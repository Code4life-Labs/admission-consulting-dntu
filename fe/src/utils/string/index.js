/**
 * Use to concatenate string. Pass a string to first parameter and pass other strings,
 * functions or just a string to second parameter.
 * @param {string} o original string, is a string you want to be concatenated with `vals`.
 * @param {Array<string | function | undefined> | string | function | undefined} vals can be a function, string, array of function or array of string.
 * @returns 
 */
function concate(o, vals) {
  if(Array.isArray(vals)) {
    for(let val of vals) {
      o = concate(o, val);
    }
    return o;
  }

  if(typeof vals === "string") {
    if(!vals) return vals;
    return o + " " + vals;
  }

  if(typeof vals === "function" && vals()) {
    return o + " " + vals();
  } else {
    return o;
  }
}

/**
 * __Building... Please don't use this function__
 * 
 * Use this function to render content from json file in `assets`.
 * @param {*} content 
 */
function convertToJSX(content) {
  return content;
}

/**
 * Dùng để tạo random id
 */
const getRandomID = (length = 18) => {
  let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
};

export const StringUtils = {
  concate,
  convertToJSX,
  getRandomID
};