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
