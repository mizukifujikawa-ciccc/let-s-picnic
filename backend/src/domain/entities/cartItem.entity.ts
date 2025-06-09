import { Product } from './product.entity';

export class CartItem {
  constructor(
    private readonly _id: number,
    private readonly _cartId: number,
    private readonly _productId: number,
    private _quantity: number,
    private readonly _createdAt: string,
    private _updatedAt: string,
    private _product?: Product
  ) {}

  get id(): number { return this._id; }
  get cartId(): number { return this._cartId; }
  get productId(): number { return this._productId; }
  get quantity(): number { return this._quantity; }
  get createdAt(): string { return this._createdAt; }
  get updatedAt(): string { return this._updatedAt; }
  get product(): Product | undefined { return this._product; }

  updateQuantity(q: number) {
    this._quantity = q;
    this.touchUpdatedAt();
  }

  attachProduct(product: Product) {
    this._product = product;
  }

  private touchUpdatedAt() {
    this._updatedAt = new Date().toISOString();
  }

  toPlainObject() {
    return {
      id: this._id,
      cartId: this._cartId,
      productId: this._productId,
      quantity: this._quantity,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      product: this._product ? this._product.toPlainObject() : undefined
    };
  }
}
