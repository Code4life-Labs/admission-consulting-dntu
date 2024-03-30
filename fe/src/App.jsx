// import React from 'react';
import { TunangnModal } from 'tunangn-react-modal';

// Import from pages
import HomePage from 'src/pages/home/HomePage';

// Import from components
import Dialog from 'src/components/dialog/Dialog';
import ChatbotDialog from './components/dialog/ChatbotDialog';
import { DialogNames } from './components/dialog/dialog_entries';

// Import styles
import "./App.css";

function App() {
  return (
    <>
      <HomePage />
      {/* Modal */}
      <TunangnModal
        className="fixed hidden w-full h-screen top-0 left-0 bg-black-200 z-50"
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
