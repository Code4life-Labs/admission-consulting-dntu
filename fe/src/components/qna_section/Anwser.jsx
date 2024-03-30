// import React from 'react'

// Import from hooks
import { useStateWESSFns } from 'src/hooks/useStateWESSFns';

// Import from utils
import { OtherUtils } from 'src/utils/other';

// Import local components
import QnAMessage from './QnAMessage'

/**
 * @typedef AnswerPropsType
 * @property {string} content
 * @property {() => void} updateAudioURL
 * @property {() => void} play
 * @property {() => void} pause
 */

/**
 * @typedef SpeechControlBtnPropsType
 * @property {string} speechRequestStatus
 * @property {bool} isSpeechPlaying
 * @property {() => Promise<any>} requestSpeech
 * @property {() => void} toggleSpeechPlaying
 */

const SpeechRequestStatus = {
  static: "static",
  pending: "pending",
  fulfilled: "fulfilled"
};

/**
 * Use this function to render a button to control speech (resquest speech, stop/play speech)
 * @param {SpeechControlBtnPropsType} props 
 * @returns 
 */
function SpeechControlBtn(props) {
  if(props.speechRequestStatus == SpeechRequestStatus.pending) {
    return (
      <span 
        className="material-symbols-outlined cursor-pointer animate-spin text-gray-500 mr-3 hover:text-gray-800 select-none"
        onClick={() => props.requestSpeech()}
      >
        progress_activity
      </span>
    )
  }

  if(props.speechRequestStatus == SpeechRequestStatus.static || !props.isSpeechPlaying) {
    return (
      <span 
        className="material-symbols-outlined cursor-pointer text-gray-500 mr-3 hover:text-gray-800 select-none"
        onClick={() => {
          if(props.speechRequestStatus == SpeechRequestStatus.fulfilled && !props.isSpeechPlaying) props.toggleSpeechPlaying();
          else {
            props.requestSpeech();
          }
        }}
      >
        volume_up
      </span>
    )
  }

  if(props.speechRequestStatus == SpeechRequestStatus.fulfilled && props.isSpeechPlaying) {
    console.log("Playing...");
    return (
      <span 
        className="material-symbols-outlined cursor-pointer text-gray-500 mr-3 hover:text-gray-800 select-none"
        onClick={() => props.toggleSpeechPlaying()}
      >
        pause
      </span>
    )
  }
}

/**
 * Use
 * @param {AnswerPropsType} props
 * @returns 
 */
export default function Anwser(props) {
  const [answerState, answerStateFns] = useStateWESSFns({
    isCopied: false,
    speechRequestStatus: SpeechRequestStatus.static,
    isSpeechPlaying: false,
    isRenewingAnswer: false
  }, function(changeState) {
    return {
      /**
       * Use this function to update `isCopied` state.
       * @param {boolean} state 
       */
      updateIsCopied: function(state = false) {
        changeState("isCopied", function() { return state });
      },

      /**
       * Use this function to update status of speech requesting.
       * @param {string} status 
       */
      updateSpeechRequestStatus: function(status = SpeechRequestStatus.static) {
        changeState("speechRequestStatus", function() { return status });
      },

      /**
       * Use this function to toggle between `play` and `stop` status of speech.
       */
      toggleSpeechPlaying: function() {
        changeState("isSpeechPlaying", function(data) {
          return !data;
        })
      }
    }
  });

  const copyContent = function() {
    if(answerState.isCopied) return;
    navigator.clipboard.writeText(props.content).then(() => {
      answerStateFns.updateIsCopied(true);

      setTimeout(() => { answerStateFns.updateIsCopied(false); }, 2000);
    })
  };

  const requestSpeech = function() {
    answerStateFns.updateSpeechRequestStatus(SpeechRequestStatus.pending);
    OtherUtils.wait(() => {
      answerStateFns.updateSpeechRequestStatus(SpeechRequestStatus.fulfilled);
      answerStateFns.toggleSpeechPlaying();
    }, 2000);
  }

  return (
    <QnAMessage avatar="/Logo_DNTU.png">
      <>
        <div className="rounded-xl ml-3 p-1 xl:ml-6 xl:p-3 rounded border-2">
          {props.content}
        </div>
        <div className="flex items-center ml-3 p-1 xl:ml-6 xl:p-3">
          <SpeechControlBtn
            speechRequestStatus={answerState.speechRequestStatus}
            isSpeechPlaying={answerState.isSpeechPlaying}
            requestSpeech={requestSpeech}
            toggleSpeechPlaying={answerStateFns.toggleSpeechPlaying}
          />
          <span className="material-symbols-outlined cursor-pointer text-gray-500 mr-3 hover:text-gray-800" onClick={() => copyContent()}>
            {
              answerState.isCopied ? "done" : "content_copy"
            }
          </span>
          <span className="material-symbols-outlined cursor-pointer text-gray-500 hover:text-gray-800">autorenew</span>
        </div>
      </>
    </QnAMessage>
  )
}