import { Request, Response } from "express";
import Purchase from "../models/purchase.model";

// Male purchase
const makePurchase = async (req: Request<{ cartId: string }>, res: Response) => {
  const id = Number(req.params.cartId)
  try {
    await Purchase.makePurchase(id)
    res.status(200).json({ message: "Purchase success" })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Failed to make purchase" })
  }
}

export default {
  makePurchase,
};
