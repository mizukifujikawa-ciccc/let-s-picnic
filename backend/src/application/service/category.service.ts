import { Category } from "../../domain/entities/category.entity";
import { CategoryRepository } from "../../domain/repositories/category.repository";

export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async getAllCategories(): Promise<Category[]> {
    return this.categoryRepository.getAllCategories();
  }

  async getCategoryById(id: number): Promise<Category | null> {
    return this.categoryRepository.getCategoryById(id);
  }

  async addCategory(data: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<Category | null> {
    const exist = await this.categoryRepository.getCategoryByName(data.categoryName);
    if (exist) {
      return null;
    }
    return this.categoryRepository.createCategory(data);
  }

  async editCategory(id: number, data: Partial<Omit<Category, 'id'>>): Promise<Category | null> {
    return this.categoryRepository.editCategoryById(id, data);
  }

  async deleteCategory(id: number): Promise<Category | null> {
    return this.categoryRepository.removeCategoryById(id);
  }
}
