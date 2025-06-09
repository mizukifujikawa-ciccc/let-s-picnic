export class Cart {
  constructor(
    private readonly _id: number,
    private _userId: number,
    private _status: 'active' | 'purchased' | 'delete',
    private readonly _createdAt: string,
    private _updatedAt: string
  ) {}

  get id(): number { return this._id; }
  get userId(): number { return this._userId; }
  get status(): 'active' | 'purchased' | 'delete' { return this._status; }
  get createdAt(): string { return this._createdAt; }
  get updatedAt(): string { return this._updatedAt; }

  updateStatus(status: 'active' | 'purchased' | 'delete') {
    this._status = status;
    this.touchUpdatedAt();
  }

  private touchUpdatedAt() {
    this._updatedAt = new Date().toISOString();
  }

  toPlainObject() {
    return {
      id: this._id,
      userId: this._userId,
      status: this._status,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt
    };
  }
}
