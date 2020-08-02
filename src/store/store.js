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
    this.state = initialState;

    /**
     * @property
     * @type {StoreSubscriber[]}
     */
    this.subscriber = [];
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
   * set initial state for the store
   *
   * NOTE: the naming for this method was chosen to explain
   * its ONLY purpose. This method will set a new state object
   * but will NOT notify any subscribers!
   *
   * @param {object} state
   */
  setInitialState(state) {
    this.state = state;
  }

  /**
   * @returns {boolean}
   */
  isStateReady() {
    return !this.containsUndefined(this.state);
  }

  /**
   * subscribe a callback
   * @param {function} fn
   * @param {function} [configFn]
   */
  subscribe(fn, configFn = (s) => (s)) {
    this.subscriber.push({ fn, configFn });
  }

  /**
   * unsubscribe a callback
   * @param {function} fn
   */
  unsubscribe(fn) {
    this.subscriber = this.subscriber.filter((sub) => sub.fn !== fn);
  }

  /**
   * notify subscriber listening to the state or properties of the state
   * @param {object} action
   */
  dispatch(action) {
    // if previous state is equal to next state abort
    const prevState = this.getState();
    const nextState = this.reducer(this.state, action);
    if (isEqual(prevState, nextState)) {
      return;
    }

    // update store
    this.state = nextState;

    // if state is not complete abort
    if (!this.isStateReady()) {
      return;
    }

    // iterate over subscriber to invoke affected callbacks
    this.subscriber.forEach((sub) => {
      // if no observed properties of the subscriber has changed abort
      const prevValues = sub.configFn(prevState);
      const nextValues = sub.configFn(nextState);
      if (isEqual(prevValues, nextValues)) {
        return;
      }

      // invoke callback
      sub.fn();
    });
  }

  /**
   * check if a object contains a undefined property
   * @param {object} o
   * @returns {boolean}
   */
  containsUndefined(o) {
    for (const i in o) {
      if (typeof o[i] === 'undefined') {
        return true;
      }

      if (isObject(o[i])) {
        return this.containsUndefined(o[i]);
      }
    }

    return false;
  }
}
