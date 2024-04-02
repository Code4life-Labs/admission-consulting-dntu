import React from 'react'

// Import from hooks
import { useStateWESSFns } from "src/hooks/useStateWESSFns";

// Import from components
import Button from "../button/Button";

// Import from utils
// import { OtherUtils } from 'src/utils/other';

// Import data from assets
import qnaSectionData from "src/assets/data/qnasection.json"

// Import from features
import createQnARenderer from './features/createQnARenderer';
import { socketIoInstance } from 'src/App';

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
         * Use this function to add loading message (suspended answer).
         */
        appendSuspendedMessage: function() {
          changeState("qna", function(data) {
            return [...data, { isLoading: true }]
          })
        },

        /**
         * Use this function to update last message (suspended answer) to response.
         * A response contains ref (link), answer (text), media ref (image and video).
         * Remove suspend message first.
         * @param {any} response 
         */
        updateSuspendedMessage: function(response) {
          changeState("qna", function(data) {
            data.pop();
            if(Array.isArray(response)) return [...data, ...response];
            else return [...data, response];
          }, function(data) { return !data[data.length - 1].isLoading; })
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

  const renderQnA = React.useMemo(function() {
    if(!elementRefs.current.botAudio) return undefined;
    return createQnARenderer({
      updateAudioURL: qnaStateFns.updateAudioURL,
      playAudio: elementRefs.current.botAudio.play.bind(elementRefs.current.botAudio),
      pauseAudio: elementRefs.current.botAudio.pause.bind(elementRefs.current.botAudio),
      audioElement: elementRefs.current.botAudio
    });
  }, [elementRefs.current.botAudio, qnaStateFns.updateAudioURL]);

  const handleListenCreateAnswer = (dataReturn) => {
    // đầu tiên sẽ update state response
    if (dataReturn.isOver && dataReturn.isOver === 'DONE' && dataReturn.responseObj) {
      console.log("🚀 ~ handleListenCreateAnswer ~ dataReturn.allText:", [dataReturn.responseObj]);
      qnaStateFns.appendMessage(dataReturn.responseObj, dataReturn.responseObj.type);
      // cuối cùng sẽ ngắt kết nối
      socketIoInstance.removeAllListeners('s_create_answer');
    } else {
      // console.log("🚀 ~ handleListenCreateAnswer ~ dataReturn.messageReturn:", [dataReturn.responseObj])
      qnaStateFns.appendMessage(dataReturn.responseObj, dataReturn.responseObj.type);
    }
  };

  const appendMessageWithQuestionInputElement = function(inputElement) {
    if(!inputElement) return;
    let text = inputElement.value;
    qnaStateFns.appendMessage(text, "question");
    inputElement.value = "";
  }

  // Tracking length of qna
  React.useEffect(function() {
    if(qnaState.qna.length === 0) return;

    // lắng nghe sự kiện mỗi lần có câu hỏi mới
    let X = 0
    socketIoInstance.on('s_create_answer', (data) => {
      if (data.responseObj.content.trim() !== "" && X === 0) {
        // qnaStateFns.updateIsResponding(false);
        X++;
      }
      handleListenCreateAnswer(data)
    })

    socketIoInstance.on('s_create_relevant_info', (data) => {
      console.log("🚀 ~ socketIoInstance.on ~ s_create_relevant_info:", data);
      socketIoInstance.removeAllListeners('s_create_relevant_info');
      qnaStateFns.updateIsResponding(false);

      let content = {};

      if(data.imagesResult) content.imagesResult = data.imagesResult;
      if(data.videosResult) content.videosResult = data.videosResult;
      if(data.sourcesResult) content.sourcesResult = data.sourcesResult;

      qnaStateFns.appendMessage(content, data.type);
    })


    let N = qnaState.qna.length;
    let lastMessage = qnaState.qna[N - 1];
    console.log("🚀 ~ React.useEffect ~ lastMessage:", lastMessage)

    if(lastMessage.type !== "question") return;

    qnaStateFns.appendSuspendedMessage();
    qnaStateFns.updateIsResponding(true);
    
    const requestEmit = {
      sessionId: localStorage.getItem("SESSION_USER_ID"),
      question: lastMessage.content, 
      user_name: "" // username có thể lấy khi nhập dùng mở ô chatbot lên đầu tiên và mình sẽ hỏi tên sau đó lưu vào local stored lần sau thì không hỏi nữa
    }
    
    console.log("🚀 ~ React.useEffect ~ requestEmit:", requestEmit)
    console.log("🚀 ~ React.useEffect ~ qnaState.qna:", qnaState.qna)

    // emit sự kiện
    socketIoInstance.emit('c_create_answer', requestEmit);
    // // Request a fake answer
    // OtherUtils.wait(function() {
    //   return qnaSectionData.responses;
    // }, 1000).then(answer => {
    //   console.log("🚀 ~ OtherUtils.wait ~ answer:", answer)
    //   // Update suspend message
    //   qnaStateFns.updateResponse([
    //     {
    //       type: "anwser",
    //       content: "ừ"
    //     }
    //   ]);

    //   qnaStateFns.updateResponse([
    //     {
    //       type: "anwser",
    //       content: "ừ nha"
    //     }
    //   ]);
    //   qnaStateFns.updateIsResponding(false);
    // })
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
            qnaState.qna.length === 0 || !renderQnA
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
          onKeyDown={(e) => {
            if (e.key === "Enter"){
              appendMessageWithQuestionInputElement(elementRefs.current.questionInput);
            }
          }
        }
        />
        <Button
          hasPadding={false}
          extendClassName="p-2"
          color="rose-800" hoverColor="rose-700" activeColor="rose-950"
          disabled={qnaState.isResponsding}
          onClick={() => appendMessageWithQuestionInputElement(elementRefs.current.questionInput)}
        >
          <span className="material-symbols-outlined block text-white">send</span>
        </Button>
      </div>

      {/* Audio */}
      <audio id="botAudio" src={qnaState.audioURL} ref={ref => elementRefs.current.botAudio = ref}></audio>
    </section>
  )
}