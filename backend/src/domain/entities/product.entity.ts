import { Category } from "./category.entity";

export class Product {
  constructor(
    private readonly _id: number,
    private _productName: string,
    private _category: Category,
    private _price: number,
    private _mainImage: string,
    private _description: string,
    private _discountPercentage: number,
    private _rating: number,
    private _sku: string,
    private readonly _createdAt: string,
    private _updatedAt: string,
  ) {}

  get id(): number {
    return this._id;
  }

  get productName(): string {
    return this._productName;
  }

  get categoryId(): number {
    return this._category.id;
  }

  get category(): Category {
    return this._category;
  }

  get price(): number {
    return this._price;
  }

  get mainImage(): string {
    return this._mainImage;
  }

  get description(): string {
    return this._description;
  }

  get discountPercentage(): number {
    return this._discountPercentage;
  }

  get rating(): number {
    return this._rating;
  }

  get sku(): string {
    return this._sku;
  }

  get createdAt(): string {
    return this._createdAt;
  }

  get updatedAt(): string {
    return this._updatedAt;
  }

  updateProductName(name: string): void {
    this._productName = name;
    this.touchUpdatedAt();
  }

  updateCategory(category: Category): void {
    this._category = category;
    this.touchUpdatedAt();
  }

  updatePrice(price: number): void {
    this._price = price;
    this.touchUpdatedAt();
  }

  updateMainImage(image: string): void {
    this._mainImage = image;
    this.touchUpdatedAt();
  }

  updateDescription(description: string): void {
    this._description = description;
    this.touchUpdatedAt();
  }

  updateDiscountPercentage(discount: number): void {
    this._discountPercentage = discount;
    this.touchUpdatedAt();
  }

  updateRating(rating: number): void {
    this._rating = rating;
    this.touchUpdatedAt();
  }

  updateSku(sku: string): void {
    this._sku = sku;
    this.touchUpdatedAt();
  }

  private touchUpdatedAt(): void {
    this._updatedAt = new Date().toISOString();
  }

  toPlainObject() {
    return {
      id: this._id,
      productName: this._productName,
      category: this._category.toPlainObject(),
      price: this._price,
      mainImage: this._mainImage,
      description: this._description,
      discountPercentage: this._discountPercentage,
      rating: this._rating,
      sku: this._sku,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}
