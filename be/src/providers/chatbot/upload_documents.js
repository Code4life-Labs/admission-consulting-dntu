import { createClient } from '@supabase/supabase-js'
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory'
import { PDFLoader } from 'langchain/document_loaders/fs/pdf'
import { CheerioWebBaseLoader } from 'langchain/document_loaders/web/cheerio'
import { OpenAIEmbeddings } from '@langchain/openai'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { SupabaseVectorStore } from 'langchain/vectorstores/supabase'

export const uploadDocumentsToSupabaseCloud = async () => {
  try {
    const directoryLoader = new DirectoryLoader(
      'src/documents/',
      {
        '.pdf': (path) => new PDFLoader(path)
      }
    )

    const docs = await directoryLoader.load()

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      // separators: ['\n\n', '\n', ' ', ''], // default setting
      chunkOverlap: 100
    })

    const splitDocs = await textSplitter.splitDocuments(docs)

    const sbApiKey = process.env.SUPABASE_API_KEY
    const sbUrl = process.env.SUPABASE_URL_LC_CHATBOT
    const openAIApiKey = process.env.OPENAI_API_KEY

    const client = createClient(sbUrl || '', sbApiKey || '')

    const result = await SupabaseVectorStore.fromDocuments(
      splitDocs,
      new OpenAIEmbeddings({ openAIApiKey }),
      {
        client,
        tableName: 'documents'
      }
    )
    console.log('🚀 ~ uploadDocumentsToSupabaseCloud ~ result:', result)
  } catch (err) {
    console.log(err)
  }
}

export const uploadWebsiteToSupabaseCloud = async () => {
  try {
    const loader = new CheerioWebBaseLoader('https://itviec.com/blog/mau-cv-chuan-trinh-bay-du-an-it/', {
      selector: 'section' // tổng hợp bài viết trên IT viec
    })
    const docs = await loader.load()

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      // separators: ['\n\n', '\n', ' ', ''], // default setting
      chunkOverlap: 100
    })

    const splitDocs = await textSplitter.splitDocuments(docs)

    const sbApiKey = process.env.SUPABASE_API_KEY
    const sbUrl = process.env.SUPABASE_URL_LC_CHATBOT
    const openAIApiKey = process.env.OPENAI_API_KEY

    const client = createClient(sbUrl || '', sbApiKey || '')

    const result = await SupabaseVectorStore.fromDocuments(
      splitDocs,
      new OpenAIEmbeddings({ openAIApiKey }),
      {
        client,
        tableName: 'documents'
      }
    )
    console.log('🚀 ~ uploadDocumentsToSupabaseCloud ~ result:', result)
  } catch (err) {
    console.log(err)
  }
}

export const getWebsitesPromise = (websiteUrl) => {
  return new Promise((resolve, reject) => {
    try {
      const loader = new CheerioWebBaseLoader(websiteUrl, {
        selector: 'section' // tổng hợp bài viết trên IT viec
      })
      resolve(loader.load())
    } catch (error) {
      reject(error)
    }
  })
}

export const uploadMultiWebsitesToSupabaseCloud = async () => {
  try {
    const websiteUrls = ['https://itviec.com/blog/javascript-developer/', 'https://itviec.com/blog/front-end-developer-la-gi/']

    const promiseArr = []

    let docsArr = []

    websiteUrls.forEach((url) => {
      promiseArr.push(getWebsitesPromise(url))
    })
    await Promise.all(promiseArr)
      .then((results) => {
        docsArr = results.flat()
      })
      .catch((err) => {
        console.log('🚀 ~ getMutilImage ~ err:', err)
      })

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      // separators: ['\n\n', '\n', ' ', ''], // default setting
      chunkOverlap: 100
    })

    const splitDocs = await textSplitter.splitDocuments(docsArr)
    console.log('🚀 ~ uploadMultiWebsitesToSupabaseCloud ~ splitDocs:', splitDocs)

    const sbApiKey = process.env.SUPABASE_API_KEY
    const sbUrl = process.env.SUPABASE_URL_LC_CHATBOT
    const openAIApiKey = process.env.OPENAI_API_KEY

    const client = createClient(sbUrl || '', sbApiKey || '')

    const result = await SupabaseVectorStore.fromDocuments(
      splitDocs,
      new OpenAIEmbeddings({ openAIApiKey }),
      {
        client,
        tableName: 'documents'
      }
    )
    console.log('🚀 ~ uploadDocumentsToSupabaseCloud ~ result:', result)
  } catch (err) {
    console.log(err)
  }
}