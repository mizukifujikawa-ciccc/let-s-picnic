export class Category {
  constructor(
    private readonly _id: number,
    private _categoryName: string,
    private _description: string,
    private _image: string,
    private readonly _createdAt: string,
    private _updatedAt: string
  ) {}

  get id(): number {
    return this._id;
  }

  get categoryName(): string {
    return this._categoryName;
  }

  get description(): string {
    return this._description;
  }

  get image(): string {
    return this._image;
  }

  get createdAt(): string {
    return this._createdAt;
  }

  get updatedAt(): string {
    return this._updatedAt;
  }

  updateCategoryName(name: string): void {
    this._categoryName = name;
    this.touchUpdatedAt();
  }

  updateDescription(description: string): void {
    this._description = description;
    this.touchUpdatedAt();
  }

  updateImage(image: string): void {
    this._image = image;
    this.touchUpdatedAt();
  }

  private touchUpdatedAt(): void {
    this._updatedAt = new Date().toISOString();
  }

  toPlainObject() {
    return {
      id: this._id,
      categoryName: this._categoryName,
      description: this._description,
      image: this._image,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}
