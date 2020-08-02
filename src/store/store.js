<<<<<<< Updated upstream
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
=======
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

    // abort if there is no state change after
    // and the parameter force is false
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

    // if there is a tempState set all data are gathered
    // now and the state is ready.
    // * set tempState back to null (use state object instead of tempState object)
    // * fill state object with gathered data
    // * simulate empty prevState
    if (this.tempState !== null) {
      this.tempState = null;
      this.state = nextState;
      prevState = {};
    }

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
>>>>>>> Stashed changes
