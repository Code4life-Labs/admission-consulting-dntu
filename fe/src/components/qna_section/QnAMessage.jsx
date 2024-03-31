// import React from 'react'

/**
 * @typedef QnAMessagePropsType
 * @property {string} avatar
 */

/**
 * Use this function to basically layout for `Question` and `Answer` component.
 * @param {QnAMessagePropsType & React.PropsWithChildren} props
 * @returns 
 */
export default function QnAMessage(props) {
  return (
    <div className="qna-message flex mb-6">
      {
        props.avatar
          ? (
            <img src={props.avatar} className="shrink-0 w-6 h-6 xl:w-12 xl:h-12 object-contain" />
          ) :
          (
            <span className="material-symbols-outlined text-2xl xl:text-5xl text-rose-800">account_circle</span>
          )
        }
      <section className="flex flex-col">
        {props.children}
      </section>
    </div>
  )
}