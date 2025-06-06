import { createClient } from '../database/dbClient'
import { User } from "../../domain/entities/user.entity";

// 共通のマッピング関数
function mapRowToUser(row: any): User {
  return new User(
    row.id,
    row.firstname,
    row.lastname,
    row.email,
    row.password, // hashedPassword
    row.role,
    row.created_at,
    row.updated_at
  );
}

// fetch all user
const getAllUsers = async (): Promise<User[]> => {
  const client = createClient()
  try {
    await client.connect()
    const result = await client.query(`SELECT * FROM "user" ORDER BY created_at DESC`)
    return result.rows.map(mapRowToUser)
  } catch (err) {
    console.error("Error fetching users:", err)
    throw err
  } finally {
    await client.end()
  }
}

// fetch user by id
const getUserById = async (id: number): Promise<User | null> => {
  const client = createClient()
  try {
    await client.connect()
    const result = await client.query( `SELECT * FROM "user" WHERE id = $1`, [id])
    return result.rows[0] ? mapRowToUser(result.rows[0]) : null
  } catch (err) {
    console.error("Error fetching user by id:", err)
    throw err
  } finally {
    await client.end()
  }
}

// get user by email (for login)
const getUserByEmail = async (email: string): Promise<User | null> => {
  const client = createClient()
  try {
    await client.connect()
    const result = await client.query(
      `SELECT * FROM "user" WHERE email = $1`,
      [email]
    )
    return result.rows[0] ? mapRowToUser(result.rows[0]) : null
  } catch (err) {
    console.error("Error fetching user by email:", err)
    throw err
  } finally {
    await client.end()
  }
}

// add new user
const createUser = async (newUser: Omit<User,  'id'>): Promise<User | null> => {
  const { firstName, lastName, email, hashedPassword, role } = newUser
  const client = createClient()
  try {
    await client.connect()
    const existUser = await client.query(
      `SELECT * FROM "user" WHERE email = $1`,
      [email]
    )
    if (existUser.rows[0]) {
      return null;
    }

    const result = await client.query(
      `INSERT INTO "user" (firstname, lastname, email, password, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [firstName, lastName, email, hashedPassword, role]
    )
    return result.rows[0] ? mapRowToUser(result.rows[0]) : null
  } catch (err) {
    console.error("Error creating user:", err)
    throw err
  } finally {
    await client.end()
  }
}

// edit user (except password)
const editUser = async (id: number, updatedUser: Partial<User>): Promise<User | null> => {
  const findUser = await getUserById(id);
  if(!findUser) {
    return null;
  }

  const client = createClient()
  try {
    await client.connect()

    const updateData = {
      firstName: updatedUser.firstName ?? findUser.firstName,
      lastName: updatedUser.lastName ?? findUser.lastName,
      email: updatedUser.email ?? findUser.email,
      role: updatedUser.role ?? findUser.role
    }

    const result = await client.query(
      `UPDATE "user" SET firstname = $1, lastname = $2, email = $3, role = $4 WHERE id = $5 RETURNING *`,
      [updateData.firstName, updateData.lastName, updateData.email, updateData.role, id]
    )
    return result.rows[0] ? mapRowToUser(result.rows[0]) : null
  } catch (err) {
    console.error("Error editing user:", err)
    throw err
  } finally {
    await client.end()
  }
}

// delete user
const deleteUser = async (id: number): Promise<User | null> => {
  const client = createClient()
  try {
    await client.connect()
    const result = await client.query(`DELETE FROM "user" WHERE id = $1 RETURNING *`, [id])
    return result.rows[0] ? mapRowToUser(result.rows[0]) : null
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
