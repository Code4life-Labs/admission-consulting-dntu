// import React from 'react'

// Import local components
import Anwser from '../Anwser'
import Question from '../Question'
import QnAMessage from '../QnAMessage'
import Ref from '../Ref'

/**
 * Use this function to render a message or response to answer, question, ref, ...
 * @returns 
 */
export default function createQnARenderer(
  // { updateAudioURL, play, pause }
) {
  return function renderQnA(response, index) {
    if(response.isLoading) {
      return (
        <QnAMessage avatar="/Logo_DNTU.png" key={index}>
          <div className="flex flex-row rounded-xl ml-3 p-1 xl:ml-6 xl:p-3 rounded border-2">
            <div className="animate-[bounce_1s_infinite] bg-gray-400 rounded-full w-[10px] h-[10px] me-1"></div>
            <div className="animate-[bounce_1s_infinite_100ms] bg-gray-400 rounded-full w-[10px] h-[10px] me-1"></div>
            <div className="animate-[bounce_1s_infinite_200ms] bg-gray-400 rounded-full w-[10px] h-[10px]"></div>
          </div>
        </QnAMessage>
      )
    }

    if(response.type === "question") {
      return (
        <Question content={response.content} key={index} />
      )
    }

    if(response.type === "anwser") {
      return (
        <Anwser
          content={response.content} key={index}
          // updateAudioURL={updateAudioURL}
          // play={play}
          // pause={pause}
        />
      )
    }

    // type == "related_content"
    let result = [<Ref key={index} sources={response.sourcesResult} />];

    return result;
  }
}