import { Router } from 'express';
import { PaymentService } from '../../../application/service/payment.service';
import paymentRepository from '../../../infrastructure/repositories/payment.repository';
import { createPaymentController } from '../controllers/payment.controller';

const paymentRouter = Router();

const paymentService = new PaymentService(paymentRepository);
const paymentController = createPaymentController(paymentService);

paymentRouter.post('/create-payment-intent', paymentController.createPaymentIntent);
paymentRouter.get('/:paymentIntentId', paymentController.getOrderedInfo);

export { paymentService, paymentController };
export default paymentRouter;
