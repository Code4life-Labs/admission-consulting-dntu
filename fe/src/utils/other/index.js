import React from 'react';

/**
 * @typedef CasesType
 * @property {boolean} case
 * @property {any} returnValue
 */

/**
 * @typedef ContentType
 * @property {string} name
 * @property {string | Array<string> | ContentType} text
 * @property {{[key: string]: string}} attrs
 * @property {string} element
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

/**
 * This function will be create an array of JSX Element from Content.
 * @param {Array<ContentType> | ContentType} content 
 * @returns 
 */
function fromContentToJSXElement(content) {
  return content.map(text => {
    if(!text.text)
      return React.createElement(
        text.element,
        {
          ...text.attrs,
          key: text.name
        }
      );

    return React.createElement(
      text.element,
      {
        ...text.attrs,
        key: text.name
      },
      (
        typeof text.text === "object"
          ? fromContentToJSXElement(text.text) 
          : text.text
      )
    );
  })
}

/**
 * Use this function to simulate a request with `timeout`.
 * @param {() => any} fn 
 * @param {number} timeout 
 * @returns 
 */
function wait(fn, timeout = 1000) {
  return new Promise(function(res) {
    setTimeout(function() { res(fn()) }, timeout);
  });
}

export const OtherUtils = {
  fromCase,
  togglePropertyState,
  fromContentToJSXElement,
  wait
};

export const configMD = {
  overrides: {
    mark: {
      props: {
        className: "bg-yellow-200 px-1 rounded"
      }
    },
    sup: {
      props: {
        className: "text-superscript"
      }
    },
    img: {
      props: {
        className: "my-4 rounded-lg shadow-md h-[450px] w-[450px] mx-auto"
      }
    },
    ul: {
      props: {
        className: 'ms-4 list-decimal ms-6'
      },
    },
    ol: {
      props: {
        className: 'ms-4 list-decimal list-inside'
      },
    },
    hr: {
      props: {
        className: 'h-px w-full bg-gray-400 my-3'
      }
    },
    h1: {
      props: {
        className: 'font-bold text-neutral-700 text-3xl'
      },
    },
    h2: {
      props: {
        className: 'font-bold text-neutral-700 text-2xl'
      },
    },
    h3: {
      props: {
        className: 'font-bold text-neutral-700 text-xl'
      },
    },
    h4: {
      props: {
        className: 'font-bold text-neutral-700 text-lg'
      },
    },
    h5: {
      props: {
        className: 'font-bold text-neutral-700 text-base'
      },
    },
    h6: {
      props: {
        className: 'font-bold text-neutral-700 text-sm'
      },
    },
    a: {
      props: {
        target: '_blank',
        className: 'text-sky-600 font-medium underline underline-offset-1 text-sm'
      },
    },
    blockquote: {
      props: {
        className: 'ms-4 my-4 border-l-4 border-gray-300 bg-gray-100 italic p-4 rounded'
      }
    },
    code: {
      props: {
        class: "mx-1 text-red-900 bg-gray-100 px-2 py-1 rounded-md"
      }
    },
    table: {
      props: {
        class: "my-4 min-w-full"
      }
    },
    thead : {
      props: {
        class: "text-xs text-gray-700 uppercase bg-gray-400 "
      }
    },
    tr : {
      props: {
        class: "bg-gray-50 border border-gray-400 hover:bg-gray-200"
      }
    },
    th : {
      props: {
        class: "bg-gray-300 border border-gray-400 px-6 py-3 bg-gray-50 text-left text-sm leading-4 font-bold text-gray-700 uppercase tracking-wider"
      }
    },
    tbody : {
      props: {
        class: "bg-gray-400"
      }
    },
    td : {
      props: {
        class: "border border-gray-400 px-6 py-4 whitespace-no-wrap"
      }
    },
  }
}

export const models = [
  {
    "id": "gpt-3.5-turbo-1106",
    "title": "gpt-3.5-turbo-1106"
  },
  {
    "id": "gpt-3.5-turbo-0125",
    "title": "gpt-3.5-turbo-0125"
  },
  {
    "id": "llama2-70b-4096",
    "title": "llama2-70b-4096"
  },
  {
    "id": "mixtral-8x7b-32768",
    "title": "mixtral-8x7b-32768"
  },
  {
    "id": "gemma-7b-it",
    "title": "gemma-7b-it"
  }
]