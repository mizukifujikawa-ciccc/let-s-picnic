import { Cart } from '../entities/cart.entity';

export interface CreateTransactionInput {
  userId: number;
  cartId: number;
  trackingNum: string;
  status: 'purchased' | 'cancel';
  amount: number;
  paymentIntentId: string;
}

export interface PaymentRepository {
  getActiveCartById(cartId: number): Promise<Cart | null>;
  updateCartPaymentIntent(cartId: number, paymentIntentId: string): Promise<void>;
  updateCartStatus(cartId: number, status: 'pending' | 'purchased'): Promise<void>;
  getCartByPaymentIntentId(paymentIntentId: string): Promise<Cart | null>;
  getOrderedInfo(paymentIntentId: string): Promise<{ trackingNum: string; cart: Cart } | null>;
  createTransaction(data: CreateTransactionInput): Promise<void>;
}
