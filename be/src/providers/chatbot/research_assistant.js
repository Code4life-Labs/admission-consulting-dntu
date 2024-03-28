import { OpenAIEmbeddings } from '@langchain/openai'
import OpenAI from 'openai'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { MemoryVectorStore } from 'langchain/vectorstores/memory'
import { BraveSearch } from '@langchain/community/tools/brave_search'
import cheerio from 'cheerio'

// 2. Initialize OpenAI client with Groq API
const openai = new OpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY
})

// 4. Fetch search results from Brave Search API
async function getSources(message) {
  console.log('🚀 ~ getSources ~ message:', message)
  const encodedMessage = encodeURI(message)
  try {
    const response = await fetch(
      `https://api.search.brave.com/res/v1/web/search?q=${encodedMessage}&count=10&search_lang=vi`,
      {
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
      $('script, style, head, nav, footer, iframe, img').remove()
      return $('body').text().replace(/\s+/g, ' ').trim()
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
        const mainContent = extractMainContent(html)
        return { ...source, html: mainContent }
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
  contents,
  query,
  textChunkSize = 1000,
  textChunkOverlap = 400,
  numberOfSimilarityResults = 4
) {
  try {
    const embeddings = new OpenAIEmbeddings()
    for (let i = 0; i < contents.length; i++) {
      const content = contents[i]
      if (content.html.length > 0) {
        try {
          const splitText = await new RecursiveCharacterTextSplitter({
            chunkSize: textChunkSize,
            chunkOverlap: textChunkOverlap
          }).splitText(content.html)
          const vectorStore = await MemoryVectorStore.fromTexts(
            splitText,
            { title: content.title, link: content.link },
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
// async function getImages(
//   message: string
// ): Promise<{ title: string; link: string }[]> {
//   try {
//     const response = await fetch(
//       `https://api.search.brave.com/res/v1/images/search?q=${message}&spellcheck=1`,
//       {
//         method: "GET",
//         headers: {
//           Accept: "application/json",
//           "Accept-Encoding": "gzip",
//           "X-Subscription-Token": process.env.BRAVE_SEARCH_API_KEY as string,
//         },
//       }
//     );
//     if (!response.ok) {
//       throw new Error(
//         `Network response was not ok. Status: ${response.status}`
//       );
//     }
//     const data = await response.json();
//     const validLinks = await Promise.all(
//       data.results.map(async (result: any) => {
//         const link = result.properties.url;
//         if (typeof link === "string") {
//           try {
//             const imageResponse = await fetch(link, { method: "HEAD" });
//             if (imageResponse.ok) {
//               const contentType = imageResponse.headers.get("content-type");
//               if (contentType && contentType.startsWith("image/")) {
//                 return {
//                   title: result.properties.title,
//                   link: link,
//                 };
//               }
//             }
//           } catch (error) {
//             console.error(`Error fetching image link ${link}:`, error);
//           }
//         }
//         return null;
//       })
//     );
//     const filteredLinks = validLinks.filter(
//       (link): link is { title: string; link: string } => link !== null
//     );
//     return filteredLinks.slice(0, 9);
//   } catch (error) {
//     console.error("There was a problem with your fetch operation:", error);
//     throw error;
//   }
// }
// 8. Fetch video search results from Google Serper API
// async function getVideos(
//   message: string
// ): Promise<{ imageUrl: string; link: string }[] | null> {
//   const url = "https://google.serper.dev/videos";
//   const data = JSON.stringify({
//     q: message,
//   });
//   const requestOptions: RequestInit = {
//     method: "POST",
//     headers: {
//       "X-API-KEY": process.env.SERPER_API as string,
//       "Content-Type": "application/json",
//     },
//     body: data,
//   };
//   try {
//     const response = await fetch(url, requestOptions);
//     if (!response.ok) {
//       throw new Error(
//         `Network response was not ok. Status: ${response.status}`
//       );
//     }
//     const responseData = await response.json();
//     const validLinks = await Promise.all(
//       responseData.videos.map(async (video: any) => {
//         const imageUrl = video.imageUrl;
//         if (typeof imageUrl === "string") {
//           try {
//             const imageResponse = await fetch(imageUrl, { method: "HEAD" });
//             if (imageResponse.ok) {
//               const contentType = imageResponse.headers.get("content-type");
//               if (contentType && contentType.startsWith("image/")) {
//                 return { imageUrl, link: video.link };
//               }
//             }
//           } catch (error) {
//             console.error(`Error fetching image link ${imageUrl}:`, error);
//           }
//         }
//         return null;
//       })
//     );
//     const filteredLinks = validLinks.filter(
//       (link): link is { imageUrl: string; link: string } => link !== null
//     );
//     return filteredLinks.slice(0, 9);
//   } catch (error) {
//     console.error("Error fetching videos:", error);
//     throw error;
//   }
// }
// 9. Generate follow-up questions using OpenAI API
// const relevantQuestions = async (responseText: string): Promise<any> => {
//   console.log("🚀 ~ relevantQuestions ~ responseText:", responseText)
//   const groqResponse = await openai.chat.completions.create({
//     messages: [
//       { role: "system", content: "You are a question generator. Generate 3 follow-up questions based on the provided text. Return the questions in an array format." },
//       { role: "user", content: "You must create questions in Vietnamese." },
//       {
//         role: "user",
//         content: `Generate 3 follow-up Vietnamese questions based on the following text:\n\n${responseText}\n\nReturn the Vietnamese questions in the following format: ["Vietnamese Question 1", "Vietnamese Question 2", "Vietnamese Question 3"]`
//       }
//     ],
//     model: "mixtral-8x7b-32768"
//   });
//   const groqResponseParse = JSON.parse(groqResponse.choices[0].message.content ?? "");
//   console.log("🚀 ~ relevantQuestions ~ groqResponse:", groqResponseParse)
//   return groqResponseParse
// };

const followUpQuestions = async (sources) => {
  const groqResponse = await openai.chat.completions.create({
    messages: [
      {
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
    model: 'mixtral-8x7b-32768',
    response_format: { type: 'json_object' }
  })

  const groqResponseParse = JSON.parse(groqResponse?.choices[0]?.message?.content ?? '{}')
  console.log('🚀 ~ followUpQuestions ~ groqResponse?.choices[0]?.message?.content:', groqResponse?.choices[0]?.message?.content)
  console.log('🚀 ~ relevantQuestions ~ groqResponse:', groqResponseParse)
  return groqResponseParse?.followUp
}

// 10. Main action function that orchestrates the entire process
export async function getAnswerResearchAssistant(datas) {
  // Phân tích datas
  const { message, returnSources = true, returnFollowUpQuestions = true, embedSourcesInLLMResponse = false, textChunkSize = 800, textChunkOverlap = 200, numberOfSimilarityResults = 2, numberOfPagesToScan = 4 } = datas
  console.log('message', message)
  const [sources] = await Promise.all([
    // getImages(message),
    getSources(message)
    // getVideos(message),
  ])
  const html = await get10BlueLinksContents(sources)
  const a = Date.now()
  const vectorResults = await processAndVectorizeContent(html, message)
  console.log('🚀 ~ getAnswerResearchAssistant ~ vectorResults:', vectorResults)
  const b = Date.now()
  console.log(
    '===============vectorResults took ' + (b - a) + ' ms.==================='
  )
  const chatCompletion = await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: `
        - MUST answer in VIETNAMESE. DON'T ENGLISH!
        - Here is my query "${message}", respond back with an answer that is as long as possible. If you can't find any relevant results, respond with "No relevant results found." `
      },
      {
        role: 'user',
        content: ` - Here are the top results from a similarity search: ${JSON.stringify(vectorResults)}. `
      }
    ],
    stream: true,
    model: 'mixtral-8x7b-32768'
  })
  console.log('11. Sent content to Groq for chat completion.')
  let responseTotal = ''
  console.log('12. Streaming response from Groq... \n')
  for await (const chunk of chatCompletion) {
    if (chunk.choices[0].delta && chunk.choices[0].finish_reason !== 'stop') {
      // process.stdout.write(chunk.choices[0].delta.content);
      responseTotal += chunk.choices[0].delta.content
    } else {
      let responseObj = {}
      returnSources ? responseObj.sources = sources : null
      responseObj.answer = responseTotal
      returnFollowUpQuestions ? responseObj.followUpQuestions = await followUpQuestions(sources) : null
      console.log(`\n\n13. Generated follow-up questions:  ${JSON.stringify(responseObj.followUpQuestions)}`)
      return responseObj
    }
  }
}