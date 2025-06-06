import { createClient } from '../database/dbClient'
import { User } from "../types/user";

// fetch all user
const getAllUsers = async () => {
  const client = createClient()
  try {
    await client.connect()
    const result = await client.query(`SELECT * FROM "user" ORDER BY created_at DESC`)
    return result.rows
  } catch (err) {
    console.error("Error fetching users:", err)
    throw err
  } finally {
    await client.end()
  }
}

// fetch user by id
const getUserById = async (id: number) => {
  const client = createClient()
  try {
    await client.connect()
    const result = await client.query( `SELECT * FROM "user" WHERE id = $1`, [id])
    return result.rows[0] || null
  } catch (err) {
    console.error("Error fetching user by id:", err)
    throw err
  } finally {
    await client.end()
  }
}

// get user by email (for login)
const getUserByEmail = async (email: string) => {
  const client = createClient()
  try {
    await client.connect()
    const result = await client.query(
      `SELECT * FROM "user" WHERE email = $1`,
      [email]
    )
    return result.rows[0] || null
  } catch (err) {
    console.error("Error fetching user by email:", err)
    throw err
  } finally {
    await client.end()
  }
}

// add new user
const createUser = async (newUser: Omit<User,  'id' | 'createdAt' | 'updatedAt'>) => {
  const { firstName, lastName, email, hashedPassword, role } = newUser
  const client = createClient()
  try {
    await client.connect()
    const existUser = await client.query(
      `SELECT * FROM "user" WHERE email = $1`,
      [email]
    )
    if (existUser.rows[0]) {
      return undefined;
    }

    const result = await client.query(
      `INSERT INTO "user" (firstname, lastname, email, password, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [firstName, lastName, email, hashedPassword, role]
    )
    return result.rows[0]
  } catch (err) {
    console.error("Error creating user:", err)
    throw err
  } finally {
    await client.end()
  }
}

// edit user (except password)
const editUser = async (id: number, updatedUser: Partial<User>) => {
  const findUser = await getUserById(id);
  if(!findUser) {
    return undefined;
  }

  const client = createClient()
  try {
    await client.connect()

    const updateData = {
      firstName: updatedUser.firstName ?? findUser.firstname,
      lastName: updatedUser.lastName ?? findUser.lastname,
      email: updatedUser.email ?? findUser.email,
      role: updatedUser.role ?? findUser.role
    }
    const result = await client.query(
      `UPDATE "user" SET firstname = $1, lastname = $2, email = $3, role = $4 WHERE id = $5 RETURNING *`,
      [updateData.firstName, updateData.lastName, updateData.email, updateData.role, id]
    )
    return result.rows[0] || null
  } catch (err) {
    console.error("Error editing user:", err)
    throw err
  } finally {
    await client.end()
  }
}

// delete user
const deleteUser = async (id: number) => {
  const client = createClient()
  try {
    await client.connect()
    const result = await client.query(`DELETE FROM "user" WHERE id = $1 RETURNING *`, [id])
    return result.rows[0] || null
  } catch (err) {
    console.error("Error delete user:", err)
    throw err
  } finally {
    await client.end()
  }
}


export default {
  getAllUsers,
  getUserById,
  getUserByEmail,
  createUser,
  editUser,
  deleteUser
}