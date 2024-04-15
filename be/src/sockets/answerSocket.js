import { getAnswerChatBot } from '../providers/chatbot'


export const createAnswerFromAI = (io, socket, socketIdMap) => {
  socket.on('c_create_answer', async (data) => {
    console.log('🚀 ~ file: itinerarySocket.js:8 ~ socket.on ~ data:', data)
    // data = {
    //   sessionId, question, user_name
    // }

    console.log('socketIdMap[data.currentUserId]: ', socketIdMap)

    const dataGetAnswer = {
      ...data,
      io,
      socketIdMap,
      type: 'STREAMING'
    }
    // console.log('🚀 ~ socket.on ~ dataGetAnswer:', dataGetAnswer)
    await getAnswerChatBot(dataGetAnswer)
  })
}
