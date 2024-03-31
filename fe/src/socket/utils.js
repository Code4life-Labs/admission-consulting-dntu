import {
  NonGlobalSocketEventHandlerCreatorOptions
} from 'types/index.d.ts'

/**
 * Hàm này dùng để tạo ra 2 event handlers cho một event.
 * - `listen`: đùng để lắng nghe các sự kiện của một event nào đó.
 * - `emit`: `emitter` dùng để gửi mesage tới các `listeners` (được tạo ra khi thực thi `listen`).
 * 
 * Mỗi handlers này để làm việc với message, và cũng sẽ có hai loại message:
 * - Message nhận: là message được gửi từ server.
 * - Message gửi: là message được gửi từ client.
 * 
 * _Lưu ý: Hơi khó để biết được là callBack của handlers nào trả về cái gì, cho nên ae lưu ý nhé (không xài TS nên hơi bất tiện)_
 * 
 * @param {NonGlobalSocketEventHandlerCreatorOptions} options
 */
export function createNonGlobalSocketEventHandlers(socket, eventName, options) {
  function defaultGenerateMessage(message) {
    message = Object.assign({
      status: {
        isOff: false
      },
      data: undefined
    }, message);
    return message;
  };

  options = Object.assign(
    {
      forListener: {},
      generateMessage: defaultGenerateMessage
    },
    options
  );

  let listenerOptions = options.forListener;

  return [
    /**
     * __Non-global Event__
     * 
     * Hàm này dùng để listen một sự kiện `eventName` thông qua `callBack` (listener).
     * Trả về một hàm để un-listen event. Nó sẽ nhận message được gửi từ server.
     * 
     * Quy định chung:
     * - Message nhận về là một object hoặc là một chuỗi. Không nên để là một list (Array).
     * - Message nhận về nếu là một object thì nên có `status = { isError, isDone }` (phải có), `data`
     * (tuỳ, mặc định là data, và có thể đặt là gì cũng được) và `text` (tuỳ).
     * 
     * Tuy nhiên thì các props này đều tuỳ thuộc vào bên server sẽ trả gì.
     * 
     * @param callBack dùng để thực thi mỗi khi có message từ server.
     */
    function listen(callBack) {
      try {
        if(!socket) {
          throw new Error("Socket is not created! Cannot listen to event.");
        }
        let actualCallBack = (message) => callBack(message, options.generateMessage, listenerOptions)
        socket.on(eventName, actualCallBack);
        return function() {
          socket.off(eventName, actualCallBack);
        }
      } catch (error) {
        
      }
    },
    /**
     * __Non-global Event__
     * 
     * Hàm này dùng để gửi message tới server.
     * 
     * Quy định chung:
     * - Giống với Message nhận về, thì message nhận đi nên là một object hoặc là một chuỗi. Không nên là một list (Array).
     * - Message gửi đi nếu là một object thì nên có `status = { isOff }` (phải có), `data` (tuỳ).
     * 
     * @param message message để gửi cho server.
     * @returns 
     */
    function emit(message) {
      try {
        if(!socket) {
          throw new Error("Socket is not created! Cannot listen to event.");
        }
  
        if(!message) throw new Error("You must create message from callBack.");
        if(Array.isArray(message)) console.warn("Message should be an Array.");

        socket.emit(eventName, options.generateMessage(message));
      } catch (error) {
        console.error(error.message);
      }
    }
  ]
}