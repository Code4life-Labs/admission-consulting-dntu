import { createClient } from '@supabase/supabase-js'
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory'
import { PDFLoader } from 'langchain/document_loaders/fs/pdf'
import { CheerioWebBaseLoader } from 'langchain/document_loaders/web/cheerio'
import { OpenAIEmbeddings } from '@langchain/openai'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { SupabaseVectorStore } from 'langchain/vectorstores/supabase'
import { TextLoader } from 'langchain/document_loaders/fs/text'
import { Document } from '@langchain/core/documents'
import { deleteFolder, streamUploadMutiple, uploadFilePdf } from '../cloudinary/index'

import fs from 'fs'
import { LOGO_DNTU, sleep } from '~/utilities/constants'

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

const readBufferImagePromise = (_filePath, fileName) => {
  return new Promise((resolve, reject) => {
    fs.readFile(_filePath, (err, fileBuffer) => {
      if (err) {
        console.error('Không thể đọc tệp hình ảnh:', err)
        reject(err)
      } else
        resolve({
          origin_file_name: fileName,
          buffer: fileBuffer
        })
    })
  })
}


const processFileMD = (_rootFolder, _folderName) => {
  return new Promise((resolve, reject) => {
    // Get text in file named .md
    // console.log(`${_rootFolder}/${_folderName}/${_folderName}.md`)
    fs.readFile(`${_rootFolder}/${_folderName}/${_folderName}.md`, 'utf8', async (err, plainText) => {
      if (err) {
        reject(err)
        return
      }

      // regex detch string in ![](_file_name) not display start with http:// or https://
      const regex = /!\[.*?\]\((?!https?:\/\/)(.*?\.(png|jpeg))\)/g
      const filenames = []

      let match
      while ((match = regex.exec(plainText)) !== null) {
        filenames.push(match[1])
      }

      console.log(filenames)

      console.log('filenames', filenames)

      let imageBufferArr = []
      const promises = []
      filenames.forEach(fileName => promises.push(readBufferImagePromise(`${_rootFolder}/${_folderName}/${fileName}`, fileName)))


      await Promise.all(promises)
        .then((results) => {
          imageBufferArr = results
        })
        .catch((err) => {
          console.log('🚀 ~ getMutilImage ~ err:', err)
          reject(err)
        })

      await deleteFolder(`PdfImages/${_folderName}`)

      // upload all to cloudinary
      const urlPdfImages = await streamUploadMutiple(imageBufferArr, {
        folder: `PdfImages/${_folderName}`,
        //để auto cloudinary tự động nhận file
        resource_type: 'auto'
      })

      let plainTextClone = plainText
      // console.log('🚀 ~ urlPdfImages ~ urlPdfImages:', urlPdfImages)
      urlPdfImages.forEach(obj => {
        plainTextClone = plainTextClone.replace(obj.origin_file_name, obj.url)
      })

      // console.log('🚀 ~ fs.readFile ~ plainTextClone:', plainTextClone)
      // uploadFilePdf

      const pdfUrlAndID = await uploadFilePdf(_folderName)

      fs.writeFile(`src/documents/process_md/${_folderName}.md`, plainTextClone, err => {
        if (err) {
          console.error(`File ${_folderName}.md written error!`)
          reject(err)
        } else {
          console.log(`File ${_folderName}.md written successfully!`)
          resolve(new Document({ pageContent:  plainTextClone, metadata: {
            id: pdfUrlAndID.id,
            title: _folderName + '.pdf',
            link: pdfUrlAndID.url,
            favicon: LOGO_DNTU,
            snippet: _folderName
          }
          }))
        }
      })
    })
  })
}

const chunkPromises = (promises, chunkSize) => {
  const chunks = []
  for (let i = 0; i < promises.length; i += chunkSize) {
    chunks.push(promises.slice(i, i + chunkSize))
  }
  return chunks
}

export const uploadSingleDocMDToSupabase = async (data) => {
  const { chunkSize = 1000, chunkOverlap = 500 } = data

  const _rootFolder = 'src/documents/md'
  const chunkSizePromise = 5
  const promises = []
  let documents = []

  await fs.readdirSync(_rootFolder).forEach(_folderName => {
    promises.push(processFileMD(_rootFolder, _folderName))
  })

  // Chia nhỏ mảng promises thành các chunk và thực hiện Promise.all cho từng chunk
  const chunks = chunkPromises(promises, chunkSizePromise)
  for (const chunk of chunks) {
    await Promise.all(chunk)
      .then(async results => {
        documents = documents.concat(results)
      })
      .catch(err => {
        console.log('🚀 ~ getMutilImage ~ err:', err)
      })
  }

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize,
    chunkOverlap
  })

  console.log('🚀 ~ uploadSingleDocMDToSupabase ~ documents:', documents)
  const splitDocs = await textSplitter.splitDocuments(documents)

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

