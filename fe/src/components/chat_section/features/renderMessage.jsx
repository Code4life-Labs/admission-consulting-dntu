/**
 * Dùng hàm này dể tạo ra một message renderer. Nhận JSX.Element là một tham số.
 * @param {(text: string, isOwned: boolean) => void} append 
 * @param {{ Message: () => JSX.Element, AudioMessage: () => JSX.Element }} components
 * @returns 
 */
export function createMessageRenderer(append, components) {
  const { Message, AudioMessage } = components;
  return function renderMessage(message, index, messages) {
    let hasTime = false;
    let onClickMessage;

    if(!messages[index + 1]) hasTime = true;

    if(message.isLoading) {
      return (
        <div
          className="message w-fit max-w-[45%]"
        >
          <div className="flex flex-row bg-gray-200 rounded-xl p-4 mb-2">
            <div className="animate-[bounce_1s_infinite] bg-gray-400 rounded-full w-[10px] h-[10px] me-1"></div>
            <div className="animate-[bounce_1s_infinite_100ms] bg-gray-400 rounded-full w-[10px] h-[10px] me-1"></div>
            <div className="animate-[bounce_1s_infinite_200ms] bg-gray-400 rounded-full w-[10px] h-[10px]"></div>
          </div>
        </div>
      )
    }

    if(message.audio) {
      return (
        <AudioMessage
          key={index}
          src={message.audio}
          hasTime={hasTime}
          isLoading={message.isLoading}
        />
      )
    }

    if(message.isClickableText) onClickMessage = function(content) {
      append(content, true)
    }

    return (
      <Message
        key={index}
        content={message.text}
        hasTime={hasTime}
        onClick={onClickMessage}
        extendedContainerClassName={message.isOwned ? "right" : ""}
      />
    )
  }
}