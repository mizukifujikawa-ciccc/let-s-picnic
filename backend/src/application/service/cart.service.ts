import { Cart } from '../../domain/entities/cart.entity';
import { CartItem } from '../../domain/entities/cartItem.entity';
import { CartRepository } from '../../domain/repositories/cart.repository';

export class CartService {
  constructor(private readonly cartRepository: CartRepository) {}

  addCartItem(userId: number, productId: number, quantity: number): Promise<CartItem> {
    return this.cartRepository.addCartItem(userId, productId, quantity);
  }

  getCartByUserId(userId: number): Promise<Cart> {
    return this.cartRepository.getCartByUserId(userId);
  }

  updateCartByUserId(userId: number, item: { productId: number; quantity: number }): Promise<Cart | undefined> {
    return this.cartRepository.updateCartByUserId(userId, item);
  }

  editAddressByUserId(userId: number, address: string): Promise<Cart | undefined> {
    return this.cartRepository.editAddressByUserId(userId, address);
  }

  deleteCartItemByUserId(userId: number, cartItemId: number): Promise<void> {
    return this.cartRepository.deleteCartItemByUserId(userId, cartItemId);
  }

  deleteCartByUserId(userId: number): Promise<void> {
    return this.cartRepository.deleteCartByUserId(userId);
  }

}
