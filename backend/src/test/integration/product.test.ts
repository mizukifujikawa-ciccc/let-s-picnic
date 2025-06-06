const request = require('supertest');
import app from "../../server";
import { createClient } from '../../database/dbClient'

const client = createClient();

describe('GET /product', () => {
  const resultList = [
    {
      id: 1,
      product_name: 'Test Product A',
      category_id: 1,
      price: 20,
      image: 'https://example.com/imageA.webp',
      description: 'Description for product A',
      category_name: 'Test Category A'
    },
    {
      id: 2,
      product_name: 'Test Product B',
      category_id: 2,
      price: 30,
      image: 'https://example.com/imageB.webp',
      description: 'Description for product B',
      category_name: 'Test Category B'
    }
  ]

  // テスト用データを挿入
  beforeAll(async () => {
    await client.connect();  // データベースに接続

    // テストデータの挿入
    await client.query(`
      INSERT INTO "category" (id, category_name)
      VALUES
      (1, 'Test Category A'),
      (2, 'Test Category B');
    `);

    await client.query(`
      INSERT INTO "product" (id, product_name, description, category_id, price, image)
      VALUES
      (1, 'Test Product A', 'Description for product A', 1, 19.99, 'https://example.com/imageA.webp'),
      (2, 'Test Product B', 'Description for product B', 2, 29.99, 'https://example.com/imageB.webp');
    `);
  });

  // test
  it('should return all products', async () => {
    const response = await request(app).get('/product');
    
    // ステータスコードが200であることを確認
    expect(response.status).toBe(200);

    // レスポンスのデータが2つの商品であることを確認
    expect(response.body).toHaveLength(resultList.length);

    // 期待する結果と照らし合わせてチェック
    for (let i = 0; i < resultList.length; i++) {
      const expected = resultList[i];
      const product = response.body[i];

      expect(product.product_name).toBe(expected.product_name);
      expect(product.category_id).toBe(expected.category_id);
      expect(product.price).toBe(expected.price);
      expect(product.image).toBe(expected.image);
      expect(product.description).toBe(expected.description);
      expect(product.category_name).toBe(expected.category_name);
    }
  });

  // テスト終了後にデータを削除
  afterAll(async () => {
    await client.query('DELETE FROM "product"');
    await client.query('DELETE FROM "category"');
    await client.end();  // データベース接続を終了
  });
});

// describe('POST /product', () => {
//   it('should create a new product', async () => {
//     const newProduct = {
//       name: 'Product C',
//       price: 200
//     };

//     const response = await request(app)
//       .post('/products')
//       .send(newProduct);
    
//     expect(response.status).toBe(201);
//     expect(response.body).toHaveProperty('id');
//     expect(response.body.name).toBe(newProduct.name);
//     expect(response.body.price).toBe(newProduct.price);
//   });
// });

// describe('DELETE /product/:id', () => {
//   it('should delete a product', async () => {
//     const response = await request(app).delete('/products/1');
    
//     expect(response.status).toBe(200);
//     expect(response.body.message).toBe('Product deleted');
//   });
// });
