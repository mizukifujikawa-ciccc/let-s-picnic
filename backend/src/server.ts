import express, { Request, Response } from 'express'
import dotenv from 'dotenv'
import cookieSession from 'cookie-session'
import cors from 'cors'
// dotenv.config()
if (process.env.NODE_ENV === 'test') {
  dotenv.config({ path: './.env.test' }); // テスト用の設定ファイルを読み込む
} else {
  dotenv.config();  // 開発用の設定ファイルを読み込む
}
import { connectDb } from './database/dbClient'
import userRouter from './routes/user.routes'
import categoryRouter from './routes/category.routes'
import productRouter from './routes/product.routes'

// Create server
const app = express()

// Middleware
app.use(cors({
  origin: "http://localhost:4321", // React port
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
app.use('/product', productRouter);
app.use('/purchase', productRouter);

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

export default app;