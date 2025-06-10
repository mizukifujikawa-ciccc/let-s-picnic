import { Product } from './product.entity';

export class CartItem {
  constructor(
    private readonly _id: number,
    private _quantity: number,
    private readonly _createdAt: string,
    private _updatedAt: string,
    private _product?: Product
  ) {}

  get id(): number { return this._id; }
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
      quantity: this._quantity,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      product: this._product ? this._product.toPlainObject() : undefined
    };
  }
}
