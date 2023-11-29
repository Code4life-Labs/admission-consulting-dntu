// import React from 'react'

/**
 * @typedef AudioMessagePropsType
 * @property {string} src
 * @property {number} time
 * @property {boolean} hasTime
 * @property {string} extendedClassName
 */

/**
 * Component renders a block of audio message.
 * @param {AudioMessagePropsType} props 
 * @returns 
 */
export default function AudioMessage({
  src = "",
  time = Date.now(),
  hasTime = false
}) {
  let containerClassName = "message w-full max-w-[45%] mb-2";

  return (
    <>
      <audio
        className={containerClassName}
        src={src}
        controls
      />
      { hasTime && <p className="text-xs">{(new Date(time)).toLocaleString()}</p> }
    </>
  )
}