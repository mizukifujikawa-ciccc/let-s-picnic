import { User } from './user.entity';
import { CartItem } from './cartItem.entity';

export class Cart {
  constructor(
    private readonly _id: number | null,
    private _status: 'active' | 'purchased' | 'delete' | null,
    private readonly _createdAt: string | null,
    private _updatedAt: string | null,
    private _shippingAddress: string | null,
    private _user?: User,
    private _cartItems: CartItem[] = []
  ) {}

  get id(): number | null { return this._id; }
  get status(): 'active' | 'purchased' | 'delete' | null { return this._status; }
  get createdAt(): string | null { return this._createdAt; }
  get updatedAt(): string | null { return this._updatedAt; }
  get shippingAddress(): string | null { return this._shippingAddress; }
  get user(): User | undefined { return this._user; }
  get cartItems(): CartItem[] { return this._cartItems; }

  setUser(user: User) {
    this._user = user;
  }

  setCartItems(items: CartItem[]) {
    this._cartItems = items;
  }

  updateStatus(status: 'active' | 'purchased' | 'delete') {
    this._status = status;
    this.touchUpdatedAt();
  }

  updateShippingAddress(address: string) {
    this._shippingAddress = address;
    this.touchUpdatedAt();
  }

  private touchUpdatedAt() {
    this._updatedAt = new Date().toISOString();
  }

  getTotalAmount():number {
    return this._cartItems.reduce((sum, item) => sum + item.getSubTotal(), 0);
  }

  toPlainObject() {
    return {
      id: this._id,
      status: this._status,
      totalDiscountedAmount: this.getTotalAmount(),
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      shippingAddress: this._shippingAddress,
      user: this._user ? this._user.toPlainObject() : undefined,
      cartItems: this._cartItems.map(i => i.toPlainObject())
    };
  }
}
