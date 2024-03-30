import React from 'react';

// Import from layouts
import Button from 'src/components/button/Button';

/**
 * @typedef DialogLayoutPropsType
 * @property {any} title
 * @property {string} className
 * @property {(data: any) => any} close
 * @property {React.CSSProperties} style
 */

/**
 * A layout for dialog, use for customized dialog.
 */
const DialogLayout = React.forwardRef(
  /**
   * 
   * @param {DialogLayoutPropsType & React.PropsWithChildren} props 
   * @param {*} ref 
   * @returns 
   */
  function DialogLayout(props, ref) {
    return (
      <div
        ref={ref}
        style={props.style}
        className={props.className ? props.className : "my-dialog"}
      >
        <div className="flex items-center justify-between">
          {props.title}
          {
            props.close && (
              <Button
                hasPadding={false}
                onClick={() => { props.close() }}
                extendClassName="p-2"
              >
                <span className="material-symbols-outlined block">close</span>
              </Button>
            )
          }
        </div>
        {props.children}
      </div>
    )
  }
);

export default DialogLayout;