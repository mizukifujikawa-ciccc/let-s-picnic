import { Cart } from '../../domain/entities/cart.entity';
import { CartItem } from '../../domain/entities/cartItem.entity';
import { CartRepository, CartDetail } from '../../domain/repositories/cart.repository';

export class CartService {
  constructor(private readonly cartRepository: CartRepository) {}

  getAllCarts(): Promise<Cart[]> {
    return this.cartRepository.getAllCarts();
  }

  getAllCartItems(): Promise<CartItem[]> {
    return this.cartRepository.getAllCartItems();
  }

  createCartByUserId(userId: number): Promise<Cart> {
    return this.cartRepository.createCartByUserId(userId);
  }

  addCartItem(userId: number, productId: number, quantity: number): Promise<CartItem> {
    return this.cartRepository.addCartItem(userId, productId, quantity);
  }

  getCartByUserId(userId: number): Promise<CartDetail> {
    return this.cartRepository.getCartByUserId(userId);
  }

  updateCartByUserId(userId: number, items: { productId: number; quantity: number }[]): Promise<CartDetail | undefined> {
    return this.cartRepository.updateCartByUserId(userId, items);
  }

  deleteCartItemByUserId(userId: number, cartItemId: number): Promise<void> {
    return this.cartRepository.deleteCartItemByUserId(userId, cartItemId);
  }

  deleteCartByUserId(userId: number): Promise<void> {
    return this.cartRepository.deleteCartByUserId(userId);
  }

  updateCartStatusByUserId(userId: number, status: 'active' | 'purchased' | 'delete'): Promise<Cart | null> {
    return this.cartRepository.updateCartStatusByUserId(userId, status);
  }
}
