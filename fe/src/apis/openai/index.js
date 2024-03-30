// Import from utils
const API_ROOT = import.meta.env.VITE_API_ROOT;

/**
 * Use this function to get speech by `text`.
 * @param {string} text 
 * @returns 
 */
export async function getSpeechAsync(text) {
  let url = API_ROOT + "/speech/openai";
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
  return response.arrayBuffer();
}

export const SpeechAPI = {
  getSpeechAsync
}