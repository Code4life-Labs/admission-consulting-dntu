// import React from 'react'

// Import from hooks
import { useStateWESSFns } from 'src/hooks/useStateWESSFns'

/**
 * @typedef SwitchSliderPropsType
 * @property {(toggleSlide: () => void) => JSX.Element} left
 * @property {(toggleSlide: () => void) => JSX.Element} right
 */

/**
 * Component renders a switch slider. Switch slider is a slider that has only 2 slides, they
 * are called `left` and `right` respectively.
 * @param {SwitchSliderPropsType} props
 * @returns 
 */
export default function SwitchSlider(props) {
  const [ssState, ssStateFns] = useStateWESSFns(
    {
      currentSlide: "left"
    },
    function(changeState) {
      return {
        toggleSlide: function() {
          changeState("currentSlide", function(data) {
            return data === "left" ? "right" : "left";
          })
        }
      }
    }
  );

  return (
    <div className="w-full">
      {
        ssState.currentSlide === "left"
        ? (
          <div>
            {
              props.left(ssStateFns.toggleSlide)
            }
          </div>
        )
        : (
          <div>
            {
              props.right(ssStateFns.toggleSlide)
            }
          </div>
        )
      }
    </div>
  )
}