// interface/controller/user.controller.ts
import { Request, Response } from "express";
import { UserService } from "../../../application/service/user.service";
import { User } from "../../../domain/entities/user.entity";

export function createUserController(userService: UserService) {
  return {
    getAllUsers: async (req: Request, res: Response) => {
      try {
        const users = await userService.getAllUsers();
        res.status(200).json(users.map(user => user.toPlainObject()));
      } catch (err) {
        console.error("Error in getAllUsers:", err);
        res.status(500).json({ message: "Failed to get users" });
      }
    },

    getUserById: async (req: Request, res: Response) => {
      const id = parseInt(req.params.userId, 10);
      if (isNaN(id)) {
        res.status(400).json({ error: "Invalid user ID" });
        return;
      }
      try {
        const user = await userService.getUserById(id);
        if (!user) {
          res.status(404).json({ error: "User not found" });
          return;
        }
        res.status(200).json(user.toPlainObject());
      } catch (err) {
        console.error("Error in getUserById:", err);
        res.status(500).json({ message: "Failed to get user by id" });
      }
    },

    addUser: async (req: Request, res: Response) => {
      const { firstName, lastName, email, password, role } = req.body;
      if (!firstName || !lastName || !email || !password || !role) {
        res.status(400).json({ message: "Missing required fields" });
        return;
      }
      try {
        const user = await userService.addUser({ firstName, lastName, email, password, role });
        if (!user) {
          res.status(400).json({ message: "User is already existed" });
          return;
        }
        res.status(201).json(user.toPlainObject());
      } catch (err) {
        console.error("Error in addUser:", err);
        res.status(500).json({ message: "Failed to add user" });
      }
    },

    editUser: async (req: Request<{ userId: string }, {}, Partial<User>>, res: Response) => {
      const id = parseInt(req.params.userId, 10);
      if (isNaN(id)) {
        res.status(400).json({ message: "Invalid user ID" });
        return;
      }
      try {
        const user = await userService.editUser(id, req.body);
        if (!user) {
          res.status(404).json({ message: "User not found" });
          return;
        }
        res.status(200).json(user.toPlainObject());
      } catch (err) {
        console.error("Error in editUser:", err);
        res.status(500).json({ message: "Unable to update user" });
      }
    },

    deleteUser: async (req: Request, res: Response) => {
      const id = parseInt(req.params.userId, 10);
      try {
        await userService.deleteUser(id);
        res.status(200).json({ message: "User deleted" });
      } catch (err) {
        console.error("Error in deleteUser:", err);
        res.status(500).json({ message: "Unable to delete user" });
      }
    },

    loginUser: async (req: Request, res: Response) => {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400).json({ error: "Email or password missing" });
        return;
      }
      try {
        const user = await userService.loginUser(email, password);
        if (!user) {
          res.status(401).json({ error: "Invalid email or password" });
          return;
        }
        if (req.session) {
          req.session.isLoggedIn = true;
          req.session.userId = user.id;
        }
        res.status(200).json({ message: "Login successful", userId: user.id });
      } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ error: "Login failed" });
      }
    },

    logoutUser: (req: Request, res: Response) => {
      try {
        req.session = null;
        res.status(200).json({ message: "Logged out successfully" });
      } catch (err) {
        console.error("Logout error:", err);
        res.status(500).json({ error: "Logout failed" });
      }
    },

    checkCookie: (req: Request, res: Response) => {
      if (req.session && req.session.userId) {
        res.status(200).json({ loggedIn: true, userId: req.session.userId });
      } else {
        res.status(401).json({ loggedIn: false });
      }
    },
  };
}
