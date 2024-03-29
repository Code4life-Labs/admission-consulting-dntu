import React from 'react'

// Import from hooks
import { useStateWESSFns } from "src/hooks/useStateWESSFns";

// Import from apis
// import { SpeechAPI } from 'src/apis/speech';
import { ChatBotAPI } from 'src/apis/chatbot';

// Import from components
import Button from "../button/Button";
import Message from "../message/Message";
import AudioMessage from '../message/AudioMessage';

// Import data from assets
import chatsectionData from "src/assets/data/chatsection.json";

// Import from features
import { createMessageRenderer } from "./features/renderMessage.jsx";

// Import style
import "./ChatSection.style.css";

/**
 * @typedef ChatSectionPropsType
 * @property {(to: string) => void} toSlide
 */

/**
 * Component renders a chat section.
 * @param {ChatSectionPropsType} props
 * @returns 
 */
export default function ChatSection(props) {
  const [chatState, chatStateFns] = useStateWESSFns(
    {
      messages: [...chatsectionData.messages],
      audioURL: ""
    },
    function(changeState) {
      return {
        /**
         * Use this function to add a message to `messages` and update state.
         * @param {string} text 
         * @param {boolean} isOwned 
         */
        appendMessage: function(text, isOwned) {
          changeState("messages", function(data) {
            return [...data, { text, isOwned }]
          })
        },

        /**
         * Use this function to add an audio message to `messages` and update state.
         * @param {string} audio 
         */
        appendAudioMessage: function(audio) {
          changeState("messages", function(data) {
            return [...data, { audio }]
          })
        },

        /**
         * Use this function to add loading message.
         */
        appendLoadingMessage: function() {
          changeState("messages", function(data) {
            return [...data, { isLoading: true }]
          })
        },

        /**
         * Use this function to update last message to audio.
         * @param {string} audio 
         */
        updateLastToAudioMessage: function(audio) {
          changeState("messages", function(data) {
            // Remove last message.
            data.pop();
            return [...data, { audio }]
          })
        },

        /**
         * Use this function to update last message to message (last message typically is suspended message)
         * @param {string} text 
         */
        updateLastToMessage: function(text) {
          changeState("messages", function(data) {
            // Remove last message.
            data.pop();
            return [...data, { text, canSpeak: true }]
          })
        }
      }
    }
  );

  const elementRefs = React.useRef({
    hiddenChatList: null,
    messagesContainerWrapper: null,
    chatInput: null,
    botAudio: null
  });

  const toggleHiddenChatList = React.useCallback(function() {
    elementRefs.current.hiddenChatList.classList.toggle("hide")
  }, []);

  const renderMessage = React.useMemo(function() {
    return createMessageRenderer(chatStateFns.appendMessage, { Message, AudioMessage })
  }, []);

  React.useEffect(() => {
    // Scroll to bottom whenever there is new message is appended.
    elementRefs.current.messagesContainerWrapper.scroll(0, elementRefs.current.messagesContainerWrapper.scrollHeight);

    // If the last message is user (message.isOwned = true), then call api.
    // Because of this is a voice-response chat, so api always response url of audio.
    let N = chatState.messages.length;
    // Temporarily close this feature
    let lastMessage = chatState.messages[N - 1];

    // if(lastMessage.isOwned) {
    //   chatStateFns.appendLoadingMessage()
    //   SpeechAPI
    //     .getSpeechAsync(lastMessage.text)
    //     .then((res) => res.json())
    //     .then(data => {
    //       let { audio } = data;
    //       chatStateFns.updateLastToAudioMessage(audio)
    //     })
    // }

    // Get answer as text instead
    if(lastMessage.isOwned) {
      chatStateFns.appendLoadingMessage()
      ChatBotAPI.getAnswerAsync()
    }

  }, [chatState.messages]);

  return (
    <div className="h-[calc(100vh-121px)]">
      {/* Header of chat section */}
      <div className="flex flex-row items-center w-full">
        {/* "Change slide" button */}
        <Button
          isTransparent
          hasPadding={false}
          // onClick={() => { openTMI("mySideMenu") }}
          extendClassName="p-2"
          onClick={() => props.toSlide("left")}
        >
          <span className="material-symbols-outlined block">chevron_left</span>
        </Button>
        <p className="ms-2">Về trang chủ</p>
      </div>

      {/* Body of chat section */}
      <div className="h-[calc(100%-52px)] flex flex-row">
        {/* Left part */}
        <div className="h-full w-2/6 p-4 hidden md:block">
          <h1 className="text-xl font-bold">Hộp thoại</h1>
          <p className="text-center">Tính năng này đang được xây dựng...</p>
        </div>

        {/* Right part (Chat) */}
        <div className="relative flex flex-col h-full w-4/6 border-2 rounded-xl p-4 max-md:w-full overflow-hidden">
          {/* Hidden part */}
          <div
            ref={ref => elementRefs.current.hiddenChatList = ref}
            className="absolute top-0 left-0 w-full h-full bg-white rounded-xl p-4 hidden-chat-list hide transition-all"
          >
            <div className="flex items-center">
              <Button
                isTransparent
                hasPadding={false}
                // onClick={() => { openTMI("mySideMenu") }}
                extendClassName="p-2 me-3"
                onClick={() => toggleHiddenChatList()}
              >
                <span className="material-symbols-outlined block">chevron_left</span>
              </Button>
              <h1 className="text-xl font-bold">Hộp thoại</h1>
            </div>
            <p className="text-center">Tính năng này đang được xây dựng...</p>
          </div>

          {/* Title here */}
          <div className="flex items-center ms-3 mb-3">
            <div>
              <Button
                isTransparent
                hasPadding={false}
                onClick={() => { toggleHiddenChatList() }}
                extendClassName="p-2 me-3 md:hidden"
              >
                <span className="material-symbols-outlined block">menu</span>
              </Button>
            </div>
            <div>
              <p className="text-xl font-bold text-base">DNTU Consultant</p>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-3xl"></div>
                <span className="ms-2">Trực tuyến</span>
              </div>
            </div>
          </div>

          {/* Conversation content container */}
          <div className="relative h-full max-h-full border rounded-xl mt-auto">
            <div
              ref={ref => elementRefs.current.messagesContainerWrapper = ref}
              className="h-full absolute overflow-auto p-4"
            >
              <div className="flex flex-col justify-end min-h-full">
                {
                  chatState.messages.map((message, index) => renderMessage(message, index, chatState.messages))
                }
              </div>
            </div>
          </div>

          {/* Input container */}
          <div className="flex items-center py-2 mt-3">
            <input
              ref={ref => elementRefs.current.chatInput = ref}
              type="text"
              className="w-full bg-gray-100 rounded-lg border-2 p-2 px-4 me-3"
              placeholder="Hỏi các câu hỏi khác tại đây..."
            />
            <Button
              isTransparent
              hasPadding={false}
              // onClick={() => { openTMI("mySideMenu") }}
              extendClassName="p-2"
              onClick={() => {
                let text = elementRefs.current.chatInput.value;
                chatStateFns.appendMessage(text, true);
                elementRefs.current.chatInput.value = "";
              }}
            >
              <span className="material-symbols-outlined block">send</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Audio */}
      <audio id="botAudio" src={chatState.audioURL}></audio>
    </div>
  )
}