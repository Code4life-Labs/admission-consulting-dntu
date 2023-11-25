// import React from 'react'

// Import from hooks
import { useStateWESSFns } from 'src/hooks/useStateWESSFns'

// Import styles
import './SwitchSlider.styles.css';

/**
 * @typedef SwitchSliderPropsType
 * @property {(toggleSlide: () => void, toSlide: (to: string) => void) => JSX.Element} left
 * @property {(toggleSlide: () => void, toSlide: (to: string) => void) => JSX.Element} right
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
        },

        toSlide: function(to) {
          changeState("currentSlide", function() {
            return to;
          })
        }
      }
    }
  );

  return (
    <div className="w-full overflow-x-hidden">
      {
        ssState.currentSlide === "left"
        ? (
          <div className="w-full slide left p-2">
            {
              props.left(ssStateFns.toggleSlide, ssStateFns.toSlide)
            }
          </div>
        )
        : (
          <div className="w-full slide right p-2">
            {
              props.right(ssStateFns.toggleSlide, ssStateFns.toSlide)
            }
          </div>
        )
      }
    </div>
  )
}