import { Router } from 'express';
import { CartService } from '../../../application/service/cart.service';
import cartRepository from '../../../infrastructure/repositories/cart.repository';
import { createCartController } from '../controllers/cart.controller';

const cartRouter = Router();

const cartService = new CartService(cartRepository);
const cartController = createCartController(cartService);

cartRouter.get('/', cartController.getAllCarts);
cartRouter.get('/item', cartController.getAllCartItems);
cartRouter.post('/', cartController.createCartByUser);
cartRouter.post('/item/:userId', cartController.addCartItemByUserId);
cartRouter.get('/:userId', cartController.getCartByUserId);
cartRouter.put('/item/:userId', cartController.editCartByUserId);
cartRouter.put('/:userId', cartController.updateCartStatusByUserId);
cartRouter.delete('/:userId', cartController.deleteCartByUserId);
cartRouter.delete('/item/:userId', cartController.deleteCartItemByUserId);

export default cartRouter;
