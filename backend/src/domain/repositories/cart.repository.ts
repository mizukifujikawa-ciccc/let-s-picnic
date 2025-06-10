import { Cart } from '../entities/cart.entity';
import { CartItem } from '../entities/cartItem.entity';
import { User } from '../entities/user.entity';

export interface CartDetail {
  id: number | null;
  user: User;
  cartItems: CartItem[];
  errors?: string[];
}

export interface CartRepository {
  getAllCarts(): Promise<Cart[]>;
  getAllCartItems(): Promise<CartItem[]>;
  createCartByUserId(userId: number): Promise<Cart>;
  addCartItem(userId: number, productId: number, quantity: number): Promise<CartItem>;
  getCartByUserId(userId: number): Promise<CartDetail>;
  updateCartByUserId(userId: number, item: { productId: number; quantity: number }): Promise<CartDetail | undefined>;
  deleteCartItemByUserId(userId: number, cartItemId: number): Promise<void>;
  deleteCartByUserId(userId: number): Promise<void>;
  updateCartStatusByUserId(userId: number, status: 'active' | 'purchased' | 'delete'): Promise<Cart | null>;
}
