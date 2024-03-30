// import React from 'react'

// Import local components
import QnAMessage from "./QnAMessage"

/**
 * @typedef ImagesRefPropsType
 * @property {Array<{content: string, url: string, type: string}>} images
 */

/**
 * Use this function to render related images of answer.
 * @param {ImagesRefPropsType} props
 * @returns 
 */
export default function ImagesRef(props) {
  return (
    <QnAMessage avatar="/Logo_DNTU.png">
      <div className="rounded-xl ml-3 p-1 xl:ml-6 xl:p-3 rounded border-2">
        <p className="mb-4 font-bold">Nguồn tham khảo:</p>
        {
          props.images.map((image, index) => (
            <img key={index} src={image.url} />
          ))
        }
      </div>
    </QnAMessage>
  )
}