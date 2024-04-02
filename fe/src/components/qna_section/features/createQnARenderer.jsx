// import React from 'react'

// Import local components
import Anwser from '../Anwser'
import Question from '../Question'
import QnAMessage from '../QnAMessage'
import ImagesRef from '../ImagesRef'
import VideosRef from '../VideosRef'
import Ref from '../Ref'

/**
 * Use this function to render a message or response to answer, question, ref, ...
 * @returns 
 */
export default function createQnARenderer({ updateAudioURL, playAudio, pauseAudio, audioElement }) {
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

    if(response.type === "answer") {
      return (
        <Anwser
          // t={index}
          content={response.content} key={index}
          updateAudioURL={updateAudioURL}
          playAudio={playAudio}
          pauseAudio={pauseAudio}
          audioElement={audioElement}
        />
      )
    }

    // type == "related_content"
    if(!response.type == "related_content" && typeof response.content != "object" || response.content == null) return;
    let result = [];

    if(response.content.sourcesResult) result.push(<Ref key={"ref" + index} sources={response.content.sourcesResult} />);
    if(response.content.imagesResult) result.push(<ImagesRef key={"images" + index} images={response.content.imagesResult} />);
    if(response.content.videosResult) result.push(<VideosRef key={"videos" + index} videos={response.content.videosResult} />);

    return result;
  }
}