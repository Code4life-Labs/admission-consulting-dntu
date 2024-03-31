import { io } from "socket.io-client";
import { getSocketRoot } from "src/utils/constant";

/**
 * Event sẽ có hai loại:
 * - Global: là những event mà khi vào app là lắng nghe luôn các sự kiện.
 * - Non-global: là những event sẽ không được lắng nghe khi vào app, mà nó sẽ vào một số nơi cụ thể nào đó.
 * 
 * Nên cách dùng của mỗi loại sẽ khác nhau.
 * - Global: sẽ được import vào đây và từ đây sẽ được import vào source "run" app.
 * - Non-global: sẽ không được import vào đây, mà sẽ được import vào nơi cần event này, đồng thời cũng phải có socket instance.
 */

/**
 * Lưu ý: Mỗi một Event sẽ có 2 handlers là listener và emitter.
 * - listener sẽ nhận một callBack, callBack này đảm nhận vai trò xử lý message nhận. Nó sẽ nhận vào 3 tham số
 * `message`, `generateMessage` và `listenerOptions` (Tuỳ thuốc vào việc configure thì nó sẽ trả về cái). Tuy nhiên thì hơi khó để
 * biết là bởi vì tụi mình không xài TS. Và nên nhớ callBack này thì nên xử lý if else (switch case) trong nó.
 * - emitter sẽ nhận một object hoặc là chuỗi.
 * 
 */

/**
 * Trong này sẽ dùng để setup socket cho app, hoặc là hàm setup socket cho app.
 * Import các event listener của các object khác vào trong này. Tuy nhiên thì các event này
 * là những event có tính chất global như là notification, thời tiết,... Còn một số event khác
 * sẽ được subscribe khi vào một screen cụ thể nào đó.
 */
let socket;

/**
 * Dùng để lấy socket, nếu như chưa kết nối socket thì nó sẽ tự kết nối tới server.
 * @returns {Socket}
 */
export function getSocket() {
  if(!socket) socket = io(getSocketRoot());
  return socket;
}

/**
 * Hàm này đùng để listen một event socket nào đó và trả về một hàm để unlisten event đó.
 * @param {Socket} socket kết nối socket (object) của một người dùng thông qua `io()`.
 * @param {string} eventName tên của event.
 * @param {(message: BlogCreateEventMessageProps) => any} callBack dùng để thực thi mỗi khi có message từ server.
 */
export function listenEvent(socket, eventName, callBack) {
  if(!socket) {
    console.error("Socket is not created! Cannot listen to event.");
    return;
  }
  socket.on(eventName, callBack);
  return function() {
    socket.off(eventName, callBack);
  }
}