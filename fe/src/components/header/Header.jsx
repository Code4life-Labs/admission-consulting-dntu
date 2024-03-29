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
    <header className="border-b border-gray p-4 sticky top-0 backdrop-blur-xl" style={{ zIndex: 1 }}>
      <section className="flex items-center justify-between w-full max-w-screen-xl mx-auto">
        <img src="https://dntu.edu.vn/storage/setting/5w3pOafBUPOfsXlxrwGPNhaEgnLC6x-metabG9nby5wbmc=-.png" />
        <div className="flex">
          <Button extendClassName="text-rose-800 mr-3 font-medium border border-rose-800 border-2" color="white">Đăng ký xét tuyển</Button>
          <Button extendClassName="text-rose-800 mr-3 font-medium border border-rose-800 border-2" color="white">Tham quan trường 360</Button>
          <Button extendClassName="text-white mr-3 font-medium border border-rose-800 border-2 flex" colorIntensity={800} color="rose">
          <span className="material-symbols-outlined mr-3">smart_toy</span>
            Hỏi DNTU AI...
          </Button>
        </div>
      </section>
    </header>
  )
}