import { createClient } from "../database/dbClient";
import { Product } from "../types/product";

// get all products
const getAllProducts = async () => {
  const client = createClient()
  try {
    await client.connect()
    const result = await client.query(
      `SELECT
        product.id as product_id,
        product.image as product_image,
        product.description as product_description,
        product.*,
        category.category_name as category_name,
        category.description as category_description,
        category.image as category_image
       FROM "product" AS product
       LEFT JOIN "category" AS category
       ON product.category_id = category.id
       ORDER BY product_id ASC`
    )
    const products = result.rows.map((row) => {
      return {
        product: {
          id: row.product_id,
          productName: row.product_name,
          price: row.price,
          image: row.product_image,
          description: row.product_description,
          discountPercentage: row.discount_percentage,
          rating: row.rating,
          sku: row.sku,
          categoryId: row.category_id,
          category: {
            categoryName: row.category_name,
            categoryDescription: row.category_description,
            categoryImage: row.category_image,
          },
        },
      };
    });

    return products;
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
      `SELECT
        product.id as product_id,
        product.image as product_image,
        product.description as product_description,
        product.*,
        category.category_name as category_name,
        category.description as category_description,
        category.image as category_image
       FROM "product" AS product
       LEFT JOIN "category" AS category
       ON product.category_id = category.id
       WHERE product.id = $1`, [id]
    )
    const products = result.rows.map((row) => {
      return {
        product: {
          id: row.product_id,
          productName: row.product_name,
          price: row.price,
          image: row.product_image,
          description: row.product_description,
          discountPercentage: row.discount_percentage,
          rating: row.rating,
          sku: row.sku,
          categoryId: row.category_id,
          category: {
            categoryName: row.category_name,
            categoryDescription: row.category_description,
            categoryImage: row.category_image,
          },
        },
      };
    });

    return products[0];
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
      `SELECT
        product.id as product_id,
        product.image as product_image,
        product.description as product_description,
        product.*,
        category.category_name as category_name,
        category.description as category_description,
        category.image as category_image
       FROM "product" AS product
       LEFT JOIN "category" AS category
       ON product.category_id = category.id
       WHERE product.product_name = $1`, [productName]
    )
    const products = result.rows.map((row) => {
      return {
        product: {
          id: row.product_id,
          productName: row.product_name,
          price: row.price,
          image: row.product_image,
          description: row.product_description,
          discountPercentage: row.discount_percentage,
          rating: row.rating,
          sku: row.sku,
          categoryId: row.category_id,
          category: {
            categoryName: row.category_name,
            categoryDescription: row.category_description,
            categoryImage: row.category_image,
          },
        },
      };
    });

    return products;
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
      `SELECT
        product.id as product_id,
        product.image as product_image,
        product.description as product_description,
        product.*,
        category.category_name as category_name,
        category.description as category_description,
        category.image as category_image
       FROM "product" AS product
       LEFT JOIN "category" AS category
       ON product.category_id = category.id
       WHERE product.category_id = $1`,[categoryId]
    )
    const products = result.rows.map((row) => {
      return {
        product: {
          id: row.product_id,
          productName: row.product_name,
          price: row.price,
          image: row.product_image,
          description: row.product_description,
          discountPercentage: row.discount_percentage,
          rating: row.rating,
          sku: row.sku,
          categoryId: row.category_id,
          category: {
            categoryName: row.category_name,
            categoryDescription: row.category_description,
            categoryImage: row.category_image,
          },
        },
      };
    });

    return products;
  } catch (err) {
    console.error(err)
    throw err
  } finally {
    await client.end()
  }
}

// create product
const createProduct = async (newProduct: Omit<Product, 'id'| 'createdAt' | 'updatedAt'>) => {
  const { productName, categoryId, price, image, description, discountPercentage, rating, sku } = newProduct
  const client = createClient()
  try {
    await client.connect()
    const result = await client.query(
      `INSERT INTO product (product_name, category_id, price, image, description, discount_percentage, rating, sku) VALUES ($1, $2, $3, $4, $5,  $6, $7, $8) RETURNING *`,
      [productName, categoryId, price, image, description, discountPercentage, rating, sku])
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
      productName: updatedProduct.productName ?? foundProduct.product.productName,
      categoryId: updatedProduct.categoryId ?? foundProduct.product.categoryId,
      price: updatedProduct.price ?? foundProduct.product.price,
      image: updatedProduct.image ?? foundProduct.product.image,
      description: updatedProduct.description ?? foundProduct.product.description,
      discountPercentage: updatedProduct.discountPercentage ?? foundProduct.product.discountPercentage,
      rating: updatedProduct.rating ?? foundProduct.product.rating,
      sku: updatedProduct.sku ?? foundProduct.product.sku
    }
    const result = await client.query(
      `UPDATE "product" SET product_name = $1, category_id = $2, price = $3, image = $4, description = $5, discount_percentage = $6, rating = $7, sku = $8 WHERE id = $9 RETURNING *`,
      [updateData.productName, updateData.categoryId, updateData.price, updateData.image, updateData.description, updateData.discountPercentage, updateData.rating, updateData.sku, id])
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