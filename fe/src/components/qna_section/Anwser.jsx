import React from 'react'

// Import from hooks
import { useStateWESSFns } from 'src/hooks/useStateWESSFns';

// Import from apis
import { SpeechAPI } from 'src/apis/speech';

// Import from utils
import { OtherUtils } from 'src/utils/other';

// Import local components
import QnAMessage from './QnAMessage'

/**
 * @typedef AnswerPropsType
 * @property {string} content
 * @property {() => void} updateAudioURL
 * @property {(localUrl: string) => void} playAudio
 * @property {() => void} pauseAudio
 * @property {HTMLAudioElement} audioElement
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

const urls = [
  "",
  "https://codeskulptor-demos.commondatastorage.googleapis.com/pang/paza-moduless.mp3",
  "https://commondatastorage.googleapis.com/codeskulptor-demos/riceracer_assets/music/race1.ogg"
];

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
    isRenewingAnswer: false,
    localAudioURL: ""
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
          if(data) {
            props.pauseAudio();
            return false;
          }
          return true;
        })
      },

      /**
       * Use this function to pause audio.
       */
      pauseAudio: function() {
        changeState("isSpeechPlaying", function() { return false; });
      },

      /**
       * Use this function to locally update url for Answer.
       * @param {string} url 
       */
      updateLocalAudioURL: function(url) {
        changeState("localAudioURL", function() { return url; });
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
    // If audio is playing
    if(!props.audioElement.paused) props.audioElement.pause();

    // Request speech
    SpeechAPI.OpenAI.getSpeechAsync(props.content)
    .then(function(data) {
      const blob = new Blob([data], { type: "audio/aac" });
      const url = window.URL.createObjectURL(blob);
      props.updateAudioURL(url);
      answerStateFns.updateLocalAudioURL(url);
      answerStateFns.updateSpeechRequestStatus(SpeechRequestStatus.fulfilled);
      answerStateFns.toggleSpeechPlaying();
    }).catch(function() {
      answerStateFns.updateSpeechRequestStatus(SpeechRequestStatus.static);
    });

    // Request fake speech
    // OtherUtils.wait(() => {
    //   const url = urls[props.t];
    //   answerStateFns.updateLocalAudioURL(url);
    //   answerStateFns.updateSpeechRequestStatus(SpeechRequestStatus.fulfilled);
    //   answerStateFns.toggleSpeechPlaying();
    // }, 2000);
  }

  // If audio's url isn't empty and is change and audio start playing, update new url.
  React.useEffect(() => {
    if(!answerState.isSpeechPlaying) return;
    if(props.audioElement.src != "" && props.audioElement.src != answerState.localAudioURL) {
      console.log("Play new audio: ", answerState.localAudioURL);
      props.updateAudioURL(answerState.localAudioURL);
    }
  }, [answerState.isSpeechPlaying]);

  // If audio's url is difference with local url, that mean audio must stop (or just change the icon :)))). 
  React.useEffect(() => {
    if(props.audioElement.src != answerState.localAudioURL) {
      answerStateFns.pauseAudio();
    }
  }, [props.audioElement.src]);

  return (
    <QnAMessage avatar="/Logo_DNTU.png">
      <>
      <div className="rounded-xl ml-3 p-1 xl:ml-6 xl:p-3 rounded border-2">
        {props.content.split('\n').map((line, index) => (
          <React.Fragment key={index}>
            {line}
            <br />
          </React.Fragment>
        ))}
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