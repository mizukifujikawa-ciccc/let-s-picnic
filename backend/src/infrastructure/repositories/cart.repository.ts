import { createClient } from '../database/dbClient';
import { Cart } from '../../domain/entities/cart.entity';
import { CartItem } from '../../domain/entities/cartItem.entity';
import { Product } from '../../domain/entities/product.entity';
import { Category } from '../../domain/entities/category.entity';
import { CartRepository, CartDetail } from '../../domain/repositories/cart.repository';

const mapRowToCart = (row: any): Cart => {
  return new Cart(row.id, row.user_id, row.status, row.created_at, row.updated_at);
};

const mapRowToCartItem = (row: any): CartItem => {
  return new CartItem(
    row.id,
    row.cart_id,
    row.product_id,
    row.quantity,
    row.created_at,
    row.updated_at
  );
};

const getAllCarts = async (): Promise<Cart[]> => {
  const client = createClient();
  try {
    await client.connect();
    const result = await client.query('SELECT * FROM cart ORDER BY user_id ASC');
    return result.rows.map(mapRowToCart);
  } finally {
    await client.end();
  }
};

const getAllCartItems = async (): Promise<CartItem[]> => {
  const client = createClient();
  try {
    await client.connect();
    const result = await client.query('SELECT * FROM cart_item ORDER BY product_id ASC');
    return result.rows.map(mapRowToCartItem);
  } finally {
    await client.end();
  }
};

const createCartByUserId = async (userId: number): Promise<Cart> => {
  const client = createClient();
  try {
    await client.connect();
    const findActiveCart = `SELECT * FROM cart WHERE user_id = $1 AND status = 'active' LIMIT 1`;
    const result = await client.query(findActiveCart, [userId]);
    if (result.rows.length > 0) {
      return mapRowToCart(result.rows[0]);
    }
    const newCartRes = await client.query(
      `INSERT INTO cart (user_id, status) VALUES ($1, 'active') RETURNING *`,
      [userId]
    );
    return mapRowToCart(newCartRes.rows[0]);
  } finally {
    await client.end();
  }
};

const addCartItem = async (userId: number, productId: number, quantity: number): Promise<CartItem> => {
  const client = createClient();
  try {
    await client.connect();
    const cart = await createCartByUserId(userId);
    const existing = await client.query(
      'SELECT * FROM cart_item WHERE cart_id = $1 AND product_id = $2',
      [cart.id, productId]
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
      [cart.id, productId, quantity]
    );
    return mapRowToCartItem(inserted.rows[0]);
  } finally {
    await client.end();
  }
};

const getCartByUserId = async (userId: number): Promise<CartDetail> => {
  const client = createClient();
  try {
    await client.connect();
    const userCartResult = await client.query(
      `SELECT u.id AS "userId", u.firstname AS "firstName", u.lastname AS "lastName", u.role, c.id AS "cartId"
       FROM "user" u
       JOIN cart c ON u.id = c.user_id
       WHERE u.id = $1 AND c.status = 'active'`,
      [userId]
    );

    if (userCartResult.rows.length === 0) {
      const userOnly = await client.query(
        `SELECT id AS "userId", firstname AS "firstName", lastname AS "lastName", role FROM "user" WHERE id = $1`,
        [userId]
      );
      return {
        user: {
          ...userOnly.rows[0],
          cartId: null,
          cartItems: []
        }
      };
    }

    const userCart = userCartResult.rows[0];
    const cartItemsRes = await client.query(
      `SELECT ci.id AS "cartItemId", ci.quantity, ci.product_id, ci.created_at, ci.updated_at,
              p.id AS "productId", p.product_name, p.price, p.image, p.description,
              p.discount_percentage, p.rating, p.sku,
              cat.id AS "categoryId", cat.category_name, cat.description AS category_description,
              cat.image AS category_image, cat.created_at AS category_created_at, cat.updated_at AS category_updated_at
         FROM cart_item ci
         JOIN product p ON ci.product_id = p.id
         JOIN category cat ON p.category_id = cat.id
         WHERE ci.cart_id = $1`,
      [userCart.cartId]
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
        row.image,
        row.description,
        row.discount_percentage,
        row.rating,
        row.sku,
        row.created_at,
        row.updated_at
      );
      const item = new CartItem(
        row.cartItemId,
        userCart.cartId,
        row.productId,
        row.quantity,
        row.created_at,
        row.updated_at,
        product
      );
      return item;
    });

    return {
      user: {
        userId: userCart.userId,
        firstName: userCart.firstName,
        lastName: userCart.lastName,
        role: userCart.role,
        cartId: userCart.cartId,
        cartItems
      }
    };
  } finally {
    await client.end();
  }
};

const updateCartByUserId = async (
  userId: number,
  items: { productId: number; quantity: number }[]
): Promise<CartDetail | undefined> => {
  const client = createClient();
  const errors: string[] = [];

  try {
    await client.connect();
    const cartRes = await client.query('SELECT id FROM cart WHERE user_id = $1 AND status = \"active\"', [userId]);
    if (cartRes.rows.length === 0) return undefined;
    const cartId = cartRes.rows[0].id;

    for (const item of items) {
      const { productId, quantity } = item;
      const productCheck = await client.query('SELECT id FROM product WHERE id = $1', [productId]);
      if (productCheck.rows.length === 0) {
        errors.push(`Product ID ${productId} not found`);
        continue;
      }
      const cartItemRes = await client.query('SELECT id FROM cart_item WHERE cart_id = $1 AND product_id = $2', [cartId, productId]);
      if (quantity === 0) {
        if (cartItemRes.rows.length > 0) {
          await client.query('DELETE FROM cart_item WHERE id = $1', [cartItemRes.rows[0].id]);
        }
        continue;
      }
      if (cartItemRes.rows.length > 0) {
        await client.query('UPDATE cart_item SET quantity = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [quantity, cartItemRes.rows[0].id]);
      } else {
        await client.query('INSERT INTO cart_item (cart_id, product_id, quantity) VALUES ($1, $2, $3)', [cartId, productId, quantity]);
      }
    }

    const updated = await getCartByUserId(userId);
    return { ...updated, errors: errors.length ? errors : undefined };
  } finally {
    await client.end();
  }
};

const deleteCartItemByUserId = async (userId: number, cartItemId: number): Promise<void> => {
  const cart = await getCartByUserId(userId);
  if (!cart.user.cartId) return;
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
  if (!cart.user.cartId) return;
  const client = createClient();
  try {
    await client.connect();
    await client.query('DELETE FROM cart WHERE user_id = $1', [userId]);
  } finally {
    await client.end();
  }
};

const updateCartStatusByUserId = async (
  userId: number,
  status: 'active' | 'purchased' | 'delete'
): Promise<Cart | null> => {
  const client = createClient();
  try {
    await client.connect();
    const result = await client.query(
      `UPDATE cart SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2 AND status = 'active' RETURNING *`,
      [status, userId]
    );
    return result.rows[0] ? mapRowToCart(result.rows[0]) : null;
  } finally {
    await client.end();
  }
};

export default {
  getAllCarts,
  getAllCartItems,
  createCartByUserId,
  addCartItem,
  getCartByUserId,
  updateCartByUserId,
  deleteCartItemByUserId,
  deleteCartByUserId,
  updateCartStatusByUserId
} as CartRepository;
