import React from 'react';

/**
 * @template T, N
 * @param {T} state 
 * @param {N extends keyof T} name 
 * @param {(data: T[N]) => T[N]} fn 
 * @returns 
 */
function getState(state, name, fn) {
  return {...state, [name]: fn(state[name])};
}

/**
 * This hook allow using state and generate some explicit funtions that use `setState` inside.
 * The purpose of this hook is for clearer `setState` actions and centralize state of components.
 * 
 * __WESSFns__ in `useStateWESSFns` stand for __With Explicit SetState Functions__
 * @template T, O
 * @param {T} state 
 * @param {(changeState: <N extends keyof T>(name: N, fn: (data: T[N]) => T[N], preventUpdate?: (data: T[N]) => boolean) => void) => O} build 
 * @returns {[T, O]}
 */
export function useStateWESSFns(
  state,
  build
) {
  // Get state and setState
  const [$, set$] = React.useState(state);

  // Get ESSFns from React.useMemo()
  const _fns = React.useMemo(() => {
    // Create `changeState` function.
    const $ = function(name, fn, preventUpdate) {
      set$(
        prevState => {
          if(preventUpdate && preventUpdate(prevState[name])) return prevState;
          return getState(prevState, name, fn);
        }
      );
    }

    // Use build() to get object that contains functions for component use.
    return build($);
  }, []);

  return [$, _fns];
}