import express, { Request, Response } from 'express'
import dotenv from 'dotenv'
import cookieSession from 'cookie-session'
import cors from 'cors'
dotenv.config()
import { connectDb } from './database/dbClient'
import userRouter from './routes/user.routes'
import categoryRouter from './routes/category.routes'
import productRouter from './routes/product.routes'

// Create server
const app = express()

// Middleware
app.use(cors({
  origin: "http://localhost:5173", // React port
  credentials: true // allow cookie transfer
}))
app.use(express.json());
const SIGN_KEY = process.env.COOKIE_SIGN_KEY
const ENCRYPT_KEY = process.env.COOKIE_ENCRYPT_KEY
if (!SIGN_KEY || !ENCRYPT_KEY) {
  throw new Error("Missing cookie keys!")
}

app.use(cookieSession({
  name: 'session',
  keys: [SIGN_KEY, ENCRYPT_KEY],
  maxAge: 60 * 60 * 1000
}))

// Routes
app.use('/user', userRouter);
app.use('/category', categoryRouter);
app.use('/product', productRouter)

// Fallback
app.use((req: Request, res: Response) => {
  res.status(404).send("Invalid route!")
})


const PORT = process.env.PORT || 3000

// Client connection
connectDb().then(() => {
    // Start server
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`)
    })
}).catch(err => {
  console.error(err)
})
