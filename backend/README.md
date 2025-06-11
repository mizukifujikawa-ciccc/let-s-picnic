# Backend API

This document describes the available endpoints for the Express based API located in this directory.

All endpoints respond with JSON and return appropriate HTTP status codes.

## User

### `GET /user/`
Returns a list of users.

**Response**
```json
[
  {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### `POST /user/signup`
Create a new user.

**Request**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "secret",
  "role": "user"
}
```

**Response**
```json
{
  "id": 1,
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "role": "user",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### `POST /user/login`
Login with email and password.

**Request**
```json
{
  "email": "john@example.com",
  "password": "secret"
}
```

**Response**
```json
{
  "message": "Login successful",
  "userId": 1
}
```

### `GET /user/logout`
Invalidate the session.

**Response**
```json
{ "message": "Logged out successfully" }
```

### `GET /user/check-cookie`
Check if the current session is logged in.

**Response**
```json
{ "loggedIn": true, "userId": 1 }
```

### `GET /user/:userId`
Get a user by ID.

**Response**
```json
{
  "id": 1,
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "role": "user",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### `PUT /user/:userId`
Update a user (partial fields allowed).

**Request**
```json
{
  "firstName": "Jane"
}
```

**Response**
```json
{
  "id": 1,
  "firstName": "Jane",
  "lastName": "Doe",
  "email": "john@example.com",
  "role": "user",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-02T00:00:00.000Z"
}
```

### `DELETE /user/:userId`
Delete a user.

**Response**
```json
{ "message": "User deleted" }
```

## Category

### `GET /category/`
List categories.

**Response**
```json
[
  {
    "id": 1,
    "categoryName": "Perfume",
    "description": "Fragrance items",
    "image": "url",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### `POST /category/`
Create a category.

**Request**
```json
{
  "categoryName": "Perfume",
  "description": "Fragrance items",
  "image": "url"
}
```

**Response**
```json
{
  "id": 1,
  "categoryName": "Perfume",
  "description": "Fragrance items",
  "image": "url",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### `PUT /category/:categoryId`
Update a category.

**Request**
```json
{
  "description": "Updated"
}
```

**Response**
```json
{
  "id": 1,
  "categoryName": "Perfume",
  "description": "Updated",
  "image": "url",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-02T00:00:00.000Z"
}
```

### `DELETE /category/:categoryId`
Remove a category.

**Response**
```json
{ "message": "Category deleted" }
```

### `GET /category/:categoryId`
Get a category by ID.

**Response**
```json
{
  "id": 1,
  "categoryName": "Perfume",
  "description": "Fragrance items",
  "image": "url",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## Product

### `GET /product/`
List products.

**Response**
```json
[
  {
    "id": 1,
    "productName": "CK One",
    "category": { "id": 1, "categoryName": "Perfume" },
    "price": 9.99,
    "mainImage": "url",
    "description": "desc",
    "discountPercentage": 0,
    "rating": 4.5,
    "sku": "ABC123",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### `POST /product/`
Create a product.

**Request**
```json
{
  "productName": "CK One",
  "categoryId": 1,
  "price": 9.99,
  "mainImage": "url",
  "description": "desc",
  "discountPercentage": 0,
  "rating": 4.5,
  "sku": "ABC123"
}
```

**Response**
```json
{
  "id": 1,
  "productName": "CK One",
  "category": { "id": 1, "categoryName": "Perfume" },
  "price": 9.99,
  "mainImage": "url",
  "description": "desc",
  "discountPercentage": 0,
  "rating": 4.5,
  "sku": "ABC123",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### `PUT /product/:productId`
Update a product.

**Request**
```json
{
  "price": 19.99
}
```

**Response**
```json
{
  "id": 1,
  "productName": "CK One",
  "category": { "id": 1, "categoryName": "Perfume" },
  "price": 19.99,
  "mainImage": "url",
  "description": "desc",
  "discountPercentage": 0,
  "rating": 4.5,
  "sku": "ABC123",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-02T00:00:00.000Z"
}
```

### `DELETE /product/:productId`
Delete a product.

**Response**
```json
{ "message": "Product deleted" }
```

### `GET /product/category/:categoryId`
List products in a category.

### `GET /product/search/:productName`
Find a product by name.

### `GET /product/:productId`
Get a product by ID. Responses match the product structure shown above.

## Cart

### `POST /cart/item/:userId`
Add an item to a user's cart.

**Request**
```json
{
  "productId": 1,
  "quantity": 2
}
```

**Response**
```json
{
  "id": 1,
  "quantity": 2,
  "discountedPrice": 9.99,
  "subTotal": 19.98,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "product": { "id": 1, "productName": "CK One", ... }
}
```

### `GET /cart/:userId`
Retrieve the active cart for a user.

**Response**
```json
{
  "id": 1,
  "status": "active",
  "totalDiscountedAmount": 19.98,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "shippingAddress": null,
  "user": { "id": 1, "firstName": "John", ... },
  "cartItems": [
    {
      "id": 1,
      "quantity": 2,
      "discountedPrice": 9.99,
      "subTotal": 19.98,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "product": { "id": 1, "productName": "CK One", ... }
    }
  ]
}
```

### `PUT /cart/item/:userId`
Update quantity of an item in the cart. Quantity `0` removes it.

**Request**
```json
{
  "productId": 1,
  "quantity": 1
}
```

### `PUT /cart/address/:userId`
Update shipping address.

**Request**
```json
{ "shippingAddress": "Toronto" }
```

### `DELETE /cart/item/:userId`
Remove an item from the cart. Body should include the cart item id.

**Request**
```json
{ "cartItemId": 1 }
```

### `DELETE /cart/:userId`
Mark a cart as deleted.

**Response**
```json
{ "message": "Cart deleted" }
```

## Payment

### `POST /payment/create-payment-intent`
Create a Stripe payment intent for the given cart.

**Request**
```json
{ "cartId": 1 }
```

**Response**
```json
{ "clientSecret": "pi_secret_xxx" }
```

### `GET /payment/:paymentIntentId`
Get order information after payment.

**Response**
```json
{
  "trackingNum": "uuid",
  "cart": {
    "id": 1,
    "status": "purchased",
    "totalDiscountedAmount": 19.98,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "shippingAddress": "Toronto",
    "user": { "id": 1, "firstName": "John", ... },
    "cartItems": [ ... ]
  }
}
```

### `POST /webhook`
Stripe webhook endpoint used internally. The request body must be raw JSON and signed by Stripe.

