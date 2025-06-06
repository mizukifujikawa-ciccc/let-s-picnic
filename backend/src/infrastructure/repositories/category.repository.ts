import { createClient } from "../database/dbClient";
import { Category } from "../../domain/entities/category.entity";

// 共通のマッピング関数
const mapRowToCategory = (row: any): Category => {
  return new Category(
    row.id,
    row.category_name,
    row.description,
    row.image,
    row.created_at,
    row.updated_at
  );
};

// Get all categories
const getAllCategories = async (): Promise<Category[]> => {
  const client = createClient()
  try {
    await client.connect() // Open the connection
    const result = await client.query(`SELECT * FROM category ORDER BY category_name ASC`)
    return result.rows.map(mapRowToCategory)
  } catch (err) {
    console.error(err)
    throw err
  } finally {
    await client.end() // Close the connection
  }
}

// Get category by id
const getCategoryById = async (id: number): Promise<Category | null> => {
  const client = createClient()
  try {
    await client.connect() // Open the connection
    const result = await client.query(`SELECT * FROM category WHERE id = $1`, [id])
    return result.rows[0] ? mapRowToCategory(result.rows[0]) : null
  } catch (err) {
    console.error(err)
    throw err
  } finally {
    await client.end() // Close the connection
  }
}

// Get category by name
const getCategoryByName = async (categoryName: string): Promise<Category | null> => {
  const client = createClient()
  try {
    await client.connect() // Open the connection
    const result = await client.query(`SELECT * FROM category WHERE category_name = $1`, [categoryName])
    return result.rows[0] ? mapRowToCategory(result.rows[0]) : null
  } catch (err) {
    console.error(err)
    throw err
  } finally {
    await client.end() // Close the connection
  }
}

// Create category
const createCategory = async (newCategory: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<Category | null> => {
  const { categoryName, description, image } = newCategory
  const client = createClient()
  try {
    await client.connect() // Open the connection
    const result = await client.query(`INSERT INTO category (category_name, description, image) VALUES ($1, $2, $3) RETURNING *`, [categoryName, description, image])
    return result.rows[0] ? mapRowToCategory(result.rows[0]) : null
  } catch (err) {
    console.error(err)
    throw err
  } finally {
    await client.end() // Close the connection
  }
}

// Edit category by id
const editCategoryById = async (id: number, updateData: Partial<Category>): Promise<Category | null> => {
  const foundCategory = await getCategoryById(id)
  if (!foundCategory) {
    return null
  }
  const client = createClient()
  try {
    await client.connect() // Open the connection
    const newUpdate = {
      name: updateData.categoryName ?? foundCategory.categoryName,
      description: updateData.description ?? foundCategory.description,
      image: updateData.image ?? foundCategory.image
    }
    const result = await client.query(`UPDATE category SET category_name = $1, description = $2, image = $3 WHERE id = $4 RETURNING *`, [newUpdate.name, newUpdate.description, newUpdate.image, id])
    return result.rows[0] ? mapRowToCategory(result.rows[0]) : null
  } catch (err) {
    console.error(err)
    throw err
  } finally {
    await client.end() // Close the connection
  }
}

// Remove category by id
const removeCategoryById = async (id: number): Promise<Category | null> => {
  const client = createClient()
  try {
    await client.connect() // Open the connection
    const result = await client.query(`DELETE FROM category WHERE id = $1 RETURNING *`, [id])
    return result.rows[0] ? mapRowToCategory(result.rows[0]) : null
  } catch (err) {
    console.error(err)
    throw err
  } finally {
    await client.end() // Close the connection
  }
}

export default {
  getAllCategories,
  getCategoryById,
  getCategoryByName,
  createCategory,
  editCategoryById,
  removeCategoryById
}
