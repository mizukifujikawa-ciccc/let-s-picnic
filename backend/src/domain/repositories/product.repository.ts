import { Product } from "../entities/product.entity";

export interface ProductRepository {
  getAllProducts(): Promise<Product[]>;
  getProductById(id: number): Promise<Product | null>;
  getProductByName(productName: string): Promise<Product | null>;
  getProductsByCategoryId(categoryId: number): Promise<Product[]>;
  createProduct(
    data: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'category'>
  ): Promise<Product | null>;
  editProduct(
    id: number,
    data: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'category'>>
  ): Promise<Product | null>;
  deleteProduct(id: number): Promise<Product | null>;
}
