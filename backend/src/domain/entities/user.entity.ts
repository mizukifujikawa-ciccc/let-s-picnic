// domain/entities/user.ts

export class User {
  constructor(
    private readonly _id: number,
    private _firstName: string,
    private _lastName: string,
    private _email: string,
    private _hashedPassword: string,
    private _role: string,
    private readonly _createdAt: string,
    private _updatedAt: string
  ) {}

  // getter
  get id(): number {
    return this._id;
  }

  get firstName(): string {
    return this._firstName;
  }

  get lastName(): string {
    return this._lastName;
  }

  get email(): string {
    return this._email;
  }

  get hashedPassword(): string {
    return this._hashedPassword;
  }

  get role(): string {
    return this._role;
  }

  get createdAt(): string {
    return this._createdAt;
  }

  get updatedAt(): string {
    return this._updatedAt;
  }

  updateFirstName(firstName: string): void {
    this._firstName = firstName;
    this.touchUpdatedAt();
  }

  updateLastName(lastName: string): void {
    this._lastName = lastName;
    this.touchUpdatedAt();
  }

  updateEmail(email: string): void {
    // メールフォーマットバリデーションなど入れても良い
    this._email = email;
    this.touchUpdatedAt();
  }

  updateRole(role: string): void {
    this._role = role;
    this.touchUpdatedAt();
  }

  updatePassword(hashedPassword: string): void {
    this._hashedPassword = hashedPassword;
    this.touchUpdatedAt();
  }

  private touchUpdatedAt(): void {
    this._updatedAt = new Date().toISOString();
  }

  // toJSON などを作って出力用の形にするのもあり
  toPlainObject() {
    return {
      id: this._id,
      firstName: this._firstName,
      lastName: this._lastName,
      email: this._email,
      role: this._role,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt
      // hashedPassword は通常出さない
    };
  }
}
