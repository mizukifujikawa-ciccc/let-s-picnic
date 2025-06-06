import { Request, Response } from "express";
import categoryModel from "../models/category.model";
import { Category } from "../types/category";

// get all category
const getAllCategory = async (req: Request, res: Response) => {
  try {
    const category = await categoryModel.getAllCategory();
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch category" });
  }
};

//get category by id
const getCategoryById = async (req: Request, res: Response) => {
  const id = Number(req.params.categoryId);
  try {
    const category = await categoryModel.getCategoryById(id)
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
//     const category = await categoryModel.getCategoryByName(categoryName)
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
  const { categoryName, description, image } = req.body;

  if (!categoryName) {
    res.status(400).json({ error: "Missing required fields" });
    return
  }

  try {
    const existingCategory = await categoryModel.getCategoryByName(categoryName);
    if (existingCategory) {
      res.status(409).json({ error: "Category is already registered" });
      return
    }

    const newCategory = await categoryModel.createCategory({ categoryName, description, image });
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
    const existingCategory = await categoryModel.getCategoryById(id);
    if (!existingCategory) {
      res.status(400).json({ error: "Category is not found" });
      return
    }

    const newCategory = await categoryModel.editCategoryById(id, { categoryName });
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(500).json({ error: "Failed to edit category" });
  }
};

// Delete category by id
const deleteCategoryById = async (req: Request<{ categoryId: string }>, res: Response) => {
  const id = Number(req.params.categoryId)
  try {
    await categoryModel.removeCategoryById(id)
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
