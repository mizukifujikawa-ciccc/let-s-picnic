import { Product } from "../../domain/entities/product.entity";
import { ProductRepository } from "../../domain/repositories/product.repository";

export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async getAllProducts(): Promise<Product[]> {
    return this.productRepository.getAllProducts();
  }

  async getProductById(id: number): Promise<Product | null> {
    return this.productRepository.getProductById(id);
  }

  async getProductByName(name: string): Promise<Product | null> {
    return this.productRepository.getProductByName(name);
  }

  async getProductsByCategoryId(categoryId: number): Promise<Product[]> {
    return this.productRepository.getProductsByCategoryId(categoryId);
  }

  async addProduct(
    data: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'category'>
  ): Promise<Product | null> {
    return this.productRepository.createProduct(data);
  }

  async editProduct(
    id: number,
    data: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'category'>>
  ): Promise<Product | null> {
    return this.productRepository.editProduct(id, data);
  }

  async deleteProduct(id: number): Promise<Product | null> {
    return this.productRepository.deleteProduct(id);
  }
}
