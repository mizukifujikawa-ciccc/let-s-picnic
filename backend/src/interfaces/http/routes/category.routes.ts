import { Router } from "express";
import { CategoryService } from "../../../application/service/category.service";
import categoryRepository from "../../../infrastructure/repositories/category.repository";
import { createCategoryController } from "../controllers/category.controller";

const categoryRouter = Router()

const categoryService = new CategoryService(categoryRepository);
const categoryController = createCategoryController(categoryService);
categoryRouter.get('/', categoryController.getAllCategories) // ok http://localhost:3000/
categoryRouter.post('/', categoryController.addCategory) // ok
categoryRouter.put('/:categoryId', categoryController.editCategory) // ok
categoryRouter.delete('/:categoryId', categoryController.deleteCategoryById) // ok
categoryRouter.get('/:categoryId', categoryController.getCategoryById) // ok http://localhost:3000/category/1

export default categoryRouter

