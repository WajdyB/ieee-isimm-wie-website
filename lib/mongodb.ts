import { MongoClient, Db } from 'mongodb'

const uri = process.env.MONGODB_URI
if (!uri) {
  throw new Error('MONGODB_URI is not defined in environment variables')
}

let client: MongoClient | null = null
let db: Db | null = null

export async function getDb(): Promise<Db> {
  if (db) return db
  if (!client) {
    client = new MongoClient(uri)
    await client.connect()
  }
  db = client.db() // Use default database from URI
  return db
} 