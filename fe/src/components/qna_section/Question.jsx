// import React from 'react'

// Import local components
import QnAMessage from './QnAMessage'

/**
 * @typedef QuestionPropsType
 * @property {string} content
 */

/**
 * Use this function to render a question from user.
 * @param {QuestionPropsType} props
 * @returns 
 */
export default function Question(props) {
  return (
    <QnAMessage>
      <div className="rounded-xl ml-3 p-1 xl:ml-6 xl:p-3 rounded border-2">
        {props.content}
      </div>
    </QnAMessage>
  )
}