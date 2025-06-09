import { Request, Response } from 'express';
import { CartService } from '../../../application/service/cart.service';

export function createCartController(cartService: CartService) {
  return {
    getAllCarts: async (_req: Request, res: Response) => {
      try {
        const carts = await cartService.getAllCarts();
        res.status(200).json(carts.map(c => c.toPlainObject()));
      } catch {
        res.status(500).json({ error: 'Failed to fetch carts' });
      }
    },

    getAllCartItems: async (_req: Request, res: Response) => {
      try {
        const items = await cartService.getAllCartItems();
        res.status(200).json(items.map(i => i.toPlainObject()));
      } catch {
        res.status(500).json({ error: 'Failed to fetch cart items' });
      }
    },

    createCartByUser: async (req: Request, res: Response) => {
      try {
        const userId = parseInt(req.body.userId);
        if (isNaN(userId)) {
          res.status(400).json({ error: 'Invalid user ID. Must be a number.' });
          return;
        }
        const cart = await cartService.createCartByUserId(userId);
        res.status(201).json(cart.toPlainObject());
      } catch {
        res.status(500).json({ error: 'Failed to creat cart' });
      }
    },

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

    getCartByUserId: async (req: Request, res: Response) => {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        res.status(400).json({ error: 'Invalid user ID. Must be a number.' });
        return;
      }
      try {
        const cart = await cartService.getCartByUserId(userId);
        res.status(200).json({
          user: {
            ...cart.user,
            cartItems: cart.user.cartItems.map(i => i.toPlainObject())
          },
          errors: cart.errors
        });
      } catch {
        res.status(500).json({ error: 'Failed to fetch cart' });
      }
    },

    editCartByUserId: async (req: Request, res: Response) => {
      const userId = parseInt(req.params.userId);
      const items = req.body;

      if (isNaN(userId)) {
        res.status(400).json({ error: 'Invalid user ID. Must be a number.' });
        return;
      }

      if (!Array.isArray(items)) {
        res.status(400).json({ error: 'Request body must be an array of items.' });
        return;
      }

      for (const item of items) {
        if (
          typeof item.productId !== 'number' ||
          typeof item.quantity !== 'number' ||
          item.quantity < 0
        ) {
          res.status(400).json({ error: 'Each item must have valid productId and quantity (≥ 0).' });
          return;
        }
      }

      try {
        const updated = await cartService.updateCartByUserId(userId, items);
        if (!updated) {
          res.status(404).json({ error: 'Cart not found.' });
          return;
        }
        res.status(200).json({
          user: {
            ...updated.user,
            cartItems: updated.user.cartItems.map(i => i.toPlainObject())
          },
          errors: updated.errors
        });
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
    },

    updateCartStatusByUserId: async (req: Request, res: Response) => {
      try {
        const userId = parseInt(req.params.userId);
        const { status } = req.body;

        if (isNaN(userId)) {
          res.status(400).json({ error: 'Invalid user ID. Must be a number.' });
          return;
        }

        if (!['active', 'purchased', 'delete'].includes(status)) {
          res.status(400).json({ error: "Invalid status. Must be one of 'active', 'purchased', or 'delete'." });
          return;
        }

        const updatedCart = await cartService.updateCartStatusByUserId(userId, status);
        if (!updatedCart) {
          res.status(404).json({ error: 'Cart not found or already updated.' });
          return;
        }
        res.status(200).json(updatedCart.toPlainObject());
      } catch {
        res.status(500).json({ error: 'Failed to update cart status' });
      }
    }
  };
}
