import Stripe from 'stripe';
import { randomUUID } from 'crypto';
import { PaymentRepository } from '../../domain/repositories/payment.repository';

export class PaymentService {
  private stripe: Stripe;
  constructor(private readonly repository: PaymentRepository) {
    const key = process.env.STRIPE_SECRET_KEY as string;
    this.stripe = new Stripe(key);
  }

  async createPaymentIntent(cartId: number): Promise<string | null> {
    const cart = await this.repository.getActiveCartById(cartId);
    if (!cart) return null;
    const amount = Math.round(cart.getTotalAmount() * 100);
    const intent = await this.stripe.paymentIntents.create({
      amount,
      currency: 'cad',
    });
    await this.repository.updateCartPaymentIntent(cartId, intent.id);
    await this.repository.updateCartStatus(cartId, 'pending');
    return intent.client_secret ?? null;
  }

  async handleWebhook(payload: Buffer | string, signature: string | undefined, secret: string): Promise<void> {
    if (!signature) throw new Error('Missing signature');
    const event = this.stripe.webhooks.constructEvent(payload, signature, secret);
    if (event.type === 'payment_intent.succeeded') {
      const intent = event.data.object as Stripe.PaymentIntent;
      await this.processSuccess(intent.id, intent.amount);
    }
  }

  private async processSuccess(paymentIntentId: string, amount: number) {
    const cart = await this.repository.getCartByPaymentIntentId(paymentIntentId);
    if (!cart || !cart.user || !cart.id) return;
    await this.repository.updateCartStatus(cart.id, 'purchased');
    const trackingNum = randomUUID();
    await this.repository.createTransaction({
      userId: cart.user.id as number,
      cartId: cart.id,
      trackingNum,
      status: 'purchased',
      amount,
      paymentIntentId
    });
  }

  async getOrderedInfo(paymentIntentId: string) {
    return this.repository.getOrderedInfo(paymentIntentId);
  }
}
