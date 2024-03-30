// import React from 'react'

// Import local components
import QnAMessage from "./QnAMessage"

/**
 * @typedef VideosRefPropsType
 * @property {Array<{content: string, url: string, type: string}>} videos
 */

/**
 * Use this function to render related images of answer.
 * @param {VideosRefPropsType} props
 * @returns 
 */
export default function VideosRef(props) {
  return (
    <QnAMessage avatar="/Logo_DNTU.png">
      <div className="rounded-xl ml-3 p-1 xl:ml-6 xl:p-3 rounded border-2">
        <p className="mb-4 font-bold">Nguồn tham khảo:</p>
        {
          props.videos.map((video, index) => (
            <video key={index} src={video.url} />
          ))
        }
      </div>
    </QnAMessage>
  )
}