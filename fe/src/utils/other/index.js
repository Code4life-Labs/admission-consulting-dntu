/**
 * @typedef CasesType
 * @property {boolean} case
 * @property {any} returnValue
 */

/**
 * This function allow to perform a "switch-case-like" statement.
 * @param {Array<CasesType>} cases 
 * @returns 
 */
function fromCase(cases) {
  for(let c of cases) {
    if(c.case) {
      return typeof c.returnValue === "function" ? c.returnValue() : c.returnValue;
    }
  }
}

/**
 * Use to toggle boolean state of a object.
 * 
 * This function should be used in a case that you want to operate when
 * its state is `true` or `false`.
 * @template T
 * @param {T} o 
 * @param {keyof T} propName 
 * @param {((status: boolean) => void) | undefined} fn
 * @returns 
 */
function togglePropertyState(o, propName, fn) {
  if(typeof o[propName] !== "boolean") return;

  // Toggle state
  o[propName] = !o[propName];

  // Call
  if(fn) fn(o[propName]);
}

export const OtherUtils = {
  fromCase,
  togglePropertyState
};