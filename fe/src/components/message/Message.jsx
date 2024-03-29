import { useStateWESSFns } from "src/hooks/useStateWESSFns";

const defaultTextClassName = "w-fit text-base bg-gray-200 rounded-xl p-4 mb-2";

/**
 * @typedef MessagePropsType
 * @property {string} content
 * @property {number} time
 * @property {boolean} hasTime
 * @property {boolean} canSpeak
 * @property {string} extendedClassName 
 * @property {string} extendedContainerClassName 
 * @property {(content: string) => void} onClick
 * @property {(url: string) => void} appendAudioURL
 */

/**
 * @typedef SoundButtonPropsType
 * @property {(url: string) => void} appendAudioURL
 */

/**
 * 
 * @param {SoundButtonPropsType} props 
 * @returns 
 */
function SoundButton({
  appendAudioURL
}) {
  const [soundState, soundStateFns] = useStateWESSFns({
    isLoaded: false,
    isPlaying: false,
    isLoading: false
  }, function(changeState) {
    return {
      /**
       * Use this function to update `loading` state of audio.
       * @param {boolean} state 
       */
      updateLoadingState: function(state = false) {
        changeState("isLoading", function() {
          return state;
        })
      },

      /**
       * Use this function to update `loaded` state of audio.
       * @param {boolean} state 
       */
      updateLoadedState: function(state = false) {
        changeState("isLoaded", function() {
          return state;
        })
      },

      /**
       * Use this function to update `playing` state of audio.
       * @param {boolean} state 
       */
      updatePlayingState: function(state = false) {
        changeState("isPlaying", function() {
          return state;
        })
      },
    }
  });

  let icon = soundState.isLoaded ? "stop_circle" : "volume_up";
  icon = !soundState.isPlaying ? "volume_up" : icon;

  if(soundState.isLoading) {
    return (
      <span className="material-symbols-outlined animate-spin cursor-default">progress_activity</span>
    );
  }

  return (
    <span
      onClick={() => {
        // If sound isn't loaded, load it first.
        if(!soundState.isLoaded) {
          soundStateFns.updateLoadingState(true);
          // Request api here
          setTimeout(() => {
            soundStateFns.updateLoadingState(false);
            soundStateFns.updateLoadedState(true);
          }, 2000);

          // Then append url of audio to `audio` element
          return;
        }

        // If sound is playing
        if(soundState.isPlaying) {
          soundStateFns.updatePlayingState(false);
        } else {
          soundStateFns.updatePlayingState(true);
        }
      }}
      className="material-symbols-outlined cursor-pointer text-gray-400 hover:text-black select-none"
    >
      { icon }
    </span>
  )
}

/**
 * Component renders a block of message. This block of message can contain img avatar or don't. Message can be clickable.
 * @param {MessagePropsType} props
 * @returns 
 */
export default function Message({
  content = "",
  time = Date.now(),
  hasTime = false,
  canSpeak = false,
  extendedClassName,
  extendedContainerClassName,
  onClick,
  appendAudioURL
}) {
  let containerClassName = "message w-full max-w-[45%]";
  let textClassName = defaultTextClassName;
  let isClickable = Boolean(onClick);
  let canRenderExtraBox = canSpeak || hasTime;

  if(extendedClassName) textClassName += " " + extendedClassName;

  if(extendedContainerClassName === "right") {
    containerClassName += " " + "right";
    textClassName += " " + "bg-red-600 text-white";
  }

  if(isClickable) {
    containerClassName += " " + "cursor-pointer italic";
    textClassName += " " + "border-2 border-red-600 bg-white";
  }

  return (
    <div
      className={containerClassName}
      onClick={isClickable ? () => onClick(content) : undefined}
    >
      <p className={textClassName}>{content}</p>
      {
        canRenderExtraBox && (
          <div className="mb-2">
            { hasTime && <p className="text-xs mr-3 inline">{(new Date(time)).toLocaleString()}</p> }
            { canSpeak && <SoundButton appendAudioURL={appendAudioURL} /> }
          </div>
        )
      }
    </div>
  )
}