// Import from utils
import { getAPIRoot } from "src/utils/constant";

const base = "/speech"

/**
 * Use this function to get speech by `text`.
 * @param {string} text 
 * @returns 
 */
export async function getSpeechAsync(text) {
  let url = getAPIRoot() + base + "/openai";
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

/**
 * Use to request a speech from string and receive URL of MP3
 * @param {string} text 
 * @returns 
 */
export async function getSpeechURLAsync(text, sessionId) {
  let url = getAPIRoot() + base + "/fpt/url";
  let response = await fetch(url, {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      text,
      sessionId
    })
  });
  if(!response.ok) throw new Error(response.json());
  return response.json();
}

export const SpeechAPI = {
  OpenAI: {
    getSpeechAsync
  },
  FPTAI: {
    getSpeechURLAsync
  }
}