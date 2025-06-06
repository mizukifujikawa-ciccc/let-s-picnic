import { Category } from "../entities/category.entity";

export interface CategoryRepository {
  getAllCategories(): Promise<Category[]>;
  getCategoryById(id: number): Promise<Category | null>;
  getCategoryByName(categoryName: string): Promise<Category | null>;
  createCategory(data: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<Category | null>;
  editCategoryById(id: number, data: Partial<Omit<Category, 'id'>>): Promise<Category | null>;
  removeCategoryById(id: number): Promise<Category | null>;
}
