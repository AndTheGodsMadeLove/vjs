/**
 * @version 0.1-alpha
 */

/**
 * deep clone anything
 * @param {object} obj
 * @returns {object}
 */
export const clone = (obj) => {
  const fn = (o) => {
    let v;
    let k;
    const c = Array.isArray(o) ? [] : {};
    for (k in o) {
      v = o[k];
      c[k] = isObject(v) ? fn(v) : v;
    }
    return c;
  };
  return fn(obj);
};

/**
 * check if a given value is an object
 * @param {any} v
 * @returns {boolean}
 */
export const isObject = (v) => v !== null && typeof v === 'object' && Array.isArray(v) === false;

/**
 * check if two objects share equal properties and values
 * @param {any} a
 * @param {any} b
 * @return {boolean}
 */
export const isEqual = (a, b) => (JSON.stringify(a) === JSON.stringify(b));

/**
 * removes all children from a HTMLElement or DocumentFragment
 * @param {HTMLElement|DocumentFragment} e
 */
export const flushElement = (e) => {
  const r = document.createRange();
  r.selectNodeContents(e);
  r.deleteContents();
};

