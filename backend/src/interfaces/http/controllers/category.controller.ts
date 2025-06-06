import { Request, Response } from "express";
import categoryRepository from "../../../infrastructure/repositories/category.repository";
import { Category } from "../../../domain/entities/category.entity";

// get all category
const getAllCategory = async (req: Request, res: Response) => {
  try {
    const category = await categoryRepository.getAllCategory();
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch category" });
  }
};

//get category by id
const getCategoryById = async (req: Request, res: Response) => {
  const id = Number(req.params.categoryId);
  try {
    const category = await categoryRepository.getCategoryById(id)
    if (!category) {
      res.status(404).json({ error : "Category not found"})
      return
    }
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
}

// add category
const addCategory = async (req: Request, res: Response) => {
  const { categoryName, description, image } = req.body;

  if (!categoryName) {
    res.status(400).json({ error: "Missing required fields" });
    return
  }

  try {
    const existingCategory = await categoryRepository.getCategoryByName(categoryName);
    if (existingCategory) {
      res.status(409).json({ error: "Category is already registered" });
      return
    }

    const newCategory = await categoryRepository.createCategory({ categoryName, description, image });
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(500).json({ error: "Failed to create category" });
  }
};

const editCategory = async (req: Request<{ categoryId: string }, {}, Partial<Category>>, res: Response) => {
  const id = parseInt(req.params.categoryId, 10)
  const { categoryName } = req.body;

  if (!categoryName) {
    res.status(400).json({ error: "Missing required fields" });
    return
  }

  try {
    const existingCategory = await categoryRepository.getCategoryById(id);
    if (!existingCategory) {
      res.status(400).json({ error: "Category is not found" });
      return
    }

    const newCategory = await categoryRepository.editCategoryById(id, { categoryName });
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(500).json({ error: "Failed to edit category" });
  }
};

// Delete category by id
const deleteCategoryById = async (req: Request<{ categoryId: string }>, res: Response) => {
  const id = Number(req.params.categoryId)
  try {
    await categoryRepository.removeCategoryById(id)
    res.status(200).json({ message: "Category deleted" })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Failed to delete category" })
  }
}

export default {
  getAllCategory,
  getCategoryById,
  // getCategoryByName,
  addCategory,
  editCategory,
  deleteCategoryById,
};
