/**
 * Use to round a `num` to `dec` th decimal.
 * @param {number} num 
 * @param {number} to 
 */
function roundTo(num, dec = 10) {
  return Math.round(num * dec) / dec;
}

/**
 * Use to get a random number from `min` to `max`.
 * @param {number} min 
 * @param {number} max 
 * @returns 
 */
function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1));
}

export const NumberUtils = {
  getRandom,
  roundTo
}