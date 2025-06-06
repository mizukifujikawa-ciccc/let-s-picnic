import { Request, Response } from "express";
import productModel from "../models/product.model";
import { Product } from "../types/product";

// get all products
const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await productModel.getAllProducts()
    res.status(200).json(products)
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
}

// get product by id
const getProductById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.productId)
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid user ID. Must be a number." })
    return
  }
  try {
    const product = await productModel.getProductById(id)
    if (!product) {
      res.status(404).json({ error : "Product not found"})
      return
    }
    res.status(200).json(product)
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch product by id" });
  }
}

// get product by name
const getProductByName = async (req: Request, res: Response) => {
  const productName = req.params.productName
  try {
    const product = await productModel.getProductByName(productName)
    if(!product) {
      res.status(404).json({ error : "Product not found"})
      return
    }
    res.status(200).json(product)
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch product by name" });
  }
}

// get products by category id
const getProductsByCategoryId = async (req: Request, res: Response) => {
  const categoryId = parseInt(req.params.categoryId)
  try {
    const products = await productModel.getProductsByCategoryId(categoryId)
    if(!products) {
      res.status(404).json({ error: "Products not found" })
      return
    }
    res.status(200).json(products)
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products by category id" })
  }
}

// add product
const addProduct = async (req: Request, res: Response) => {
  const { productName, categoryId, price, image, description, discountPercentage, rating, sku } = req.body
  if (!productName || !categoryId || !price || !image || !description || !rating || !sku) {
    res.status(400).json({ error: "Missing required fields" });
    return
  }

  try {
    const newProduct = await productModel.createProduct({
      productName,
      categoryId,
      price,
      image,
      description,
      discountPercentage,
      rating,
      sku
    })
    res.status(201).json(newProduct)
  } catch (err) {
    res.status(500).json({ error: "Failed to create product" });
  }
}

// edit product by id
const editProduct = async (req: Request<{ productId: string }, {}, Partial<Product>>, res: Response) => {
  const id = parseInt(req.params.productId)
  try {
    const { productName, categoryId, price, image, description, discountPercentage, rating, sku } = req.body
    const product = await productModel.editProduct(id, {productName, categoryId, price, image, description, discountPercentage, rating, sku})

    if (!product) {
      res.status(404).json({ message: "Product not found" })
      return
    }

    res.status(200).json(product)
  } catch (err) {
    res.status(500).json({ error: "Failed to edit product" });
  }
}

// delete product by id
const deleteProduct = async (req: Request, res: Response) => {
  const id = parseInt(req.params.productId)
  try {
    await productModel.deleteProduct(id)
    res.status(200).json({ message: "Product deleted"})
  } catch (err) {
    res.status(500).json({ error: "Failed to delete product" });
  }
}

export default {
  getAllProducts,
  getProductById,
  getProductByName,
  getProductsByCategoryId,
  addProduct,
  editProduct,
  deleteProduct
}