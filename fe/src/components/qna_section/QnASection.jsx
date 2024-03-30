import React from 'react'

// Import from hooks
import { useStateWESSFns } from "src/hooks/useStateWESSFns";

// Import from apis
import { ChatBotAPI } from 'src/apis/chatbot';

// Import from components
import Button from "../button/Button";

// Import data from assets
import chatsectionData from "src/assets/data/chatsection.json";

/**
 * Use this function to render a Question and Answer section with Chatbot.
 * @returns 
 */
export default function QnASection() {
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

  // const toggleHiddenChatList = React.useCallback(function() {
  //   elementRefs.current.hiddenChatList.classList.toggle("hide")
  // }, []);

  // const renderMessage = React.useMemo(function() {
  //   return createMessageRenderer(chatStateFns.appendMessage, { Message, AudioMessage })
  // }, []);

  React.useEffect(() => {
    // Scroll to bottom whenever there is new message is appended.
    // elementRefs.current.messagesContainerWrapper.scroll(0, elementRefs.current.messagesContainerWrapper.scrollHeight);

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
    <section className="flex flex-col flex-1 px-4 mt-4">
      {/* Q and A will appear here */}
      <div className="relative flex flex-1 flex-col h-3/4 w-full max-md:w-full overflow-hidden">
        <div className="h-full"></div>
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

      {/* Audio */}
      <audio id="botAudio" src={chatState.audioURL}></audio>
    </section>
  )
}