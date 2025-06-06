import { Client } from "pg";

// Database configuration
const config = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: Number(process.env.DB_PORT)
}

// Create new client
const createClient = () => {
  return new Client(config)
}

// Check database connection
const connectDb = async () => {
  const client = createClient()
  try {
    await client.connect()
    console.log(`Connected to PostgreSQL Database`)
    return client
  } catch (err) {
    console.error(`Error connecting to database`)
    throw err
  }
}

export {
  createClient,
  connectDb
}