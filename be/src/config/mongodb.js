import { MongoClient, Db } from 'mongodb'

// Import from env
import { env } from './environment'

let dbInstance = null

export const connectDB = async () => {
  const client = new MongoClient(env.MONGODB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true
  })

  // Connect the client to the server
  await client.connect()

  // Assign clientDB to our dbInstance
  dbInstance = client.db(env.DATABASE_NAME)
}

// Get Database Instance
/**
 *
 * @returns {Db}
 */
export const getDB = () => {
  if (!dbInstance) throw new Error('Must connect to Database first!')
  return dbInstance
}