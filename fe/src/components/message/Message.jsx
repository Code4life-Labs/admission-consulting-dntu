// import React from 'react'

const defaultTextContainerClassName = "w-fit text-base bg-gray-200 rounded-xl p-4 mb-2";

/**
 * @typedef MessagePropsType
 * @property {string} content
 * @property {number} time
 * @property {boolean} hasTime
 * @property {(content: string) => void} onClick
 * @property {string} extendedClassName 
 */

/**
 * Component renders a block of message. This block of message can contain img avatar or don't. Message can be clickable.
 * @param {MessagePropsType} props
 * @returns 
 */
export default function Message({
  content = "",
  time = Date.now(),
  hasTime = false,
  extendedClassName,
  onClick
}) {
  let containerClassName = "message w-full max-w-[45%]";
  let textContainerClassName = defaultTextContainerClassName;
  let isClickable = Boolean(onClick);

  if(extendedClassName) textContainerClassName += " " + extendedClassName;
  if(isClickable) {
    containerClassName += " " + "cursor-pointer italic";
    textContainerClassName += " " + "border-2 border-blue-600 bg-white"
  }

  return (
    <div
      className={containerClassName}
      onClick={isClickable ? () => onClick(content) : undefined}
    >
      <p className={textContainerClassName}>{content}</p>
      { hasTime && <p className="text-xs">{(new Date(time)).toLocaleString()}</p> }
    </div>
  )
}