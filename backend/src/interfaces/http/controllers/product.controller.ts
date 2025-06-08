import { Request, Response } from "express";
import { ProductService } from "../../../application/service/product.service";
import { ProductCreateInput } from "../../../domain/repositories/product.repository";

export function createProductController(productService: ProductService) {
  return {
    getAllProducts: async (_req: Request, res: Response) => {
      try {
        const products = await productService.getAllProducts();
        res.status(200).json(products.map(product => product.toPlainObject()));
      } catch (err) {
        res.status(500).json({ error: "Failed to fetch products" });
      }
    },

    getProductById: async (req: Request, res: Response) => {
      const id = parseInt(req.params.productId);
      if (isNaN(id)) {
        res
          .status(400)
          .json({ error: "Invalid product ID. Must be a number." });
        return;
      }
      try {
        const product = await productService.getProductById(id);
        if (!product) {
          res.status(404).json({ error: "Product not found" });
          return;
        }
        res.status(200).json(product?.toPlainObject());
      } catch (err) {
        res.status(500).json({ error: "Failed to fetch product by id" });
      }
    },

    getProductByName: async (req: Request, res: Response) => {
      const productName = req.params.productName;
      try {
        const product = await productService.getProductByName(productName);
        if (!product) {
          res.status(404).json({ error: "Product not found" });
          return;
        }
        res.status(200).json(product?.toPlainObject());
      } catch (err) {
        res.status(500).json({ error: "Failed to fetch product by name" });
      }
    },

    getProductsByCategoryId: async (req: Request, res: Response) => {
      const categoryId = parseInt(req.params.categoryId);
      try {
        const products =
          await productService.getProductsByCategoryId(categoryId);
        if (!products) {
          res.status(404).json({ error: "Products not found" });
          return;
        }
        res.status(200).json(products.map(product => product.toPlainObject()));
      } catch (err) {
        res
          .status(500)
          .json({ error: "Failed to fetch products by category id" });
      }
    },

    addProduct: async (req: Request, res: Response) => {
      const {
        productName,
        categoryId,
        price,
        image,
        description,
        discountPercentage,
        rating,
        sku,
      } = req.body;
      if (
        !productName ||
        !categoryId ||
        !price ||
        !image ||
        !description ||
        !rating ||
        !sku
      ) {
        res.status(400).json({ error: "Missing required fields" });
        return;
      }
      try {
        const product = await productService.addProduct({
          productName,
          categoryId,
          price,
          image,
          description,
          discountPercentage,
          rating,
          sku,
        } as ProductCreateInput);
        res.status(201).json(product?.toPlainObject());
      } catch (err) {
        res.status(500).json({ error: "Failed to create product" });
      }
    },

    editProduct: async (
      req: Request<{ productId: string }, {}, Partial<ProductCreateInput>>,
      res: Response,
    ) => {
      const id = parseInt(req.params.productId);
      try {
        const product = await productService.editProduct(id, req.body);
        if (!product) {
          res.status(404).json({ message: "Product not found" });
          return;
        }
        res.status(200).json(product?.toPlainObject());
      } catch (err) {
        res.status(500).json({ error: "Failed to edit product" });
      }
    },

    deleteProduct: async (req: Request, res: Response) => {
      const id = parseInt(req.params.productId);
      try {
        const deleted = await productService.deleteProduct(id);
        if (!deleted) {
          res.status(404).json({ message: "Product not found" });
          return;
        }
        res.status(200).json({ message: "Product deleted" });
      } catch (err) {
        res.status(500).json({ error: "Failed to delete product" });
      }
    },
  };
}
