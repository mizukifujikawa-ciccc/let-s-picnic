import { Request, Response } from "express";
import Category from "../models/category.model";

// get all category
const getAllCategory = async (req: Request, res: Response) => {
  try {
    const category = await Category.getAllCategory();
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch category" });
  }
};

//get category by id
const getCategoryById = async (req: Request, res: Response) => {
  const id = Number(req.params.categoryId);
  try {
    const category = await Category.getCategoryById(id)
    if (!category) {
      res.status(404).json({ error : "Category not found"})
      return
    }
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
}

//get category by name
// const getCategoryByName = async (req: Request, res: Response) => {
//   const categoryName = req.params.categoryName;
//   try {
//     const category = await Category.getCategoryByName(categoryName)
//     if (!category) {
//       res.status(404).json({ error : "Category not found"})
//       return
//     }
//     res.status(200).json(category);
//   } catch (err) {
//     res.status(500).json({ error: "Something went wrong" });
//   }
// }

// add category
const addCategory = async (req: Request, res: Response) => {
  const { categoryName } = req.body;

  if (!categoryName) {
    res.status(400).json({ error: "Missing required fields" });
    return
  }

  try {
    const existingCategory = await Category.getCategoryByName(categoryName);
    if (existingCategory) {
      res.status(409).json({ error: "Category is already registered" });
      return
    }

    const newCategory = await Category.createCategory({ categoryName });
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(500).json({ error: "Failed to create category" });
  }
};

// Delete category by id
const deleteCategoryById = async (req: Request<{ categoryId: string }>, res: Response) => {
  const id = Number(req.params.categoryId)
  try {
    await Category.removeCategoryById(id)
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
  deleteCategoryById,
};
