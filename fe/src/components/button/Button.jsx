/**
 * @typedef ButtonPropsType
 * @property {boolean | undefined} isTransparent
 * @property {boolean | undefined} hasPadding
 * @property {string | undefined} extendClassName
 * @property {string} color
 * @property {number} colorIntensity
 * @property {number} hoverIntensity
 * @property {number} activeIntensity
 * @property {number} focusIntensity
 */

// Import from utils.
// import { OtherUtils } from 'src/utils/other';

const defaultClassName = "rounded";
const skyBGButtonClassName = "bg-sky-500 hover:bg-sky-600 active:bg-sky-700 focus:outline-none focus:ring focus:ring-sky-300";

/**
 * Component này render ra nút.
 * @param {ButtonPropsType & React.ButtonHTMLAttributes<HTMLButtonElement>} props 
 * @returns 
 */
export default function Button({
  hasPadding = true,
  isTransparent = false,
  color,
  colorIntensity = 500,
  hoverIntensity = 600,
  activeIntensity = 700,
  focusIntensity = 300,
  extendClassName,
  ...props
}) {
  let className = defaultClassName;

  if(!isTransparent && !color) className += " " + skyBGButtonClassName;
  if(color) className += " " + `bg-${color}-${colorIntensity} hover:bg-${color}-${hoverIntensity} active:bg-${color}-${activeIntensity} focus:outline-none focus:ring focus:ring-${color}-${focusIntensity}`;
  else className += " hover:bg-gray-500/20"

  if(hasPadding) className += " " + "px-6 py-3"

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