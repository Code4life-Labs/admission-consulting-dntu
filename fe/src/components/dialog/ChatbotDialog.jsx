// import React from 'react';

// Import from layout
import DialogLayout from 'src/layouts/modal_items/dialog_layout/DialogLayout';

// Import from components
// import Button from '../button/Button';
import QnASection from '../qna_section/QnASection';

/**
 * @typedef DialogContentType
 * @property {string} name
 * @property {string} text
 * @property {string} className
 * @property {string} element
 */

/**
 * @typedef MyDialogTransferedDataType
 * @property {Array<DialogContentType>} content
 */

/**
 * A component will pop a dialog up.
 * @param {CustomizedModalItemProps} props 
 * @returns 
 */
export default function ChatbotDialog(props) {
  const data = props.item.getData();
  // const content = data.content;

  return (
    <DialogLayout
      title={
        typeof data.title === "function"
          ? data.title()
          : data.title
      }
      close={props.close}
      className="bg-white p-3"
      style={props.utils.getContainerStyle({
        width: "100%",
        maxWidth: "1280px",
        maxHeight: "720px",
        minHeight: "520px"
      })}
    >
      <QnASection />
    </DialogLayout>
  )
}