/* eslint-disable no-unreachable */

import dialogflow from '@google-cloud/dialogflow'
import { dfConfig } from '~/config/dfConfig'
import { ChatGptProvider } from '~/providers/ChatGptProvider'

const getTextConsulting = async (data) => {
  // data = {
  //  "question": "Hello cậu",
  // "currentUserId": "acb-1341234"
  // }
  try {
    // connect to dialogflow api
    const projectId = dfConfig.project_id
    const sessionId = data.currentUserId


    const credentials = {
      client_email: dfConfig.client_email,
      private_key: dfConfig.private_key
    }

    // Create a new session
    const sessionClient = new dialogflow.SessionsClient({ credentials })
    const sessionPath = sessionClient.projectAgentSessionPath(
      projectId,
      sessionId
    )

    const req = {
      session: sessionPath,
      queryInput: {
        text: {
          text: data.question,
          languageCode: data.languageCode
        }
      }
    }

    const res = await sessionClient.detectIntent(req)

    // return res
    let action = res[0].queryResult.action
    console.log('🚀 ~ file: chatbot.service.js:39 ~ getTextConsulting ~ action:', action)

    let queryText = res[0].queryResult.queryText

    let responseText = res[0].queryResult.fulfillmentMessages[0].text.text[0]
    console.log('🚀 ~ file: chatbot.service.js:46 ~ getTextConsulting ~ responseText:', responseText)

    if (action === 'input.unknown') {
      // Nếu hành động không được xác định thì chuyển qua hỏi con chatGPT
      // let result = await ChatGptProvider.textGeneration(queryText)
      // result.action = action
      // return result
      return {
        response: responseText,
        action: action
      }
    } else {
      return {
        response: responseText,
        action: action
      }
    }
  } catch (error) {
    console.log('🚀 ~ file: chatbot.service.js:67 ~ getTextConsulting ~ error:', error)
    throw new Error(error)
  }
}

const generateTextGPT = async (data) => {
  // data = {
  //   textInitial: string,
  //   textTranslated: string
  // }
  try {
    const queryText = `textInitial="${data.textInitial}", textTranslated="${data.textTranslated}"`
    let result = await ChatGptProvider.textGeneration(queryText)
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const translateTextGPT = async (data) => {
  // data = {
  //   text: string,
  //   languageConvert: string
  // }
  try {
    const queryText = `text="${data.text}", languageConvert="${data.languageConvert}"`
    let result = await ChatGptProvider.translateText(queryText)
    return result
  } catch (error) {
    throw new Error(error)
  }
}

export const ChatbotService = {
  getTextConsulting,
  generateTextGPT,
  translateTextGPT
}
