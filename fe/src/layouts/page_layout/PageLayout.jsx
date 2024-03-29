// Import from components
import Header from 'src/components/header/Header';
import Navbar from 'src/components/navbar/Navbar';

/**
 * @typedef PageLayoutProps
 * @property {string | JSX.Element | (() => string | JSX.Element) | undefined} headerTitle
 * @property {string | JSX.Element | (() => string | JSX.Element) | undefined} footerTitle
 * @property {boolean | undefined} shownFooter
 * @property {boolean | undefined} shownHeader
 * @property {boolean | undefined} shownNavbar
 */

/**
 * Dùng component này để render ra layout cho page.
 * @param {PageLayoutProps & React.PropsWithChildren} props 
 * @returns 
 */
export default function PageLayout(props) {
  return (
    <>
      {
        (props.shownHeader === true || props.shownHeader === undefined)
        && (
          <Header
            title={props.headerTitle}
          />
        )
      }
      {
        (props.shownNavbar === true || props.shownNavbar === undefined)
        && (
          <Navbar
          />
        )
      }
      { props.children }
    </>
  )
}