import { Request, Response } from "express";
import { CategoryService } from "../../../application/service/category.service";
import { Category } from "../../../domain/entities/category.entity";

export function createCategoryController(categoryService: CategoryService) {
  return {
    getAllCategories: async (_req: Request, res: Response) => {
      try {
        const categories = await categoryService.getAllCategories();
        res.status(200).json(categories.map(category => category.toPlainObject()));
      } catch (err) {
        res.status(500).json({ error: "Failed to fetch category" });
      }
    },

    getCategoryById: async (req: Request, res: Response) => {
      const id = Number(req.params.categoryId);
      try {
        const category = await categoryService.getCategoryById(id);
        if (!category) {
          res.status(404).json({ error: "Category not found" });
          return;
        }
        res.status(200).json(category.toPlainObject());
      } catch (err) {
        res.status(500).json({ error: "Something went wrong" });
      }
    },

    addCategory: async (req: Request, res: Response) => {
      const { categoryName, description, image } = req.body;
      if (!categoryName) {
        res.status(400).json({ error: "Missing required fields" });
        return;
      }
      try {
        const newCategory = await categoryService.addCategory({
          categoryName,
          description,
          image,
        } as Omit<Category, 'id' | 'createdAt' | 'updatedAt'>);
        if (!newCategory) {
          res.status(409).json({ error: "Category is already registered" });
          return;
        }
        res.status(201).json(newCategory.toPlainObject());
      } catch (err) {
        res.status(500).json({ error: "Failed to create category" });
      }
    },

    editCategory: async (
      req: Request<{ categoryId: string }, {}, Partial<Category>>,
      res: Response
    ) => {
      const id = parseInt(req.params.categoryId, 10);
      try {
        const category = await categoryService.editCategory(id, req.body);
        if (!category) {
          res.status(404).json({ error: "Category is not found" });
          return;
        }
        res.status(200).json(category.toPlainObject());
      } catch (err) {
        res.status(500).json({ error: "Failed to edit category" });
      }
    },

    deleteCategoryById: async (
      req: Request<{ categoryId: string }>,
      res: Response
    ) => {
      const id = Number(req.params.categoryId);
      try {
        const deleted = await categoryService.deleteCategory(id);
        if (!deleted) {
          res.status(404).json({ message: "Category not found" });
          return;
        }
        res.status(200).json({ message: "Category deleted" });
      } catch (err) {
        res.status(500).json({ message: "Failed to delete category" });
      }
    },
  };
}
