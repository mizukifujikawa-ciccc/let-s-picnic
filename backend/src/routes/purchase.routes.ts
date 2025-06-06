import { Router } from "express";
import purchaseController from "../controllers/purchase.controller";

const purchaseRouter = Router()

purchaseRouter.post('/:cartId', purchaseController.makePurchase)

export default purchaseRouter