import { Cart } from '../entities/cart.entity';
import { CartItem } from '../entities/cartItem.entity';

export interface CartRepository {
  getAllCarts(): Promise<Cart[]>;
  getAllCartItems(): Promise<CartItem[]>;
  createCartByUserId(userId: number): Promise<void>;
  addCartItem(userId: number, productId: number, quantity: number): Promise<CartItem>;
  getCartByUserId(userId: number): Promise<Cart>;
  updateCartByUserId(userId: number, item: { productId: number; quantity: number }): Promise<Cart | undefined>;
  deleteCartItemByUserId(userId: number, cartItemId: number): Promise<void>;
  deleteCartByUserId(userId: number): Promise<void>;
  updateCartStatusByUserId(userId: number, status: 'active' | 'purchased' | 'delete'): Promise<Cart | null>;
}
