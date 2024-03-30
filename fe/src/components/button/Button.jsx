/**
 * @typedef ButtonPropsType
 * @property {boolean | undefined} hasPadding
 * @property {string | undefined} extendClassName
 * @property {string} color
 * @property {string} hoverColor
 * @property {string} activeColor
 * @property {string} focusColor
 */

// Import from utils.
// import { OtherUtils } from 'src/utils/other';

const defaultClassName = "rounded";

/**
 * Component này render ra nút.
 * @param {ButtonPropsType & React.ButtonHTMLAttributes<HTMLButtonElement>} props 
 * @returns 
 */
export default function Button({
  hasPadding = true,
  color,
  hoverColor,
  activeColor,
  focusColor,
  extendClassName,
  ...props
}) {
  let className = defaultClassName;

  if(color) className += " " + `bg-${color}`;
  else className += " " + "bg-white";
  if(hoverColor) className += " " + `hover:bg-${hoverColor}`;
  else className += " " + "hover:bg-slate-50";
  if(activeColor) className += " " + `active:bg-${activeColor}`;
  else className += " " + "active:bg-slate-200";
  if(focusColor) className += " " + `focus:ring-${focusColor}`;
  else className += " focus:ring-rose-600"
  className += " focus:outline-none focus:ring";

  if(hasPadding) className += " " + "px-6 py-3";

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