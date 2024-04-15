import { ObjectId } from 'mongodb'

// Import schema
import { SpeechSchema } from './speech.schema'
import { getDB } from '../../config/mongodb'

// INSERT
/**
 * Use this function to insert a speech data.
 * @param {*} data
 * @returns
 */
async function insertOne(data) {
  try {
    let validated = await SpeechSchema.validateAsync(data)
    return await getDB().collection('speech').insertOne(validated)
  } catch (error) {
    return {
      errors: error.message
    }
  }
}
// FIND
/**
 * Use this function to find a speech by intent.
 * @param {*} intent
 */
async function findOneByIntent(intent) {
  try {
    let result = await getDB().collection('speech').findOne({ 'intent': intent })
    return result
  } catch (error) {
    return {
      errors: error.message
    }
  }
}

// UPDATE
/**
 * Use this function to update an existing speech.
 * @param {string} id
 * @param {*} data
 * @returns
 */
async function updateOneById(id, data) {
  try {
    let query = { _id: new ObjectId(id) }

    let result = await getDB().collection('speech').updateOne(
      query,
      {
        $set: {
          ...data,
          'updatedAt': Date.now
        }
      }
    )
    return result
  } catch (error) {
    return {
      errors: error.message
    }
  }
}

export const SpeechModel = {
  insertOne,
  findOneByIntent,
  updateOneById
}