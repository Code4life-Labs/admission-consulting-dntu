//  import React from 'react';
import { TunangnModal } from 'tunangn-react-modal';

// Import from pages
import HomePage from 'src/pages/home/HomePage';

// Import from components
import Dialog from 'src/components/dialog/Dialog';
import ChatbotDialog from './components/dialog/ChatbotDialog';
import { DialogNames } from './components/dialog/dialog_entries';

// Import styles
import "./App.css";
import { getSocket } from './socket';
import React from 'react';
import { StringUtils } from './utils/string';

export const socketIoInstance = getSocket()

function App() {

  React.useEffect(() => {
    // tạo ngẫu nhiên ID
		let userId =  StringUtils.getRandomID();
    console.log("🚀 ~ React.useEffect ~ userId:", userId)
    // có thể lưu vào localStored để include case user bấm nhầm nút close trong TunangnModal
    localStorage.setItem("SESSION_USER_ID", userId)

		socketIoInstance.emit('c_user_login', userId)
	}, [])
  return (
    <>
      <HomePage />
      {/* Modal */}
      <TunangnModal
        className="fixed hidden w-full h-screen top-0 left-0 bg-black-300 z-50"
        items={{
          [DialogNames.normal]: {
            type: "dialog",
            element: Dialog
          },
          [DialogNames.chatbot]: {
            type: "dialog",
            element: ChatbotDialog
          },
        }}
      />
    </>
  )
}

export default App
