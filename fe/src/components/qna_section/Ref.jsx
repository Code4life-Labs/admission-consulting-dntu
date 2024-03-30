// import React from 'react'

// Import local components
import QnAMessage from "./QnAMessage"

/**
 * @typedef RefPropsType
 * @property {Array<{content: string, url: string, type: string}>} sources
 */

/**
 * Use this function to render references of answer via link to articles, paragraphs or studies.
 * @param {RefPropsType} props
 * @returns 
 */
export default function Ref(props) {
  return (
    <QnAMessage avatar="/Logo_DNTU.png">
      <div className="rounded-xl ml-3 p-1 xl:ml-6 xl:p-3 rounded border-2">
        <p className="mb-4 font-bold">Nguồn tham khảo:</p>
        {
          props.sources.map((src, index) => (
            <p key={index}>
              {`[${index + 1}]: `}
              <a className="ml-2 underline decoration-1 text-cyan-600 hover:text-cyan-800" href={src.url}>{src.content}</a>
            </p>
          ))
        }
      </div>
    </QnAMessage>
  )
}