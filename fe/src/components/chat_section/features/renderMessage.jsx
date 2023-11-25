/**
 * Dùng hàm này dể tạo ra một message renderer. Nhận JSX.Element là một tham số.
 * @param {() => JSX.Element} Component 
 * @returns 
 */
export function createMessageRenderer(Component) {
  return function renderMessage(message, index, messages) {
    let hasTime = false;
    let onClickMessage;

    if(!messages[index + 1]) hasTime = true;
    if(message.isClickableText) onClickMessage = function(content) {
      console.log("Content: ", content);
    }

    return (
      <Component
        key={index}
        content={message.text}
        hasTime={hasTime}
        onClick={onClickMessage}
      />
    )
  }
}