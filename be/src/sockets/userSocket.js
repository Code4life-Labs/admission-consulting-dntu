export const createSocketIdMap = (socket, socketIdMap) => {
  socket.on('c_user_login', (sessionId) => {
    console.log('Client Connected', sessionId)

    // lưu socket ID vào biến socketIdMap
    socketIdMap[sessionId] = socket.id
    console.log('🚀 ~ socket.on ~ socketIdMap:', socketIdMap)
    return socketIdMap
  })
}
