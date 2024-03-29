// Import from utils
const API_ROOT = import.meta.env.VITE_API_ROOT;

/**
 * Use this function to get speech by `text`.
 * @param {string} text 
 * @returns 
 */
export async function getSpeechAsync(text) {
  let url = API_ROOT + "/speech" + "?text=" + text;
  return fetch(url);
}

export const SpeechAPI = {
  getSpeechAsync
}