import { Cart } from '../entities/cart.entity';
import { CartItem } from '../entities/cartItem.entity';

export interface CartRepository {
  createCartByUserId(userId: number): Promise<void>;
  addCartItem(userId: number, productId: number, quantity: number): Promise<CartItem>;
  getCartByUserId(userId: number): Promise<Cart>;
  updateCartByUserId(userId: number, item: { productId: number; quantity: number }): Promise<Cart | undefined>;
  editAddressByUserId(userId: number, address: string): Promise<Cart | undefined>;
  deleteCartItemByUserId(userId: number, cartItemId: number): Promise<void>;
  deleteCartByUserId(userId: number): Promise<void>;
}
