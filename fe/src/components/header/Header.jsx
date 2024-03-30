// import React from 'react';

// Import from components
import { openChatbotDialog } from '../dialog/dialog_entries';
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
export default function Header() {
  return (
    <header className="border-b border-gray p-4 sticky top-0 backdrop-blur-xl" style={{ zIndex: 1 }}>
      <section
        className="flex flex-col w-full max-w-screen-xl mx-auto items-center justify-between xl:flex xl:flex-row xl:items-center xl:justify-between"
      >
        <img src="https://dntu.edu.vn/storage/setting/5w3pOafBUPOfsXlxrwGPNhaEgnLC6x-metabG9nby5wbmc=-.png" className="mb-4 xl:mb-0"/>
        <div className="flex">
          <Button extendClassName="text-rose-800 mr-3 font-medium border border-rose-800 border-2" color="white">Đăng ký xét tuyển</Button>
          <Button extendClassName="text-rose-800 mr-3 font-medium border border-rose-800 border-2" color="white">Tham quan trường 360</Button>
          <Button
            extendClassName="text-white mr-3 font-medium border border-rose-800 border-2 flex"
            color="rose-800" hoverColor="rose-700" activeColor="rose-950"
            onClick={() => openChatbotDialog()}
          >
            <span className="material-symbols-outlined mr-3">smart_toy</span>
            Hỏi DNTU AI...
          </Button>
        </div>
      </section>
    </header>
  )
}