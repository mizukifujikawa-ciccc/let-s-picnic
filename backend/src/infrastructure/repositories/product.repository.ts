import { createClient } from "../database/dbClient";
import { Product } from "../../domain/entities/product.entity";
import { Category } from "../../domain/entities/category.entity";
import { ProductCreateInput } from "../../domain/repositories/product.repository";

const mapRowToProduct = (row: any): Product => {
  const category = new Category(
    row.category_id,
    row.category_name,
    row.category_description,
    row.category_image,
    row.category_created_at,
    row.category_updated_at,
  );
  return new Product(
    row.product_id ?? row.id,
    row.product_name,
    category,
    row.price,
    row.product_image ?? row.main_image,
    row.product_description ?? row.description,
    row.discount_percentage,
    row.rating,
    row.sku,
    row.created_at,
    row.updated_at,
  );
};

// get all products
const getAllProducts = async (): Promise<Product[]> => {
  const client = createClient();
  try {
    await client.connect();
    const result = await client.query(
      `SELECT
        product.id as product_id,
        product.main_image as product_image,
        product.description as product_description,
        product.*,
        category.category_name as category_name,
        category.description as category_description,
        category.image as category_image,
        category.created_at as category_created_at,
        category.updated_at as category_updated_at
       FROM "product" AS product
       LEFT JOIN "category" AS category
       ON product.category_id = category.id
       ORDER BY product_id ASC`,
    );
    return result.rows.map(mapRowToProduct);
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    await client.end();
  }
};

// get product by id
const getProductById = async (id: number): Promise<Product | null> => {
  const client = createClient();
  try {
    await client.connect();
    const result = await client.query(
      `SELECT
        product.id as product_id,
        product.main_image as product_image,
        product.description as product_description,
        product.*,
        category.category_name as category_name,
        category.description as category_description,
        category.image as category_image,
        category.created_at as category_created_at,
        category.updated_at as category_updated_at
       FROM "product" AS product
       LEFT JOIN "category" AS category
       ON product.category_id = category.id
       WHERE product.id = $1`,
      [id],
    );
    return result.rows[0] ? mapRowToProduct(result.rows[0]) : null;
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    await client.end();
  }
};

// get product by name
const getProductByName = async (
  productName: string,
): Promise<Product | null> => {
  const client = createClient();
  try {
    await client.connect();
    const result = await client.query(
      `SELECT
        product.id as product_id,
        product.main_image as product_image,
        product.description as product_description,
        product.*,
        category.category_name as category_name,
        category.description as category_description,
        category.image as category_image,
        category.created_at as category_created_at,
        category.updated_at as category_updated_at
       FROM "product" AS product
       LEFT JOIN "category" AS category
       ON product.category_id = category.id
       WHERE product.product_name = $1`,
      [productName],
    );
    return result.rows[0] ? mapRowToProduct(result.rows[0]) : null;
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    await client.end();
  }
};

// get products by group category
const getProductsByCategoryId = async (
  categoryId: number,
): Promise<Product[]> => {
  const client = createClient();
  try {
    await client.connect();
    const result = await client.query(
      `SELECT
        product.id as product_id,
        product.main_image as product_image,
        product.description as product_description,
        product.*,
        category.category_name as category_name,
        category.description as category_description,
        category.image as category_image,
        category.created_at as category_created_at,
        category.updated_at as category_updated_at
       FROM "product" AS product
       LEFT JOIN "category" AS category
       ON product.category_id = category.id
       WHERE product.category_id = $1`,
      [categoryId],
    );
    return result.rows.map(mapRowToProduct);
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    await client.end();
  }
};

// create product
const createProduct = async (
  newProduct: ProductCreateInput,
): Promise<Product | null> => {
  const {
    productName,
    categoryId,
    price,
    mainImage,
    description,
    discountPercentage,
    rating,
    sku,
  } = newProduct;
  const client = createClient();
  try {
    await client.connect();
    const result = await client.query(
      `INSERT INTO product (product_name, category_id, price, main_image, description, discount_percentage, rating, sku) VALUES ($1, $2, $3, $4, $5,  $6, $7, $8) RETURNING *`,
      [
        productName,
        categoryId,
        price,
        mainImage,
        description,
        discountPercentage,
        rating,
        sku,
      ],
    );
    const inserted = result.rows[0];
    if (!inserted) return null;
    const joined = await client.query(
      `SELECT category_name, description as category_description, image as category_image, created_at as category_created_at, updated_at as category_updated_at FROM category WHERE id = $1`,
      [inserted.category_id],
    );
    const cat = joined.rows[0];
    return cat
      ? mapRowToProduct({
          ...inserted,
          ...cat,
          category_id: inserted.category_id,
        })
      : null;
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    await client.end();
  }
};

// edit product by id
const editProduct = async (
  id: number,
  updatedProduct: Partial<ProductCreateInput>,
): Promise<Product | null> => {
  const foundProduct = await getProductById(id);
  if (!foundProduct) return null;
  const client = createClient();
  try {
    await client.connect();
    const updateData = {
      productName: updatedProduct.productName ?? foundProduct.productName,
      categoryId: updatedProduct.categoryId ?? foundProduct.categoryId,
      price: updatedProduct.price ?? foundProduct.price,
      mainImage: updatedProduct.mainImage ?? foundProduct.mainImage,
      description: updatedProduct.description ?? foundProduct.description,
      discountPercentage:
        updatedProduct.discountPercentage ?? foundProduct.discountPercentage,
      rating: updatedProduct.rating ?? foundProduct.rating,
      sku: updatedProduct.sku ?? foundProduct.sku,
    };
    const result = await client.query(
      `UPDATE "product" SET product_name = $1, category_id = $2, price = $3, main_image = $4, description = $5, discount_percentage = $6, rating = $7, sku = $8 WHERE id = $9 RETURNING *`,
      [
        updateData.productName,
        updateData.categoryId,
        updateData.price,
        updateData.mainImage,
        updateData.description,
        updateData.discountPercentage,
        updateData.rating,
        updateData.sku,
        id,
      ],
    );
    const updated = result.rows[0];
    if (!updated) return null;
    const joined = await client.query(
      `SELECT category_name, description as category_description, image as category_image, created_at as category_created_at, updated_at as category_updated_at FROM category WHERE id = $1`,
      [updated.category_id],
    );
    const cat = joined.rows[0];
    return cat
      ? mapRowToProduct({
          ...updated,
          ...cat,
          category_id: updated.category_id,
        })
      : null;
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    await client.end();
  }
};

// delete product by id
const deleteProduct = async (id: number): Promise<Product | null> => {
  const existing = await getProductById(id);
  if (!existing) return null;
  const client = createClient();
  try {
    await client.connect();
    await client.query(`DELETE FROM "product" WHERE id = $1`, [id]);
    return existing;
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    await client.end();
  }
};

export default {
  getAllProducts,
  getProductById,
  getProductByName,
  getProductsByCategoryId,
  createProduct,
  editProduct,
  deleteProduct,
};
