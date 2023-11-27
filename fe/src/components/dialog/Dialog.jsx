import React from 'react';
import { openTMI } from 'tunangn-react-modal';

// Import components
// import Button from '../button/Button';

// Import layout
import DialogLayout from 'src/layouts/modal_items/dialog_layout/DialogLayout'

export const name = "myDialog";

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
 * Use this function to open a dialog when you want to get data for game finding.
 */
export function openMyDialog() {
  return openTMI(
    name,
    {
      title: <h1 className="font-bold text-lg">Các thông tin khác</h1>,
      content: [
        {
          "name": "greeting",
          "text": "Chào mừng các bạn sinh viên đến với",
          "className": "text-base",
          "element": "p"
        },
      ]
    }
  );
}

/**
 * A component will pop a dialog up.
 * @param {CustomizedModalItemProps} props 
 * @returns 
 */
export default function Dialog(props) {
  const data = props.item.getData();
  const content = data.content;

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
        maxWidth: "540px",
        minHeight: "360px"
      })}
    >
      <div className="px-4 mt-4">
        {
          content.map(text => (
            React.createElement(text.element, { className: text.className, key: text.name }, text.text)
          ))
        }
      </div>
    </DialogLayout>
  )
}