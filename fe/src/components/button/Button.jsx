/**
 * @typedef ButtonPropsType
 * @property {boolean | undefined} isTransparent
 * @property {boolean | undefined} hasPadding
 * @property {string | undefined} extendClassName
 */

import { OtherUtils } from 'utils/other';

const defaultClassName = "rounded";
const skyBGButtonClassName = "bg-sky-500 hover:bg-sky-700 active:bg-sky-700 focus:outline-none focus:ring focus:ring-sky-300";

/**
 * 
 * @param {ButtonPropsType & React.ButtonHTMLAttributes<HTMLButtonElement>} props 
 * @returns 
 */
export default function Button({
  hasPadding = true,
  isTransparent = false,
  extendClassName,
  ...props
}) {
  // Concatenate the root class name with the extend class name.
  let className = OtherUtils.fromCase([
    {
      case: isTransparent,
      returnValue: defaultClassName + " " + "px-6 py-3"
    },
    {
      case: !hasPadding,
      returnValue: defaultClassName + " " + skyBGButtonClassName
    },
    {
      case: true,
      returnValue: defaultClassName + " " + skyBGButtonClassName + " " + "px-6 py-3"
    }
  ]);

  if(extendClassName) className += " " + extendClassName;

  return (
    <button
      {...props}
      className={className}
    >
      { props.children }
    </button>
  )
}