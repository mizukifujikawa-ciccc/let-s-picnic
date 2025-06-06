// application/service/user.service.ts
import bcrypt from "bcrypt";
import { User } from "../../domain/entities/user.entity";
import { UserRepository } from "../../domain/repositories/user.repository";

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.getAllUsers();
  }

  async getUserById(userId: number): Promise<User | null> {
    return this.userRepository.getUserById(userId);
  }

  async addUser(data: { firstName: string; lastName: string; email: string; password: string; role: string }): Promise<User | null> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return this.userRepository.createUser({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      hashedPassword,
      role: data.role,
    });
  }

  async editUser(userId: number, data: Partial<Omit<User, "id" | "password">>): Promise<User | null> {
    return this.userRepository.editUser(userId, data);
  }

  async deleteUser(userId: number): Promise<void> {
    await this.userRepository.deleteUser(userId);
  }

  async loginUser(email: string, password: string): Promise<User | null> {
    if (!email || !password) {
      return null;
    }
    const user = await this.userRepository.getUserByEmail(email);
    if (!user) {
      return null;
    }
    const match = await bcrypt.compare(password, user.hashedPassword);
    if (!match) {
      return null;
    }
    return user;
  }
}
