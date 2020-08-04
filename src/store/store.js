/**
 * @version 0.1-alpha
 *
 * @requires './../util/util.js:clone
 * @requires './../util/util.js:isEqual
 * @requires './../util/util.js:isObject
 */

// eslint-disable-next-line
/// <reference path='./typedef.js' />

import {
  clone,
  isEqual,
  isObject,
} from './../util/util.js';

/**
 * create a new store
 */
export class Store {
  /**
   * create a new store
   * @param {function} reducer
   * @param {object} [initialState]
   */
  constructor(reducer, initialState = null) {
    /**
     * @property
     * @type {function}
     */
    this.reducer = reducer;

    /**
     * @property
     * @type {(object|null)}
     */
    this.state = null;

    /**
     * @property
     * @type {(object|null)}
     */
    this.tempState = null;

    /**
     * @property
     * @type {Array.<{ fn: function, configFn: function}>}
     */
    this.listenerList = [];

    if (isObject(initialState)) {
      this.setInitialState(initialState);
    }
  }

  /**
   * get current state
   * @returns {object}
   */
  getState() {
    if (!isObject(this.state)) {
      throw new Error('current state is not an object! check if initial state is set and/or your reducer');
    }
    return clone(this.state);
  }

  /**
   * @param {object} state
   */
  setInitialState(state) {
    if (this._containsUndefined(state)) {
      this.tempState = state;
    } else {
      this.state = state;
    }

    this.dispatch({}, true);
  }

  /**
   * @returns {boolean}
   */
  isStateReady() {
    return !this._containsUndefined(this.state) && isObject(this.state);
  }

  /**
   * subscribe a callback
   * @param {function} fn
   * @param {function} [configFn]
   */
  subscribe(fn, configFn = (s) => (s)) {
    this.listenerList.push({ fn, configFn });
  }

  /**
   * unsubscribe a callback
   * @param {function} fn
   */
  unsubscribe(fn) {
    this.listenerList = this.listenerList.filter((listener) => listener.fn !== fn);
  }

  /**
   * notify subscriber listening to the state or properties of the state
   * @param {object} action - action object with type and payload
   * @param {boolean} force - force invocation of subscribed callbacks
   */
  dispatch(action, force = false) {
    let prevState = this.tempState || this.getState();
    const nextState = this.reducer(prevState, action);

    // abort if there is no state change after the reducer action
    // and the force invocation parameter is false
    if (!force && isEqual(prevState, nextState)) {
      return;
    }

    // if nextState contains undefined update
    // tempState and abort
    if (this._containsUndefined(nextState)) {
      this.tempState = {
        ...this.tempState,
        ...nextState,
      };
      return;
    }

    // if there is a tempState set, all data are gathered now and the state is ready.
    //
    // * set tempState back to null (dispatch utilizes state object instead of tempState object)
    // * simulate empty prevState
    if (this.tempState !== null) {
      this.tempState = null;
      prevState = {};
    }

    // update state
    this.state = nextState;

    // iterate listener
    this.listenerList.forEach((listener) => {
      const prevValues = listener.configFn(prevState);
      const nextValues = listener.configFn(nextState);
      // abort if observed property has no state change
      if (!force && isEqual(prevValues, nextValues)) {
        return;
      }

      // invoke callback
      listener.fn(nextState);
    });
  }

  /**
   * check if a object contains a undefined property
   * @param {object} o
   * @returns {boolean}
   */
  _containsUndefined(o) {
    for (const i in o) {
      if (typeof o[i] === 'undefined') {
        return true;
      }

      if (isObject(o[i])) {
        return this._containsUndefined(o[i]);
      }
    }

    return false;
  }
}
