import React from 'react'

// Import from hooks
import { useStateWESSFns } from "src/hooks/useStateWESSFns";

// Import from apis
// import { ChatBotAPI } from 'src/apis/chatbot';

// Import from components
import Button from "../button/Button";

// Import from utils
// import { OtherUtils } from 'src/utils/other';

// Import data from assets
import qnaSectionData from "src/assets/data/qnasection.json"

// Import from features
import createQnARenderer from './features/createQnARenderer';
import { socketIoInstance } from 'src/App';
import { LocalStorageUtils } from 'src/utils/localstorage';

/**
 * Use this function to render introduction text of DNTU AI
 * @returns 
 */
function Introduction() {
  return (
    <div className="w-3/5 mx-auto mb-6">
      <img src="/Logo_DNTU.png" className="w-16 xl:w-20 sm:w-20 mb-4 mx-auto" />
      <p className="text-justify">
        {
          qnaSectionData.introduction.text
        }  
      </p>
    </div>
  )
}

/**
 * Use this function to render a Question and Answer section with Chatbot.
 * @returns 
 */
export default function QnASection() {

  const [qnaState, qnaStateFns] = useStateWESSFns(
    {
      qna: [],
      audioURL: "",
      isResponsding: false
    },
    function(changeState) {
      return {
        /**
         * Use this function to add a message, it can be question or answer, to `qna` and update state.
         * @param {string} content 
         * @param {string} type 
         */
        appendMessage: function(content, type) {
          changeState("qna", function(data) {
            return [...data, { content, type }]
          })
        },

        /**
         * Use this function to add loading message.
         */
        appendLoadingAnswer: function() {
          changeState("qna", function(data) {
            return [...data, { isLoading: true }]
          })
        },

        /**
         * Use this function to update last message to response.
         * A response contains ref (link), answer (text), media ref (image and video).
         * Remove suspend message first.
         * @param {any} response 
         */
        updateResponse: function(response) {
          changeState("qna", function(data) {
            // Remove last message.
            data.pop();
            return [...data, ...response]
          })
        },

        /**
         * Use this function to update `isResponding` state.
         * @param {bool} state 
         */
        updateIsResponding: function(state = false) {
          changeState("isResponsding", function() {
            return state;
          })
        },

        /**
         * Use this function to update url for audio bot.
         * @param {string} url 
         */
        updateAudioURL: function(url) {
          changeState("audioURL", function() {
            return url;
          })
        }
      }
    }
  );

  const elementRefs = React.useRef({
    questionInput: null,
    botAudio: null
  });

  const renderQnA = React.useMemo(() => createQnARenderer(
    // {
    //   updateAudioURL: qnaStateFns.updateAudioURL,
    //   playAudio: elementRefs.current.botAudio.play,
    //   pauseAudio: elementRefs.current.botAudio.pause
    // }
  ), [elementRefs.current.botAudio, qnaStateFns.updateAudioURL]);

  // Khởi động
  // React.useEffect(() => {
  //   socketIoInstance.on('s_create_answer', (dataReturn) => {
  //     // handleListenCreateAnswer(dataReturn)
  //   })
  // }, [])

  // Tracking length of qna
  React.useEffect(function() {
    if(qnaState.qna.length === 0) return;

    let N = qnaState.qna.length;
    let lastMessage = qnaState.qna[N - 1];
    console.log("🚀 ~ React.useEffect ~ lastMessage:", lastMessage)

    if(lastMessage.type === "question") {
      qnaStateFns.appendLoadingAnswer();
      qnaStateFns.updateIsResponding(true);
      
      const requestEmit = {
        sessionId: LocalStorageUtils.getItem("SESSION_USER_ID"),
        question: lastMessage.content, 
        user_name: ""
      } 
      console.log("🚀 ~ React.useEffect ~ requestEmit:", requestEmit)

      socketIoInstance.emit('c_create_answer', requestEmit)
      // // Request a fake answer
      // OtherUtils.wait(function() {
      //   return qnaSectionData.responses;
      // }, 1000).then(answer => {
      //   console.log("🚀 ~ OtherUtils.wait ~ answer:", answer)
      //   // Update suspend message
      //   qnaStateFns.updateResponse(answer);
      //   qnaStateFns.updateIsResponding(false);
      // })
    }
  }, [qnaState.qna, qnaState.qna.length, qnaStateFns]);

  React.useEffect(function() {
    // Play audio
    if(qnaState.audioURL != "") {
      elementRefs.current.botAudio.play();
    }
  }, [qnaState.audioURL]);

  return (
    <section className="flex flex-col mt-4">
      {/* Q and A will appear here */}
      <div className="relative px-2 flex flex-1 flex-col h-3/4 w-full xl:px-11">
        <div className="h-full">
          {
            qnaState.qna.length === 0
              ? (
                <Introduction />
              ) : (
                // Render response here
                qnaState.qna.map(renderQnA)
              )
          }
        </div>
      </div>

      {/* Input container */}
      <div className="flex items-center py-2 mt-3">
        <input
          ref={ref => elementRefs.current.questionInput = ref}
          type="text"
          className="w-full bg-gray-100 focus:ring-rose-800 focus:outline-none focus:ring rounded-lg border-2 p-2 px-4 me-3"
          disabled={qnaState.isResponsding}
          placeholder="Bạn có thể nhập câu hỏi ở đây..."
        />
        <Button
          hasPadding={false}
          extendClassName="p-2"
          color="rose-800" hoverColor="rose-700" activeColor="rose-950"
          disabled={qnaState.isResponsding}
          onClick={() => {
            let text = elementRefs.current.questionInput.value;
            qnaStateFns.appendMessage(text, "question");
            elementRefs.current.questionInput.value = "";
          }}
        >
          <span className="material-symbols-outlined block text-white">send</span>
        </Button>
      </div>

      {/* Audio */}
      <audio id="botAudio" src={qnaState.audioURL} ref={ref => elementRefs.current.botAudio = ref}></audio>
    </section>
  )
}