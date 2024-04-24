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

import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import { models } from 'src/utils/other';
import { memo } from 'react';
import { StringUtils } from 'src/utils/string';

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

export const QnASection = memo(function QnASection() {
  
  const {
    listening,
    resetTranscript,
    interimTranscript
  } = useSpeechRecognition();

  // const [showStopGenerate, setShowStopGenerate] = React.useState(false)
  const [model, setModel] = React.useState(models[0].id)
  const [emitId, setEmitId] = React.useState('')
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
            // console.log("🚀 ~ changeState ~ data:", data)
            if(data && data[data.length - 1] && (data[data.length - 1]?.isLoading || (data[data.length - 1]?.type === "related_content" && data[data.length - 2]?.type === "related_content")) ) data.pop();
            return [...data, { content, type }]
          })
        },


        /**
         * Use this function to update last message, it can be question or answer, to `qna` and update state.
         * @param {string} content 
         * @param {string} type 
         */
        updateLastMessage: function(content, type) {
          changeState("qna", function(data) {
            if (data && data[data.length - 1] && data[data.length - 1]?.type !== "related_content") data.pop()
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

  const handleListenCreateAnswer = (dataReturn, id) => {
    // đầu tiên sẽ update state response
    if (dataReturn.isOver && dataReturn.isOver === 'DONE' && dataReturn.responseObj) {
      // console.log("🚀 ~ handleListenCreateAnswer ~ dataReturn.allText:", [dataReturn.responseObj]);
      qnaStateFns.updateLastMessage(dataReturn.responseObj.content, dataReturn.responseObj.type);
      // cuối cùng sẽ ngắt kết nối
      socketIoInstance.removeAllListeners(`s_create_answer_${id}`);
      socketIoInstance.removeAllListeners(`s_create_relevant_info_${id}`)
      // setShowStopGenerate(false)

    } else {
      // console.log("🚀 ~ handleListenCreateAnswer ~ dataReturn.messageReturn:", [dataReturn.responseObj])
      qnaStateFns.updateLastMessage(dataReturn.responseObj.content, dataReturn.responseObj.type);
    }
  };

  const appendMessageWithQuestionInputElement = function(inputElement) {
    let text = inputElement.value;
    if(!inputElement || !text) return;
    qnaStateFns.appendMessage(text, "question");
    inputElement.value = "";
    // setShowStopGenerate(true)
    console.log("So lan lap lai tai appendMessageWithQuestionInputElement")
    let id = StringUtils.getRandomID() ;
    setEmitId(prev => id);
    handleListeningEvent(id)
  }
  const startMicroPhone = () => {
    SpeechRecognition.startListening({ language: 'vi-VN', continuous: true })
  }

  const stopMicroPhone = () => {
      SpeechRecognition.stopListening().then(() => {
        // console.log("interimTranscript", interimTranscript)
        // console.log("value", value)
        // console.log("transcript", value)
        if(!interimTranscript) return;
        // qnaStateFns.appendMessage(interimTranscript, "question");
        elementRefs.current.questionInput.value = interimTranscript;
        resetTranscript()
      })
  }

  // const handleAbortAnswer  = () => {
  //   // hủy lắng nghe sự kiện 
  //   socketIoInstance.removeAllListeners('s_create_relevant_info')
  //   socketIoInstance.removeAllListeners('s_create_answer');
  //   setShowStopGenerate(false)
  //   qnaStateFns.updateIsResponding(false);
  //   qnaStateFns.appendMessage('Bạn đã ngưng tạo câu hỏi!', 'answer');
  // }

  const handleListeningEvent = (id) => {
    console.log("EmitId", id)

    console.log("So lan lap lai tai handleListeningEvent")
    socketIoInstance.on(`s_create_relevant_info_${id}`, (data) => {
    console.log("So lan lap lai tai socketIoInstance s_create_relevant_info")

      socketIoInstance.removeAllListeners(`s_create_relevant_info_${id}`)
        console.log("🚀 ~ socketIoInstance.on ~ s_create_relevant_info:", data);
        // socketIoInstance.removeAllListeners('s_create_relevant_info');
        // qnaStateFns.updateIsResponding(false);
  
        let content = {};
  
        if(data.imagesResult && data.imagesResult.length) content.imagesResult = data.imagesResult;
        if(data.videosResult && data.videosResult.length) content.videosResult = data.videosResult;
        if(data.sourcesResult && data.sourcesResult.length) content.sourcesResult = data.sourcesResult;
  
        qnaStateFns.appendMessage(content, data.type);

        qnaStateFns.appendSuspendedMessage();
    })

    // lắng nghe sự kiện mỗi lần có câu hỏi mới
    socketIoInstance.on(`s_create_answer_${id}`, (data) => {
    console.log("So lan lap lai tai socketIoInstance s_create_answer")

      if (data.responseObj.content.trim() !== "") {
        qnaStateFns.updateIsResponding(false);
      }
      handleListenCreateAnswer(data, id)
    })
  }

  // Tracking length of qna
  React.useEffect(function() {
    if(qnaState.qna.length === 0) return;
    console.log("🚀 ~ React.useEffect ~ qnaState.qna:", qnaState.qna)


    let N = qnaState.qna.length;
    let lastMessage = qnaState.qna[N - 1];
    // console.log("🚀 ~ React.useEffect ~ lastMessage:", lastMessage)

    if(lastMessage.type !== "question") return;

    qnaStateFns.appendSuspendedMessage();
    qnaStateFns.updateIsResponding(true);

    console.log("Create emitId", emitId)
    const requestEmit = {
      sessionId: localStorage.getItem("SESSION_USER_ID"),
      emitId: emitId,
      question: lastMessage.content, 
      user_name: "bạn", // username có thể lấy khi nhập dùng mở ô chatbot lên đầu tiên và mình sẽ hỏi tên sau đó lưu vào local stored lần sau thì không hỏi nữa
      model
    }
    
    console.log("🚀 ~ React.useEffect ~ requestEmit:", requestEmit)
    // console.log("🚀 ~ React.useEffect ~ qnaState.qna:", qnaState.qna)

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
      <div className="sticky bottom-0 right-0 left-0">
        {/* {
          showStopGenerate && 
          <div 
            onClick={handleAbortAnswer}
            className='flex flex-row hover:cursor-pointer bg-rose-800 absolute bottom-[100px] right-[44px] justify-center py-1 px-2 rounded'>
            <span className="material-symbols-outlined text-base text-white me-1">
            stop_circle
            </span>
            <div className='text-white text-sm' style={{marginTop: '2px'}}>Ngừng tạo</div>
          </div>
        } */}
        <div className="flex items-center lg:px-[44px] ">
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
            extendClassName="h-[45px] w-[45px] me-2 bg-gray-400"
            color={listening ? "rose-800" : "gray-400"} hoverColor="gray-500" activeColor='gray-600' focusColor='gray-600'
            disabled={qnaState.isResponsding}
            onTouchStart={startMicroPhone}
            onMouseDown={startMicroPhone}
            onTouchEnd={stopMicroPhone}
            onMouseUp={stopMicroPhone}
          >
            <span className="material-symbols-outlined text-white mt-2">mic</span>
          </Button>
          
          <Button
            hasPadding={false}
            extendClassName="h-[45px] w-[45px]"
            color={qnaState.isResponsding ? "gray-400" : "rose-800"} hoverColor={qnaState.isResponsding ? "gray-400" : "rose-700"} activeColor="rose-950"
            disabled={qnaState.isResponsding}
            onClick={() => appendMessageWithQuestionInputElement(elementRefs.current.questionInput)}
          >
            {
              qnaState.isResponsding
              ? <div
                  className="inline-block h-5 w-5 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
                  role="status">
                  <span
                    className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                    >Loading...</span
                  >
                </div>
              : <span className="material-symbols-outlined block text-white">send</span>
            }
          </Button>
        </div>
        <div className='flex flex-row text-gray-600 ms-[44px] py-2'>
          <div>Mô hình: </div>
          <select 
            defaultValue={models[0].title}
            onChange={e => setModel(e.target.value)} 
            className='bg-white underline mx-1'>
            {
              models.map((item) => {
                return(
                  <option
                    key={item.id}
                    value={item.title}
                  >
                    {item.title}
                  </option>
                )
              })
            }
          </select>
          <div>Chú ý: chọn mô hình sẽ làm thay đổi độ chính xác nội dung và tốc độ trả về</div>
        </div>
        <div className={`absolute inset-0 ${qnaState.qna.length ? 'h-[125px]' : 'h-[60px]'}  rounded-b-[15px] bg-white m-block top-0 bottom-0 left-0 right-0 z-[-1]`}></div>
        
      </div>
      {/* Audio */}
      <audio id="botAudio" src={qnaState.audioURL} ref={ref => elementRefs.current.botAudio = ref}></audio>
    </section>
  )
});