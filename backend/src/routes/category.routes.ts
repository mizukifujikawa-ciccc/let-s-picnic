import { Router } from "express";
import categoryController from "../controllers/category.controller";

const categoryRouter = Router()

categoryRouter.get('/', categoryController.getAllCategory) // ok http://localhost:3000/
categoryRouter.post('/', categoryController.addCategory) // ok
categoryRouter.delete('/:categoryId', categoryController.deleteCategoryById) // ok
categoryRouter.get('/:categoryId', categoryController.getCategoryById) // ok http://localhost:3000/category/1

export default categoryRouter