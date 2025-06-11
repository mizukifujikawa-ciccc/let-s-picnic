export class Transaction {
  constructor(
    private readonly _id: number,
    private readonly _userId: number,
    private readonly _cartId: number,
    private readonly _trackingNum: string,
    private _status: 'purchased' | 'cancel',
    private readonly _amount: number,
    private readonly _createdAt: string,
    private _updatedAt: string,
  ) {}

  get id(): number { return this._id; }
  get userId(): number { return this._userId; }
  get cartId(): number { return this._cartId; }
  get trackingNum(): string { return this._trackingNum; }
  get status(): 'purchased' | 'cancel' { return this._status; }
  get amount(): number { return this._amount; }
  get createdAt(): string { return this._createdAt; }
  get updatedAt(): string { return this._updatedAt; }

  updateStatus(status: 'purchased' | 'cancel') {
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
      cartId: this._cartId,
      trackingNum: this._trackingNum,
      status: this._status,
      amount: this._amount,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}
