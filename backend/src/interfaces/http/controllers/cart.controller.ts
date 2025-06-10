import { Request, Response } from 'express';
import { CartService } from '../../../application/service/cart.service';

export function createCartController(cartService: CartService) {
  return {
    addCartItemByUserId: async (req: Request, res: Response) => {
      try {
        const userId = parseInt(req.params.userId);
        const { productId, quantity } = req.body;
        if (isNaN(userId)) {
          res.status(400).json({ error: 'Invalid user ID. Must be a number.' });
          return;
        }
        const item = await cartService.addCartItem(userId, productId, quantity);
        res.status(201).json(item.toPlainObject());
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to edit cart' });
      }
    },

    editAddressByUserId: async (req: Request, res: Response) => {
      const userId = parseInt(req.params.userId);
      const { shippingAddress } = req.body;

      if (isNaN(userId)) {
        res.status(400).json({ error: 'Invalid user ID. Must be a number.' });
        return;
      }
      if (typeof shippingAddress !== 'string' || shippingAddress.length === 0) {
        res.status(400).json({ error: 'Invalid shipping address.' });
        return;
      }
      try {
        const cart = await cartService.editAddressByUserId(userId, shippingAddress);
        if (!cart) {
          res.status(404).json({ error: 'Cart not found.' });
          return;
        }
        res.status(200).json(cart.toPlainObject());
      } catch (err) {
        console.error('editAddressByUserId error:', err);
        res.status(500).json({ error: 'Failed to update address.' });
      }
    },

    getCartByUserId: async (req: Request, res: Response) => {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        res.status(400).json({ error: 'Invalid user ID. Must be a number.' });
        return;
      }
      try {
        const cart = await cartService.getCartByUserId(userId);
        res.status(200).json(cart.toPlainObject());
      } catch {
        res.status(500).json({ error: 'Failed to fetch cart' });
      }
    },

    editCartByUserId: async (req: Request, res: Response) => {
      const userId = parseInt(req.params.userId);
      const item = req.body;

      if (isNaN(userId)) {
        res.status(400).json({ error: 'Invalid user ID. Must be a number.' });
        return;
      }

      if (
        typeof item.productId !== 'number' ||
        typeof item.quantity !== 'number' ||
        item.quantity < 0
      ) {
        res.status(400).json({ error: 'Request body must contain valid productId and quantity (≥ 0).' });
        return;
      }

      try {
        const updated = await cartService.updateCartByUserId(userId, item);
        if (!updated) {
          res.status(404).json({ error: 'Cart not found.' });
          return;
        }
        res.status(200).json(updated.toPlainObject());
      } catch (err) {
        console.error('editCartByUserId error:', err);
        res.status(500).json({ error: 'Failed to edit cart.' });
      }
    },

    deleteCartItemByUserId: async (req: Request, res: Response) => {
      const userId = parseInt(req.params.userId);
      const cartItemId = parseInt(req.body.cartItemId);
      try {
        await cartService.deleteCartItemByUserId(userId, cartItemId);
        res.status(200).json({ message: 'Product item deleted' });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete cart item' });
      }
    },

    deleteCartByUserId: async (req: Request, res: Response) => {
      const userId = parseInt(req.params.userId);
      try {
        await cartService.deleteCartByUserId(userId);
        res.status(200).json({ message: 'Cart deleted' });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete cart' });
      }
    }
  };
}
