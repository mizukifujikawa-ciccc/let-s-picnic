import { Request, Response } from 'express';
import { PaymentService } from '../../../application/service/payment.service';

export function createPaymentController(paymentService: PaymentService) {
  return {
    createPaymentIntent: async (req: Request, res: Response) => {
      const cartId = parseInt(req.body.cartId);
      if (isNaN(cartId)) {
        res.status(400).json({ error: 'Invalid cartId' });
        return;
      }
      try {
        const clientSecret = await paymentService.createPaymentIntent(cartId);
        if (!clientSecret) {
          res.status(404).json({ error: 'Cart not found or inactive' });
          return;
        }
        res.status(200).json({ clientSecret });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create payment intent' });
      }
    },
    webhook: async (req: Request, res: Response) => {
      const signature = req.headers['stripe-signature'] as string | undefined;
      const secret = process.env.STRIPE_WEBHOOK_SECRET as string;
      try {
        await paymentService.handleWebhook(req.body, signature, secret);
        res.status(200).send('ok');
      } catch (err) {
        console.error('Webhook Error:', err);
        res.status(400).send('Webhook Error');
      }
    },

    getOrderedInfo: async (req: Request, res: Response) => {
      const paymentIntentId = req.params.paymentIntentId;
      try {
        const result = await paymentService.getOrderedInfo(paymentIntentId);
        if (!result) {
          res.status(404).json({ error: 'Order not found' });
          return;
        }
        res.status(200).json({
          trackingNum: result.trackingNum,
          cart: result.cart.toPlainObject(),
        });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch order info' });
      }
    },
  };
}
