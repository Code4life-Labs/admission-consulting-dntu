import { createClient } from '@supabase/supabase-js'
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory'
import { PDFLoader } from 'langchain/document_loaders/fs/pdf'
import { CheerioWebBaseLoader } from 'langchain/document_loaders/web/cheerio'
import { OpenAIEmbeddings } from '@langchain/openai'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { SupabaseVectorStore } from 'langchain/vectorstores/supabase'
import { TextLoader } from 'langchain/document_loaders/fs/text'
import { Document } from '@langchain/core/documents'

export const uploadDocumentsToSupabaseCloud = async (directory = 'src/documents/upload', type_file = '.pdf .txt', chunkSize = 1000, chunkOverlap = 500) => {
  const typeFileArr = type_file.split(' ')
  const configDirectory = {}
  typeFileArr.forEach(type => {
    if (type === '.pdf') {
      configDirectory['.pdf'] = (path) => new PDFLoader(path)
    } else if (type === '.txt') {
      configDirectory['.txt'] = (path) => new TextLoader(path)
    }
  })
  try {
    const directoryLoader = new DirectoryLoader(directory, configDirectory)

    const docs = await directoryLoader.load()

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize,
      chunkOverlap
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
    return 'OK'
  } catch (err) {
    console.log(err)
  }
}

export const uploadWebsiteToSupabaseCloud = async (website, selector = 'body') => {
  try {
    const loader = new CheerioWebBaseLoader(website, {
      selector
    })
    const docs = await loader.load()
    return docs
  } catch (err) {
    console.log(err)
  }
}

export const getWebsitesPromise = (websiteUrl, selector) => {
  return new Promise((resolve, reject) => {
    try {
      const loader = new CheerioWebBaseLoader(websiteUrl, {
        selector // tổng hợp html
      })
      resolve(loader.load())
    } catch (error) {
      reject(error)
    }
  })
}

export const uploadMultiWebsitesToSupabaseCloud = async (websiteUrls, selector = 'body', chunkSize = 500, chunkOverlap = 100) => {
  try {
    const promiseArr = []

    let docsArr = []

    websiteUrls.forEach((url) => {
      promiseArr.push(getWebsitesPromise(url, selector))
    })
    await Promise.all(promiseArr)
      .then((results) => {
        docsArr = results.flat()
      })
      .catch((err) => {
        console.log('🚀 ~ getMutilImage ~ err:', err)
      })

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize,
      chunkOverlap
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

    return 'Ok'
  } catch (err) {
    console.log(err)
  }
}

export const extractUrlTextInMD = () => {

}

export const uploadSingleDocMDToSupabase = async (data) => {
  const { chunkSize = 1000, chunkOverlap = 500 } = data

  // fake
  const textMD = `
  Mọi thắc mắc cần tư vấn, thí sinh có thể liên hệ theo thông tin sau:
  **TRƯỜNG ĐẠI HỌC CÔNG NGHỆ ĐỒNG NAI - 𝐃𝐨𝐧𝐠 𝐍𝐚𝐢 𝐓𝐞𝐜𝐡𝐧𝐨𝐥𝐨𝐠𝐲 (DNTU)**
  - Mã trường: 𝐃𝐂𝐃
  - Địa chỉ: Đường Nguyễn Khuyến, Khu phố 5, P. Trảng Dài, TP. Biên Hòa, Tỉnh Đồng Nai
  - Website: [https://dntu.edu.vn](https://dntu.edu.vn)
  - Fanpage: [https://facebook.com/dntuedu](https://facebook.com/dntuedu)
  - Hotline/ Zalo: 0986.39.7733 - 0904.39.7733 hoặc (0251) 261 2241
  - E-mail: [tuyensinh@dntu.edu.vn](mailto:tuyensinh@dntu.edu.vn)
  - Xét tuyển online: [https://xetonline.dntu.edu.vn](https://xetonline.dntu.edu.vn)
  - 360 virtual: [https://360campus.dntu.edu.vn](https://360campus.dntu.edu.vn)
  `
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize,
    chunkOverlap
  })

  const splitDocs = await textSplitter.splitDocuments([
    new Document({ pageContent: textMD })
  ])

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
}