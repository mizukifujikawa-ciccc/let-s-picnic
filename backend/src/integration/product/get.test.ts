const request = require('supertest');
import app from "../../server";
import { createClient } from '../../infrastructure/database/dbClient'

const client = createClient();

describe('GET /product', () => {
  const resultList = [
    {
        "id": 1,
        "productName": "Test Product A",
        "category": {
            "id": 1,
            "categoryName": "Test category A",
            "description": "Description for category A",
            "image": "https://dummyjson.image/groceries",
            "createdAt": "2025-05-15T16:15:39.848Z",
            "updatedAt": "2025-05-15T16:15:39.848Z"
        },
        "price": "19.99",
        "mainImage": "https://example.com/imageA.webp",
        "description": "Description for product A",
        "discountPercentage": 10,
        "rating": "4.90",
        "sku": "aaa-bbb-ccc",
        "createdAt": "2025-05-15T16:44:35.407Z",
        "updatedAt": "2025-05-15T16:44:35.407Z"
    },
    {
      "id": 2,
      "productName": "Test Product B",
      "category": {
          "id": 2,
          "categoryName": "Test category B",
          "description": "Description for category B",
          "image": "https://dummyjson.image/furniture",
          "createdAt": "2025-05-15T16:15:31.491Z",
          "updatedAt": "2025-05-15T16:15:31.491Z"
      },
      "price": "29.99",
      "mainImage": "https://example.com/imageB.webp",
      "description": "Description for product B",
      "discountPercentage": 15,
      "rating": "4.60",
      "sku": "ddd-eee-fff",
      "createdAt": "2025-05-15T16:44:35.412Z",
      "updatedAt": "2025-05-15T16:44:35.412Z"
  }
    ,
    {
      "id": 3,
      "productName": "Test Product C",
      "category": {
          "id": 1,
          "categoryName": "Test category A",
          "description": "Description for category A",
          "image": "https://dummyjson.image/groceries",
          "createdAt": "2025-05-15T16:15:39.848Z",
          "updatedAt": "2025-05-15T16:15:39.848Z"
      },
      "price": "39.99",
      "mainImage": "https://example.com/imageC.webp",
      "description": "Description for product C",
      "discountPercentage": 5,
      "rating": "4.70",
      "sku": "ggg-hhh-iii",
      "createdAt": "2025-05-15T16:44:35.415Z",
      "updatedAt": "2025-05-15T16:44:35.415Z"
    }
  ]

  // テスト用データを挿入
  beforeAll(async () => {
    await client.connect();  // データベースに接続

    // テストデータの挿入
    await client.query(`
      INSERT INTO category (id, category_name, description, image)
      VALUES
      (1, 'Test category A', 'Description for category A', 'https://dummyjson.image/groceries'),
      (2, 'Test category B', 'Description for category B', 'https://dummyjson.image/furniture');
    `);

    await client.query(`
      INSERT INTO product (id, product_name, category_id, price, main_image, description, discount_percentage, rating, sku)
      VALUES
      (1, 'Test Product A', 1, 19.99, 'https://example.com/imageA.webp', 'Description for product A', 10, 4.90, 'aaa-bbb-ccc'),
      (2, 'Test Product B', 2, 29.99, 'https://example.com/imageB.webp', 'Description for product B', 15, 4.60, 'ddd-eee-fff'),
      (3, 'Test Product C', 1, 39.99, 'https://example.com/imageC.webp', 'Description for product C', 5, 4.70, 'ggg-hhh-iii');
    `);
  });

  // test
  it('should return all products', async () => {
    const response = await request(app).get('/product');
    
    // ステータスコードが200であることを確認
    expect(response.status).toBe(200);

    // レスポンスのデータが3つの商品であることを確認
    expect(response.body).toHaveLength(resultList.length);

    // 期待する結果と照らし合わせてチェック
    for (let i = 0; i < resultList.length; i++) {
      const expected = resultList[i];
      const product = response.body[i];

      expect(product.productName).toBe(expected.productName);
      expect(product.price).toBe(expected.price);
      expect(product.mainImage).toBe(expected.mainImage);
      expect(product.description).toBe(expected.description);
      expect(product.category.id).toBe(expected.category.id);
      expect(product.category.categoryName).toBe(expected.category.categoryName);
      expect(product.category.description).toBe(expected.category.description);
      expect(product.category.image).toBe(expected.category.image);
      expect(product.discountPercentage).toBe(expected.discountPercentage);
      expect(product.rating).toBe(expected.rating);
      expect(product.sku).toBe(expected.sku);

      expect(product.category.createdAt).not.toBeNull();
      expect(product.category.updatedAt).not.toBeNull();
      expect(product.createdAt).not.toBeNull();
      expect(product.updatedAt).not.toBeNull();
    }
  });

  it('should return products by category id', async () => {
    const response = await request(app).get('/product/category/1');

    expect(response.status).toBe(200);
    const expectedProducts = [resultList[0], resultList[2]];
    expect(response.body).toHaveLength(expectedProducts.length);

    for (let i = 0; i < expectedProducts.length; i++) {
      const product = response.body[i];
      const expected = expectedProducts[i];

      expect(product.id).toBe(expected.id);
      expect(product.productName).toBe(expected.productName);
      expect(product.price).toBe(expected.price);
      expect(product.mainImage).toBe(expected.mainImage);
      expect(product.description).toBe(expected.description);
      expect(product.category.id).toBe(expected.category.id);
      expect(product.category.categoryName).toBe(expected.category.categoryName);
      expect(product.category.description).toBe(expected.category.description);
      expect(product.category.image).toBe(expected.category.image);
      expect(product.discountPercentage).toBe(expected.discountPercentage);
      expect(product.rating).toBe(expected.rating);
      expect(product.sku).toBe(expected.sku);

      expect(product.category.createdAt).not.toBeNull();
      expect(product.category.updatedAt).not.toBeNull();
      expect(product.createdAt).not.toBeNull();
      expect(product.updatedAt).not.toBeNull();
    }
  });

  it('should return product by name', async () => {
    const response = await request(app).get('/product/search/' + encodeURIComponent('Test Product A'));

    expect(response.status).toBe(200);

    const product = response.body;
    const expected = resultList[0];

    expect(product.id).toBe(expected.id);
    expect(product.productName).toBe(expected.productName);
    expect(product.price).toBe(expected.price);
    expect(product.mainImage).toBe(expected.mainImage);
    expect(product.description).toBe(expected.description);
    expect(product.category.id).toBe(expected.category.id);
    expect(product.category.categoryName).toBe(expected.category.categoryName);
    expect(product.category.description).toBe(expected.category.description);
    expect(product.category.image).toBe(expected.category.image);
    expect(product.discountPercentage).toBe(expected.discountPercentage);
    expect(product.rating).toBe(expected.rating);
    expect(product.sku).toBe(expected.sku);

    expect(product.category.createdAt).not.toBeNull();
    expect(product.category.updatedAt).not.toBeNull();
    expect(product.createdAt).not.toBeNull();
    expect(product.updatedAt).not.toBeNull();
  });

  it('should return product by id', async () => {
    const response = await request(app).get('/product/1');

    expect(response.status).toBe(200);

    const product = response.body;
    const expected = resultList[0];

    expect(product.id).toBe(expected.id);
    expect(product.productName).toBe(expected.productName);
    expect(product.price).toBe(expected.price);
    expect(product.mainImage).toBe(expected.mainImage);
    expect(product.description).toBe(expected.description);
    expect(product.category.id).toBe(expected.category.id);
    expect(product.category.categoryName).toBe(expected.category.categoryName);
    expect(product.category.description).toBe(expected.category.description);
    expect(product.category.image).toBe(expected.category.image);
    expect(product.discountPercentage).toBe(expected.discountPercentage);
    expect(product.rating).toBe(expected.rating);
    expect(product.sku).toBe(expected.sku);

    expect(product.category.createdAt).not.toBeNull();
    expect(product.category.updatedAt).not.toBeNull();
    expect(product.createdAt).not.toBeNull();
    expect(product.updatedAt).not.toBeNull();
  });

  // テスト終了後にデータを削除
  afterAll(async () => {
    await client.query('DELETE FROM "product"');
    await client.query('DELETE FROM "category"');
    await client.end();  // データベース接続を終了
  });
});

