// import React from 'react'

// Import local components
import QnAMessage from "./QnAMessage"

/**
 * @typedef RefPropsType
 * @property {Array<{title: string, link: string, favicon: string}>} sources
 */

/**
 * Use this function to render references of answer via link to articles, paragraphs or studies.
 * @param {RefPropsType} props
 * @returns 
 */
export default function Ref(props) {
  return (
    <QnAMessage avatar="/Logo_DNTU.png">
      <div className="rounded-xl ml-3 p-1 xl:ml-6 xl:p-3 border-2">
        <p className="mb-4 font-bold">Nguồn tham khảo:</p>
        {
          props.sources.map((source, index) => (
            <p className="flex items-center mb-2 " key={index}>
              <img className="w-4 h-4 xl:w-6 xl:h-6 ms-4 object-contain" src={source.favicon} />
              <a className="ml-2 underline decoration-1 text-cyan-600 hover:text-cyan-800" target="_blank" href={source.link} rel="noreferrer">{source.title}</a>
            </p>
          ))
        }
      </div>
    </QnAMessage>
  )
}