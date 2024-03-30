import { openTMI } from 'tunangn-react-modal';

// Import from assets
import aboutData from 'src/assets/data/about.json';

export const DialogNames = {
  chatbot: "chatbot_dialog",
  normal: "normal_dialog"
};

/**
 * Use this function to open Chatbot Dialog.
 */
export function openChatbotDialog() {
  return openTMI(
    DialogNames.chatbot,
    {
      title: <h1 className="font-bold text-2xl text-rose-800">DNTU AI</h1>,
      content: "Hello"
    }
  );
}

/**
 * Use this function to open a dialog when you want to get data for game finding.
 */
export function openMyDialog() {
  return openTMI(
    DialogNames.normal,
    {
      title: <h1 className="font-bold text-2xl">Một số thông tin</h1>,
      content: aboutData.texts,
    }
  );
}