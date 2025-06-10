import { createClient } from '../database/dbClient';
import { Cart } from '../../domain/entities/cart.entity';
import { CartItem } from '../../domain/entities/cartItem.entity';
import { Product } from '../../domain/entities/product.entity';
import { Category } from '../../domain/entities/category.entity';
import { CartRepository } from '../../domain/repositories/cart.repository';
import { User } from '../../domain/entities/user.entity';

const mapRowToCart = (row: any): Cart => {
  return new Cart(
    row.id,
    row.status,
    row.created_at,
    row.updated_at,
    row.shipping_address
  );
};

const mapRowToCartItem = (row: any): CartItem => {
  return new CartItem(
    row.id,
    row.quantity,
    row.created_at,
    row.updated_at
  );
};

const createCartByUserId = async (userId: number): Promise<void> => {
  const client = createClient();
  try {
    await client.connect();
    const findActiveCart = `SELECT * FROM cart WHERE user_id = $1 AND status = 'active' LIMIT 1`;
    const result = await client.query(findActiveCart, [userId]);
    if (result.rows.length === 0) {
      await client.query(`INSERT INTO cart (user_id, status) VALUES ($1, 'active')`, [userId]);
    }
  } finally {
    await client.end();
  }
};

const addCartItem = async (userId: number, productId: number, quantity: number): Promise<CartItem> => {
  const client = createClient();
  try {
    await client.connect();
    await createCartByUserId(userId);
    const cartRes = await client.query(
      `SELECT id FROM cart WHERE user_id = $1 AND status = 'active' LIMIT 1`,
      [userId]
    );
    const cartId = cartRes.rows[0].id;
    const existing = await client.query(
      'SELECT * FROM cart_item WHERE cart_id = $1 AND product_id = $2',
      [cartId, productId]
    );
    if (existing.rows.length > 0) {
      const updated = await client.query(
        `UPDATE cart_item SET quantity = quantity + $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
        [quantity, existing.rows[0].id]
      );
      return mapRowToCartItem(updated.rows[0]);
    }
    const inserted = await client.query(
      `INSERT INTO cart_item (cart_id, product_id, quantity, created_at, updated_at) VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *`,
      [cartId, productId, quantity]
    );
    return mapRowToCartItem(inserted.rows[0]);
  } finally {
    await client.end();
  }
};


const getCartByUserId = async (userId: number): Promise<Cart> => {
  const client = createClient();
  try {
    await client.connect();

    const userRes = await client.query(
      `SELECT id AS "userId", firstname AS "firstName", lastname AS "lastName", email, password, role, created_at AS "createdAt", updated_at AS "updatedAt" FROM "user" WHERE id = $1`,
      [userId]
    );

    if (userRes.rows.length === 0) {
      throw new Error('User not found');
    }

    const u = userRes.rows[0];
    const user = new User(u.userId, u.firstName, u.lastName, u.email, u.password, u.role, u.createdAt, u.updatedAt);

    const cartRes = await client.query(
      `SELECT * FROM cart WHERE user_id = $1 AND status = 'active' LIMIT 1`,
      [userId]
    );

    if (cartRes.rows.length === 0) {
      return new Cart(null, null, null, null, null, user, []);
    }

    const cart = mapRowToCart(cartRes.rows[0]);
    cart.setUser(user);
    const cartId = cart.id as number;
    const cartItemsRes = await client.query(
      `SELECT ci.id AS "cartItemId", ci.quantity, ci.created_at, ci.updated_at,
              p.id AS "productId", p.product_name, p.price, p.main_image, p.description,
              p.discount_percentage, p.rating, p.sku,
              cat.id AS "categoryId", cat.category_name, cat.description AS category_description,
              cat.image AS category_image, cat.created_at AS category_created_at, cat.updated_at AS category_updated_at
         FROM cart_item ci
         JOIN product p ON ci.product_id = p.id
         JOIN category cat ON p.category_id = cat.id
         WHERE ci.cart_id = $1`,
      [cartId]
    );

    const cartItems = cartItemsRes.rows.map(row => {
      const category = new Category(
        row.categoryId,
        row.category_name,
        row.category_description,
        row.category_image,
        row.category_created_at,
        row.category_updated_at
      );

      const product = new Product(
        row.productId,
        row.product_name,
        category,
        row.price,
        row.main_image,
        row.description,
        row.discount_percentage,
        row.rating,
        row.sku,
        row.created_at,
        row.updated_at
      );

      return new CartItem(
        row.cartItemId,
        row.quantity,
        row.created_at,
        row.updated_at,
        product
      );
    });
    cart.setCartItems(cartItems);
    return cart;
  } finally {
    await client.end();
  }
};
const updateCartByUserId = async (
  userId: number,
  item: { productId: number; quantity: number }
): Promise<Cart | undefined> => {
  const client = createClient();

  try {
    await client.connect();
    const cartRes = await client.query('SELECT id FROM cart WHERE user_id = $1 AND status = \'active\'', [userId]);
    if (cartRes.rows.length === 0) return undefined;
    const cartId = cartRes.rows[0].id;

    const { productId, quantity } = item;
    const productCheck = await client.query('SELECT id FROM product WHERE id = $1', [productId]);
    if (productCheck.rows.length !== 0) {
      const cartItemRes = await client.query('SELECT id FROM cart_item WHERE cart_id = $1 AND product_id = $2', [cartId, productId]);
      if (quantity === 0) {
        if (cartItemRes.rows.length > 0) {
          await client.query('DELETE FROM cart_item WHERE id = $1', [cartItemRes.rows[0].id]);
        }
      } else if (cartItemRes.rows.length > 0) {
        await client.query('UPDATE cart_item SET quantity = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [quantity, cartItemRes.rows[0].id]);
      } else {
        await client.query('INSERT INTO cart_item (cart_id, product_id, quantity) VALUES ($1, $2, $3)', [cartId, productId, quantity]);
      }
    }

    const updated = await getCartByUserId(userId);
    return updated;
  } finally {
    await client.end();
  }
};

const editAddressByUserId = async (
  userId: number,
  address: string
): Promise<Cart | undefined> => {
  const client = createClient();
  try {
    await client.connect();
    const cartRes = await client.query(
      "SELECT id FROM cart WHERE user_id = $1 AND status = 'active'",
      [userId]
    );
    if (cartRes.rows.length === 0) return undefined;
    const cartId = cartRes.rows[0].id;
    await client.query(
      "UPDATE cart SET shipping_address = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2",
      [address, cartId]
    );
    const updated = await getCartByUserId(userId);
    return updated;
  } finally {
    await client.end();
  }
};

const deleteCartItemByUserId = async (userId: number, cartItemId: number): Promise<void> => {
  const cart = await getCartByUserId(userId);
  if (!cart.id) return;
  const client = createClient();
  try {
    await client.connect();
    await client.query('DELETE FROM cart_item WHERE id = $1', [cartItemId]);
  } finally {
    await client.end();
  }
};

const deleteCartByUserId = async (userId: number): Promise<void> => {
  const cart = await getCartByUserId(userId);
  if (!cart.id) return;
  const client = createClient();
  try {
    await client.connect();
    await client.query('UPDATE cart SET status = \'deleted\' WHERE user_id = $1', [userId]);
  } finally {
    await client.end();
  }
};

export default {
  createCartByUserId,
  addCartItem,
  getCartByUserId,
  updateCartByUserId,
  editAddressByUserId,
  deleteCartItemByUserId,
  deleteCartByUserId
} as CartRepository;
