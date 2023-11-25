// import React from 'react';
// import { openTMI } from "tunangn-react-modal";

// Import from components
import Button from '../button/Button';

/**
 * @typedef HeaderProps
 * @property {string | JSX.Element | (() => string | JSX.Element) | undefined} title
 */

/**
 * Component này render ra header.
 * @param {HeaderProps} props 
 * @returns 
 */
export default function Header(props) {
  return (
    <div className="border-b border-gray p-4 sticky top-0 backdrop-blur-xl">
      <div className="flex items-center justify-between w-full max-w-screen-xl mx-auto">
        {
          (typeof props.title === "string" || !props.title)
            ? <h4 className="font-bold">{"Tư vấn tuyển sinh DNTU" + (props.title ? " - " + props.title : "")}</h4>
            : (typeof props.title === "function")
              ? props.title()
              : props.title
        }
        <div className="flex-box ait-center">
          <Button
            isTransparent
            hasPadding={false}
            // onClick={() => { openTMI("mySideMenu") }}
            extendClassName="p-2"
          >
            <span className="material-symbols-outlined block">menu</span>
          </Button>
        </div>
      </div>
    </div>
  )
}