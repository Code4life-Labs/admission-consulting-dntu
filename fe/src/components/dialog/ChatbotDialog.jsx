// import React from 'react';

// Import from layout
import DialogLayout from 'src/layouts/modal_items/dialog_layout/DialogLayout';

// Import from components
import Button from '../button/Button';
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
  // const data = props.item.getData();
  // const content = data.content;

  return (
    <DialogLayout
      className="w-screen h-screen bg-transparent flex overflow-auto p-6"
    >
      <div className="w-full bg-white rounded-xl max-w-[1280px] m-auto p-3">
        <header className="w-full flex justify-between">
          <h1 className="font-bold text-2xl text-rose-800">DNTU AI</h1>
          <Button
            hasPadding={false}
            onClick={() => { props.close() }}
            extendClassName="p-2"
          >
            <span className="material-symbols-outlined block">close</span>
          </Button>
        </header>
        <QnASection />
      </div>
    </DialogLayout>
  )
}