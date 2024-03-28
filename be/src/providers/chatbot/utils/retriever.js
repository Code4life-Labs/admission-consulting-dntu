import { SupabaseVectorStore } from 'langchain/vectorstores/supabase'
import { OpenAIEmbeddings } from '@langchain/openai'
import { createClient } from '@supabase/supabase-js'
import { env } from '../../../config/environment'


export const getRetrieverSupabase = () => {

  const vectorStore = getVectorStoreSupabase()

  const retriever = vectorStore.asRetriever({
    k: 3 //lấy số docs = 10
  })

  return retriever
}

export const getVectorStoreSupabase = () => {
  const embeddings = new OpenAIEmbeddings()
  const sbApiKey = env.SUPABASE_API_KEY || ''
  const sbUrl = env.SUPABASE_URL_LC_CHATBOT || ''
  const client = createClient(sbUrl, sbApiKey)

  const vectorStore = new SupabaseVectorStore(embeddings, {
    client,
    tableName: 'documents',
    queryName: 'match_documents'
  })
  return vectorStore
}