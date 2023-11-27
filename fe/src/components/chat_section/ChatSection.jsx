// import React from 'react'

// Import from hooks
import { useStateWESSFns } from "src/hooks/useStateWESSFns";

// Import from components
import Button from "../button/Button";
import Message from "../message/Message";

// Import data from assets
import chatsectionData from "src/assets/data/chatsection.json";

// Import from features
import { createMessageRenderer } from "./features/renderMessage.jsx";

// Create something
const renderMessage = createMessageRenderer(Message);

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
      messages: [...chatsectionData.initialMessages, ...chatsectionData.optionMessages]
    },
    function(changeState) {
      return {
        appendMessage: function() {
          changeState("messages", function(data) {
            return data
          })
        }
      }
    }
  );

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
        <div className="h-full w-2/6 p-4">
          <h1 className="text-xl font-bold">Hộp thoại</h1>
          <p className="text-center">Tính năng này đang được xây dựng...</p>
        </div>
        {/* Right part (Chat) */}
        <div className="flex flex-col h-full w-4/6 border-2 rounded-xl p-4">
          {/* Title here */}
          <div className="ms-3 mb-3">
            <p className="text-xl font-bold text-base">Voice of DNTU Consultant</p>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-3xl"></div>
              <span className="ms-2">Trực tuyến</span>
            </div>
          </div>

          {/* Conversation content container */}
          <div className="flex flex-col justify-end h-full border rounded-xl overflow-auto p-4">
            {
              chatState.messages.map((message, index) => renderMessage(message, index, chatState.messages))
            }
          </div>

          {/* Input container */}
          <div className="flex items-center py-2 mt-3">
            <input
              type="text"
              className="w-full bg-gray-100 rounded-lg border-2 p-2 px-4 me-3"
              placeholder="Hỏi các câu hỏi khác tại đây..."
            />
            <Button
              isTransparent
              hasPadding={false}
              // onClick={() => { openTMI("mySideMenu") }}
              extendClassName="p-2"
              onClick={() => props.toSlide("left")}
            >
              <span className="material-symbols-outlined block">send</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}