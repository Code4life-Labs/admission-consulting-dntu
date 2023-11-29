// Import from utils
import { API_ROOT } from "src/utils/constant"

/**
 * Use this function to get speech by `text`.
 * @param {string} text 
 * @returns 
 */
export async function getSpeechAsync(text) {
  let url = API_ROOT.DEV + "/speech" + "?text=" + text;
  return fetch(url);
}

export const SpeechAPI = {
  getSpeechAsync
}