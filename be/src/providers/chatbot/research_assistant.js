import {
  OpenAIEmbeddings
} from '@langchain/openai'
import OpenAI from 'openai'
import {
  RecursiveCharacterTextSplitter
} from 'langchain/text_splitter'
import {
  MemoryVectorStore
} from 'langchain/vectorstores/memory'
import {
  BraveSearch
} from '@langchain/community/tools/brave_search'
import cheerio from 'cheerio'
import {
  getChatHistoryConvertString
} from './utils/upstash_chat_history'
import {
  promptRole
} from './utils/prompt'
import TurndownService from 'turndown'
import { Document } from '@langchain/core/documents'
import { uploadWithTextSplitter } from './upload_documents'
import { getModelOptional } from './utils/get_llm'
import { env } from '../../config/environment'


const turndownService = new TurndownService()


// 4. Fetch search results from Brave Search API
async function getSources(standaloneQuestion) {
  console.log('🚀 ~ getSources ~ standaloneQuestion:', standaloneQuestion)
  const encodedMessage = encodeURI(standaloneQuestion)
  try {
    const response = await fetch(
      `https://api.search.brave.com/res/v1/web/search?q=${encodedMessage}&count=10&search_lang=vi`, {
        headers: {
          Accept: 'application/json',
          'Accept-Encoding': 'gzip',
          'X-Subscription-Token': process.env.BRAVE_SEARCH_API_KEY
        }
      }
    )
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const jsonResponse = await response.json()
    if (!jsonResponse.web || !jsonResponse.web.results) {
      throw new Error('Invalid API response format')
    }
    const final = jsonResponse.web.results.map(
      (result) => ({
        title: result.title,
        link: result.url,
        snippet: result.description,
        favicon: result.profile.img
      })
    )
    return final
  } catch (error) {
    console.error('Error fetching search results:', error)
    throw error
  }
}
// 5. Fetch contents of top 10 search results
async function get10BlueLinksContents(sources) {
  async function fetchWithTimeout(
    url,
    options = {},
    timeout = 800
  ) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeout)
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      })
      clearTimeout(timeoutId)
      return response
    } catch (error) {
      if (error) {
        console.log(`Skipping ${url}!`)
      }
      throw error
    }
  }

  function extractMainContent(html) {
    try {
      const $ = cheerio.load(html)
      $('script, noscript, style, head, nav, footer, iframe, svg, symbol, path, aside, article, button, input, form').remove()
      // return $('body').text().replace(/\s+/g, ' ').trim()
      return $('body').html()
    } catch (error) {
      console.error('Error extracting main content:', error)
      throw error
    }
  }
  const promises = sources.map(
    async (source) => {
      try {
        const response = await fetchWithTimeout(source.link, {}, 800)
        if (!response.ok) {
          throw new Error(
            `Failed to fetch ${source.link}. Status: ${response.status}`
          )
        }
        const html = await response.text()
        const mainContentHTML = extractMainContent(html)
        console.log('🚀 ~ mainContent:', mainContentHTML)
        // mainContentHTML :html => md
        const mainContentMarkdown = turndownService.turndown(mainContentHTML)
        return {
          ...source,
          markdown: mainContentMarkdown
        }
      } catch (error) {
        console.error(`Error processing ${source.link}:`, error)
        return null
      }
    }
  )
  try {
    const results = await Promise.all(promises)
    return results.filter((source) => source !== null)
  } catch (error) {
    console.error('Error fetching and processing blue links contents:', error)
    throw error
  }
}

// 6. Process and vectorize content using LangChain
async function processAndVectorizeContent(
  markdownContentArr,
  query,
  textChunkSize = 1000,
  textChunkOverlap = 400,
  numberOfSimilarityResults = 4
) {
  try {
    const embeddings = new OpenAIEmbeddings()
    for (let i = 0; i < markdownContentArr.length; i++) {
      const content = markdownContentArr[i]
      if (content.markdown.length > 0) {
        try {
          const splitText = await new RecursiveCharacterTextSplitter({
            chunkSize: textChunkSize,
            chunkOverlap: textChunkOverlap
          }).splitText(content.markdown)


          // lưu vào database để trả lời cho lần sau
          // await uploadWithTextSplitter([
          //   new Document({ pageContent: content.markdown, metadata: {
          //     title: content.title,
          //     link: content.link
          //   } })
          // ], 1000, 500)

          const vectorStore = await MemoryVectorStore.fromTexts(
            splitText, {
              title: content.title,
              link: content.link
            },
            embeddings
          )
          return await vectorStore.similaritySearch(
            query,
            numberOfSimilarityResults
          )
        } catch (error) {
          console.error(`Error processing content for ${content.link}:`, error)
        }
      }
    }
    return []
  } catch (error) {
    console.error('Error processing and vectorizing content:', error)
    throw error
  }
}

// 7. Fetch image search results from Brave Search API
async function getImages(standaloneQuestion) {
  try {
    const response = await fetch(
      `https://api.search.brave.com/res/v1/images/search?q=${standaloneQuestion}&spellcheck=1`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Accept-Encoding': 'gzip',
          'X-Subscription-Token': process.env.BRAVE_SEARCH_API_KEY
        }
      }
    )
    if (!response.ok) {
      throw new Error(
        `Network response was not ok. Status: ${response.status}`
      )
    }
    const data = await response.json()
    const validLinks = await Promise.all(
      data.results.map(async (result) => {
        const link = result.properties.url
        if (typeof link === 'string') {
          try {
            const imageResponse = await fetch(link, {
              method: 'HEAD'
            })
            if (imageResponse.ok) {
              const contentType = imageResponse.headers.get('content-type')
              if (contentType && contentType.startsWith('image/')) {
                return {
                  title: result.properties.title,
                  link: link
                }
              }
            }
          } catch (error) {
            console.error(`Error fetching image link ${link}:`, error)
          }
        }
        return null
      })
    )
    const filteredLinks = validLinks.filter(
      (link) => link !== null
    )
    return filteredLinks.slice(0, 9)
  } catch (error) {
    console.error('There was a problem with your fetch operation:', error)
    throw error
  }
}
// 8. Fetch video search results from Google Serper API
async function getVideos(standaloneQuestion) {
  const url = 'https://google.serper.dev/videos'
  const data = JSON.stringify({
    q: standaloneQuestion
  })
  const requestOptions = {
    method: 'POST',
    headers: {
      'X-API-KEY': process.env.SERPER_API,
      'Content-Type': 'application/json'
    },
    body: data
  }
  try {
    const response = await fetch(url, requestOptions)
    if (!response.ok) {
      throw new Error(
        `Network response was not ok. Status: ${response.status}`
      )
    }
    const responseData = await response.json()
    const validLinks = await Promise.all(
      responseData.videos.map(async (video) => {
        const imageUrl = video.imageUrl
        if (typeof imageUrl === 'string') {
          try {
            const imageResponse = await fetch(imageUrl, {
              method: 'HEAD'
            })
            if (imageResponse.ok) {
              const contentType = imageResponse.headers.get('content-type')
              if (contentType && contentType.startsWith('image/')) {
                return {
                  imageUrl,
                  link: video.link
                }
              }
            }
          } catch (error) {
            console.error(`Error fetching image link ${imageUrl}:`, error)
          }
        }
        return null
      })
    )
    const filteredLinks = validLinks.filter(
      (link) => link !== null
    )
    return filteredLinks.slice(0, 9)
  } catch (error) {
    console.error('Error fetching videos:', error)
    throw error
  }
}
// 9. Generate follow-up questions using OpenAI API
const relevantQuestions = async (responseText) => {
  console.log('🚀 ~ relevantQuestions ~ responseText:', responseText)
  const groqResponse = await openai.chat.completions.create({
    messages: [{
      role: 'system',
      content: 'You are a question generator. Generate 3 follow-up questions based on the provided text. Return the questions in an array format.'
    },
    {
      role: 'user',
      content: 'You must create questions in Vietnamese.'
    },
    {
      role: 'user',
      content: `Generate 3 follow-up Vietnamese questions based on the following text:\n\n${responseText}\n\nReturn the Vietnamese questions in the following format: ["Vietnamese Question 1", "Vietnamese Question 2", "Vietnamese Question 3"]`
    }
    ],
    model: 'gpt-3.5-turbo-1106'
  })
  const groqResponseParse = JSON.parse(groqResponse.choices[0].message.content ?? '')
  console.log('🚀 ~ relevantQuestions ~ groqResponse:', groqResponseParse)
  return groqResponseParse
}
const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY })
const followUpQuestions = async (sources) => {
  const groqResponse = await openai.chat.completions.create({
    messages: [{
      role: 'system',
      content: `
        You are a Question in Vietnamese generate who generates in JSON an array of 3 follow up questions in vietnamese.
         The JSON schema should include {
          "followUp": [
            "Vietnamese Question 1",
            "Vietnamese Question 2", 
            "Vietnamese Question 3"
          ]
         }
        `
    },
    {
      role: 'user',
      content: ` - Here are the top results from a similarity search: ${JSON.stringify(sources)}. `
    }
    ],
    model: 'gpt-3.5-turbo-1106',
    response_format: {
      type: 'json_object'
    }
  })

  const groqResponseParse = JSON.parse(groqResponse?.choices[0]?.message?.content ?? '{}')
  console.log('🚀 ~ followUpQuestions ~ groqResponse?.choices[0]?.message?.content:', groqResponse?.choices[0]?.message?.content)
  console.log('🚀 ~ relevantQuestions ~ groqResponse:', groqResponseParse)
  return groqResponseParse?.followUp
}

// 10. Main action function that orchestrates the entire process
export async function getAnswerResearchAssistant(dataGetAnswer) {
  const {
    sessionId,
    standaloneQuestion,
    question,
    user_name,
    io,
    socketIdMap,
    type,
    model='gpt-3.5-turbo-1106',
    emitId
  } = dataGetAnswer
  console.log('🚀 ~ Using ~ model:', model)

  const embedSourcesInLLMResponse = type === 'STREAMING' ? false : true

  const openai = getModelOptional(model)

  console.log('standaloneQuestion', standaloneQuestion)
  let sources
  if (type === 'STREAMING') {
    const [imagesResult, sourcesResult, videosResult] = await Promise.all([
      getImages(standaloneQuestion),
      getSources(standaloneQuestion),
      getVideos(standaloneQuestion)
    ])
    // trả về client
    io.to(socketIdMap[sessionId]).emit(`s_create_relevant_info_${emitId}`, {
      type: 'related_content',
      imagesResult,
      sourcesResult,
      videosResult
    })

    sources = sourcesResult
  } else {
    sources = await getSources(standaloneQuestion)
  }
  const markdownContentArr = await get10BlueLinksContents(sources)
  const a = Date.now()
  const vectorResults = await processAndVectorizeContent(markdownContentArr, standaloneQuestion)

  console.log('🚀 ~ getAnswerResearchAssistant ~ vectorResults:', vectorResults)
  const b = Date.now()
  console.log(
    '===============vectorResults took ' + (b - a) + ' ms.==================='
  )

  let chat_history = await getChatHistoryConvertString(sessionId)
  chat_history += '\nHuman: ' + question

  const dataChatchatCompletion = {
    messages: [{
      role: 'system',
      content: `${promptRole}
        Please answer the question, and make sure you follow ALL of the rules below:
        - Here is query: ${question}, respond back with an answer for user is as long as possible. You can based on history chat that human provided below
        - Don't try to make up an answer. If you really don't know the answer, say "I'm sorry, I don't know the answer to that." then direct the questioner to email tuyensinh@dntu.edu.vn to assist. 
        ${user_name ? '- Please mention the user\'s name when chatting. The user\'s name is' + user_name : ''}
        - Answer questions in a helpful manner that straight to the point, with clear structure & all relevant information that might help users answer the question
        - Don't answer in letter form, don't be too formal, try to answer normal chat text type as if you were chatting to a friend. You can use icons to show the friendliness
        ${type === 'STREAMING' ? '- Anwser should be formatted in Markdown (IMPORTANT) \n- If there are relevant markdown syntax have type: IMAGES, VIDEO, LINKS, TABLE (keep markdown syntax in Table), CODE, ... You must include them as part of the answer and must keep the markdown syntax'
    : '- Please return an answer in plain text NOT MARKDOWN SYNTAX'}
        - Please answer in VIETNAMESE. Double check the spelling to see if it is correct whether you returned the answer in Vietnamese
        - ${embedSourcesInLLMResponse ? 'Return the sources used in the response with iterable numbered style.' : ''}`
    },
    {
      role: 'user',
      content: `History chat: ${chat_history}`
    },
    {
      role: 'user',
      content: ` - Here are the top results from a similarity search: ${JSON.stringify(vectorResults)}. `
    },
    {
      role: 'assistant',
      content: `(VIETNAMESE ANSWER ${type === 'STREAMING' ? 'FORMATTED IN MARKDOWN' : 'FORMATTED IN PLAIN TEXT'})`
    }
    ],
    model
  }

  if (type === 'STREAMING') dataChatchatCompletion.stream = true
  const chatCompletion = await openai.chat.completions.create(dataChatchatCompletion)

  console.log('11. Sent content to Groq for chat completion.')
  let messageReturn = ''
  console.log('12. Streaming (or Not Streaming) response from Groq... \n')

  if (type === 'STREAMING') {
    // mỗi 100 mili giây nó trả về một lần đến khi kết thúc
    // const intervalId = setInterval(() => {

    //   io.to(socketIdMap[sessionId]).emit(`s_create_answer_${emitId}`, {
    //     responseObj: {
    //       content: messageReturn,
    //       type: 'answer'
    //     }
    //   })
    // }, 100)
    for await (const chunk of chatCompletion) {
      if (chunk.choices[0].delta && chunk.choices[0].finish_reason !== 'stop') {
        process.stdout.write(chunk.choices[0].delta.content)
        messageReturn += chunk.choices[0].delta.content
        io.to(socketIdMap[sessionId]).emit(`s_create_answer_${emitId}`, {
          responseObj: {
            content: messageReturn,
            type: 'answer'
          }
        })
      } else {
        let responseObj = {}
        console.log(`\n\n13. Generated follow-up questions:  ${JSON.stringify(responseObj.followUpQuestions)}`)
        responseObj.followUpQuestions = await followUpQuestions(sources)
        responseObj.messageReturn = messageReturn
        io.to(socketIdMap[sessionId]).emit(`s_create_answer_${emitId}`, {
          isOver: 'DONE',
          responseObj: {
            content: messageReturn,
            type: 'answer'
          }
        })
        // clearInterval(intervalId)
        // console.log('🚀 ~ forawait ~ messageReturn:', messageReturn)

        return messageReturn
      }
    }
  } else {
    console.log('🚀 ~ getAnswerNormalAssistant ~ chatCompletion:', chatCompletion.choices[0]?.message?.content)
    return chatCompletion.choices[0]?.message?.content
  }
}