// Import from utils
import { getAPIRoot } from "src/utils/constant";

/**
 * Use this function to get speech by `text`.
 * @param {string} text 
 * @returns 
 */
export async function getSpeechAsync(text) {
  let url = getAPIRoot() + "/speech/openai";
  let response = await fetch(url, {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      text: text
    })
  });
  if(!response.ok) throw new Error(response.json());
  return response.arrayBuffer();
}

export const SpeechAPI = {
  OpenAI: {
    getSpeechAsync
  }
}