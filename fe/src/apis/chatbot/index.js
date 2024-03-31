// Import from utils
import { getAPIRoot } from "src/utils/constant";

const base = "/fpt";

/**
 * Use this function to get answer from AI.
 * @param {string} text 
 * @returns 
 */
export async function getAnswerAsync(text, senderName) {
  let url = getAPIRoot() + base + "/get-answer-ai";
  let response = await fetch(url, {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      sender_id: "",
      sender_name: senderName,
      sender_input: text
    })
  });
  return response.json();
}

export const ChatBotAPI = {
  getAnswerAsync
}