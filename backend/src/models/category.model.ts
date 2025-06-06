import { createClient } from "../database/dbClient";
import { Category } from "../types/category";

// Get all category
const getAllCategory = async () => {
  const client = createClient()
  try {
    await client.connect() // Open the connection
    const result = await client.query(`SELECT * FROM category ORDER BY category_name ASC`)
    return result.rows
  } catch (err) {
    console.error(err)
    throw err
  } finally {
    await client.end() // Close the connection
  }
}

// Get category by id
const getCategoryById = async (id: number) => {
  const client = createClient()
  try {
    await client.connect() // Open the connection
    const result = await client.query(`SELECT * FROM category WHERE id = ${id}`)
    return result.rows[0]
  } catch (err) {
    console.error(err)
    throw err
  } finally {
    await client.end() // Close the connection
  }
}

// Get category by name
const getCategoryByName = async (categoryName: string) => {
  const client = createClient()
  try {
    await client.connect() // Open the connection
    const result = await client.query(`SELECT * FROM category WHERE category_name = $1`, [categoryName])
    return result.rows[0]
  } catch (err) {
    console.error(err)
    throw err
  } finally {
    await client.end() // Close the connection
  }
}

// Create category
const createCategory = async (newCategory: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => {
  const { categoryName, description, image } = newCategory
  const client = createClient()
  try {
    await client.connect() // Open the connection
    const result = await client.query(`INSERT INTO category (category_name, description, image) VALUES ($1, $2, $3) RETURNING *`, [categoryName, description, image])
    return result.rows[0]
  } catch (err) {
    console.error(err)
    throw err
  } finally {
    await client.end() // Close the connection
  }
}

// Edit category by id
const editCategoryById = async (id: number, updateData: Partial<Category>) => {
  const foundCategory = await getCategoryById(id)
  if (!foundCategory) {
    return undefined
  }
  const client = createClient()
  try {
    await client.connect() // Open the connection
    const newUpdate = {
      name: updateData.categoryName ?? foundCategory.category_name,
      description: updateData.description ?? foundCategory.description,
      image: updateData.image ?? foundCategory.image
    }
    const result = await client.query(`UPDATE category SET category_name = $1, description = $2, image = $3 WHERE id = $4 RETURNING *`, [newUpdate.name, newUpdate.description, newUpdate.image, id])
    return result.rows[0]
  } catch (err) {
    console.error(err)
    throw err
  } finally {
    await client.end() // Close the connection
  }
}

// Remove category by id
const removeCategoryById = async (id: number) => {
  const foundCategory = await getCategoryById(id)
  if (!foundCategory) {
    return undefined
  }
  const client = createClient()
  try {
    await client.connect() // Open the connection
    await client.query(`DELETE FROM category WHERE id = ${id}`)
    return true
  } catch (err) {
    console.error(err)
    throw err
  } finally {
    await client.end() // Close the connection
  }
}

export default {
  getAllCategory,
  getCategoryById,
  getCategoryByName,
  createCategory,
  editCategoryById,
  removeCategoryById
}