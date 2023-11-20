const StoreKeys = {
  "test": "_t"
};

/**
 * @typedef {keyof StoreKeys} Keys
 */

/**
 * Use this function to get key of `StoreKeys`.
 * @param {Keys} key 
 * @returns 
 */
function getKey(key) {
  return StoreKeys[key];
}

/**
 * Use this function to get data from storage.
 * @template T
 * @param {Keys} key 
 * @returns {T}
 */
function getItem(key) {
  let dataString = localStorage.getItem(getKey(key));

  if(!dataString) return null;

  return JSON.parse(dataString);
}

/**
 * Use this function to save data in storage.
 * @param {Keys} key 
 * @param data 
 */
function setItem(key, data) {
  data = JSON.stringify(data);
  localStorage.setItem(getKey(key), data);
}

/**
 * Use this function to remove data from storage.
 * @param {Keys} key 
 * @returns 
 */
function removeItem(key) {
  localStorage.removeItem(getKey(key));
  return true;
}

/**
 * Give `index` to this function and receive the `index`-th item's name.
 * @param {number} index 
 * @returns 
 */
function keyName(index) {
  return localStorage.key(index);
}

/**
 * Use this function to clear all items in storage.
 */
function clearAll() {
  localStorage.clear();
}

/**
 * Use this function to get length of local storage.
 * @returns 
 */
function getLength() {
  return localStorage.length;
}

export const LocalStorageUtils = {
  getItem,
  setItem,
  removeItem,
  keyName,
  clearAll,
  getLength
};