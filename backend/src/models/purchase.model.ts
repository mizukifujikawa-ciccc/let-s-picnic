import { createClient } from "../database/dbClient";

// Make purchase
const makePurchase = async (cartId: number) => {
  const client = createClient()
  try {
    await client.connect() // Open the connection
    const result = await client.query(`UPDATE cart SET status = $1 WHERE id = $2 RETURNING *`, ['purchased', cartId])
    return true
  } catch (err) {
    console.error(err)
    throw err
  } finally {
    await client.end() // Close the connection
  }
}

export default {
  makePurchase
}