import { getClassificationResult } from './classification'
import { addChatHistory } from './utils/upstash_chat_history'
import { getAnswerNormalAssistant } from './answer_assistant'
import { getAnswerResearchAssistant } from './research_assistant'
import { getStandaloneQuestion } from './standalone_question'
import { getAnswerDocumentAssistant } from './document_assistant'
import { getAnswerModerationAssistant } from './moderation_assistant'


export const getAnswerChatBot = async (dataGetAnswer) => {
  let response = ''
  // Check moderation
  const sensitiveDeteched = await getAnswerModerationAssistant(dataGetAnswer)
  if (sensitiveDeteched) return sensitiveDeteched
  // simplify question output
  const classification = await getClassificationResult(dataGetAnswer.sessionId, dataGetAnswer.question)
  if (classification === 'ANSWER_NORMAL') {
    console.log('🤖 Agent: ', 'I\'m looking to in ANSWER NORMAL....')
    const answerNormalAssistant = await getAnswerNormalAssistant(dataGetAnswer)
    response = answerNormalAssistant
  } else {
    // create a standaone question based on chat history and question
    const standaloneQuestion = await getStandaloneQuestion(dataGetAnswer.sessionId, dataGetAnswer.question)
    console.log('🤖 Agent: Created standalone question => ', standaloneQuestion)

    // if (classification === 'SEARCH_INTERNET') {
    console.log('🤖 Agent: ', 'I\'m looking to DOCUMENTS DNTU....')

    dataGetAnswer.standaloneQuestion = standaloneQuestion

    const answerDocumentAssistant = await getAnswerDocumentAssistant(dataGetAnswer)
    if (answerDocumentAssistant === 'NO_ANSWER') {

      console.log('🤖 Agent: ', 'I\'m looking to INTERNET....')
      const answerResearchAssistant = await getAnswerResearchAssistant(dataGetAnswer)
      response = answerResearchAssistant
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
  await addChatHistory(dataGetAnswer.sessionId, dataGetAnswer.question, response)

  return response
}