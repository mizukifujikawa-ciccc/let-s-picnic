// domain/repositories/user.repository.ts
import { User } from "../entities/user.entity";

export interface UserRepository {
  getAllUsers(): Promise<User[]>;
  getUserById(userId: number): Promise<User | null>;
  createUser(userData: {
    firstName: string;
    lastName: string;
    email: string;
    hashedPassword: string;
    role: string;
  }): Promise<User | null>;
  editUser(userId: number, data: Partial<Omit<User, "id" | "password">>): Promise<User | null>;
  deleteUser(userId: number): Promise<User | null>;
  getUserByEmail(email: string): Promise<User | null>;
}
