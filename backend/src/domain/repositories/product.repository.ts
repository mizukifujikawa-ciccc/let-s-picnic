import { Product } from "../entities/product.entity";

export interface ProductCreateInput {
  productName: string;
  categoryId: number;
  price: number;
  mainImage: string;
  description: string;
  discountPercentage: number;
  rating: number;
  sku: string;
}

export interface ProductRepository {
  getAllProducts(): Promise<Product[]>;
  getProductById(id: number): Promise<Product | null>;
  getProductByName(productName: string): Promise<Product | null>;
  getProductsByCategoryId(categoryId: number): Promise<Product[]>;
  createProduct(data: ProductCreateInput): Promise<Product | null>;
  editProduct(
    id: number,
    data: Partial<ProductCreateInput>,
  ): Promise<Product | null>;
  deleteProduct(id: number): Promise<Product | null>;
}
