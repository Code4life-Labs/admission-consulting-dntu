/* eslint-disable no-unreachable */
import { uploadDocumentsToSupabaseCloud, uploadSingleDocMDToSupabase } from '../../src/providers/chatbot/upload_documents'

const uploadMultiDocsWebsite = async (data) => {
  // data = {
  //  websites: ["url1", "url2", "url3"]
  //  chunkSize: 500,
  //  chunkOverlap: 100
  // }
  try {
    // const result = await uploadMultiWebsitesToSupabaseCloud(data.websites, data.selector, data.chunkSize, data.chunkSize)
    // return result
  } catch (error) {
    console.log('🚀 ~ file: chatbot.service.js:67 ~ uploadMultiDocsWebsite ~ error:', error)
    throw new Error(error)
  }
}

const uploadMultiDocs = async (data) => {
  // data = {
  // directory, type_file, chunkSize, chunkOverlap
  // }
  try {
    const result = await uploadDocumentsToSupabaseCloud(data.directory, data.type_file, data.chunkSize, data.chunkOverlap)
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const testScratchWebsite = async (data) => {
  // data = {
  //   text: string,
  //   languageConvert: string
  // }
  try {
    // const result = await uploadWebsiteToSupabaseCloud(data.website, data.selector)
    // return result
  } catch (error) {
    throw new Error(error)
  }
}

const uploadSingleDocMD = async (data) => {
  console.log('🚀 ~ uploadSingleDocMD ~ data:', data)
  try {
    const result = await uploadSingleDocMDToSupabase(data)
    return result
  } catch (error) {
    throw new Error(error)
  }
}

export const ChatbotService = {
  uploadMultiDocsWebsite,
  uploadMultiDocs,
  testScratchWebsite,
  uploadSingleDocMD
}
