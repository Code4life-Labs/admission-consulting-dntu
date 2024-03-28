import { getClassificationResult } from './classification'
import { getAnswerDatabaseAssistant } from './database_assistant'
import { addChatHistory } from './utils/upstash_chat_history'
import { getAnswerNormalAssistant } from './answer_assistant'
import { getAnswerResearchAssistant } from './research_assistant'
import { getStandaloneQuestion } from './standalone_question'
import { getAnswerDocumentAssistant } from './document_assistant'


export const getAnswerChatBot = async (sessionId, question, user_name) => {
  // simplify question output
  const classification = await getClassificationResult(sessionId, question)
  console.log('🚀 ~ getAnswerChatBot ~ classification:', classification)
  let response = ''
  if (classification === 'ANSWER_NORMAL') {
    console.log('🤖 Agent: ', 'I\'m looking to in ANSWER NORMAL....')
    const answerNormalAssistant = await getAnswerNormalAssistant(sessionId, question, user_name)
    response = answerNormalAssistant
  } else {
    // create a standaone question based on chat history and question
    const standaloneQuestion = await getStandaloneQuestion(sessionId, question)
    console.log('🤖 Agent: Created standalone question => ', standaloneQuestion)

    // if (classification === 'SEARCH_INTERNET') {
    console.log('🤖 Agent: ', 'I\'m looking to DOCUMENTS DNTU....')
    const answerDocumentAssistant = await getAnswerDocumentAssistant(sessionId, standaloneQuestion, question, user_name)
    if (answerDocumentAssistant === 'NO_ANSWER') {
      const datas = {
        'sessionId': sessionId,
        'originMessage': question,
        'user_name': user_name,
        'message': standaloneQuestion,
        'returnSources': true,
        'returnFollowUpQuestions': true,
        'embedSourcesInLLMResponse': true,
        'textChunkSize': 1000,
        'textChunkOverlap': 400,
        'numberOfSimilarityResults': 4,
        'numberOfPagesToScan': 3
      }
      console.log('🤖 Agent: ', 'I\'m looking to INTERNET....')
      const answerResearchAssistant = await getAnswerResearchAssistant(datas)
      response = answerResearchAssistant.answer
    } else response = answerDocumentAssistant
    // }
    // else if (classification === 'SEARCH_JOB') {
    //   // using database tool
    //   console.log('🤖 Agent: ', 'I\'m looking to in DATABASE....')
    //   const answerDatabaseAssistant = await getAnswerDatabaseAssistant(sessionId, standaloneQuestion, user_name)
    //   response = answerDatabaseAssistant
    // }
  }
  console.log('🤖 Agent: ', response)
  // Save question and response answers
  await addChatHistory(sessionId, question, response)

  return response
}