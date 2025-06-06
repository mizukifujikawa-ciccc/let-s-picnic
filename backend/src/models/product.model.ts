import { createClient } from "../database/dbClient";
import { Product } from "../types/product";

// get all products
const getAllProducts = async () => {
  const client = createClient()
  try {
    await client.connect()
    const result = await client.query(
      `SELECT product.*, category.category_name
       FROM "product" AS product
       LEFT JOIN "category" AS category
       ON product.category_id = category.id
       ORDER BY product_name ASC`
    )
    return result.rows
  } catch (err) {
    console.error(err)
    throw err
  } finally {
    await client.end()
  }
}

// get product by id
const getProductById = async (id: number) => {
  const client = createClient()
  try {
    await client.connect()
    const result = await client.query(
      `SELECT product.*, category.category_name
       FROM "product" AS product
       LEFT JOIN "category" AS category
       ON product.category_id = category.id
       WHERE product.id = $1`, [id])
    return result.rows[0]
  } catch (err) {
    console.error(err)
    throw err
  } finally {
    await client.end()
  }
}

// get product by name
const getProductByName = async (productName: string) => {
  const client = createClient()
  try {
    await client.connect()
    const result = await client.query(
      `SELECT product.*, category.category_name
       FROM "product" AS product
       LEFT JOIN "category" AS category
       ON product.category_id = category.id
       WHERE product.product_name = $1`, [productName])
    return result.rows[0]
  } catch (err) {
    console.error(err)
    throw err
  } finally {
    await client.end()
  }
}

// get products by group category
const getProductsByCategoryId = async (categoryId: number) => {
  const client = createClient()
  try {
    await client.connect()
    const result = await client.query(
      `SELECT product.*, category.category_name
       FROM "product" AS product
       LEFT JOIN "category" AS category
       ON product.category_id = category.id
       WHERE product.category_id = $1`,[categoryId])
    return result.rows
  } catch (err) {
    console.error(err)
    throw err
  } finally {
    await client.end()
  }
}

// create product 
const createProduct = async (newProduct: Omit<Product, 'id'| 'createdAt' | 'updatedAt'>) => {
  const { productName, categoryId, price, image, description } = newProduct
  const client = createClient()
  try {
    await client.connect()
    const result = await client.query(`INSERT INTO product (product_name, category_id, price, image, description) VALUES ($1, $2, $3, $4, $5) RETURNING *`,  [productName, categoryId, price, image, description])
    return result.rows[0]
  } catch (err) {
    console.error(err)
    throw err
  } finally {
    await client.end()
  }
}

// edit product by id
const editProduct = async (id: number, updatedProduct: Partial<Product>) => {
  const foundProduct = await getProductById(id)
  if (!foundProduct) return undefined
  const client = createClient()
  try {
    await client.connect()
    const updateData = {
      productName: updatedProduct.productName ?? foundProduct.product_name,
      categoryId: updatedProduct.categoryId ?? foundProduct.category_id,
      price: updatedProduct.price ?? foundProduct.price,
      image: updatedProduct.image ?? foundProduct.image,
      description: updatedProduct.description ?? foundProduct.description
    }
    const result = await client.query(
      `UPDATE "product" SET product_name = $1, category_id = $2, price = $3, image = $4, description = $5 WHERE id = $6 RETURNING *`,
      [updateData.productName, updateData.categoryId, updateData.price, updateData.image, updateData.description, id])
    return result.rows[0]
  } catch (err) {
    console.error(err)
    throw err
  } finally {
    await client.end()
  }
}

// delete product by id
const deleteProduct = async (id: number) => {
  const foundProduct = await getProductById(id)
  if (!foundProduct) return undefined
  const client = createClient()
  try {
    await client.connect()
    await client.query(`DELETE FROM "product" WHERE id = $1`, [id])
    return true
  } catch (err) {
    console.error(err)
    throw err
  } finally {
    await client.end()
  }
}

export default {
  getAllProducts,
  getProductById,
  getProductByName,
  getProductsByCategoryId,
  createProduct,
  editProduct,
  deleteProduct
}