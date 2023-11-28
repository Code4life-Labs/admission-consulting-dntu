// import React from 'react';
import { TunangnModal } from 'tunangn-react-modal';

// Import from pages
import HomePage from 'src/pages/home/HomePage';

// Import from components
import Dialog, { name as MY_DIALOG_NAME } from 'src/components/dialog/Dialog';

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
          [MY_DIALOG_NAME]: {
            type: "dialog",
            element: Dialog
          }
        }}
      />
    </>
  )
}

export default App
