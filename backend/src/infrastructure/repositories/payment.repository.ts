import { createClient } from '../database/dbClient';
import { PaymentRepository, CreateTransactionInput } from '../../domain/repositories/payment.repository';
import { Cart } from '../../domain/entities/cart.entity';
import { CartItem } from '../../domain/entities/cartItem.entity';
import { Product } from '../../domain/entities/product.entity';
import { Category } from '../../domain/entities/category.entity';
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

const getActiveCartById = async (cartId: number): Promise<Cart | null> => {
  const client = createClient();
  try {
    await client.connect();
    const cartRes = await client.query(
      `SELECT c.*, u.id as "userId", u.firstname as "firstName", u.lastname as "lastName", u.email, u.password, u.role, u.created_at as "userCreatedAt", u.updated_at as "userUpdatedAt" FROM cart c JOIN "user" u ON c.user_id = u.id WHERE c.id = $1 AND c.status = 'active' LIMIT 1`,
      [cartId]
    );
    if (cartRes.rows.length === 0) return null;
    const row = cartRes.rows[0];
    const cart = mapRowToCart(row);
    const user = new User(row.userId, row.firstName, row.lastName, row.email, row.password, row.role, row.userCreatedAt, row.userUpdatedAt);
    cart.attachUser(user);
    const itemsRes = await client.query(
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
    const cartItems = itemsRes.rows.map(row => {
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

const updateCartPaymentIntent = async (cartId: number, paymentIntentId: string): Promise<void> => {
  const client = createClient();
  try {
    await client.connect();
    await client.query(
      `UPDATE cart SET payment_intent_id = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
      [paymentIntentId, cartId]
    );
  } finally {
    await client.end();
  }
};

const updateCartStatus = async (cartId: number, status: 'pending' | 'purchased'): Promise<void> => {
  const client = createClient();
  try {
    await client.connect();
    await client.query(
      `UPDATE cart SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
      [status, cartId]
    );
  } finally {
    await client.end();
  }
};

const getCartByPaymentIntentId = async (paymentIntentId: string): Promise<Cart | null> => {
  const client = createClient();
  try {
    await client.connect();
    const cartRes = await client.query(
      `SELECT c.*, u.id as "userId", u.firstname as "firstName", u.lastname as "lastName", u.email, u.password, u.role, u.created_at as "userCreatedAt", u.updated_at as "userUpdatedAt" FROM cart c JOIN "user" u ON c.user_id = u.id WHERE c.payment_intent_id = $1 LIMIT 1`,
      [paymentIntentId]
    );
    if (cartRes.rows.length === 0) return null;
    const row = cartRes.rows[0];
    const cart = mapRowToCart(row);
    const user = new User(row.userId, row.firstName, row.lastName, row.email, row.password, row.role, row.userCreatedAt, row.userUpdatedAt);
    cart.attachUser(user);
    return cart;
  } finally {
    await client.end();
  }
};

const createTransaction = async (data: CreateTransactionInput): Promise<void> => {
  const client = createClient();
  try {
    await client.connect();
    await client.query(
      `INSERT INTO transaction (user_id, cart_id, tracking_num, status, amount, payment_intent_id, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      [data.userId, data.cartId, data.trackingNum, data.status, data.amount, data.paymentIntentId]
    );
  } finally {
    await client.end();
  }
};

const getOrderedInfo = async (paymentIntentId: string): Promise<{ trackingNum: string; cart: Cart } | null> => {
  const client = createClient();
  try {
    await client.connect();
    const res = await client.query(
      `SELECT t.tracking_num, c.*, u.id as "userId", u.firstname as "firstName", u.lastname as "lastName", u.email, u.password, u.role, u.created_at as "userCreatedAt", u.updated_at as "userUpdatedAt"
         FROM transaction t
         JOIN cart c ON t.cart_id = c.id
         JOIN "user" u ON c.user_id = u.id
        WHERE t.payment_intent_id = $1 LIMIT 1`,
      [paymentIntentId]
    );
    if (res.rows.length === 0) return null;
    const row = res.rows[0];
    const cart = mapRowToCart(row);
    const user = new User(row.userId, row.firstName, row.lastName, row.email, row.password, row.role, row.userCreatedAt, row.userUpdatedAt);
    cart.attachUser(user);
    const itemsRes = await client.query(
      `SELECT ci.id AS "cartItemId", ci.quantity, ci.created_at, ci.updated_at,
              p.id AS "productId", p.product_name, p.price, p.main_image, p.description,
              p.discount_percentage, p.rating, p.sku,
              cat.id AS "categoryId", cat.category_name, cat.description AS category_description,
              cat.image AS category_image, cat.created_at AS category_created_at, cat.updated_at AS category_updated_at
         FROM cart_item ci
         JOIN product p ON ci.product_id = p.id
         JOIN category cat ON p.category_id = cat.id
         WHERE ci.cart_id = $1`,
      [cart.id]
    );
    const cartItems = itemsRes.rows.map((r: any) => {
      const category = new Category(
        r.categoryId,
        r.category_name,
        r.category_description,
        r.category_image,
        r.category_created_at,
        r.category_updated_at
      );
      const product = new Product(
        r.productId,
        r.product_name,
        category,
        r.price,
        r.main_image,
        r.description,
        r.discount_percentage,
        r.rating,
        r.sku,
        r.created_at,
        r.updated_at
      );
      return new CartItem(
        r.cartItemId,
        r.quantity,
        r.created_at,
        r.updated_at,
        product
      );
    });
    cart.setCartItems(cartItems);
    return { trackingNum: row.tracking_num, cart };
  } finally {
    await client.end();
  }
};

export default {
  getActiveCartById,
  updateCartPaymentIntent,
  updateCartStatus,
  getCartByPaymentIntentId,
  getOrderedInfo,
  createTransaction,
} as PaymentRepository;
