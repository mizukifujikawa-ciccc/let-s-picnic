import { Request, Response } from "express";
import userModel from "../models/user.model";
import bcrypt from "bcrypt";
import { User } from "../types/user";

// get all users
const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await userModel.getAllUsers()
    res.status(200).json(users)
  } catch (err) {
    console.error('Error in getAllUsers:', err)
    res.status(500).json({ message: 'Failed to get users'})
  }
}

// get user by id
const getUserById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.userId, 10)
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid user ID. Must be a number." })
    return
  }
  try {
    const user = await userModel.getUserById(id)
    if (!user) {
      res.status(404).json({ error : "User not found"})
      return
    }
    res.status(200).json(user)
  } catch (err) {
    console.error('Error in getUserById:', err)
    res.status(500).json({ message: 'Failed to get user by id'})
  }
}

// add new user
const addUser = async (req: Request, res: Response) => {
  const { firstName, lastName, email, password, role} = req.body;

  if (!firstName || !lastName || !email || !password || !role) {
    res.status(400).json({ message: 'Missing required fields' });
    return;
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userModel.createUser({firstName, lastName, email, hashedPassword, role});

    if(!user){
      res.status(400).json({ message: "User is already existed" })
      return
    }

    res.status(201).json(user);
  } catch (err) {
    console.error('Error in addUser:', err);
    res.status(500).json({ message: 'Failed to add user' });
  }
};

// edit user
const editUser = async (req: Request<{ userId: string }, {}, Partial<User>>, res: Response) => {
  try {
    const id = parseInt(req.params.userId, 10)
    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid user ID" })
      return
    }

    const { firstName, lastName, email, role } = req.body
    const user = await userModel.editUser(id, {firstName, lastName, email, role})

    if (!user) {
      res.status(404).json({ message: "User not found" })
      return
    }

    res.status(200).json(user)
  } catch (err) {
    console.error("Error in editUser:", err)
    res.status(500).json({ message: "Unable to update user" })
  }
}


// delete user
const deleteUser = async (req: Request, res: Response) => {
  const id = parseInt(req.params.userId, 10)
  try {
    const user = await userModel.deleteUser(id)
    res.status(200).json({ message: "User deleted" })
  } catch (err) {
    console.error(err)
    res.status(500).json({message: "Unable to delete user"})
  }
}


// login
const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: "Email or password missing" });
    return;
  }

  try {
    const user = await userModel.getUserByEmail(email);
    if (!user || !user.password) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
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
}

const logoutUser = (req: Request, res: Response) => {
  try {
    req.session = null;
    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ error: "Logout failed" });
  }
}

// check cookie
const checkCookie = (req: Request, res: Response) => {
  if (req.session && req.session.userId) {
    res.status(200).json({ loggedIn: true, userId: req.session.userId });
  } else {
    res.status(401).json({ loggedIn: false });
  }
};

export default {
  getAllUsers,
  getUserById,
  addUser,
  editUser,
  deleteUser,
  loginUser,
  logoutUser,
  checkCookie
}