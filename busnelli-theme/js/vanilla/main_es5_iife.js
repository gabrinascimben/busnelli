/**
 * @license gulp-4-bundler v1.0.0
 * (c) 2023 Luca Zampetti <lzampetti@gmail.com>
 * License: MIT
 */

var main_es5_iife=(function(){'use strict';/**
 * SSR Window 4.0.2
 * Better handling for window object in SSR environment
 * https://github.com/nolimits4web/ssr-window
 *
 * Copyright 2021, Vladimir Kharlampidi
 *
 * Licensed under MIT
 *
 * Released on: December 13, 2021
 */
/* eslint-disable no-param-reassign */
function isObject$1(obj) {
    return (obj !== null &&
        typeof obj === 'object' &&
        'constructor' in obj &&
        obj.constructor === Object);
}
function extend$1(target = {}, src = {}) {
    Object.keys(src).forEach((key) => {
        if (typeof target[key] === 'undefined')
            target[key] = src[key];
        else if (isObject$1(src[key]) &&
            isObject$1(target[key]) &&
            Object.keys(src[key]).length > 0) {
            extend$1(target[key], src[key]);
        }
    });
}

const ssrDocument = {
    body: {},
    addEventListener() { },
    removeEventListener() { },
    activeElement: {
        blur() { },
        nodeName: '',
    },
    querySelector() {
        return null;
    },
    querySelectorAll() {
        return [];
    },
    getElementById() {
        return null;
    },
    createEvent() {
        return {
            initEvent() { },
        };
    },
    createElement() {
        return {
            children: [],
            childNodes: [],
            style: {},
            setAttribute() { },
            getElementsByTagName() {
                return [];
            },
        };
    },
    createElementNS() {
        return {};
    },
    importNode() {
        return null;
    },
    location: {
        hash: '',
        host: '',
        hostname: '',
        href: '',
        origin: '',
        pathname: '',
        protocol: '',
        search: '',
    },
};
function getDocument() {
    const doc = typeof document !== 'undefined' ? document : {};
    extend$1(doc, ssrDocument);
    return doc;
}

const ssrWindow = {
    document: ssrDocument,
    navigator: {
        userAgent: '',
    },
    location: {
        hash: '',
        host: '',
        hostname: '',
        href: '',
        origin: '',
        pathname: '',
        protocol: '',
        search: '',
    },
    history: {
        replaceState() { },
        pushState() { },
        go() { },
        back() { },
    },
    CustomEvent: function CustomEvent() {
        return this;
    },
    addEventListener() { },
    removeEventListener() { },
    getComputedStyle() {
        return {
            getPropertyValue() {
                return '';
            },
        };
    },
    Image() { },
    Date() { },
    screen: {},
    setTimeout() { },
    clearTimeout() { },
    matchMedia() {
        return {};
    },
    requestAnimationFrame(callback) {
        if (typeof setTimeout === 'undefined') {
            callback();
            return null;
        }
        return setTimeout(callback, 0);
    },
    cancelAnimationFrame(id) {
        if (typeof setTimeout === 'undefined') {
            return;
        }
        clearTimeout(id);
    },
};
function getWindow() {
    const win = typeof window !== 'undefined' ? window : {};
    extend$1(win, ssrWindow);
    return win;
}/**
 * Dom7 4.0.6
 * Minimalistic JavaScript library for DOM manipulation, with a jQuery-compatible API
 * https://framework7.io/docs/dom7.html
 *
 * Copyright 2023, Vladimir Kharlampidi
 *
 * Licensed under MIT
 *
 * Released on: February 2, 2023
 */

/* eslint-disable no-proto */
function makeReactive(obj) {
  const proto = obj.__proto__;
  Object.defineProperty(obj, '__proto__', {
    get() {
      return proto;
    },

    set(value) {
      proto.__proto__ = value;
    }

  });
}

class Dom7 extends Array {
  constructor(items) {
    if (typeof items === 'number') {
      super(items);
    } else {
      super(...(items || []));
      makeReactive(this);
    }
  }

}

function arrayFlat(arr = []) {
  const res = [];
  arr.forEach(el => {
    if (Array.isArray(el)) {
      res.push(...arrayFlat(el));
    } else {
      res.push(el);
    }
  });
  return res;
}
function arrayFilter(arr, callback) {
  return Array.prototype.filter.call(arr, callback);
}
function arrayUnique(arr) {
  const uniqueArray = [];

  for (let i = 0; i < arr.length; i += 1) {
    if (uniqueArray.indexOf(arr[i]) === -1) uniqueArray.push(arr[i]);
  }

  return uniqueArray;
}

// eslint-disable-next-line

function qsa(selector, context) {
  if (typeof selector !== 'string') {
    return [selector];
  }

  const a = [];
  const res = context.querySelectorAll(selector);

  for (let i = 0; i < res.length; i += 1) {
    a.push(res[i]);
  }

  return a;
}

function $$1(selector, context) {
  const window = getWindow();
  const document = getDocument();
  let arr = [];

  if (!context && selector instanceof Dom7) {
    return selector;
  }

  if (!selector) {
    return new Dom7(arr);
  }

  if (typeof selector === 'string') {
    const html = selector.trim();

    if (html.indexOf('<') >= 0 && html.indexOf('>') >= 0) {
      let toCreate = 'div';
      if (html.indexOf('<li') === 0) toCreate = 'ul';
      if (html.indexOf('<tr') === 0) toCreate = 'tbody';
      if (html.indexOf('<td') === 0 || html.indexOf('<th') === 0) toCreate = 'tr';
      if (html.indexOf('<tbody') === 0) toCreate = 'table';
      if (html.indexOf('<option') === 0) toCreate = 'select';
      const tempParent = document.createElement(toCreate);
      tempParent.innerHTML = html;

      for (let i = 0; i < tempParent.childNodes.length; i += 1) {
        arr.push(tempParent.childNodes[i]);
      }
    } else {
      arr = qsa(selector.trim(), context || document);
    } // arr = qsa(selector, document);

  } else if (selector.nodeType || selector === window || selector === document) {
    arr.push(selector);
  } else if (Array.isArray(selector)) {
    if (selector instanceof Dom7) return selector;
    arr = selector;
  }

  return new Dom7(arrayUnique(arr));
}

$$1.fn = Dom7.prototype;

// eslint-disable-next-line

function addClass(...classes) {
  const classNames = arrayFlat(classes.map(c => c.split(' ')));
  this.forEach(el => {
    el.classList.add(...classNames);
  });
  return this;
}

function removeClass(...classes) {
  const classNames = arrayFlat(classes.map(c => c.split(' ')));
  this.forEach(el => {
    el.classList.remove(...classNames);
  });
  return this;
}

function toggleClass(...classes) {
  const classNames = arrayFlat(classes.map(c => c.split(' ')));
  this.forEach(el => {
    classNames.forEach(className => {
      el.classList.toggle(className);
    });
  });
}

function hasClass(...classes) {
  const classNames = arrayFlat(classes.map(c => c.split(' ')));
  return arrayFilter(this, el => {
    return classNames.filter(className => el.classList.contains(className)).length > 0;
  }).length > 0;
}

function attr(attrs, value) {
  if (arguments.length === 1 && typeof attrs === 'string') {
    // Get attr
    if (this[0]) return this[0].getAttribute(attrs);
    return undefined;
  } // Set attrs


  for (let i = 0; i < this.length; i += 1) {
    if (arguments.length === 2) {
      // String
      this[i].setAttribute(attrs, value);
    } else {
      // Object
      for (const attrName in attrs) {
        this[i][attrName] = attrs[attrName];
        this[i].setAttribute(attrName, attrs[attrName]);
      }
    }
  }

  return this;
}

function removeAttr(attr) {
  for (let i = 0; i < this.length; i += 1) {
    this[i].removeAttribute(attr);
  }

  return this;
}

function transform(transform) {
  for (let i = 0; i < this.length; i += 1) {
    this[i].style.transform = transform;
  }

  return this;
}

function transition$1(duration) {
  for (let i = 0; i < this.length; i += 1) {
    this[i].style.transitionDuration = typeof duration !== 'string' ? `${duration}ms` : duration;
  }

  return this;
}

function on(...args) {
  let [eventType, targetSelector, listener, capture] = args;

  if (typeof args[1] === 'function') {
    [eventType, listener, capture] = args;
    targetSelector = undefined;
  }

  if (!capture) capture = false;

  function handleLiveEvent(e) {
    const target = e.target;
    if (!target) return;
    const eventData = e.target.dom7EventData || [];

    if (eventData.indexOf(e) < 0) {
      eventData.unshift(e);
    }

    if ($$1(target).is(targetSelector)) listener.apply(target, eventData);else {
      const parents = $$1(target).parents(); // eslint-disable-line

      for (let k = 0; k < parents.length; k += 1) {
        if ($$1(parents[k]).is(targetSelector)) listener.apply(parents[k], eventData);
      }
    }
  }

  function handleEvent(e) {
    const eventData = e && e.target ? e.target.dom7EventData || [] : [];

    if (eventData.indexOf(e) < 0) {
      eventData.unshift(e);
    }

    listener.apply(this, eventData);
  }

  const events = eventType.split(' ');
  let j;

  for (let i = 0; i < this.length; i += 1) {
    const el = this[i];

    if (!targetSelector) {
      for (j = 0; j < events.length; j += 1) {
        const event = events[j];
        if (!el.dom7Listeners) el.dom7Listeners = {};
        if (!el.dom7Listeners[event]) el.dom7Listeners[event] = [];
        el.dom7Listeners[event].push({
          listener,
          proxyListener: handleEvent
        });
        el.addEventListener(event, handleEvent, capture);
      }
    } else {
      // Live events
      for (j = 0; j < events.length; j += 1) {
        const event = events[j];
        if (!el.dom7LiveListeners) el.dom7LiveListeners = {};
        if (!el.dom7LiveListeners[event]) el.dom7LiveListeners[event] = [];
        el.dom7LiveListeners[event].push({
          listener,
          proxyListener: handleLiveEvent
        });
        el.addEventListener(event, handleLiveEvent, capture);
      }
    }
  }

  return this;
}

function off(...args) {
  let [eventType, targetSelector, listener, capture] = args;

  if (typeof args[1] === 'function') {
    [eventType, listener, capture] = args;
    targetSelector = undefined;
  }

  if (!capture) capture = false;
  const events = eventType.split(' ');

  for (let i = 0; i < events.length; i += 1) {
    const event = events[i];

    for (let j = 0; j < this.length; j += 1) {
      const el = this[j];
      let handlers;

      if (!targetSelector && el.dom7Listeners) {
        handlers = el.dom7Listeners[event];
      } else if (targetSelector && el.dom7LiveListeners) {
        handlers = el.dom7LiveListeners[event];
      }

      if (handlers && handlers.length) {
        for (let k = handlers.length - 1; k >= 0; k -= 1) {
          const handler = handlers[k];

          if (listener && handler.listener === listener) {
            el.removeEventListener(event, handler.proxyListener, capture);
            handlers.splice(k, 1);
          } else if (listener && handler.listener && handler.listener.dom7proxy && handler.listener.dom7proxy === listener) {
            el.removeEventListener(event, handler.proxyListener, capture);
            handlers.splice(k, 1);
          } else if (!listener) {
            el.removeEventListener(event, handler.proxyListener, capture);
            handlers.splice(k, 1);
          }
        }
      }
    }
  }

  return this;
}

function trigger(...args) {
  const window = getWindow();
  const events = args[0].split(' ');
  const eventData = args[1];

  for (let i = 0; i < events.length; i += 1) {
    const event = events[i];

    for (let j = 0; j < this.length; j += 1) {
      const el = this[j];

      if (window.CustomEvent) {
        const evt = new window.CustomEvent(event, {
          detail: eventData,
          bubbles: true,
          cancelable: true
        });
        el.dom7EventData = args.filter((data, dataIndex) => dataIndex > 0);
        el.dispatchEvent(evt);
        el.dom7EventData = [];
        delete el.dom7EventData;
      }
    }
  }

  return this;
}

function transitionEnd$1(callback) {
  const dom = this;

  function fireCallBack(e) {
    if (e.target !== this) return;
    callback.call(this, e);
    dom.off('transitionend', fireCallBack);
  }

  if (callback) {
    dom.on('transitionend', fireCallBack);
  }

  return this;
}

function outerWidth(includeMargins) {
  if (this.length > 0) {
    if (includeMargins) {
      const styles = this.styles();
      return this[0].offsetWidth + parseFloat(styles.getPropertyValue('margin-right')) + parseFloat(styles.getPropertyValue('margin-left'));
    }

    return this[0].offsetWidth;
  }

  return null;
}

function outerHeight(includeMargins) {
  if (this.length > 0) {
    if (includeMargins) {
      const styles = this.styles();
      return this[0].offsetHeight + parseFloat(styles.getPropertyValue('margin-top')) + parseFloat(styles.getPropertyValue('margin-bottom'));
    }

    return this[0].offsetHeight;
  }

  return null;
}

function offset() {
  if (this.length > 0) {
    const window = getWindow();
    const document = getDocument();
    const el = this[0];
    const box = el.getBoundingClientRect();
    const body = document.body;
    const clientTop = el.clientTop || body.clientTop || 0;
    const clientLeft = el.clientLeft || body.clientLeft || 0;
    const scrollTop = el === window ? window.scrollY : el.scrollTop;
    const scrollLeft = el === window ? window.scrollX : el.scrollLeft;
    return {
      top: box.top + scrollTop - clientTop,
      left: box.left + scrollLeft - clientLeft
    };
  }

  return null;
}

function styles() {
  const window = getWindow();
  if (this[0]) return window.getComputedStyle(this[0], null);
  return {};
}

function css(props, value) {
  const window = getWindow();
  let i;

  if (arguments.length === 1) {
    if (typeof props === 'string') {
      // .css('width')
      if (this[0]) return window.getComputedStyle(this[0], null).getPropertyValue(props);
    } else {
      // .css({ width: '100px' })
      for (i = 0; i < this.length; i += 1) {
        for (const prop in props) {
          this[i].style[prop] = props[prop];
        }
      }

      return this;
    }
  }

  if (arguments.length === 2 && typeof props === 'string') {
    // .css('width', '100px')
    for (i = 0; i < this.length; i += 1) {
      this[i].style[props] = value;
    }

    return this;
  }

  return this;
}

function each(callback) {
  if (!callback) return this;
  this.forEach((el, index) => {
    callback.apply(el, [el, index]);
  });
  return this;
}

function filter(callback) {
  const result = arrayFilter(this, callback);
  return $$1(result);
}

function html(html) {
  if (typeof html === 'undefined') {
    return this[0] ? this[0].innerHTML : null;
  }

  for (let i = 0; i < this.length; i += 1) {
    this[i].innerHTML = html;
  }

  return this;
}

function text(text) {
  if (typeof text === 'undefined') {
    return this[0] ? this[0].textContent.trim() : null;
  }

  for (let i = 0; i < this.length; i += 1) {
    this[i].textContent = text;
  }

  return this;
}

function is(selector) {
  const window = getWindow();
  const document = getDocument();
  const el = this[0];
  let compareWith;
  let i;
  if (!el || typeof selector === 'undefined') return false;

  if (typeof selector === 'string') {
    if (el.matches) return el.matches(selector);
    if (el.webkitMatchesSelector) return el.webkitMatchesSelector(selector);
    if (el.msMatchesSelector) return el.msMatchesSelector(selector);
    compareWith = $$1(selector);

    for (i = 0; i < compareWith.length; i += 1) {
      if (compareWith[i] === el) return true;
    }

    return false;
  }

  if (selector === document) {
    return el === document;
  }

  if (selector === window) {
    return el === window;
  }

  if (selector.nodeType || selector instanceof Dom7) {
    compareWith = selector.nodeType ? [selector] : selector;

    for (i = 0; i < compareWith.length; i += 1) {
      if (compareWith[i] === el) return true;
    }

    return false;
  }

  return false;
}

function index() {
  let child = this[0];
  let i;

  if (child) {
    i = 0; // eslint-disable-next-line

    while ((child = child.previousSibling) !== null) {
      if (child.nodeType === 1) i += 1;
    }

    return i;
  }

  return undefined;
}

function eq(index) {
  if (typeof index === 'undefined') return this;
  const length = this.length;

  if (index > length - 1) {
    return $$1([]);
  }

  if (index < 0) {
    const returnIndex = length + index;
    if (returnIndex < 0) return $$1([]);
    return $$1([this[returnIndex]]);
  }

  return $$1([this[index]]);
}

function append(...els) {
  let newChild;
  const document = getDocument();

  for (let k = 0; k < els.length; k += 1) {
    newChild = els[k];

    for (let i = 0; i < this.length; i += 1) {
      if (typeof newChild === 'string') {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = newChild;

        while (tempDiv.firstChild) {
          this[i].appendChild(tempDiv.firstChild);
        }
      } else if (newChild instanceof Dom7) {
        for (let j = 0; j < newChild.length; j += 1) {
          this[i].appendChild(newChild[j]);
        }
      } else {
        this[i].appendChild(newChild);
      }
    }
  }

  return this;
}

function prepend(newChild) {
  const document = getDocument();
  let i;
  let j;

  for (i = 0; i < this.length; i += 1) {
    if (typeof newChild === 'string') {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = newChild;

      for (j = tempDiv.childNodes.length - 1; j >= 0; j -= 1) {
        this[i].insertBefore(tempDiv.childNodes[j], this[i].childNodes[0]);
      }
    } else if (newChild instanceof Dom7) {
      for (j = 0; j < newChild.length; j += 1) {
        this[i].insertBefore(newChild[j], this[i].childNodes[0]);
      }
    } else {
      this[i].insertBefore(newChild, this[i].childNodes[0]);
    }
  }

  return this;
}

function next(selector) {
  if (this.length > 0) {
    if (selector) {
      if (this[0].nextElementSibling && $$1(this[0].nextElementSibling).is(selector)) {
        return $$1([this[0].nextElementSibling]);
      }

      return $$1([]);
    }

    if (this[0].nextElementSibling) return $$1([this[0].nextElementSibling]);
    return $$1([]);
  }

  return $$1([]);
}

function nextAll(selector) {
  const nextEls = [];
  let el = this[0];
  if (!el) return $$1([]);

  while (el.nextElementSibling) {
    const next = el.nextElementSibling; // eslint-disable-line

    if (selector) {
      if ($$1(next).is(selector)) nextEls.push(next);
    } else nextEls.push(next);

    el = next;
  }

  return $$1(nextEls);
}

function prev(selector) {
  if (this.length > 0) {
    const el = this[0];

    if (selector) {
      if (el.previousElementSibling && $$1(el.previousElementSibling).is(selector)) {
        return $$1([el.previousElementSibling]);
      }

      return $$1([]);
    }

    if (el.previousElementSibling) return $$1([el.previousElementSibling]);
    return $$1([]);
  }

  return $$1([]);
}

function prevAll(selector) {
  const prevEls = [];
  let el = this[0];
  if (!el) return $$1([]);

  while (el.previousElementSibling) {
    const prev = el.previousElementSibling; // eslint-disable-line

    if (selector) {
      if ($$1(prev).is(selector)) prevEls.push(prev);
    } else prevEls.push(prev);

    el = prev;
  }

  return $$1(prevEls);
}

function parent(selector) {
  const parents = []; // eslint-disable-line

  for (let i = 0; i < this.length; i += 1) {
    if (this[i].parentNode !== null) {
      if (selector) {
        if ($$1(this[i].parentNode).is(selector)) parents.push(this[i].parentNode);
      } else {
        parents.push(this[i].parentNode);
      }
    }
  }

  return $$1(parents);
}

function parents(selector) {
  const parents = []; // eslint-disable-line

  for (let i = 0; i < this.length; i += 1) {
    let parent = this[i].parentNode; // eslint-disable-line

    while (parent) {
      if (selector) {
        if ($$1(parent).is(selector)) parents.push(parent);
      } else {
        parents.push(parent);
      }

      parent = parent.parentNode;
    }
  }

  return $$1(parents);
}

function closest(selector) {
  let closest = this; // eslint-disable-line

  if (typeof selector === 'undefined') {
    return $$1([]);
  }

  if (!closest.is(selector)) {
    closest = closest.parents(selector).eq(0);
  }

  return closest;
}

function find(selector) {
  const foundElements = [];

  for (let i = 0; i < this.length; i += 1) {
    const found = this[i].querySelectorAll(selector);

    for (let j = 0; j < found.length; j += 1) {
      foundElements.push(found[j]);
    }
  }

  return $$1(foundElements);
}

function children(selector) {
  const children = []; // eslint-disable-line

  for (let i = 0; i < this.length; i += 1) {
    const childNodes = this[i].children;

    for (let j = 0; j < childNodes.length; j += 1) {
      if (!selector || $$1(childNodes[j]).is(selector)) {
        children.push(childNodes[j]);
      }
    }
  }

  return $$1(children);
}

function remove() {
  for (let i = 0; i < this.length; i += 1) {
    if (this[i].parentNode) this[i].parentNode.removeChild(this[i]);
  }

  return this;
}const Methods = {
  addClass,
  removeClass,
  hasClass,
  toggleClass,
  attr,
  removeAttr,
  transform,
  transition: transition$1,
  on,
  off,
  trigger,
  transitionEnd: transitionEnd$1,
  outerWidth,
  outerHeight,
  styles,
  offset,
  css,
  each,
  html,
  text,
  is,
  index,
  eq,
  append,
  prepend,
  next,
  nextAll,
  prev,
  prevAll,
  parent,
  parents,
  closest,
  find,
  children,
  filter,
  remove
};
Object.keys(Methods).forEach(methodName => {
  Object.defineProperty($$1.fn, methodName, {
    value: Methods[methodName],
    writable: true
  });
});function deleteProps(obj) {
  const object = obj;
  Object.keys(object).forEach(key => {
    try {
      object[key] = null;
    } catch (e) {// no getter for object
    }

    try {
      delete object[key];
    } catch (e) {// something got wrong
    }
  });
}

function nextTick(callback, delay = 0) {
  return setTimeout(callback, delay);
}

function now() {
  return Date.now();
}

function getComputedStyle$1(el) {
  const window = getWindow();
  let style;

  if (window.getComputedStyle) {
    style = window.getComputedStyle(el, null);
  }

  if (!style && el.currentStyle) {
    style = el.currentStyle;
  }

  if (!style) {
    style = el.style;
  }

  return style;
}

function getTranslate(el, axis = 'x') {
  const window = getWindow();
  let matrix;
  let curTransform;
  let transformMatrix;
  const curStyle = getComputedStyle$1(el);

  if (window.WebKitCSSMatrix) {
    curTransform = curStyle.transform || curStyle.webkitTransform;

    if (curTransform.split(',').length > 6) {
      curTransform = curTransform.split(', ').map(a => a.replace(',', '.')).join(', ');
    } // Some old versions of Webkit choke when 'none' is passed; pass
    // empty string instead in this case


    transformMatrix = new window.WebKitCSSMatrix(curTransform === 'none' ? '' : curTransform);
  } else {
    transformMatrix = curStyle.MozTransform || curStyle.OTransform || curStyle.MsTransform || curStyle.msTransform || curStyle.transform || curStyle.getPropertyValue('transform').replace('translate(', 'matrix(1, 0, 0, 1,');
    matrix = transformMatrix.toString().split(',');
  }

  if (axis === 'x') {
    // Latest Chrome and webkits Fix
    if (window.WebKitCSSMatrix) curTransform = transformMatrix.m41; // Crazy IE10 Matrix
    else if (matrix.length === 16) curTransform = parseFloat(matrix[12]); // Normal Browsers
    else curTransform = parseFloat(matrix[4]);
  }

  if (axis === 'y') {
    // Latest Chrome and webkits Fix
    if (window.WebKitCSSMatrix) curTransform = transformMatrix.m42; // Crazy IE10 Matrix
    else if (matrix.length === 16) curTransform = parseFloat(matrix[13]); // Normal Browsers
    else curTransform = parseFloat(matrix[5]);
  }

  return curTransform || 0;
}

function isObject(o) {
  return typeof o === 'object' && o !== null && o.constructor && Object.prototype.toString.call(o).slice(8, -1) === 'Object';
}

function isNode$1(node) {
  // eslint-disable-next-line
  if (typeof window !== 'undefined' && typeof window.HTMLElement !== 'undefined') {
    return node instanceof HTMLElement;
  }

  return node && (node.nodeType === 1 || node.nodeType === 11);
}

function extend(...args) {
  const to = Object(args[0]);
  const noExtend = ['__proto__', 'constructor', 'prototype'];

  for (let i = 1; i < args.length; i += 1) {
    const nextSource = args[i];

    if (nextSource !== undefined && nextSource !== null && !isNode$1(nextSource)) {
      const keysArray = Object.keys(Object(nextSource)).filter(key => noExtend.indexOf(key) < 0);

      for (let nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex += 1) {
        const nextKey = keysArray[nextIndex];
        const desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);

        if (desc !== undefined && desc.enumerable) {
          if (isObject(to[nextKey]) && isObject(nextSource[nextKey])) {
            if (nextSource[nextKey].__swiper__) {
              to[nextKey] = nextSource[nextKey];
            } else {
              extend(to[nextKey], nextSource[nextKey]);
            }
          } else if (!isObject(to[nextKey]) && isObject(nextSource[nextKey])) {
            to[nextKey] = {};

            if (nextSource[nextKey].__swiper__) {
              to[nextKey] = nextSource[nextKey];
            } else {
              extend(to[nextKey], nextSource[nextKey]);
            }
          } else {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
    }
  }

  return to;
}

function setCSSProperty(el, varName, varValue) {
  el.style.setProperty(varName, varValue);
}

function animateCSSModeScroll({
  swiper,
  targetPosition,
  side
}) {
  const window = getWindow();
  const startPosition = -swiper.translate;
  let startTime = null;
  let time;
  const duration = swiper.params.speed;
  swiper.wrapperEl.style.scrollSnapType = 'none';
  window.cancelAnimationFrame(swiper.cssModeFrameID);
  const dir = targetPosition > startPosition ? 'next' : 'prev';

  const isOutOfBound = (current, target) => {
    return dir === 'next' && current >= target || dir === 'prev' && current <= target;
  };

  const animate = () => {
    time = new Date().getTime();

    if (startTime === null) {
      startTime = time;
    }

    const progress = Math.max(Math.min((time - startTime) / duration, 1), 0);
    const easeProgress = 0.5 - Math.cos(progress * Math.PI) / 2;
    let currentPosition = startPosition + easeProgress * (targetPosition - startPosition);

    if (isOutOfBound(currentPosition, targetPosition)) {
      currentPosition = targetPosition;
    }

    swiper.wrapperEl.scrollTo({
      [side]: currentPosition
    });

    if (isOutOfBound(currentPosition, targetPosition)) {
      swiper.wrapperEl.style.overflow = 'hidden';
      swiper.wrapperEl.style.scrollSnapType = '';
      setTimeout(() => {
        swiper.wrapperEl.style.overflow = '';
        swiper.wrapperEl.scrollTo({
          [side]: currentPosition
        });
      });
      window.cancelAnimationFrame(swiper.cssModeFrameID);
      return;
    }

    swiper.cssModeFrameID = window.requestAnimationFrame(animate);
  };

  animate();
}let support;

function calcSupport() {
  const window = getWindow();
  const document = getDocument();
  return {
    smoothScroll: document.documentElement && 'scrollBehavior' in document.documentElement.style,
    touch: !!('ontouchstart' in window || window.DocumentTouch && document instanceof window.DocumentTouch),
    passiveListener: function checkPassiveListener() {
      let supportsPassive = false;

      try {
        const opts = Object.defineProperty({}, 'passive', {
          // eslint-disable-next-line
          get() {
            supportsPassive = true;
          }

        });
        window.addEventListener('testPassiveListener', null, opts);
      } catch (e) {// No support
      }

      return supportsPassive;
    }(),
    gestures: function checkGestures() {
      return 'ongesturestart' in window;
    }()
  };
}

function getSupport() {
  if (!support) {
    support = calcSupport();
  }

  return support;
}let deviceCached;

function calcDevice({
  userAgent
} = {}) {
  const support = getSupport();
  const window = getWindow();
  const platform = window.navigator.platform;
  const ua = userAgent || window.navigator.userAgent;
  const device = {
    ios: false,
    android: false
  };
  const screenWidth = window.screen.width;
  const screenHeight = window.screen.height;
  const android = ua.match(/(Android);?[\s\/]+([\d.]+)?/); // eslint-disable-line

  let ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
  const ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
  const iphone = !ipad && ua.match(/(iPhone\sOS|iOS)\s([\d_]+)/);
  const windows = platform === 'Win32';
  let macos = platform === 'MacIntel'; // iPadOs 13 fix

  const iPadScreens = ['1024x1366', '1366x1024', '834x1194', '1194x834', '834x1112', '1112x834', '768x1024', '1024x768', '820x1180', '1180x820', '810x1080', '1080x810'];

  if (!ipad && macos && support.touch && iPadScreens.indexOf(`${screenWidth}x${screenHeight}`) >= 0) {
    ipad = ua.match(/(Version)\/([\d.]+)/);
    if (!ipad) ipad = [0, 1, '13_0_0'];
    macos = false;
  } // Android


  if (android && !windows) {
    device.os = 'android';
    device.android = true;
  }

  if (ipad || iphone || ipod) {
    device.os = 'ios';
    device.ios = true;
  } // Export object


  return device;
}

function getDevice(overrides = {}) {
  if (!deviceCached) {
    deviceCached = calcDevice(overrides);
  }

  return deviceCached;
}let browser;

function calcBrowser() {
  const window = getWindow();

  function isSafari() {
    const ua = window.navigator.userAgent.toLowerCase();
    return ua.indexOf('safari') >= 0 && ua.indexOf('chrome') < 0 && ua.indexOf('android') < 0;
  }

  return {
    isSafari: isSafari(),
    isWebView: /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(window.navigator.userAgent)
  };
}

function getBrowser() {
  if (!browser) {
    browser = calcBrowser();
  }

  return browser;
}function Resize({
  swiper,
  on,
  emit
}) {
  const window = getWindow();
  let observer = null;
  let animationFrame = null;

  const resizeHandler = () => {
    if (!swiper || swiper.destroyed || !swiper.initialized) return;
    emit('beforeResize');
    emit('resize');
  };

  const createObserver = () => {
    if (!swiper || swiper.destroyed || !swiper.initialized) return;
    observer = new ResizeObserver(entries => {
      animationFrame = window.requestAnimationFrame(() => {
        const {
          width,
          height
        } = swiper;
        let newWidth = width;
        let newHeight = height;
        entries.forEach(({
          contentBoxSize,
          contentRect,
          target
        }) => {
          if (target && target !== swiper.el) return;
          newWidth = contentRect ? contentRect.width : (contentBoxSize[0] || contentBoxSize).inlineSize;
          newHeight = contentRect ? contentRect.height : (contentBoxSize[0] || contentBoxSize).blockSize;
        });

        if (newWidth !== width || newHeight !== height) {
          resizeHandler();
        }
      });
    });
    observer.observe(swiper.el);
  };

  const removeObserver = () => {
    if (animationFrame) {
      window.cancelAnimationFrame(animationFrame);
    }

    if (observer && observer.unobserve && swiper.el) {
      observer.unobserve(swiper.el);
      observer = null;
    }
  };

  const orientationChangeHandler = () => {
    if (!swiper || swiper.destroyed || !swiper.initialized) return;
    emit('orientationchange');
  };

  on('init', () => {
    if (swiper.params.resizeObserver && typeof window.ResizeObserver !== 'undefined') {
      createObserver();
      return;
    }

    window.addEventListener('resize', resizeHandler);
    window.addEventListener('orientationchange', orientationChangeHandler);
  });
  on('destroy', () => {
    removeObserver();
    window.removeEventListener('resize', resizeHandler);
    window.removeEventListener('orientationchange', orientationChangeHandler);
  });
}function Observer$1({
  swiper,
  extendParams,
  on,
  emit
}) {
  const observers = [];
  const window = getWindow();

  const attach = (target, options = {}) => {
    const ObserverFunc = window.MutationObserver || window.WebkitMutationObserver;
    const observer = new ObserverFunc(mutations => {
      // The observerUpdate event should only be triggered
      // once despite the number of mutations.  Additional
      // triggers are redundant and are very costly
      if (mutations.length === 1) {
        emit('observerUpdate', mutations[0]);
        return;
      }

      const observerUpdate = function observerUpdate() {
        emit('observerUpdate', mutations[0]);
      };

      if (window.requestAnimationFrame) {
        window.requestAnimationFrame(observerUpdate);
      } else {
        window.setTimeout(observerUpdate, 0);
      }
    });
    observer.observe(target, {
      attributes: typeof options.attributes === 'undefined' ? true : options.attributes,
      childList: typeof options.childList === 'undefined' ? true : options.childList,
      characterData: typeof options.characterData === 'undefined' ? true : options.characterData
    });
    observers.push(observer);
  };

  const init = () => {
    if (!swiper.params.observer) return;

    if (swiper.params.observeParents) {
      const containerParents = swiper.$el.parents();

      for (let i = 0; i < containerParents.length; i += 1) {
        attach(containerParents[i]);
      }
    } // Observe container


    attach(swiper.$el[0], {
      childList: swiper.params.observeSlideChildren
    }); // Observe wrapper

    attach(swiper.$wrapperEl[0], {
      attributes: false
    });
  };

  const destroy = () => {
    observers.forEach(observer => {
      observer.disconnect();
    });
    observers.splice(0, observers.length);
  };

  extendParams({
    observer: false,
    observeParents: false,
    observeSlideChildren: false
  });
  on('init', init);
  on('destroy', destroy);
}/* eslint-disable no-underscore-dangle */
var eventsEmitter = {
  on(events, handler, priority) {
    const self = this;
    if (!self.eventsListeners || self.destroyed) return self;
    if (typeof handler !== 'function') return self;
    const method = priority ? 'unshift' : 'push';
    events.split(' ').forEach(event => {
      if (!self.eventsListeners[event]) self.eventsListeners[event] = [];
      self.eventsListeners[event][method](handler);
    });
    return self;
  },

  once(events, handler, priority) {
    const self = this;
    if (!self.eventsListeners || self.destroyed) return self;
    if (typeof handler !== 'function') return self;

    function onceHandler(...args) {
      self.off(events, onceHandler);

      if (onceHandler.__emitterProxy) {
        delete onceHandler.__emitterProxy;
      }

      handler.apply(self, args);
    }

    onceHandler.__emitterProxy = handler;
    return self.on(events, onceHandler, priority);
  },

  onAny(handler, priority) {
    const self = this;
    if (!self.eventsListeners || self.destroyed) return self;
    if (typeof handler !== 'function') return self;
    const method = priority ? 'unshift' : 'push';

    if (self.eventsAnyListeners.indexOf(handler) < 0) {
      self.eventsAnyListeners[method](handler);
    }

    return self;
  },

  offAny(handler) {
    const self = this;
    if (!self.eventsListeners || self.destroyed) return self;
    if (!self.eventsAnyListeners) return self;
    const index = self.eventsAnyListeners.indexOf(handler);

    if (index >= 0) {
      self.eventsAnyListeners.splice(index, 1);
    }

    return self;
  },

  off(events, handler) {
    const self = this;
    if (!self.eventsListeners || self.destroyed) return self;
    if (!self.eventsListeners) return self;
    events.split(' ').forEach(event => {
      if (typeof handler === 'undefined') {
        self.eventsListeners[event] = [];
      } else if (self.eventsListeners[event]) {
        self.eventsListeners[event].forEach((eventHandler, index) => {
          if (eventHandler === handler || eventHandler.__emitterProxy && eventHandler.__emitterProxy === handler) {
            self.eventsListeners[event].splice(index, 1);
          }
        });
      }
    });
    return self;
  },

  emit(...args) {
    const self = this;
    if (!self.eventsListeners || self.destroyed) return self;
    if (!self.eventsListeners) return self;
    let events;
    let data;
    let context;

    if (typeof args[0] === 'string' || Array.isArray(args[0])) {
      events = args[0];
      data = args.slice(1, args.length);
      context = self;
    } else {
      events = args[0].events;
      data = args[0].data;
      context = args[0].context || self;
    }

    data.unshift(context);
    const eventsArray = Array.isArray(events) ? events : events.split(' ');
    eventsArray.forEach(event => {
      if (self.eventsAnyListeners && self.eventsAnyListeners.length) {
        self.eventsAnyListeners.forEach(eventHandler => {
          eventHandler.apply(context, [event, ...data]);
        });
      }

      if (self.eventsListeners && self.eventsListeners[event]) {
        self.eventsListeners[event].forEach(eventHandler => {
          eventHandler.apply(context, data);
        });
      }
    });
    return self;
  }

};function updateSize() {
  const swiper = this;
  let width;
  let height;
  const $el = swiper.$el;

  if (typeof swiper.params.width !== 'undefined' && swiper.params.width !== null) {
    width = swiper.params.width;
  } else {
    width = $el[0].clientWidth;
  }

  if (typeof swiper.params.height !== 'undefined' && swiper.params.height !== null) {
    height = swiper.params.height;
  } else {
    height = $el[0].clientHeight;
  }

  if (width === 0 && swiper.isHorizontal() || height === 0 && swiper.isVertical()) {
    return;
  } // Subtract paddings


  width = width - parseInt($el.css('padding-left') || 0, 10) - parseInt($el.css('padding-right') || 0, 10);
  height = height - parseInt($el.css('padding-top') || 0, 10) - parseInt($el.css('padding-bottom') || 0, 10);
  if (Number.isNaN(width)) width = 0;
  if (Number.isNaN(height)) height = 0;
  Object.assign(swiper, {
    width,
    height,
    size: swiper.isHorizontal() ? width : height
  });
}function updateSlides() {
  const swiper = this;

  function getDirectionLabel(property) {
    if (swiper.isHorizontal()) {
      return property;
    } // prettier-ignore


    return {
      'width': 'height',
      'margin-top': 'margin-left',
      'margin-bottom ': 'margin-right',
      'margin-left': 'margin-top',
      'margin-right': 'margin-bottom',
      'padding-left': 'padding-top',
      'padding-right': 'padding-bottom',
      'marginRight': 'marginBottom'
    }[property];
  }

  function getDirectionPropertyValue(node, label) {
    return parseFloat(node.getPropertyValue(getDirectionLabel(label)) || 0);
  }

  const params = swiper.params;
  const {
    $wrapperEl,
    size: swiperSize,
    rtlTranslate: rtl,
    wrongRTL
  } = swiper;
  const isVirtual = swiper.virtual && params.virtual.enabled;
  const previousSlidesLength = isVirtual ? swiper.virtual.slides.length : swiper.slides.length;
  const slides = $wrapperEl.children(`.${swiper.params.slideClass}`);
  const slidesLength = isVirtual ? swiper.virtual.slides.length : slides.length;
  let snapGrid = [];
  const slidesGrid = [];
  const slidesSizesGrid = [];
  let offsetBefore = params.slidesOffsetBefore;

  if (typeof offsetBefore === 'function') {
    offsetBefore = params.slidesOffsetBefore.call(swiper);
  }

  let offsetAfter = params.slidesOffsetAfter;

  if (typeof offsetAfter === 'function') {
    offsetAfter = params.slidesOffsetAfter.call(swiper);
  }

  const previousSnapGridLength = swiper.snapGrid.length;
  const previousSlidesGridLength = swiper.slidesGrid.length;
  let spaceBetween = params.spaceBetween;
  let slidePosition = -offsetBefore;
  let prevSlideSize = 0;
  let index = 0;

  if (typeof swiperSize === 'undefined') {
    return;
  }

  if (typeof spaceBetween === 'string' && spaceBetween.indexOf('%') >= 0) {
    spaceBetween = parseFloat(spaceBetween.replace('%', '')) / 100 * swiperSize;
  }

  swiper.virtualSize = -spaceBetween; // reset margins

  if (rtl) slides.css({
    marginLeft: '',
    marginBottom: '',
    marginTop: ''
  });else slides.css({
    marginRight: '',
    marginBottom: '',
    marginTop: ''
  }); // reset cssMode offsets

  if (params.centeredSlides && params.cssMode) {
    setCSSProperty(swiper.wrapperEl, '--swiper-centered-offset-before', '');
    setCSSProperty(swiper.wrapperEl, '--swiper-centered-offset-after', '');
  }

  const gridEnabled = params.grid && params.grid.rows > 1 && swiper.grid;

  if (gridEnabled) {
    swiper.grid.initSlides(slidesLength);
  } // Calc slides


  let slideSize;
  const shouldResetSlideSize = params.slidesPerView === 'auto' && params.breakpoints && Object.keys(params.breakpoints).filter(key => {
    return typeof params.breakpoints[key].slidesPerView !== 'undefined';
  }).length > 0;

  for (let i = 0; i < slidesLength; i += 1) {
    slideSize = 0;
    const slide = slides.eq(i);

    if (gridEnabled) {
      swiper.grid.updateSlide(i, slide, slidesLength, getDirectionLabel);
    }

    if (slide.css('display') === 'none') continue; // eslint-disable-line

    if (params.slidesPerView === 'auto') {
      if (shouldResetSlideSize) {
        slides[i].style[getDirectionLabel('width')] = ``;
      }

      const slideStyles = getComputedStyle(slide[0]);
      const currentTransform = slide[0].style.transform;
      const currentWebKitTransform = slide[0].style.webkitTransform;

      if (currentTransform) {
        slide[0].style.transform = 'none';
      }

      if (currentWebKitTransform) {
        slide[0].style.webkitTransform = 'none';
      }

      if (params.roundLengths) {
        slideSize = swiper.isHorizontal() ? slide.outerWidth(true) : slide.outerHeight(true);
      } else {
        // eslint-disable-next-line
        const width = getDirectionPropertyValue(slideStyles, 'width');
        const paddingLeft = getDirectionPropertyValue(slideStyles, 'padding-left');
        const paddingRight = getDirectionPropertyValue(slideStyles, 'padding-right');
        const marginLeft = getDirectionPropertyValue(slideStyles, 'margin-left');
        const marginRight = getDirectionPropertyValue(slideStyles, 'margin-right');
        const boxSizing = slideStyles.getPropertyValue('box-sizing');

        if (boxSizing && boxSizing === 'border-box') {
          slideSize = width + marginLeft + marginRight;
        } else {
          const {
            clientWidth,
            offsetWidth
          } = slide[0];
          slideSize = width + paddingLeft + paddingRight + marginLeft + marginRight + (offsetWidth - clientWidth);
        }
      }

      if (currentTransform) {
        slide[0].style.transform = currentTransform;
      }

      if (currentWebKitTransform) {
        slide[0].style.webkitTransform = currentWebKitTransform;
      }

      if (params.roundLengths) slideSize = Math.floor(slideSize);
    } else {
      slideSize = (swiperSize - (params.slidesPerView - 1) * spaceBetween) / params.slidesPerView;
      if (params.roundLengths) slideSize = Math.floor(slideSize);

      if (slides[i]) {
        slides[i].style[getDirectionLabel('width')] = `${slideSize}px`;
      }
    }

    if (slides[i]) {
      slides[i].swiperSlideSize = slideSize;
    }

    slidesSizesGrid.push(slideSize);

    if (params.centeredSlides) {
      slidePosition = slidePosition + slideSize / 2 + prevSlideSize / 2 + spaceBetween;
      if (prevSlideSize === 0 && i !== 0) slidePosition = slidePosition - swiperSize / 2 - spaceBetween;
      if (i === 0) slidePosition = slidePosition - swiperSize / 2 - spaceBetween;
      if (Math.abs(slidePosition) < 1 / 1000) slidePosition = 0;
      if (params.roundLengths) slidePosition = Math.floor(slidePosition);
      if (index % params.slidesPerGroup === 0) snapGrid.push(slidePosition);
      slidesGrid.push(slidePosition);
    } else {
      if (params.roundLengths) slidePosition = Math.floor(slidePosition);
      if ((index - Math.min(swiper.params.slidesPerGroupSkip, index)) % swiper.params.slidesPerGroup === 0) snapGrid.push(slidePosition);
      slidesGrid.push(slidePosition);
      slidePosition = slidePosition + slideSize + spaceBetween;
    }

    swiper.virtualSize += slideSize + spaceBetween;
    prevSlideSize = slideSize;
    index += 1;
  }

  swiper.virtualSize = Math.max(swiper.virtualSize, swiperSize) + offsetAfter;

  if (rtl && wrongRTL && (params.effect === 'slide' || params.effect === 'coverflow')) {
    $wrapperEl.css({
      width: `${swiper.virtualSize + params.spaceBetween}px`
    });
  }

  if (params.setWrapperSize) {
    $wrapperEl.css({
      [getDirectionLabel('width')]: `${swiper.virtualSize + params.spaceBetween}px`
    });
  }

  if (gridEnabled) {
    swiper.grid.updateWrapperSize(slideSize, snapGrid, getDirectionLabel);
  } // Remove last grid elements depending on width


  if (!params.centeredSlides) {
    const newSlidesGrid = [];

    for (let i = 0; i < snapGrid.length; i += 1) {
      let slidesGridItem = snapGrid[i];
      if (params.roundLengths) slidesGridItem = Math.floor(slidesGridItem);

      if (snapGrid[i] <= swiper.virtualSize - swiperSize) {
        newSlidesGrid.push(slidesGridItem);
      }
    }

    snapGrid = newSlidesGrid;

    if (Math.floor(swiper.virtualSize - swiperSize) - Math.floor(snapGrid[snapGrid.length - 1]) > 1) {
      snapGrid.push(swiper.virtualSize - swiperSize);
    }
  }

  if (snapGrid.length === 0) snapGrid = [0];

  if (params.spaceBetween !== 0) {
    const key = swiper.isHorizontal() && rtl ? 'marginLeft' : getDirectionLabel('marginRight');
    slides.filter((_, slideIndex) => {
      if (!params.cssMode) return true;

      if (slideIndex === slides.length - 1) {
        return false;
      }

      return true;
    }).css({
      [key]: `${spaceBetween}px`
    });
  }

  if (params.centeredSlides && params.centeredSlidesBounds) {
    let allSlidesSize = 0;
    slidesSizesGrid.forEach(slideSizeValue => {
      allSlidesSize += slideSizeValue + (params.spaceBetween ? params.spaceBetween : 0);
    });
    allSlidesSize -= params.spaceBetween;
    const maxSnap = allSlidesSize - swiperSize;
    snapGrid = snapGrid.map(snap => {
      if (snap < 0) return -offsetBefore;
      if (snap > maxSnap) return maxSnap + offsetAfter;
      return snap;
    });
  }

  if (params.centerInsufficientSlides) {
    let allSlidesSize = 0;
    slidesSizesGrid.forEach(slideSizeValue => {
      allSlidesSize += slideSizeValue + (params.spaceBetween ? params.spaceBetween : 0);
    });
    allSlidesSize -= params.spaceBetween;

    if (allSlidesSize < swiperSize) {
      const allSlidesOffset = (swiperSize - allSlidesSize) / 2;
      snapGrid.forEach((snap, snapIndex) => {
        snapGrid[snapIndex] = snap - allSlidesOffset;
      });
      slidesGrid.forEach((snap, snapIndex) => {
        slidesGrid[snapIndex] = snap + allSlidesOffset;
      });
    }
  }

  Object.assign(swiper, {
    slides,
    snapGrid,
    slidesGrid,
    slidesSizesGrid
  });

  if (params.centeredSlides && params.cssMode && !params.centeredSlidesBounds) {
    setCSSProperty(swiper.wrapperEl, '--swiper-centered-offset-before', `${-snapGrid[0]}px`);
    setCSSProperty(swiper.wrapperEl, '--swiper-centered-offset-after', `${swiper.size / 2 - slidesSizesGrid[slidesSizesGrid.length - 1] / 2}px`);
    const addToSnapGrid = -swiper.snapGrid[0];
    const addToSlidesGrid = -swiper.slidesGrid[0];
    swiper.snapGrid = swiper.snapGrid.map(v => v + addToSnapGrid);
    swiper.slidesGrid = swiper.slidesGrid.map(v => v + addToSlidesGrid);
  }

  if (slidesLength !== previousSlidesLength) {
    swiper.emit('slidesLengthChange');
  }

  if (snapGrid.length !== previousSnapGridLength) {
    if (swiper.params.watchOverflow) swiper.checkOverflow();
    swiper.emit('snapGridLengthChange');
  }

  if (slidesGrid.length !== previousSlidesGridLength) {
    swiper.emit('slidesGridLengthChange');
  }

  if (params.watchSlidesProgress) {
    swiper.updateSlidesOffset();
  }

  if (!isVirtual && !params.cssMode && (params.effect === 'slide' || params.effect === 'fade')) {
    const backFaceHiddenClass = `${params.containerModifierClass}backface-hidden`;
    const hasClassBackfaceClassAdded = swiper.$el.hasClass(backFaceHiddenClass);

    if (slidesLength <= params.maxBackfaceHiddenSlides) {
      if (!hasClassBackfaceClassAdded) swiper.$el.addClass(backFaceHiddenClass);
    } else if (hasClassBackfaceClassAdded) {
      swiper.$el.removeClass(backFaceHiddenClass);
    }
  }
}function updateAutoHeight(speed) {
  const swiper = this;
  const activeSlides = [];
  const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
  let newHeight = 0;
  let i;

  if (typeof speed === 'number') {
    swiper.setTransition(speed);
  } else if (speed === true) {
    swiper.setTransition(swiper.params.speed);
  }

  const getSlideByIndex = index => {
    if (isVirtual) {
      return swiper.slides.filter(el => parseInt(el.getAttribute('data-swiper-slide-index'), 10) === index)[0];
    }

    return swiper.slides.eq(index)[0];
  }; // Find slides currently in view


  if (swiper.params.slidesPerView !== 'auto' && swiper.params.slidesPerView > 1) {
    if (swiper.params.centeredSlides) {
      (swiper.visibleSlides || $$1([])).each(slide => {
        activeSlides.push(slide);
      });
    } else {
      for (i = 0; i < Math.ceil(swiper.params.slidesPerView); i += 1) {
        const index = swiper.activeIndex + i;
        if (index > swiper.slides.length && !isVirtual) break;
        activeSlides.push(getSlideByIndex(index));
      }
    }
  } else {
    activeSlides.push(getSlideByIndex(swiper.activeIndex));
  } // Find new height from highest slide in view


  for (i = 0; i < activeSlides.length; i += 1) {
    if (typeof activeSlides[i] !== 'undefined') {
      const height = activeSlides[i].offsetHeight;
      newHeight = height > newHeight ? height : newHeight;
    }
  } // Update Height


  if (newHeight || newHeight === 0) swiper.$wrapperEl.css('height', `${newHeight}px`);
}function updateSlidesOffset() {
  const swiper = this;
  const slides = swiper.slides;

  for (let i = 0; i < slides.length; i += 1) {
    slides[i].swiperSlideOffset = swiper.isHorizontal() ? slides[i].offsetLeft : slides[i].offsetTop;
  }
}function updateSlidesProgress(translate = this && this.translate || 0) {
  const swiper = this;
  const params = swiper.params;
  const {
    slides,
    rtlTranslate: rtl,
    snapGrid
  } = swiper;
  if (slides.length === 0) return;
  if (typeof slides[0].swiperSlideOffset === 'undefined') swiper.updateSlidesOffset();
  let offsetCenter = -translate;
  if (rtl) offsetCenter = translate; // Visible Slides

  slides.removeClass(params.slideVisibleClass);
  swiper.visibleSlidesIndexes = [];
  swiper.visibleSlides = [];

  for (let i = 0; i < slides.length; i += 1) {
    const slide = slides[i];
    let slideOffset = slide.swiperSlideOffset;

    if (params.cssMode && params.centeredSlides) {
      slideOffset -= slides[0].swiperSlideOffset;
    }

    const slideProgress = (offsetCenter + (params.centeredSlides ? swiper.minTranslate() : 0) - slideOffset) / (slide.swiperSlideSize + params.spaceBetween);
    const originalSlideProgress = (offsetCenter - snapGrid[0] + (params.centeredSlides ? swiper.minTranslate() : 0) - slideOffset) / (slide.swiperSlideSize + params.spaceBetween);
    const slideBefore = -(offsetCenter - slideOffset);
    const slideAfter = slideBefore + swiper.slidesSizesGrid[i];
    const isVisible = slideBefore >= 0 && slideBefore < swiper.size - 1 || slideAfter > 1 && slideAfter <= swiper.size || slideBefore <= 0 && slideAfter >= swiper.size;

    if (isVisible) {
      swiper.visibleSlides.push(slide);
      swiper.visibleSlidesIndexes.push(i);
      slides.eq(i).addClass(params.slideVisibleClass);
    }

    slide.progress = rtl ? -slideProgress : slideProgress;
    slide.originalProgress = rtl ? -originalSlideProgress : originalSlideProgress;
  }

  swiper.visibleSlides = $$1(swiper.visibleSlides);
}function updateProgress(translate) {
  const swiper = this;

  if (typeof translate === 'undefined') {
    const multiplier = swiper.rtlTranslate ? -1 : 1; // eslint-disable-next-line

    translate = swiper && swiper.translate && swiper.translate * multiplier || 0;
  }

  const params = swiper.params;
  const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
  let {
    progress,
    isBeginning,
    isEnd
  } = swiper;
  const wasBeginning = isBeginning;
  const wasEnd = isEnd;

  if (translatesDiff === 0) {
    progress = 0;
    isBeginning = true;
    isEnd = true;
  } else {
    progress = (translate - swiper.minTranslate()) / translatesDiff;
    isBeginning = progress <= 0;
    isEnd = progress >= 1;
  }

  Object.assign(swiper, {
    progress,
    isBeginning,
    isEnd
  });
  if (params.watchSlidesProgress || params.centeredSlides && params.autoHeight) swiper.updateSlidesProgress(translate);

  if (isBeginning && !wasBeginning) {
    swiper.emit('reachBeginning toEdge');
  }

  if (isEnd && !wasEnd) {
    swiper.emit('reachEnd toEdge');
  }

  if (wasBeginning && !isBeginning || wasEnd && !isEnd) {
    swiper.emit('fromEdge');
  }

  swiper.emit('progress', progress);
}function updateSlidesClasses() {
  const swiper = this;
  const {
    slides,
    params,
    $wrapperEl,
    activeIndex,
    realIndex
  } = swiper;
  const isVirtual = swiper.virtual && params.virtual.enabled;
  slides.removeClass(`${params.slideActiveClass} ${params.slideNextClass} ${params.slidePrevClass} ${params.slideDuplicateActiveClass} ${params.slideDuplicateNextClass} ${params.slideDuplicatePrevClass}`);
  let activeSlide;

  if (isVirtual) {
    activeSlide = swiper.$wrapperEl.find(`.${params.slideClass}[data-swiper-slide-index="${activeIndex}"]`);
  } else {
    activeSlide = slides.eq(activeIndex);
  } // Active classes


  activeSlide.addClass(params.slideActiveClass);

  if (params.loop) {
    // Duplicate to all looped slides
    if (activeSlide.hasClass(params.slideDuplicateClass)) {
      $wrapperEl.children(`.${params.slideClass}:not(.${params.slideDuplicateClass})[data-swiper-slide-index="${realIndex}"]`).addClass(params.slideDuplicateActiveClass);
    } else {
      $wrapperEl.children(`.${params.slideClass}.${params.slideDuplicateClass}[data-swiper-slide-index="${realIndex}"]`).addClass(params.slideDuplicateActiveClass);
    }
  } // Next Slide


  let nextSlide = activeSlide.nextAll(`.${params.slideClass}`).eq(0).addClass(params.slideNextClass);

  if (params.loop && nextSlide.length === 0) {
    nextSlide = slides.eq(0);
    nextSlide.addClass(params.slideNextClass);
  } // Prev Slide


  let prevSlide = activeSlide.prevAll(`.${params.slideClass}`).eq(0).addClass(params.slidePrevClass);

  if (params.loop && prevSlide.length === 0) {
    prevSlide = slides.eq(-1);
    prevSlide.addClass(params.slidePrevClass);
  }

  if (params.loop) {
    // Duplicate to all looped slides
    if (nextSlide.hasClass(params.slideDuplicateClass)) {
      $wrapperEl.children(`.${params.slideClass}:not(.${params.slideDuplicateClass})[data-swiper-slide-index="${nextSlide.attr('data-swiper-slide-index')}"]`).addClass(params.slideDuplicateNextClass);
    } else {
      $wrapperEl.children(`.${params.slideClass}.${params.slideDuplicateClass}[data-swiper-slide-index="${nextSlide.attr('data-swiper-slide-index')}"]`).addClass(params.slideDuplicateNextClass);
    }

    if (prevSlide.hasClass(params.slideDuplicateClass)) {
      $wrapperEl.children(`.${params.slideClass}:not(.${params.slideDuplicateClass})[data-swiper-slide-index="${prevSlide.attr('data-swiper-slide-index')}"]`).addClass(params.slideDuplicatePrevClass);
    } else {
      $wrapperEl.children(`.${params.slideClass}.${params.slideDuplicateClass}[data-swiper-slide-index="${prevSlide.attr('data-swiper-slide-index')}"]`).addClass(params.slideDuplicatePrevClass);
    }
  }

  swiper.emitSlidesClasses();
}function updateActiveIndex(newActiveIndex) {
  const swiper = this;
  const translate = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
  const {
    slidesGrid,
    snapGrid,
    params,
    activeIndex: previousIndex,
    realIndex: previousRealIndex,
    snapIndex: previousSnapIndex
  } = swiper;
  let activeIndex = newActiveIndex;
  let snapIndex;

  if (typeof activeIndex === 'undefined') {
    for (let i = 0; i < slidesGrid.length; i += 1) {
      if (typeof slidesGrid[i + 1] !== 'undefined') {
        if (translate >= slidesGrid[i] && translate < slidesGrid[i + 1] - (slidesGrid[i + 1] - slidesGrid[i]) / 2) {
          activeIndex = i;
        } else if (translate >= slidesGrid[i] && translate < slidesGrid[i + 1]) {
          activeIndex = i + 1;
        }
      } else if (translate >= slidesGrid[i]) {
        activeIndex = i;
      }
    } // Normalize slideIndex


    if (params.normalizeSlideIndex) {
      if (activeIndex < 0 || typeof activeIndex === 'undefined') activeIndex = 0;
    }
  }

  if (snapGrid.indexOf(translate) >= 0) {
    snapIndex = snapGrid.indexOf(translate);
  } else {
    const skip = Math.min(params.slidesPerGroupSkip, activeIndex);
    snapIndex = skip + Math.floor((activeIndex - skip) / params.slidesPerGroup);
  }

  if (snapIndex >= snapGrid.length) snapIndex = snapGrid.length - 1;

  if (activeIndex === previousIndex) {
    if (snapIndex !== previousSnapIndex) {
      swiper.snapIndex = snapIndex;
      swiper.emit('snapIndexChange');
    }

    return;
  } // Get real index


  const realIndex = parseInt(swiper.slides.eq(activeIndex).attr('data-swiper-slide-index') || activeIndex, 10);
  Object.assign(swiper, {
    snapIndex,
    realIndex,
    previousIndex,
    activeIndex
  });
  swiper.emit('activeIndexChange');
  swiper.emit('snapIndexChange');

  if (previousRealIndex !== realIndex) {
    swiper.emit('realIndexChange');
  }

  if (swiper.initialized || swiper.params.runCallbacksOnInit) {
    swiper.emit('slideChange');
  }
}function updateClickedSlide(e) {
  const swiper = this;
  const params = swiper.params;
  const slide = $$1(e).closest(`.${params.slideClass}`)[0];
  let slideFound = false;
  let slideIndex;

  if (slide) {
    for (let i = 0; i < swiper.slides.length; i += 1) {
      if (swiper.slides[i] === slide) {
        slideFound = true;
        slideIndex = i;
        break;
      }
    }
  }

  if (slide && slideFound) {
    swiper.clickedSlide = slide;

    if (swiper.virtual && swiper.params.virtual.enabled) {
      swiper.clickedIndex = parseInt($$1(slide).attr('data-swiper-slide-index'), 10);
    } else {
      swiper.clickedIndex = slideIndex;
    }
  } else {
    swiper.clickedSlide = undefined;
    swiper.clickedIndex = undefined;
    return;
  }

  if (params.slideToClickedSlide && swiper.clickedIndex !== undefined && swiper.clickedIndex !== swiper.activeIndex) {
    swiper.slideToClickedSlide();
  }
}var update = {
  updateSize,
  updateSlides,
  updateAutoHeight,
  updateSlidesOffset,
  updateSlidesProgress,
  updateProgress,
  updateSlidesClasses,
  updateActiveIndex,
  updateClickedSlide
};function getSwiperTranslate(axis = this.isHorizontal() ? 'x' : 'y') {
  const swiper = this;
  const {
    params,
    rtlTranslate: rtl,
    translate,
    $wrapperEl
  } = swiper;

  if (params.virtualTranslate) {
    return rtl ? -translate : translate;
  }

  if (params.cssMode) {
    return translate;
  }

  let currentTranslate = getTranslate($wrapperEl[0], axis);
  if (rtl) currentTranslate = -currentTranslate;
  return currentTranslate || 0;
}function setTranslate(translate, byController) {
  const swiper = this;
  const {
    rtlTranslate: rtl,
    params,
    $wrapperEl,
    wrapperEl,
    progress
  } = swiper;
  let x = 0;
  let y = 0;
  const z = 0;

  if (swiper.isHorizontal()) {
    x = rtl ? -translate : translate;
  } else {
    y = translate;
  }

  if (params.roundLengths) {
    x = Math.floor(x);
    y = Math.floor(y);
  }

  if (params.cssMode) {
    wrapperEl[swiper.isHorizontal() ? 'scrollLeft' : 'scrollTop'] = swiper.isHorizontal() ? -x : -y;
  } else if (!params.virtualTranslate) {
    $wrapperEl.transform(`translate3d(${x}px, ${y}px, ${z}px)`);
  }

  swiper.previousTranslate = swiper.translate;
  swiper.translate = swiper.isHorizontal() ? x : y; // Check if we need to update progress

  let newProgress;
  const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();

  if (translatesDiff === 0) {
    newProgress = 0;
  } else {
    newProgress = (translate - swiper.minTranslate()) / translatesDiff;
  }

  if (newProgress !== progress) {
    swiper.updateProgress(translate);
  }

  swiper.emit('setTranslate', swiper.translate, byController);
}function minTranslate() {
  return -this.snapGrid[0];
}function maxTranslate() {
  return -this.snapGrid[this.snapGrid.length - 1];
}function translateTo(translate = 0, speed = this.params.speed, runCallbacks = true, translateBounds = true, internal) {
  const swiper = this;
  const {
    params,
    wrapperEl
  } = swiper;

  if (swiper.animating && params.preventInteractionOnTransition) {
    return false;
  }

  const minTranslate = swiper.minTranslate();
  const maxTranslate = swiper.maxTranslate();
  let newTranslate;
  if (translateBounds && translate > minTranslate) newTranslate = minTranslate;else if (translateBounds && translate < maxTranslate) newTranslate = maxTranslate;else newTranslate = translate; // Update progress

  swiper.updateProgress(newTranslate);

  if (params.cssMode) {
    const isH = swiper.isHorizontal();

    if (speed === 0) {
      wrapperEl[isH ? 'scrollLeft' : 'scrollTop'] = -newTranslate;
    } else {
      if (!swiper.support.smoothScroll) {
        animateCSSModeScroll({
          swiper,
          targetPosition: -newTranslate,
          side: isH ? 'left' : 'top'
        });
        return true;
      }

      wrapperEl.scrollTo({
        [isH ? 'left' : 'top']: -newTranslate,
        behavior: 'smooth'
      });
    }

    return true;
  }

  if (speed === 0) {
    swiper.setTransition(0);
    swiper.setTranslate(newTranslate);

    if (runCallbacks) {
      swiper.emit('beforeTransitionStart', speed, internal);
      swiper.emit('transitionEnd');
    }
  } else {
    swiper.setTransition(speed);
    swiper.setTranslate(newTranslate);

    if (runCallbacks) {
      swiper.emit('beforeTransitionStart', speed, internal);
      swiper.emit('transitionStart');
    }

    if (!swiper.animating) {
      swiper.animating = true;

      if (!swiper.onTranslateToWrapperTransitionEnd) {
        swiper.onTranslateToWrapperTransitionEnd = function transitionEnd(e) {
          if (!swiper || swiper.destroyed) return;
          if (e.target !== this) return;
          swiper.$wrapperEl[0].removeEventListener('transitionend', swiper.onTranslateToWrapperTransitionEnd);
          swiper.$wrapperEl[0].removeEventListener('webkitTransitionEnd', swiper.onTranslateToWrapperTransitionEnd);
          swiper.onTranslateToWrapperTransitionEnd = null;
          delete swiper.onTranslateToWrapperTransitionEnd;

          if (runCallbacks) {
            swiper.emit('transitionEnd');
          }
        };
      }

      swiper.$wrapperEl[0].addEventListener('transitionend', swiper.onTranslateToWrapperTransitionEnd);
      swiper.$wrapperEl[0].addEventListener('webkitTransitionEnd', swiper.onTranslateToWrapperTransitionEnd);
    }
  }

  return true;
}var translate = {
  getTranslate: getSwiperTranslate,
  setTranslate,
  minTranslate,
  maxTranslate,
  translateTo
};function setTransition(duration, byController) {
  const swiper = this;

  if (!swiper.params.cssMode) {
    swiper.$wrapperEl.transition(duration);
  }

  swiper.emit('setTransition', duration, byController);
}function transitionEmit({
  swiper,
  runCallbacks,
  direction,
  step
}) {
  const {
    activeIndex,
    previousIndex
  } = swiper;
  let dir = direction;

  if (!dir) {
    if (activeIndex > previousIndex) dir = 'next';else if (activeIndex < previousIndex) dir = 'prev';else dir = 'reset';
  }

  swiper.emit(`transition${step}`);

  if (runCallbacks && activeIndex !== previousIndex) {
    if (dir === 'reset') {
      swiper.emit(`slideResetTransition${step}`);
      return;
    }

    swiper.emit(`slideChangeTransition${step}`);

    if (dir === 'next') {
      swiper.emit(`slideNextTransition${step}`);
    } else {
      swiper.emit(`slidePrevTransition${step}`);
    }
  }
}function transitionStart(runCallbacks = true, direction) {
  const swiper = this;
  const {
    params
  } = swiper;
  if (params.cssMode) return;

  if (params.autoHeight) {
    swiper.updateAutoHeight();
  }

  transitionEmit({
    swiper,
    runCallbacks,
    direction,
    step: 'Start'
  });
}function transitionEnd(runCallbacks = true, direction) {
  const swiper = this;
  const {
    params
  } = swiper;
  swiper.animating = false;
  if (params.cssMode) return;
  swiper.setTransition(0);
  transitionEmit({
    swiper,
    runCallbacks,
    direction,
    step: 'End'
  });
}var transition = {
  setTransition,
  transitionStart,
  transitionEnd
};function slideTo(index = 0, speed = this.params.speed, runCallbacks = true, internal, initial) {
  if (typeof index !== 'number' && typeof index !== 'string') {
    throw new Error(`The 'index' argument cannot have type other than 'number' or 'string'. [${typeof index}] given.`);
  }

  if (typeof index === 'string') {
    /**
     * The `index` argument converted from `string` to `number`.
     * @type {number}
     */
    const indexAsNumber = parseInt(index, 10);
    /**
     * Determines whether the `index` argument is a valid `number`
     * after being converted from the `string` type.
     * @type {boolean}
     */

    const isValidNumber = isFinite(indexAsNumber);

    if (!isValidNumber) {
      throw new Error(`The passed-in 'index' (string) couldn't be converted to 'number'. [${index}] given.`);
    } // Knowing that the converted `index` is a valid number,
    // we can update the original argument's value.


    index = indexAsNumber;
  }

  const swiper = this;
  let slideIndex = index;
  if (slideIndex < 0) slideIndex = 0;
  const {
    params,
    snapGrid,
    slidesGrid,
    previousIndex,
    activeIndex,
    rtlTranslate: rtl,
    wrapperEl,
    enabled
  } = swiper;

  if (swiper.animating && params.preventInteractionOnTransition || !enabled && !internal && !initial) {
    return false;
  }

  const skip = Math.min(swiper.params.slidesPerGroupSkip, slideIndex);
  let snapIndex = skip + Math.floor((slideIndex - skip) / swiper.params.slidesPerGroup);
  if (snapIndex >= snapGrid.length) snapIndex = snapGrid.length - 1;
  const translate = -snapGrid[snapIndex]; // Normalize slideIndex

  if (params.normalizeSlideIndex) {
    for (let i = 0; i < slidesGrid.length; i += 1) {
      const normalizedTranslate = -Math.floor(translate * 100);
      const normalizedGrid = Math.floor(slidesGrid[i] * 100);
      const normalizedGridNext = Math.floor(slidesGrid[i + 1] * 100);

      if (typeof slidesGrid[i + 1] !== 'undefined') {
        if (normalizedTranslate >= normalizedGrid && normalizedTranslate < normalizedGridNext - (normalizedGridNext - normalizedGrid) / 2) {
          slideIndex = i;
        } else if (normalizedTranslate >= normalizedGrid && normalizedTranslate < normalizedGridNext) {
          slideIndex = i + 1;
        }
      } else if (normalizedTranslate >= normalizedGrid) {
        slideIndex = i;
      }
    }
  } // Directions locks


  if (swiper.initialized && slideIndex !== activeIndex) {
    if (!swiper.allowSlideNext && translate < swiper.translate && translate < swiper.minTranslate()) {
      return false;
    }

    if (!swiper.allowSlidePrev && translate > swiper.translate && translate > swiper.maxTranslate()) {
      if ((activeIndex || 0) !== slideIndex) return false;
    }
  }

  if (slideIndex !== (previousIndex || 0) && runCallbacks) {
    swiper.emit('beforeSlideChangeStart');
  } // Update progress


  swiper.updateProgress(translate);
  let direction;
  if (slideIndex > activeIndex) direction = 'next';else if (slideIndex < activeIndex) direction = 'prev';else direction = 'reset'; // Update Index

  if (rtl && -translate === swiper.translate || !rtl && translate === swiper.translate) {
    swiper.updateActiveIndex(slideIndex); // Update Height

    if (params.autoHeight) {
      swiper.updateAutoHeight();
    }

    swiper.updateSlidesClasses();

    if (params.effect !== 'slide') {
      swiper.setTranslate(translate);
    }

    if (direction !== 'reset') {
      swiper.transitionStart(runCallbacks, direction);
      swiper.transitionEnd(runCallbacks, direction);
    }

    return false;
  }

  if (params.cssMode) {
    const isH = swiper.isHorizontal();
    const t = rtl ? translate : -translate;

    if (speed === 0) {
      const isVirtual = swiper.virtual && swiper.params.virtual.enabled;

      if (isVirtual) {
        swiper.wrapperEl.style.scrollSnapType = 'none';
        swiper._immediateVirtual = true;
      }

      wrapperEl[isH ? 'scrollLeft' : 'scrollTop'] = t;

      if (isVirtual) {
        requestAnimationFrame(() => {
          swiper.wrapperEl.style.scrollSnapType = '';
          swiper._swiperImmediateVirtual = false;
        });
      }
    } else {
      if (!swiper.support.smoothScroll) {
        animateCSSModeScroll({
          swiper,
          targetPosition: t,
          side: isH ? 'left' : 'top'
        });
        return true;
      }

      wrapperEl.scrollTo({
        [isH ? 'left' : 'top']: t,
        behavior: 'smooth'
      });
    }

    return true;
  }

  swiper.setTransition(speed);
  swiper.setTranslate(translate);
  swiper.updateActiveIndex(slideIndex);
  swiper.updateSlidesClasses();
  swiper.emit('beforeTransitionStart', speed, internal);
  swiper.transitionStart(runCallbacks, direction);

  if (speed === 0) {
    swiper.transitionEnd(runCallbacks, direction);
  } else if (!swiper.animating) {
    swiper.animating = true;

    if (!swiper.onSlideToWrapperTransitionEnd) {
      swiper.onSlideToWrapperTransitionEnd = function transitionEnd(e) {
        if (!swiper || swiper.destroyed) return;
        if (e.target !== this) return;
        swiper.$wrapperEl[0].removeEventListener('transitionend', swiper.onSlideToWrapperTransitionEnd);
        swiper.$wrapperEl[0].removeEventListener('webkitTransitionEnd', swiper.onSlideToWrapperTransitionEnd);
        swiper.onSlideToWrapperTransitionEnd = null;
        delete swiper.onSlideToWrapperTransitionEnd;
        swiper.transitionEnd(runCallbacks, direction);
      };
    }

    swiper.$wrapperEl[0].addEventListener('transitionend', swiper.onSlideToWrapperTransitionEnd);
    swiper.$wrapperEl[0].addEventListener('webkitTransitionEnd', swiper.onSlideToWrapperTransitionEnd);
  }

  return true;
}function slideToLoop(index = 0, speed = this.params.speed, runCallbacks = true, internal) {
  if (typeof index === 'string') {
    /**
     * The `index` argument converted from `string` to `number`.
     * @type {number}
     */
    const indexAsNumber = parseInt(index, 10);
    /**
     * Determines whether the `index` argument is a valid `number`
     * after being converted from the `string` type.
     * @type {boolean}
     */

    const isValidNumber = isFinite(indexAsNumber);

    if (!isValidNumber) {
      throw new Error(`The passed-in 'index' (string) couldn't be converted to 'number'. [${index}] given.`);
    } // Knowing that the converted `index` is a valid number,
    // we can update the original argument's value.


    index = indexAsNumber;
  }

  const swiper = this;
  let newIndex = index;

  if (swiper.params.loop) {
    newIndex += swiper.loopedSlides;
  }

  return swiper.slideTo(newIndex, speed, runCallbacks, internal);
}/* eslint no-unused-vars: "off" */
function slideNext(speed = this.params.speed, runCallbacks = true, internal) {
  const swiper = this;
  const {
    animating,
    enabled,
    params
  } = swiper;
  if (!enabled) return swiper;
  let perGroup = params.slidesPerGroup;

  if (params.slidesPerView === 'auto' && params.slidesPerGroup === 1 && params.slidesPerGroupAuto) {
    perGroup = Math.max(swiper.slidesPerViewDynamic('current', true), 1);
  }

  const increment = swiper.activeIndex < params.slidesPerGroupSkip ? 1 : perGroup;

  if (params.loop) {
    if (animating && params.loopPreventsSlide) return false;
    swiper.loopFix(); // eslint-disable-next-line

    swiper._clientLeft = swiper.$wrapperEl[0].clientLeft;
  }

  if (params.rewind && swiper.isEnd) {
    return swiper.slideTo(0, speed, runCallbacks, internal);
  }

  return swiper.slideTo(swiper.activeIndex + increment, speed, runCallbacks, internal);
}/* eslint no-unused-vars: "off" */
function slidePrev(speed = this.params.speed, runCallbacks = true, internal) {
  const swiper = this;
  const {
    params,
    animating,
    snapGrid,
    slidesGrid,
    rtlTranslate,
    enabled
  } = swiper;
  if (!enabled) return swiper;

  if (params.loop) {
    if (animating && params.loopPreventsSlide) return false;
    swiper.loopFix(); // eslint-disable-next-line

    swiper._clientLeft = swiper.$wrapperEl[0].clientLeft;
  }

  const translate = rtlTranslate ? swiper.translate : -swiper.translate;

  function normalize(val) {
    if (val < 0) return -Math.floor(Math.abs(val));
    return Math.floor(val);
  }

  const normalizedTranslate = normalize(translate);
  const normalizedSnapGrid = snapGrid.map(val => normalize(val));
  let prevSnap = snapGrid[normalizedSnapGrid.indexOf(normalizedTranslate) - 1];

  if (typeof prevSnap === 'undefined' && params.cssMode) {
    let prevSnapIndex;
    snapGrid.forEach((snap, snapIndex) => {
      if (normalizedTranslate >= snap) {
        // prevSnap = snap;
        prevSnapIndex = snapIndex;
      }
    });

    if (typeof prevSnapIndex !== 'undefined') {
      prevSnap = snapGrid[prevSnapIndex > 0 ? prevSnapIndex - 1 : prevSnapIndex];
    }
  }

  let prevIndex = 0;

  if (typeof prevSnap !== 'undefined') {
    prevIndex = slidesGrid.indexOf(prevSnap);
    if (prevIndex < 0) prevIndex = swiper.activeIndex - 1;

    if (params.slidesPerView === 'auto' && params.slidesPerGroup === 1 && params.slidesPerGroupAuto) {
      prevIndex = prevIndex - swiper.slidesPerViewDynamic('previous', true) + 1;
      prevIndex = Math.max(prevIndex, 0);
    }
  }

  if (params.rewind && swiper.isBeginning) {
    const lastIndex = swiper.params.virtual && swiper.params.virtual.enabled && swiper.virtual ? swiper.virtual.slides.length - 1 : swiper.slides.length - 1;
    return swiper.slideTo(lastIndex, speed, runCallbacks, internal);
  }

  return swiper.slideTo(prevIndex, speed, runCallbacks, internal);
}/* eslint no-unused-vars: "off" */
function slideReset(speed = this.params.speed, runCallbacks = true, internal) {
  const swiper = this;
  return swiper.slideTo(swiper.activeIndex, speed, runCallbacks, internal);
}/* eslint no-unused-vars: "off" */
function slideToClosest(speed = this.params.speed, runCallbacks = true, internal, threshold = 0.5) {
  const swiper = this;
  let index = swiper.activeIndex;
  const skip = Math.min(swiper.params.slidesPerGroupSkip, index);
  const snapIndex = skip + Math.floor((index - skip) / swiper.params.slidesPerGroup);
  const translate = swiper.rtlTranslate ? swiper.translate : -swiper.translate;

  if (translate >= swiper.snapGrid[snapIndex]) {
    // The current translate is on or after the current snap index, so the choice
    // is between the current index and the one after it.
    const currentSnap = swiper.snapGrid[snapIndex];
    const nextSnap = swiper.snapGrid[snapIndex + 1];

    if (translate - currentSnap > (nextSnap - currentSnap) * threshold) {
      index += swiper.params.slidesPerGroup;
    }
  } else {
    // The current translate is before the current snap index, so the choice
    // is between the current index and the one before it.
    const prevSnap = swiper.snapGrid[snapIndex - 1];
    const currentSnap = swiper.snapGrid[snapIndex];

    if (translate - prevSnap <= (currentSnap - prevSnap) * threshold) {
      index -= swiper.params.slidesPerGroup;
    }
  }

  index = Math.max(index, 0);
  index = Math.min(index, swiper.slidesGrid.length - 1);
  return swiper.slideTo(index, speed, runCallbacks, internal);
}function slideToClickedSlide() {
  const swiper = this;
  const {
    params,
    $wrapperEl
  } = swiper;
  const slidesPerView = params.slidesPerView === 'auto' ? swiper.slidesPerViewDynamic() : params.slidesPerView;
  let slideToIndex = swiper.clickedIndex;
  let realIndex;

  if (params.loop) {
    if (swiper.animating) return;
    realIndex = parseInt($$1(swiper.clickedSlide).attr('data-swiper-slide-index'), 10);

    if (params.centeredSlides) {
      if (slideToIndex < swiper.loopedSlides - slidesPerView / 2 || slideToIndex > swiper.slides.length - swiper.loopedSlides + slidesPerView / 2) {
        swiper.loopFix();
        slideToIndex = $wrapperEl.children(`.${params.slideClass}[data-swiper-slide-index="${realIndex}"]:not(.${params.slideDuplicateClass})`).eq(0).index();
        nextTick(() => {
          swiper.slideTo(slideToIndex);
        });
      } else {
        swiper.slideTo(slideToIndex);
      }
    } else if (slideToIndex > swiper.slides.length - slidesPerView) {
      swiper.loopFix();
      slideToIndex = $wrapperEl.children(`.${params.slideClass}[data-swiper-slide-index="${realIndex}"]:not(.${params.slideDuplicateClass})`).eq(0).index();
      nextTick(() => {
        swiper.slideTo(slideToIndex);
      });
    } else {
      swiper.slideTo(slideToIndex);
    }
  } else {
    swiper.slideTo(slideToIndex);
  }
}var slide = {
  slideTo,
  slideToLoop,
  slideNext,
  slidePrev,
  slideReset,
  slideToClosest,
  slideToClickedSlide
};function loopCreate() {
  const swiper = this;
  const document = getDocument();
  const {
    params,
    $wrapperEl
  } = swiper; // Remove duplicated slides

  const $selector = $wrapperEl.children().length > 0 ? $$1($wrapperEl.children()[0].parentNode) : $wrapperEl;
  $selector.children(`.${params.slideClass}.${params.slideDuplicateClass}`).remove();
  let slides = $selector.children(`.${params.slideClass}`);

  if (params.loopFillGroupWithBlank) {
    const blankSlidesNum = params.slidesPerGroup - slides.length % params.slidesPerGroup;

    if (blankSlidesNum !== params.slidesPerGroup) {
      for (let i = 0; i < blankSlidesNum; i += 1) {
        const blankNode = $$1(document.createElement('div')).addClass(`${params.slideClass} ${params.slideBlankClass}`);
        $selector.append(blankNode);
      }

      slides = $selector.children(`.${params.slideClass}`);
    }
  }

  if (params.slidesPerView === 'auto' && !params.loopedSlides) params.loopedSlides = slides.length;
  swiper.loopedSlides = Math.ceil(parseFloat(params.loopedSlides || params.slidesPerView, 10));
  swiper.loopedSlides += params.loopAdditionalSlides;

  if (swiper.loopedSlides > slides.length && swiper.params.loopedSlidesLimit) {
    swiper.loopedSlides = slides.length;
  }

  const prependSlides = [];
  const appendSlides = [];
  slides.each((el, index) => {
    const slide = $$1(el);
    slide.attr('data-swiper-slide-index', index);
  });

  for (let i = 0; i < swiper.loopedSlides; i += 1) {
    const index = i - Math.floor(i / slides.length) * slides.length;
    appendSlides.push(slides.eq(index)[0]);
    prependSlides.unshift(slides.eq(slides.length - index - 1)[0]);
  }

  for (let i = 0; i < appendSlides.length; i += 1) {
    $selector.append($$1(appendSlides[i].cloneNode(true)).addClass(params.slideDuplicateClass));
  }

  for (let i = prependSlides.length - 1; i >= 0; i -= 1) {
    $selector.prepend($$1(prependSlides[i].cloneNode(true)).addClass(params.slideDuplicateClass));
  }
}function loopFix() {
  const swiper = this;
  swiper.emit('beforeLoopFix');
  const {
    activeIndex,
    slides,
    loopedSlides,
    allowSlidePrev,
    allowSlideNext,
    snapGrid,
    rtlTranslate: rtl
  } = swiper;
  let newIndex;
  swiper.allowSlidePrev = true;
  swiper.allowSlideNext = true;
  const snapTranslate = -snapGrid[activeIndex];
  const diff = snapTranslate - swiper.getTranslate(); // Fix For Negative Oversliding

  if (activeIndex < loopedSlides) {
    newIndex = slides.length - loopedSlides * 3 + activeIndex;
    newIndex += loopedSlides;
    const slideChanged = swiper.slideTo(newIndex, 0, false, true);

    if (slideChanged && diff !== 0) {
      swiper.setTranslate((rtl ? -swiper.translate : swiper.translate) - diff);
    }
  } else if (activeIndex >= slides.length - loopedSlides) {
    // Fix For Positive Oversliding
    newIndex = -slides.length + activeIndex + loopedSlides;
    newIndex += loopedSlides;
    const slideChanged = swiper.slideTo(newIndex, 0, false, true);

    if (slideChanged && diff !== 0) {
      swiper.setTranslate((rtl ? -swiper.translate : swiper.translate) - diff);
    }
  }

  swiper.allowSlidePrev = allowSlidePrev;
  swiper.allowSlideNext = allowSlideNext;
  swiper.emit('loopFix');
}function loopDestroy() {
  const swiper = this;
  const {
    $wrapperEl,
    params,
    slides
  } = swiper;
  $wrapperEl.children(`.${params.slideClass}.${params.slideDuplicateClass},.${params.slideClass}.${params.slideBlankClass}`).remove();
  slides.removeAttr('data-swiper-slide-index');
}var loop = {
  loopCreate,
  loopFix,
  loopDestroy
};function setGrabCursor(moving) {
  const swiper = this;
  if (swiper.support.touch || !swiper.params.simulateTouch || swiper.params.watchOverflow && swiper.isLocked || swiper.params.cssMode) return;
  const el = swiper.params.touchEventsTarget === 'container' ? swiper.el : swiper.wrapperEl;
  el.style.cursor = 'move';
  el.style.cursor = moving ? 'grabbing' : 'grab';
}function unsetGrabCursor() {
  const swiper = this;

  if (swiper.support.touch || swiper.params.watchOverflow && swiper.isLocked || swiper.params.cssMode) {
    return;
  }

  swiper[swiper.params.touchEventsTarget === 'container' ? 'el' : 'wrapperEl'].style.cursor = '';
}var grabCursor = {
  setGrabCursor,
  unsetGrabCursor
};function closestElement(selector, base = this) {
  function __closestFrom(el) {
    if (!el || el === getDocument() || el === getWindow()) return null;
    if (el.assignedSlot) el = el.assignedSlot;
    const found = el.closest(selector);

    if (!found && !el.getRootNode) {
      return null;
    }

    return found || __closestFrom(el.getRootNode().host);
  }

  return __closestFrom(base);
}

function onTouchStart(event) {
  const swiper = this;
  const document = getDocument();
  const window = getWindow();
  const data = swiper.touchEventsData;
  const {
    params,
    touches,
    enabled
  } = swiper;
  if (!enabled) return;

  if (swiper.animating && params.preventInteractionOnTransition) {
    return;
  }

  if (!swiper.animating && params.cssMode && params.loop) {
    swiper.loopFix();
  }

  let e = event;
  if (e.originalEvent) e = e.originalEvent;
  let $targetEl = $$1(e.target);

  if (params.touchEventsTarget === 'wrapper') {
    if (!$targetEl.closest(swiper.wrapperEl).length) return;
  }

  data.isTouchEvent = e.type === 'touchstart';
  if (!data.isTouchEvent && 'which' in e && e.which === 3) return;
  if (!data.isTouchEvent && 'button' in e && e.button > 0) return;
  if (data.isTouched && data.isMoved) return; // change target el for shadow root component

  const swipingClassHasValue = !!params.noSwipingClass && params.noSwipingClass !== ''; // eslint-disable-next-line

  const eventPath = event.composedPath ? event.composedPath() : event.path;

  if (swipingClassHasValue && e.target && e.target.shadowRoot && eventPath) {
    $targetEl = $$1(eventPath[0]);
  }

  const noSwipingSelector = params.noSwipingSelector ? params.noSwipingSelector : `.${params.noSwipingClass}`;
  const isTargetShadow = !!(e.target && e.target.shadowRoot); // use closestElement for shadow root element to get the actual closest for nested shadow root element

  if (params.noSwiping && (isTargetShadow ? closestElement(noSwipingSelector, $targetEl[0]) : $targetEl.closest(noSwipingSelector)[0])) {
    swiper.allowClick = true;
    return;
  }

  if (params.swipeHandler) {
    if (!$targetEl.closest(params.swipeHandler)[0]) return;
  }

  touches.currentX = e.type === 'touchstart' ? e.targetTouches[0].pageX : e.pageX;
  touches.currentY = e.type === 'touchstart' ? e.targetTouches[0].pageY : e.pageY;
  const startX = touches.currentX;
  const startY = touches.currentY; // Do NOT start if iOS edge swipe is detected. Otherwise iOS app cannot swipe-to-go-back anymore

  const edgeSwipeDetection = params.edgeSwipeDetection || params.iOSEdgeSwipeDetection;
  const edgeSwipeThreshold = params.edgeSwipeThreshold || params.iOSEdgeSwipeThreshold;

  if (edgeSwipeDetection && (startX <= edgeSwipeThreshold || startX >= window.innerWidth - edgeSwipeThreshold)) {
    if (edgeSwipeDetection === 'prevent') {
      event.preventDefault();
    } else {
      return;
    }
  }

  Object.assign(data, {
    isTouched: true,
    isMoved: false,
    allowTouchCallbacks: true,
    isScrolling: undefined,
    startMoving: undefined
  });
  touches.startX = startX;
  touches.startY = startY;
  data.touchStartTime = now();
  swiper.allowClick = true;
  swiper.updateSize();
  swiper.swipeDirection = undefined;
  if (params.threshold > 0) data.allowThresholdMove = false;

  if (e.type !== 'touchstart') {
    let preventDefault = true;

    if ($targetEl.is(data.focusableElements)) {
      preventDefault = false;

      if ($targetEl[0].nodeName === 'SELECT') {
        data.isTouched = false;
      }
    }

    if (document.activeElement && $$1(document.activeElement).is(data.focusableElements) && document.activeElement !== $targetEl[0]) {
      document.activeElement.blur();
    }

    const shouldPreventDefault = preventDefault && swiper.allowTouchMove && params.touchStartPreventDefault;

    if ((params.touchStartForcePreventDefault || shouldPreventDefault) && !$targetEl[0].isContentEditable) {
      e.preventDefault();
    }
  }

  if (swiper.params.freeMode && swiper.params.freeMode.enabled && swiper.freeMode && swiper.animating && !params.cssMode) {
    swiper.freeMode.onTouchStart();
  }

  swiper.emit('touchStart', e);
}function onTouchMove(event) {
  const document = getDocument();
  const swiper = this;
  const data = swiper.touchEventsData;
  const {
    params,
    touches,
    rtlTranslate: rtl,
    enabled
  } = swiper;
  if (!enabled) return;
  let e = event;
  if (e.originalEvent) e = e.originalEvent;

  if (!data.isTouched) {
    if (data.startMoving && data.isScrolling) {
      swiper.emit('touchMoveOpposite', e);
    }

    return;
  }

  if (data.isTouchEvent && e.type !== 'touchmove') return;
  const targetTouch = e.type === 'touchmove' && e.targetTouches && (e.targetTouches[0] || e.changedTouches[0]);
  const pageX = e.type === 'touchmove' ? targetTouch.pageX : e.pageX;
  const pageY = e.type === 'touchmove' ? targetTouch.pageY : e.pageY;

  if (e.preventedByNestedSwiper) {
    touches.startX = pageX;
    touches.startY = pageY;
    return;
  }

  if (!swiper.allowTouchMove) {
    if (!$$1(e.target).is(data.focusableElements)) {
      swiper.allowClick = false;
    }

    if (data.isTouched) {
      Object.assign(touches, {
        startX: pageX,
        startY: pageY,
        currentX: pageX,
        currentY: pageY
      });
      data.touchStartTime = now();
    }

    return;
  }

  if (data.isTouchEvent && params.touchReleaseOnEdges && !params.loop) {
    if (swiper.isVertical()) {
      // Vertical
      if (pageY < touches.startY && swiper.translate <= swiper.maxTranslate() || pageY > touches.startY && swiper.translate >= swiper.minTranslate()) {
        data.isTouched = false;
        data.isMoved = false;
        return;
      }
    } else if (pageX < touches.startX && swiper.translate <= swiper.maxTranslate() || pageX > touches.startX && swiper.translate >= swiper.minTranslate()) {
      return;
    }
  }

  if (data.isTouchEvent && document.activeElement) {
    if (e.target === document.activeElement && $$1(e.target).is(data.focusableElements)) {
      data.isMoved = true;
      swiper.allowClick = false;
      return;
    }
  }

  if (data.allowTouchCallbacks) {
    swiper.emit('touchMove', e);
  }

  if (e.targetTouches && e.targetTouches.length > 1) return;
  touches.currentX = pageX;
  touches.currentY = pageY;
  const diffX = touches.currentX - touches.startX;
  const diffY = touches.currentY - touches.startY;
  if (swiper.params.threshold && Math.sqrt(diffX ** 2 + diffY ** 2) < swiper.params.threshold) return;

  if (typeof data.isScrolling === 'undefined') {
    let touchAngle;

    if (swiper.isHorizontal() && touches.currentY === touches.startY || swiper.isVertical() && touches.currentX === touches.startX) {
      data.isScrolling = false;
    } else {
      // eslint-disable-next-line
      if (diffX * diffX + diffY * diffY >= 25) {
        touchAngle = Math.atan2(Math.abs(diffY), Math.abs(diffX)) * 180 / Math.PI;
        data.isScrolling = swiper.isHorizontal() ? touchAngle > params.touchAngle : 90 - touchAngle > params.touchAngle;
      }
    }
  }

  if (data.isScrolling) {
    swiper.emit('touchMoveOpposite', e);
  }

  if (typeof data.startMoving === 'undefined') {
    if (touches.currentX !== touches.startX || touches.currentY !== touches.startY) {
      data.startMoving = true;
    }
  }

  if (data.isScrolling) {
    data.isTouched = false;
    return;
  }

  if (!data.startMoving) {
    return;
  }

  swiper.allowClick = false;

  if (!params.cssMode && e.cancelable) {
    e.preventDefault();
  }

  if (params.touchMoveStopPropagation && !params.nested) {
    e.stopPropagation();
  }

  if (!data.isMoved) {
    if (params.loop && !params.cssMode) {
      swiper.loopFix();
    }

    data.startTranslate = swiper.getTranslate();
    swiper.setTransition(0);

    if (swiper.animating) {
      swiper.$wrapperEl.trigger('webkitTransitionEnd transitionend');
    }

    data.allowMomentumBounce = false; // Grab Cursor

    if (params.grabCursor && (swiper.allowSlideNext === true || swiper.allowSlidePrev === true)) {
      swiper.setGrabCursor(true);
    }

    swiper.emit('sliderFirstMove', e);
  }

  swiper.emit('sliderMove', e);
  data.isMoved = true;
  let diff = swiper.isHorizontal() ? diffX : diffY;
  touches.diff = diff;
  diff *= params.touchRatio;
  if (rtl) diff = -diff;
  swiper.swipeDirection = diff > 0 ? 'prev' : 'next';
  data.currentTranslate = diff + data.startTranslate;
  let disableParentSwiper = true;
  let resistanceRatio = params.resistanceRatio;

  if (params.touchReleaseOnEdges) {
    resistanceRatio = 0;
  }

  if (diff > 0 && data.currentTranslate > swiper.minTranslate()) {
    disableParentSwiper = false;
    if (params.resistance) data.currentTranslate = swiper.minTranslate() - 1 + (-swiper.minTranslate() + data.startTranslate + diff) ** resistanceRatio;
  } else if (diff < 0 && data.currentTranslate < swiper.maxTranslate()) {
    disableParentSwiper = false;
    if (params.resistance) data.currentTranslate = swiper.maxTranslate() + 1 - (swiper.maxTranslate() - data.startTranslate - diff) ** resistanceRatio;
  }

  if (disableParentSwiper) {
    e.preventedByNestedSwiper = true;
  } // Directions locks


  if (!swiper.allowSlideNext && swiper.swipeDirection === 'next' && data.currentTranslate < data.startTranslate) {
    data.currentTranslate = data.startTranslate;
  }

  if (!swiper.allowSlidePrev && swiper.swipeDirection === 'prev' && data.currentTranslate > data.startTranslate) {
    data.currentTranslate = data.startTranslate;
  }

  if (!swiper.allowSlidePrev && !swiper.allowSlideNext) {
    data.currentTranslate = data.startTranslate;
  } // Threshold


  if (params.threshold > 0) {
    if (Math.abs(diff) > params.threshold || data.allowThresholdMove) {
      if (!data.allowThresholdMove) {
        data.allowThresholdMove = true;
        touches.startX = touches.currentX;
        touches.startY = touches.currentY;
        data.currentTranslate = data.startTranslate;
        touches.diff = swiper.isHorizontal() ? touches.currentX - touches.startX : touches.currentY - touches.startY;
        return;
      }
    } else {
      data.currentTranslate = data.startTranslate;
      return;
    }
  }

  if (!params.followFinger || params.cssMode) return; // Update active index in free mode

  if (params.freeMode && params.freeMode.enabled && swiper.freeMode || params.watchSlidesProgress) {
    swiper.updateActiveIndex();
    swiper.updateSlidesClasses();
  }

  if (swiper.params.freeMode && params.freeMode.enabled && swiper.freeMode) {
    swiper.freeMode.onTouchMove();
  } // Update progress


  swiper.updateProgress(data.currentTranslate); // Update translate

  swiper.setTranslate(data.currentTranslate);
}function onTouchEnd(event) {
  const swiper = this;
  const data = swiper.touchEventsData;
  const {
    params,
    touches,
    rtlTranslate: rtl,
    slidesGrid,
    enabled
  } = swiper;
  if (!enabled) return;
  let e = event;
  if (e.originalEvent) e = e.originalEvent;

  if (data.allowTouchCallbacks) {
    swiper.emit('touchEnd', e);
  }

  data.allowTouchCallbacks = false;

  if (!data.isTouched) {
    if (data.isMoved && params.grabCursor) {
      swiper.setGrabCursor(false);
    }

    data.isMoved = false;
    data.startMoving = false;
    return;
  } // Return Grab Cursor


  if (params.grabCursor && data.isMoved && data.isTouched && (swiper.allowSlideNext === true || swiper.allowSlidePrev === true)) {
    swiper.setGrabCursor(false);
  } // Time diff


  const touchEndTime = now();
  const timeDiff = touchEndTime - data.touchStartTime; // Tap, doubleTap, Click

  if (swiper.allowClick) {
    const pathTree = e.path || e.composedPath && e.composedPath();
    swiper.updateClickedSlide(pathTree && pathTree[0] || e.target);
    swiper.emit('tap click', e);

    if (timeDiff < 300 && touchEndTime - data.lastClickTime < 300) {
      swiper.emit('doubleTap doubleClick', e);
    }
  }

  data.lastClickTime = now();
  nextTick(() => {
    if (!swiper.destroyed) swiper.allowClick = true;
  });

  if (!data.isTouched || !data.isMoved || !swiper.swipeDirection || touches.diff === 0 || data.currentTranslate === data.startTranslate) {
    data.isTouched = false;
    data.isMoved = false;
    data.startMoving = false;
    return;
  }

  data.isTouched = false;
  data.isMoved = false;
  data.startMoving = false;
  let currentPos;

  if (params.followFinger) {
    currentPos = rtl ? swiper.translate : -swiper.translate;
  } else {
    currentPos = -data.currentTranslate;
  }

  if (params.cssMode) {
    return;
  }

  if (swiper.params.freeMode && params.freeMode.enabled) {
    swiper.freeMode.onTouchEnd({
      currentPos
    });
    return;
  } // Find current slide


  let stopIndex = 0;
  let groupSize = swiper.slidesSizesGrid[0];

  for (let i = 0; i < slidesGrid.length; i += i < params.slidesPerGroupSkip ? 1 : params.slidesPerGroup) {
    const increment = i < params.slidesPerGroupSkip - 1 ? 1 : params.slidesPerGroup;

    if (typeof slidesGrid[i + increment] !== 'undefined') {
      if (currentPos >= slidesGrid[i] && currentPos < slidesGrid[i + increment]) {
        stopIndex = i;
        groupSize = slidesGrid[i + increment] - slidesGrid[i];
      }
    } else if (currentPos >= slidesGrid[i]) {
      stopIndex = i;
      groupSize = slidesGrid[slidesGrid.length - 1] - slidesGrid[slidesGrid.length - 2];
    }
  }

  let rewindFirstIndex = null;
  let rewindLastIndex = null;

  if (params.rewind) {
    if (swiper.isBeginning) {
      rewindLastIndex = swiper.params.virtual && swiper.params.virtual.enabled && swiper.virtual ? swiper.virtual.slides.length - 1 : swiper.slides.length - 1;
    } else if (swiper.isEnd) {
      rewindFirstIndex = 0;
    }
  } // Find current slide size


  const ratio = (currentPos - slidesGrid[stopIndex]) / groupSize;
  const increment = stopIndex < params.slidesPerGroupSkip - 1 ? 1 : params.slidesPerGroup;

  if (timeDiff > params.longSwipesMs) {
    // Long touches
    if (!params.longSwipes) {
      swiper.slideTo(swiper.activeIndex);
      return;
    }

    if (swiper.swipeDirection === 'next') {
      if (ratio >= params.longSwipesRatio) swiper.slideTo(params.rewind && swiper.isEnd ? rewindFirstIndex : stopIndex + increment);else swiper.slideTo(stopIndex);
    }

    if (swiper.swipeDirection === 'prev') {
      if (ratio > 1 - params.longSwipesRatio) {
        swiper.slideTo(stopIndex + increment);
      } else if (rewindLastIndex !== null && ratio < 0 && Math.abs(ratio) > params.longSwipesRatio) {
        swiper.slideTo(rewindLastIndex);
      } else {
        swiper.slideTo(stopIndex);
      }
    }
  } else {
    // Short swipes
    if (!params.shortSwipes) {
      swiper.slideTo(swiper.activeIndex);
      return;
    }

    const isNavButtonTarget = swiper.navigation && (e.target === swiper.navigation.nextEl || e.target === swiper.navigation.prevEl);

    if (!isNavButtonTarget) {
      if (swiper.swipeDirection === 'next') {
        swiper.slideTo(rewindFirstIndex !== null ? rewindFirstIndex : stopIndex + increment);
      }

      if (swiper.swipeDirection === 'prev') {
        swiper.slideTo(rewindLastIndex !== null ? rewindLastIndex : stopIndex);
      }
    } else if (e.target === swiper.navigation.nextEl) {
      swiper.slideTo(stopIndex + increment);
    } else {
      swiper.slideTo(stopIndex);
    }
  }
}function onResize() {
  const swiper = this;
  const {
    params,
    el
  } = swiper;
  if (el && el.offsetWidth === 0) return; // Breakpoints

  if (params.breakpoints) {
    swiper.setBreakpoint();
  } // Save locks


  const {
    allowSlideNext,
    allowSlidePrev,
    snapGrid
  } = swiper; // Disable locks on resize

  swiper.allowSlideNext = true;
  swiper.allowSlidePrev = true;
  swiper.updateSize();
  swiper.updateSlides();
  swiper.updateSlidesClasses();

  if ((params.slidesPerView === 'auto' || params.slidesPerView > 1) && swiper.isEnd && !swiper.isBeginning && !swiper.params.centeredSlides) {
    swiper.slideTo(swiper.slides.length - 1, 0, false, true);
  } else {
    swiper.slideTo(swiper.activeIndex, 0, false, true);
  }

  if (swiper.autoplay && swiper.autoplay.running && swiper.autoplay.paused) {
    swiper.autoplay.run();
  } // Return locks after resize


  swiper.allowSlidePrev = allowSlidePrev;
  swiper.allowSlideNext = allowSlideNext;

  if (swiper.params.watchOverflow && snapGrid !== swiper.snapGrid) {
    swiper.checkOverflow();
  }
}function onClick(e) {
  const swiper = this;
  if (!swiper.enabled) return;

  if (!swiper.allowClick) {
    if (swiper.params.preventClicks) e.preventDefault();

    if (swiper.params.preventClicksPropagation && swiper.animating) {
      e.stopPropagation();
      e.stopImmediatePropagation();
    }
  }
}function onScroll() {
  const swiper = this;
  const {
    wrapperEl,
    rtlTranslate,
    enabled
  } = swiper;
  if (!enabled) return;
  swiper.previousTranslate = swiper.translate;

  if (swiper.isHorizontal()) {
    swiper.translate = -wrapperEl.scrollLeft;
  } else {
    swiper.translate = -wrapperEl.scrollTop;
  } // eslint-disable-next-line


  if (swiper.translate === 0) swiper.translate = 0;
  swiper.updateActiveIndex();
  swiper.updateSlidesClasses();
  let newProgress;
  const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();

  if (translatesDiff === 0) {
    newProgress = 0;
  } else {
    newProgress = (swiper.translate - swiper.minTranslate()) / translatesDiff;
  }

  if (newProgress !== swiper.progress) {
    swiper.updateProgress(rtlTranslate ? -swiper.translate : swiper.translate);
  }

  swiper.emit('setTranslate', swiper.translate, false);
}let dummyEventAttached = false;

function dummyEventListener() {}

const events = (swiper, method) => {
  const document = getDocument();
  const {
    params,
    touchEvents,
    el,
    wrapperEl,
    device,
    support
  } = swiper;
  const capture = !!params.nested;
  const domMethod = method === 'on' ? 'addEventListener' : 'removeEventListener';
  const swiperMethod = method; // Touch Events

  if (!support.touch) {
    el[domMethod](touchEvents.start, swiper.onTouchStart, false);
    document[domMethod](touchEvents.move, swiper.onTouchMove, capture);
    document[domMethod](touchEvents.end, swiper.onTouchEnd, false);
  } else {
    const passiveListener = touchEvents.start === 'touchstart' && support.passiveListener && params.passiveListeners ? {
      passive: true,
      capture: false
    } : false;
    el[domMethod](touchEvents.start, swiper.onTouchStart, passiveListener);
    el[domMethod](touchEvents.move, swiper.onTouchMove, support.passiveListener ? {
      passive: false,
      capture
    } : capture);
    el[domMethod](touchEvents.end, swiper.onTouchEnd, passiveListener);

    if (touchEvents.cancel) {
      el[domMethod](touchEvents.cancel, swiper.onTouchEnd, passiveListener);
    }
  } // Prevent Links Clicks


  if (params.preventClicks || params.preventClicksPropagation) {
    el[domMethod]('click', swiper.onClick, true);
  }

  if (params.cssMode) {
    wrapperEl[domMethod]('scroll', swiper.onScroll);
  } // Resize handler


  if (params.updateOnWindowResize) {
    swiper[swiperMethod](device.ios || device.android ? 'resize orientationchange observerUpdate' : 'resize observerUpdate', onResize, true);
  } else {
    swiper[swiperMethod]('observerUpdate', onResize, true);
  }
};

function attachEvents() {
  const swiper = this;
  const document = getDocument();
  const {
    params,
    support
  } = swiper;
  swiper.onTouchStart = onTouchStart.bind(swiper);
  swiper.onTouchMove = onTouchMove.bind(swiper);
  swiper.onTouchEnd = onTouchEnd.bind(swiper);

  if (params.cssMode) {
    swiper.onScroll = onScroll.bind(swiper);
  }

  swiper.onClick = onClick.bind(swiper);

  if (support.touch && !dummyEventAttached) {
    document.addEventListener('touchstart', dummyEventListener);
    dummyEventAttached = true;
  }

  events(swiper, 'on');
}

function detachEvents() {
  const swiper = this;
  events(swiper, 'off');
}

var events$1 = {
  attachEvents,
  detachEvents
};const isGridEnabled = (swiper, params) => {
  return swiper.grid && params.grid && params.grid.rows > 1;
};

function setBreakpoint() {
  const swiper = this;
  const {
    activeIndex,
    initialized,
    loopedSlides = 0,
    params,
    $el
  } = swiper;
  const breakpoints = params.breakpoints;
  if (!breakpoints || breakpoints && Object.keys(breakpoints).length === 0) return; // Get breakpoint for window width and update parameters

  const breakpoint = swiper.getBreakpoint(breakpoints, swiper.params.breakpointsBase, swiper.el);
  if (!breakpoint || swiper.currentBreakpoint === breakpoint) return;
  const breakpointOnlyParams = breakpoint in breakpoints ? breakpoints[breakpoint] : undefined;
  const breakpointParams = breakpointOnlyParams || swiper.originalParams;
  const wasMultiRow = isGridEnabled(swiper, params);
  const isMultiRow = isGridEnabled(swiper, breakpointParams);
  const wasEnabled = params.enabled;

  if (wasMultiRow && !isMultiRow) {
    $el.removeClass(`${params.containerModifierClass}grid ${params.containerModifierClass}grid-column`);
    swiper.emitContainerClasses();
  } else if (!wasMultiRow && isMultiRow) {
    $el.addClass(`${params.containerModifierClass}grid`);

    if (breakpointParams.grid.fill && breakpointParams.grid.fill === 'column' || !breakpointParams.grid.fill && params.grid.fill === 'column') {
      $el.addClass(`${params.containerModifierClass}grid-column`);
    }

    swiper.emitContainerClasses();
  } // Toggle navigation, pagination, scrollbar


  ['navigation', 'pagination', 'scrollbar'].forEach(prop => {
    const wasModuleEnabled = params[prop] && params[prop].enabled;
    const isModuleEnabled = breakpointParams[prop] && breakpointParams[prop].enabled;

    if (wasModuleEnabled && !isModuleEnabled) {
      swiper[prop].disable();
    }

    if (!wasModuleEnabled && isModuleEnabled) {
      swiper[prop].enable();
    }
  });
  const directionChanged = breakpointParams.direction && breakpointParams.direction !== params.direction;
  const needsReLoop = params.loop && (breakpointParams.slidesPerView !== params.slidesPerView || directionChanged);

  if (directionChanged && initialized) {
    swiper.changeDirection();
  }

  extend(swiper.params, breakpointParams);
  const isEnabled = swiper.params.enabled;
  Object.assign(swiper, {
    allowTouchMove: swiper.params.allowTouchMove,
    allowSlideNext: swiper.params.allowSlideNext,
    allowSlidePrev: swiper.params.allowSlidePrev
  });

  if (wasEnabled && !isEnabled) {
    swiper.disable();
  } else if (!wasEnabled && isEnabled) {
    swiper.enable();
  }

  swiper.currentBreakpoint = breakpoint;
  swiper.emit('_beforeBreakpoint', breakpointParams);

  if (needsReLoop && initialized) {
    swiper.loopDestroy();
    swiper.loopCreate();
    swiper.updateSlides();
    swiper.slideTo(activeIndex - loopedSlides + swiper.loopedSlides, 0, false);
  }

  swiper.emit('breakpoint', breakpointParams);
}function getBreakpoint(breakpoints, base = 'window', containerEl) {
  if (!breakpoints || base === 'container' && !containerEl) return undefined;
  let breakpoint = false;
  const window = getWindow();
  const currentHeight = base === 'window' ? window.innerHeight : containerEl.clientHeight;
  const points = Object.keys(breakpoints).map(point => {
    if (typeof point === 'string' && point.indexOf('@') === 0) {
      const minRatio = parseFloat(point.substr(1));
      const value = currentHeight * minRatio;
      return {
        value,
        point
      };
    }

    return {
      value: point,
      point
    };
  });
  points.sort((a, b) => parseInt(a.value, 10) - parseInt(b.value, 10));

  for (let i = 0; i < points.length; i += 1) {
    const {
      point,
      value
    } = points[i];

    if (base === 'window') {
      if (window.matchMedia(`(min-width: ${value}px)`).matches) {
        breakpoint = point;
      }
    } else if (value <= containerEl.clientWidth) {
      breakpoint = point;
    }
  }

  return breakpoint || 'max';
}var breakpoints = {
  setBreakpoint,
  getBreakpoint
};function prepareClasses(entries, prefix) {
  const resultClasses = [];
  entries.forEach(item => {
    if (typeof item === 'object') {
      Object.keys(item).forEach(classNames => {
        if (item[classNames]) {
          resultClasses.push(prefix + classNames);
        }
      });
    } else if (typeof item === 'string') {
      resultClasses.push(prefix + item);
    }
  });
  return resultClasses;
}

function addClasses() {
  const swiper = this;
  const {
    classNames,
    params,
    rtl,
    $el,
    device,
    support
  } = swiper; // prettier-ignore

  const suffixes = prepareClasses(['initialized', params.direction, {
    'pointer-events': !support.touch
  }, {
    'free-mode': swiper.params.freeMode && params.freeMode.enabled
  }, {
    'autoheight': params.autoHeight
  }, {
    'rtl': rtl
  }, {
    'grid': params.grid && params.grid.rows > 1
  }, {
    'grid-column': params.grid && params.grid.rows > 1 && params.grid.fill === 'column'
  }, {
    'android': device.android
  }, {
    'ios': device.ios
  }, {
    'css-mode': params.cssMode
  }, {
    'centered': params.cssMode && params.centeredSlides
  }, {
    'watch-progress': params.watchSlidesProgress
  }], params.containerModifierClass);
  classNames.push(...suffixes);
  $el.addClass([...classNames].join(' '));
  swiper.emitContainerClasses();
}function removeClasses() {
  const swiper = this;
  const {
    $el,
    classNames
  } = swiper;
  $el.removeClass(classNames.join(' '));
  swiper.emitContainerClasses();
}var classes = {
  addClasses,
  removeClasses
};function loadImage(imageEl, src, srcset, sizes, checkForComplete, callback) {
  const window = getWindow();
  let image;

  function onReady() {
    if (callback) callback();
  }

  const isPicture = $$1(imageEl).parent('picture')[0];

  if (!isPicture && (!imageEl.complete || !checkForComplete)) {
    if (src) {
      image = new window.Image();
      image.onload = onReady;
      image.onerror = onReady;

      if (sizes) {
        image.sizes = sizes;
      }

      if (srcset) {
        image.srcset = srcset;
      }

      if (src) {
        image.src = src;
      }
    } else {
      onReady();
    }
  } else {
    // image already loaded...
    onReady();
  }
}function preloadImages() {
  const swiper = this;
  swiper.imagesToLoad = swiper.$el.find('img');

  function onReady() {
    if (typeof swiper === 'undefined' || swiper === null || !swiper || swiper.destroyed) return;
    if (swiper.imagesLoaded !== undefined) swiper.imagesLoaded += 1;

    if (swiper.imagesLoaded === swiper.imagesToLoad.length) {
      if (swiper.params.updateOnImagesReady) swiper.update();
      swiper.emit('imagesReady');
    }
  }

  for (let i = 0; i < swiper.imagesToLoad.length; i += 1) {
    const imageEl = swiper.imagesToLoad[i];
    swiper.loadImage(imageEl, imageEl.currentSrc || imageEl.getAttribute('src'), imageEl.srcset || imageEl.getAttribute('srcset'), imageEl.sizes || imageEl.getAttribute('sizes'), true, onReady);
  }
}var images = {
  loadImage,
  preloadImages
};function checkOverflow() {
  const swiper = this;
  const {
    isLocked: wasLocked,
    params
  } = swiper;
  const {
    slidesOffsetBefore
  } = params;

  if (slidesOffsetBefore) {
    const lastSlideIndex = swiper.slides.length - 1;
    const lastSlideRightEdge = swiper.slidesGrid[lastSlideIndex] + swiper.slidesSizesGrid[lastSlideIndex] + slidesOffsetBefore * 2;
    swiper.isLocked = swiper.size > lastSlideRightEdge;
  } else {
    swiper.isLocked = swiper.snapGrid.length === 1;
  }

  if (params.allowSlideNext === true) {
    swiper.allowSlideNext = !swiper.isLocked;
  }

  if (params.allowSlidePrev === true) {
    swiper.allowSlidePrev = !swiper.isLocked;
  }

  if (wasLocked && wasLocked !== swiper.isLocked) {
    swiper.isEnd = false;
  }

  if (wasLocked !== swiper.isLocked) {
    swiper.emit(swiper.isLocked ? 'lock' : 'unlock');
  }
}

var checkOverflow$1 = {
  checkOverflow
};var defaults = {
  init: true,
  direction: 'horizontal',
  touchEventsTarget: 'wrapper',
  initialSlide: 0,
  speed: 300,
  cssMode: false,
  updateOnWindowResize: true,
  resizeObserver: true,
  nested: false,
  createElements: false,
  enabled: true,
  focusableElements: 'input, select, option, textarea, button, video, label',
  // Overrides
  width: null,
  height: null,
  //
  preventInteractionOnTransition: false,
  // ssr
  userAgent: null,
  url: null,
  // To support iOS's swipe-to-go-back gesture (when being used in-app).
  edgeSwipeDetection: false,
  edgeSwipeThreshold: 20,
  // Autoheight
  autoHeight: false,
  // Set wrapper width
  setWrapperSize: false,
  // Virtual Translate
  virtualTranslate: false,
  // Effects
  effect: 'slide',
  // 'slide' or 'fade' or 'cube' or 'coverflow' or 'flip'
  // Breakpoints
  breakpoints: undefined,
  breakpointsBase: 'window',
  // Slides grid
  spaceBetween: 0,
  slidesPerView: 1,
  slidesPerGroup: 1,
  slidesPerGroupSkip: 0,
  slidesPerGroupAuto: false,
  centeredSlides: false,
  centeredSlidesBounds: false,
  slidesOffsetBefore: 0,
  // in px
  slidesOffsetAfter: 0,
  // in px
  normalizeSlideIndex: true,
  centerInsufficientSlides: false,
  // Disable swiper and hide navigation when container not overflow
  watchOverflow: true,
  // Round length
  roundLengths: false,
  // Touches
  touchRatio: 1,
  touchAngle: 45,
  simulateTouch: true,
  shortSwipes: true,
  longSwipes: true,
  longSwipesRatio: 0.5,
  longSwipesMs: 300,
  followFinger: true,
  allowTouchMove: true,
  threshold: 0,
  touchMoveStopPropagation: false,
  touchStartPreventDefault: true,
  touchStartForcePreventDefault: false,
  touchReleaseOnEdges: false,
  // Unique Navigation Elements
  uniqueNavElements: true,
  // Resistance
  resistance: true,
  resistanceRatio: 0.85,
  // Progress
  watchSlidesProgress: false,
  // Cursor
  grabCursor: false,
  // Clicks
  preventClicks: true,
  preventClicksPropagation: true,
  slideToClickedSlide: false,
  // Images
  preloadImages: true,
  updateOnImagesReady: true,
  // loop
  loop: false,
  loopAdditionalSlides: 0,
  loopedSlides: null,
  loopedSlidesLimit: true,
  loopFillGroupWithBlank: false,
  loopPreventsSlide: true,
  // rewind
  rewind: false,
  // Swiping/no swiping
  allowSlidePrev: true,
  allowSlideNext: true,
  swipeHandler: null,
  // '.swipe-handler',
  noSwiping: true,
  noSwipingClass: 'swiper-no-swiping',
  noSwipingSelector: null,
  // Passive Listeners
  passiveListeners: true,
  maxBackfaceHiddenSlides: 10,
  // NS
  containerModifierClass: 'swiper-',
  // NEW
  slideClass: 'swiper-slide',
  slideBlankClass: 'swiper-slide-invisible-blank',
  slideActiveClass: 'swiper-slide-active',
  slideDuplicateActiveClass: 'swiper-slide-duplicate-active',
  slideVisibleClass: 'swiper-slide-visible',
  slideDuplicateClass: 'swiper-slide-duplicate',
  slideNextClass: 'swiper-slide-next',
  slideDuplicateNextClass: 'swiper-slide-duplicate-next',
  slidePrevClass: 'swiper-slide-prev',
  slideDuplicatePrevClass: 'swiper-slide-duplicate-prev',
  wrapperClass: 'swiper-wrapper',
  // Callbacks
  runCallbacksOnInit: true,
  // Internals
  _emitClasses: false
};function moduleExtendParams(params, allModulesParams) {
  return function extendParams(obj = {}) {
    const moduleParamName = Object.keys(obj)[0];
    const moduleParams = obj[moduleParamName];

    if (typeof moduleParams !== 'object' || moduleParams === null) {
      extend(allModulesParams, obj);
      return;
    }

    if (['navigation', 'pagination', 'scrollbar'].indexOf(moduleParamName) >= 0 && params[moduleParamName] === true) {
      params[moduleParamName] = {
        auto: true
      };
    }

    if (!(moduleParamName in params && 'enabled' in moduleParams)) {
      extend(allModulesParams, obj);
      return;
    }

    if (params[moduleParamName] === true) {
      params[moduleParamName] = {
        enabled: true
      };
    }

    if (typeof params[moduleParamName] === 'object' && !('enabled' in params[moduleParamName])) {
      params[moduleParamName].enabled = true;
    }

    if (!params[moduleParamName]) params[moduleParamName] = {
      enabled: false
    };
    extend(allModulesParams, obj);
  };
}/* eslint no-param-reassign: "off" */
const prototypes = {
  eventsEmitter,
  update,
  translate,
  transition,
  slide,
  loop,
  grabCursor,
  events: events$1,
  breakpoints,
  checkOverflow: checkOverflow$1,
  classes,
  images
};
const extendedDefaults = {};

class Swiper {
  constructor(...args) {
    let el;
    let params;

    if (args.length === 1 && args[0].constructor && Object.prototype.toString.call(args[0]).slice(8, -1) === 'Object') {
      params = args[0];
    } else {
      [el, params] = args;
    }

    if (!params) params = {};
    params = extend({}, params);
    if (el && !params.el) params.el = el;

    if (params.el && $$1(params.el).length > 1) {
      const swipers = [];
      $$1(params.el).each(containerEl => {
        const newParams = extend({}, params, {
          el: containerEl
        });
        swipers.push(new Swiper(newParams));
      }); // eslint-disable-next-line no-constructor-return

      return swipers;
    } // Swiper Instance


    const swiper = this;
    swiper.__swiper__ = true;
    swiper.support = getSupport();
    swiper.device = getDevice({
      userAgent: params.userAgent
    });
    swiper.browser = getBrowser();
    swiper.eventsListeners = {};
    swiper.eventsAnyListeners = [];
    swiper.modules = [...swiper.__modules__];

    if (params.modules && Array.isArray(params.modules)) {
      swiper.modules.push(...params.modules);
    }

    const allModulesParams = {};
    swiper.modules.forEach(mod => {
      mod({
        swiper,
        extendParams: moduleExtendParams(params, allModulesParams),
        on: swiper.on.bind(swiper),
        once: swiper.once.bind(swiper),
        off: swiper.off.bind(swiper),
        emit: swiper.emit.bind(swiper)
      });
    }); // Extend defaults with modules params

    const swiperParams = extend({}, defaults, allModulesParams); // Extend defaults with passed params

    swiper.params = extend({}, swiperParams, extendedDefaults, params);
    swiper.originalParams = extend({}, swiper.params);
    swiper.passedParams = extend({}, params); // add event listeners

    if (swiper.params && swiper.params.on) {
      Object.keys(swiper.params.on).forEach(eventName => {
        swiper.on(eventName, swiper.params.on[eventName]);
      });
    }

    if (swiper.params && swiper.params.onAny) {
      swiper.onAny(swiper.params.onAny);
    } // Save Dom lib


    swiper.$ = $$1; // Extend Swiper

    Object.assign(swiper, {
      enabled: swiper.params.enabled,
      el,
      // Classes
      classNames: [],
      // Slides
      slides: $$1(),
      slidesGrid: [],
      snapGrid: [],
      slidesSizesGrid: [],

      // isDirection
      isHorizontal() {
        return swiper.params.direction === 'horizontal';
      },

      isVertical() {
        return swiper.params.direction === 'vertical';
      },

      // Indexes
      activeIndex: 0,
      realIndex: 0,
      //
      isBeginning: true,
      isEnd: false,
      // Props
      translate: 0,
      previousTranslate: 0,
      progress: 0,
      velocity: 0,
      animating: false,
      // Locks
      allowSlideNext: swiper.params.allowSlideNext,
      allowSlidePrev: swiper.params.allowSlidePrev,
      // Touch Events
      touchEvents: function touchEvents() {
        const touch = ['touchstart', 'touchmove', 'touchend', 'touchcancel'];
        const desktop = ['pointerdown', 'pointermove', 'pointerup'];
        swiper.touchEventsTouch = {
          start: touch[0],
          move: touch[1],
          end: touch[2],
          cancel: touch[3]
        };
        swiper.touchEventsDesktop = {
          start: desktop[0],
          move: desktop[1],
          end: desktop[2]
        };
        return swiper.support.touch || !swiper.params.simulateTouch ? swiper.touchEventsTouch : swiper.touchEventsDesktop;
      }(),
      touchEventsData: {
        isTouched: undefined,
        isMoved: undefined,
        allowTouchCallbacks: undefined,
        touchStartTime: undefined,
        isScrolling: undefined,
        currentTranslate: undefined,
        startTranslate: undefined,
        allowThresholdMove: undefined,
        // Form elements to match
        focusableElements: swiper.params.focusableElements,
        // Last click time
        lastClickTime: now(),
        clickTimeout: undefined,
        // Velocities
        velocities: [],
        allowMomentumBounce: undefined,
        isTouchEvent: undefined,
        startMoving: undefined
      },
      // Clicks
      allowClick: true,
      // Touches
      allowTouchMove: swiper.params.allowTouchMove,
      touches: {
        startX: 0,
        startY: 0,
        currentX: 0,
        currentY: 0,
        diff: 0
      },
      // Images
      imagesToLoad: [],
      imagesLoaded: 0
    });
    swiper.emit('_swiper'); // Init

    if (swiper.params.init) {
      swiper.init();
    } // Return app instance
    // eslint-disable-next-line no-constructor-return


    return swiper;
  }

  enable() {
    const swiper = this;
    if (swiper.enabled) return;
    swiper.enabled = true;

    if (swiper.params.grabCursor) {
      swiper.setGrabCursor();
    }

    swiper.emit('enable');
  }

  disable() {
    const swiper = this;
    if (!swiper.enabled) return;
    swiper.enabled = false;

    if (swiper.params.grabCursor) {
      swiper.unsetGrabCursor();
    }

    swiper.emit('disable');
  }

  setProgress(progress, speed) {
    const swiper = this;
    progress = Math.min(Math.max(progress, 0), 1);
    const min = swiper.minTranslate();
    const max = swiper.maxTranslate();
    const current = (max - min) * progress + min;
    swiper.translateTo(current, typeof speed === 'undefined' ? 0 : speed);
    swiper.updateActiveIndex();
    swiper.updateSlidesClasses();
  }

  emitContainerClasses() {
    const swiper = this;
    if (!swiper.params._emitClasses || !swiper.el) return;
    const cls = swiper.el.className.split(' ').filter(className => {
      return className.indexOf('swiper') === 0 || className.indexOf(swiper.params.containerModifierClass) === 0;
    });
    swiper.emit('_containerClasses', cls.join(' '));
  }

  getSlideClasses(slideEl) {
    const swiper = this;
    if (swiper.destroyed) return '';
    return slideEl.className.split(' ').filter(className => {
      return className.indexOf('swiper-slide') === 0 || className.indexOf(swiper.params.slideClass) === 0;
    }).join(' ');
  }

  emitSlidesClasses() {
    const swiper = this;
    if (!swiper.params._emitClasses || !swiper.el) return;
    const updates = [];
    swiper.slides.each(slideEl => {
      const classNames = swiper.getSlideClasses(slideEl);
      updates.push({
        slideEl,
        classNames
      });
      swiper.emit('_slideClass', slideEl, classNames);
    });
    swiper.emit('_slideClasses', updates);
  }

  slidesPerViewDynamic(view = 'current', exact = false) {
    const swiper = this;
    const {
      params,
      slides,
      slidesGrid,
      slidesSizesGrid,
      size: swiperSize,
      activeIndex
    } = swiper;
    let spv = 1;

    if (params.centeredSlides) {
      let slideSize = slides[activeIndex].swiperSlideSize;
      let breakLoop;

      for (let i = activeIndex + 1; i < slides.length; i += 1) {
        if (slides[i] && !breakLoop) {
          slideSize += slides[i].swiperSlideSize;
          spv += 1;
          if (slideSize > swiperSize) breakLoop = true;
        }
      }

      for (let i = activeIndex - 1; i >= 0; i -= 1) {
        if (slides[i] && !breakLoop) {
          slideSize += slides[i].swiperSlideSize;
          spv += 1;
          if (slideSize > swiperSize) breakLoop = true;
        }
      }
    } else {
      // eslint-disable-next-line
      if (view === 'current') {
        for (let i = activeIndex + 1; i < slides.length; i += 1) {
          const slideInView = exact ? slidesGrid[i] + slidesSizesGrid[i] - slidesGrid[activeIndex] < swiperSize : slidesGrid[i] - slidesGrid[activeIndex] < swiperSize;

          if (slideInView) {
            spv += 1;
          }
        }
      } else {
        // previous
        for (let i = activeIndex - 1; i >= 0; i -= 1) {
          const slideInView = slidesGrid[activeIndex] - slidesGrid[i] < swiperSize;

          if (slideInView) {
            spv += 1;
          }
        }
      }
    }

    return spv;
  }

  update() {
    const swiper = this;
    if (!swiper || swiper.destroyed) return;
    const {
      snapGrid,
      params
    } = swiper; // Breakpoints

    if (params.breakpoints) {
      swiper.setBreakpoint();
    }

    swiper.updateSize();
    swiper.updateSlides();
    swiper.updateProgress();
    swiper.updateSlidesClasses();

    function setTranslate() {
      const translateValue = swiper.rtlTranslate ? swiper.translate * -1 : swiper.translate;
      const newTranslate = Math.min(Math.max(translateValue, swiper.maxTranslate()), swiper.minTranslate());
      swiper.setTranslate(newTranslate);
      swiper.updateActiveIndex();
      swiper.updateSlidesClasses();
    }

    let translated;

    if (swiper.params.freeMode && swiper.params.freeMode.enabled) {
      setTranslate();

      if (swiper.params.autoHeight) {
        swiper.updateAutoHeight();
      }
    } else {
      if ((swiper.params.slidesPerView === 'auto' || swiper.params.slidesPerView > 1) && swiper.isEnd && !swiper.params.centeredSlides) {
        translated = swiper.slideTo(swiper.slides.length - 1, 0, false, true);
      } else {
        translated = swiper.slideTo(swiper.activeIndex, 0, false, true);
      }

      if (!translated) {
        setTranslate();
      }
    }

    if (params.watchOverflow && snapGrid !== swiper.snapGrid) {
      swiper.checkOverflow();
    }

    swiper.emit('update');
  }

  changeDirection(newDirection, needUpdate = true) {
    const swiper = this;
    const currentDirection = swiper.params.direction;

    if (!newDirection) {
      // eslint-disable-next-line
      newDirection = currentDirection === 'horizontal' ? 'vertical' : 'horizontal';
    }

    if (newDirection === currentDirection || newDirection !== 'horizontal' && newDirection !== 'vertical') {
      return swiper;
    }

    swiper.$el.removeClass(`${swiper.params.containerModifierClass}${currentDirection}`).addClass(`${swiper.params.containerModifierClass}${newDirection}`);
    swiper.emitContainerClasses();
    swiper.params.direction = newDirection;
    swiper.slides.each(slideEl => {
      if (newDirection === 'vertical') {
        slideEl.style.width = '';
      } else {
        slideEl.style.height = '';
      }
    });
    swiper.emit('changeDirection');
    if (needUpdate) swiper.update();
    return swiper;
  }

  changeLanguageDirection(direction) {
    const swiper = this;
    if (swiper.rtl && direction === 'rtl' || !swiper.rtl && direction === 'ltr') return;
    swiper.rtl = direction === 'rtl';
    swiper.rtlTranslate = swiper.params.direction === 'horizontal' && swiper.rtl;

    if (swiper.rtl) {
      swiper.$el.addClass(`${swiper.params.containerModifierClass}rtl`);
      swiper.el.dir = 'rtl';
    } else {
      swiper.$el.removeClass(`${swiper.params.containerModifierClass}rtl`);
      swiper.el.dir = 'ltr';
    }

    swiper.update();
  }

  mount(el) {
    const swiper = this;
    if (swiper.mounted) return true; // Find el

    const $el = $$1(el || swiper.params.el);
    el = $el[0];

    if (!el) {
      return false;
    }

    el.swiper = swiper;

    const getWrapperSelector = () => {
      return `.${(swiper.params.wrapperClass || '').trim().split(' ').join('.')}`;
    };

    const getWrapper = () => {
      if (el && el.shadowRoot && el.shadowRoot.querySelector) {
        const res = $$1(el.shadowRoot.querySelector(getWrapperSelector())); // Children needs to return slot items

        res.children = options => $el.children(options);

        return res;
      }

      if (!$el.children) {
        return $$1($el).children(getWrapperSelector());
      }

      return $el.children(getWrapperSelector());
    }; // Find Wrapper


    let $wrapperEl = getWrapper();

    if ($wrapperEl.length === 0 && swiper.params.createElements) {
      const document = getDocument();
      const wrapper = document.createElement('div');
      $wrapperEl = $$1(wrapper);
      wrapper.className = swiper.params.wrapperClass;
      $el.append(wrapper);
      $el.children(`.${swiper.params.slideClass}`).each(slideEl => {
        $wrapperEl.append(slideEl);
      });
    }

    Object.assign(swiper, {
      $el,
      el,
      $wrapperEl,
      wrapperEl: $wrapperEl[0],
      mounted: true,
      // RTL
      rtl: el.dir.toLowerCase() === 'rtl' || $el.css('direction') === 'rtl',
      rtlTranslate: swiper.params.direction === 'horizontal' && (el.dir.toLowerCase() === 'rtl' || $el.css('direction') === 'rtl'),
      wrongRTL: $wrapperEl.css('display') === '-webkit-box'
    });
    return true;
  }

  init(el) {
    const swiper = this;
    if (swiper.initialized) return swiper;
    const mounted = swiper.mount(el);
    if (mounted === false) return swiper;
    swiper.emit('beforeInit'); // Set breakpoint

    if (swiper.params.breakpoints) {
      swiper.setBreakpoint();
    } // Add Classes


    swiper.addClasses(); // Create loop

    if (swiper.params.loop) {
      swiper.loopCreate();
    } // Update size


    swiper.updateSize(); // Update slides

    swiper.updateSlides();

    if (swiper.params.watchOverflow) {
      swiper.checkOverflow();
    } // Set Grab Cursor


    if (swiper.params.grabCursor && swiper.enabled) {
      swiper.setGrabCursor();
    }

    if (swiper.params.preloadImages) {
      swiper.preloadImages();
    } // Slide To Initial Slide


    if (swiper.params.loop) {
      swiper.slideTo(swiper.params.initialSlide + swiper.loopedSlides, 0, swiper.params.runCallbacksOnInit, false, true);
    } else {
      swiper.slideTo(swiper.params.initialSlide, 0, swiper.params.runCallbacksOnInit, false, true);
    } // Attach events


    swiper.attachEvents(); // Init Flag

    swiper.initialized = true; // Emit

    swiper.emit('init');
    swiper.emit('afterInit');
    return swiper;
  }

  destroy(deleteInstance = true, cleanStyles = true) {
    const swiper = this;
    const {
      params,
      $el,
      $wrapperEl,
      slides
    } = swiper;

    if (typeof swiper.params === 'undefined' || swiper.destroyed) {
      return null;
    }

    swiper.emit('beforeDestroy'); // Init Flag

    swiper.initialized = false; // Detach events

    swiper.detachEvents(); // Destroy loop

    if (params.loop) {
      swiper.loopDestroy();
    } // Cleanup styles


    if (cleanStyles) {
      swiper.removeClasses();
      $el.removeAttr('style');
      $wrapperEl.removeAttr('style');

      if (slides && slides.length) {
        slides.removeClass([params.slideVisibleClass, params.slideActiveClass, params.slideNextClass, params.slidePrevClass].join(' ')).removeAttr('style').removeAttr('data-swiper-slide-index');
      }
    }

    swiper.emit('destroy'); // Detach emitter events

    Object.keys(swiper.eventsListeners).forEach(eventName => {
      swiper.off(eventName);
    });

    if (deleteInstance !== false) {
      swiper.$el[0].swiper = null;
      deleteProps(swiper);
    }

    swiper.destroyed = true;
    return null;
  }

  static extendDefaults(newDefaults) {
    extend(extendedDefaults, newDefaults);
  }

  static get extendedDefaults() {
    return extendedDefaults;
  }

  static get defaults() {
    return defaults;
  }

  static installModule(mod) {
    if (!Swiper.prototype.__modules__) Swiper.prototype.__modules__ = [];
    const modules = Swiper.prototype.__modules__;

    if (typeof mod === 'function' && modules.indexOf(mod) < 0) {
      modules.push(mod);
    }
  }

  static use(module) {
    if (Array.isArray(module)) {
      module.forEach(m => Swiper.installModule(m));
      return Swiper;
    }

    Swiper.installModule(module);
    return Swiper;
  }

}

Object.keys(prototypes).forEach(prototypeGroup => {
  Object.keys(prototypes[prototypeGroup]).forEach(protoMethod => {
    Swiper.prototype[protoMethod] = prototypes[prototypeGroup][protoMethod];
  });
});
Swiper.use([Resize, Observer$1]);function Virtual({
  swiper,
  extendParams,
  on,
  emit
}) {
  extendParams({
    virtual: {
      enabled: false,
      slides: [],
      cache: true,
      renderSlide: null,
      renderExternal: null,
      renderExternalUpdate: true,
      addSlidesBefore: 0,
      addSlidesAfter: 0
    }
  });
  let cssModeTimeout;
  swiper.virtual = {
    cache: {},
    from: undefined,
    to: undefined,
    slides: [],
    offset: 0,
    slidesGrid: []
  };

  function renderSlide(slide, index) {
    const params = swiper.params.virtual;

    if (params.cache && swiper.virtual.cache[index]) {
      return swiper.virtual.cache[index];
    }

    const $slideEl = params.renderSlide ? $$1(params.renderSlide.call(swiper, slide, index)) : $$1(`<div class="${swiper.params.slideClass}" data-swiper-slide-index="${index}">${slide}</div>`);
    if (!$slideEl.attr('data-swiper-slide-index')) $slideEl.attr('data-swiper-slide-index', index);
    if (params.cache) swiper.virtual.cache[index] = $slideEl;
    return $slideEl;
  }

  function update(force) {
    const {
      slidesPerView,
      slidesPerGroup,
      centeredSlides
    } = swiper.params;
    const {
      addSlidesBefore,
      addSlidesAfter
    } = swiper.params.virtual;
    const {
      from: previousFrom,
      to: previousTo,
      slides,
      slidesGrid: previousSlidesGrid,
      offset: previousOffset
    } = swiper.virtual;

    if (!swiper.params.cssMode) {
      swiper.updateActiveIndex();
    }

    const activeIndex = swiper.activeIndex || 0;
    let offsetProp;
    if (swiper.rtlTranslate) offsetProp = 'right';else offsetProp = swiper.isHorizontal() ? 'left' : 'top';
    let slidesAfter;
    let slidesBefore;

    if (centeredSlides) {
      slidesAfter = Math.floor(slidesPerView / 2) + slidesPerGroup + addSlidesAfter;
      slidesBefore = Math.floor(slidesPerView / 2) + slidesPerGroup + addSlidesBefore;
    } else {
      slidesAfter = slidesPerView + (slidesPerGroup - 1) + addSlidesAfter;
      slidesBefore = slidesPerGroup + addSlidesBefore;
    }

    const from = Math.max((activeIndex || 0) - slidesBefore, 0);
    const to = Math.min((activeIndex || 0) + slidesAfter, slides.length - 1);
    const offset = (swiper.slidesGrid[from] || 0) - (swiper.slidesGrid[0] || 0);
    Object.assign(swiper.virtual, {
      from,
      to,
      offset,
      slidesGrid: swiper.slidesGrid
    });

    function onRendered() {
      swiper.updateSlides();
      swiper.updateProgress();
      swiper.updateSlidesClasses();

      if (swiper.lazy && swiper.params.lazy.enabled) {
        swiper.lazy.load();
      }

      emit('virtualUpdate');
    }

    if (previousFrom === from && previousTo === to && !force) {
      if (swiper.slidesGrid !== previousSlidesGrid && offset !== previousOffset) {
        swiper.slides.css(offsetProp, `${offset}px`);
      }

      swiper.updateProgress();
      emit('virtualUpdate');
      return;
    }

    if (swiper.params.virtual.renderExternal) {
      swiper.params.virtual.renderExternal.call(swiper, {
        offset,
        from,
        to,
        slides: function getSlides() {
          const slidesToRender = [];

          for (let i = from; i <= to; i += 1) {
            slidesToRender.push(slides[i]);
          }

          return slidesToRender;
        }()
      });

      if (swiper.params.virtual.renderExternalUpdate) {
        onRendered();
      } else {
        emit('virtualUpdate');
      }

      return;
    }

    const prependIndexes = [];
    const appendIndexes = [];

    if (force) {
      swiper.$wrapperEl.find(`.${swiper.params.slideClass}`).remove();
    } else {
      for (let i = previousFrom; i <= previousTo; i += 1) {
        if (i < from || i > to) {
          swiper.$wrapperEl.find(`.${swiper.params.slideClass}[data-swiper-slide-index="${i}"]`).remove();
        }
      }
    }

    for (let i = 0; i < slides.length; i += 1) {
      if (i >= from && i <= to) {
        if (typeof previousTo === 'undefined' || force) {
          appendIndexes.push(i);
        } else {
          if (i > previousTo) appendIndexes.push(i);
          if (i < previousFrom) prependIndexes.push(i);
        }
      }
    }

    appendIndexes.forEach(index => {
      swiper.$wrapperEl.append(renderSlide(slides[index], index));
    });
    prependIndexes.sort((a, b) => b - a).forEach(index => {
      swiper.$wrapperEl.prepend(renderSlide(slides[index], index));
    });
    swiper.$wrapperEl.children('.swiper-slide').css(offsetProp, `${offset}px`);
    onRendered();
  }

  function appendSlide(slides) {
    if (typeof slides === 'object' && 'length' in slides) {
      for (let i = 0; i < slides.length; i += 1) {
        if (slides[i]) swiper.virtual.slides.push(slides[i]);
      }
    } else {
      swiper.virtual.slides.push(slides);
    }

    update(true);
  }

  function prependSlide(slides) {
    const activeIndex = swiper.activeIndex;
    let newActiveIndex = activeIndex + 1;
    let numberOfNewSlides = 1;

    if (Array.isArray(slides)) {
      for (let i = 0; i < slides.length; i += 1) {
        if (slides[i]) swiper.virtual.slides.unshift(slides[i]);
      }

      newActiveIndex = activeIndex + slides.length;
      numberOfNewSlides = slides.length;
    } else {
      swiper.virtual.slides.unshift(slides);
    }

    if (swiper.params.virtual.cache) {
      const cache = swiper.virtual.cache;
      const newCache = {};
      Object.keys(cache).forEach(cachedIndex => {
        const $cachedEl = cache[cachedIndex];
        const cachedElIndex = $cachedEl.attr('data-swiper-slide-index');

        if (cachedElIndex) {
          $cachedEl.attr('data-swiper-slide-index', parseInt(cachedElIndex, 10) + numberOfNewSlides);
        }

        newCache[parseInt(cachedIndex, 10) + numberOfNewSlides] = $cachedEl;
      });
      swiper.virtual.cache = newCache;
    }

    update(true);
    swiper.slideTo(newActiveIndex, 0);
  }

  function removeSlide(slidesIndexes) {
    if (typeof slidesIndexes === 'undefined' || slidesIndexes === null) return;
    let activeIndex = swiper.activeIndex;

    if (Array.isArray(slidesIndexes)) {
      for (let i = slidesIndexes.length - 1; i >= 0; i -= 1) {
        swiper.virtual.slides.splice(slidesIndexes[i], 1);

        if (swiper.params.virtual.cache) {
          delete swiper.virtual.cache[slidesIndexes[i]];
        }

        if (slidesIndexes[i] < activeIndex) activeIndex -= 1;
        activeIndex = Math.max(activeIndex, 0);
      }
    } else {
      swiper.virtual.slides.splice(slidesIndexes, 1);

      if (swiper.params.virtual.cache) {
        delete swiper.virtual.cache[slidesIndexes];
      }

      if (slidesIndexes < activeIndex) activeIndex -= 1;
      activeIndex = Math.max(activeIndex, 0);
    }

    update(true);
    swiper.slideTo(activeIndex, 0);
  }

  function removeAllSlides() {
    swiper.virtual.slides = [];

    if (swiper.params.virtual.cache) {
      swiper.virtual.cache = {};
    }

    update(true);
    swiper.slideTo(0, 0);
  }

  on('beforeInit', () => {
    if (!swiper.params.virtual.enabled) return;
    swiper.virtual.slides = swiper.params.virtual.slides;
    swiper.classNames.push(`${swiper.params.containerModifierClass}virtual`);
    swiper.params.watchSlidesProgress = true;
    swiper.originalParams.watchSlidesProgress = true;

    if (!swiper.params.initialSlide) {
      update();
    }
  });
  on('setTranslate', () => {
    if (!swiper.params.virtual.enabled) return;

    if (swiper.params.cssMode && !swiper._immediateVirtual) {
      clearTimeout(cssModeTimeout);
      cssModeTimeout = setTimeout(() => {
        update();
      }, 100);
    } else {
      update();
    }
  });
  on('init update resize', () => {
    if (!swiper.params.virtual.enabled) return;

    if (swiper.params.cssMode) {
      setCSSProperty(swiper.wrapperEl, '--swiper-virtual-size', `${swiper.virtualSize}px`);
    }
  });
  Object.assign(swiper.virtual, {
    appendSlide,
    prependSlide,
    removeSlide,
    removeAllSlides,
    update
  });
}/* eslint-disable consistent-return */
function Keyboard({
  swiper,
  extendParams,
  on,
  emit
}) {
  const document = getDocument();
  const window = getWindow();
  swiper.keyboard = {
    enabled: false
  };
  extendParams({
    keyboard: {
      enabled: false,
      onlyInViewport: true,
      pageUpDown: true
    }
  });

  function handle(event) {
    if (!swiper.enabled) return;
    const {
      rtlTranslate: rtl
    } = swiper;
    let e = event;
    if (e.originalEvent) e = e.originalEvent; // jquery fix

    const kc = e.keyCode || e.charCode;
    const pageUpDown = swiper.params.keyboard.pageUpDown;
    const isPageUp = pageUpDown && kc === 33;
    const isPageDown = pageUpDown && kc === 34;
    const isArrowLeft = kc === 37;
    const isArrowRight = kc === 39;
    const isArrowUp = kc === 38;
    const isArrowDown = kc === 40; // Directions locks

    if (!swiper.allowSlideNext && (swiper.isHorizontal() && isArrowRight || swiper.isVertical() && isArrowDown || isPageDown)) {
      return false;
    }

    if (!swiper.allowSlidePrev && (swiper.isHorizontal() && isArrowLeft || swiper.isVertical() && isArrowUp || isPageUp)) {
      return false;
    }

    if (e.shiftKey || e.altKey || e.ctrlKey || e.metaKey) {
      return undefined;
    }

    if (document.activeElement && document.activeElement.nodeName && (document.activeElement.nodeName.toLowerCase() === 'input' || document.activeElement.nodeName.toLowerCase() === 'textarea')) {
      return undefined;
    }

    if (swiper.params.keyboard.onlyInViewport && (isPageUp || isPageDown || isArrowLeft || isArrowRight || isArrowUp || isArrowDown)) {
      let inView = false; // Check that swiper should be inside of visible area of window

      if (swiper.$el.parents(`.${swiper.params.slideClass}`).length > 0 && swiper.$el.parents(`.${swiper.params.slideActiveClass}`).length === 0) {
        return undefined;
      }

      const $el = swiper.$el;
      const swiperWidth = $el[0].clientWidth;
      const swiperHeight = $el[0].clientHeight;
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const swiperOffset = swiper.$el.offset();
      if (rtl) swiperOffset.left -= swiper.$el[0].scrollLeft;
      const swiperCoord = [[swiperOffset.left, swiperOffset.top], [swiperOffset.left + swiperWidth, swiperOffset.top], [swiperOffset.left, swiperOffset.top + swiperHeight], [swiperOffset.left + swiperWidth, swiperOffset.top + swiperHeight]];

      for (let i = 0; i < swiperCoord.length; i += 1) {
        const point = swiperCoord[i];

        if (point[0] >= 0 && point[0] <= windowWidth && point[1] >= 0 && point[1] <= windowHeight) {
          if (point[0] === 0 && point[1] === 0) continue; // eslint-disable-line

          inView = true;
        }
      }

      if (!inView) return undefined;
    }

    if (swiper.isHorizontal()) {
      if (isPageUp || isPageDown || isArrowLeft || isArrowRight) {
        if (e.preventDefault) e.preventDefault();else e.returnValue = false;
      }

      if ((isPageDown || isArrowRight) && !rtl || (isPageUp || isArrowLeft) && rtl) swiper.slideNext();
      if ((isPageUp || isArrowLeft) && !rtl || (isPageDown || isArrowRight) && rtl) swiper.slidePrev();
    } else {
      if (isPageUp || isPageDown || isArrowUp || isArrowDown) {
        if (e.preventDefault) e.preventDefault();else e.returnValue = false;
      }

      if (isPageDown || isArrowDown) swiper.slideNext();
      if (isPageUp || isArrowUp) swiper.slidePrev();
    }

    emit('keyPress', kc);
    return undefined;
  }

  function enable() {
    if (swiper.keyboard.enabled) return;
    $$1(document).on('keydown', handle);
    swiper.keyboard.enabled = true;
  }

  function disable() {
    if (!swiper.keyboard.enabled) return;
    $$1(document).off('keydown', handle);
    swiper.keyboard.enabled = false;
  }

  on('init', () => {
    if (swiper.params.keyboard.enabled) {
      enable();
    }
  });
  on('destroy', () => {
    if (swiper.keyboard.enabled) {
      disable();
    }
  });
  Object.assign(swiper.keyboard, {
    enable,
    disable
  });
}/* eslint-disable consistent-return */
function Mousewheel({
  swiper,
  extendParams,
  on,
  emit
}) {
  const window = getWindow();
  extendParams({
    mousewheel: {
      enabled: false,
      releaseOnEdges: false,
      invert: false,
      forceToAxis: false,
      sensitivity: 1,
      eventsTarget: 'container',
      thresholdDelta: null,
      thresholdTime: null
    }
  });
  swiper.mousewheel = {
    enabled: false
  };
  let timeout;
  let lastScrollTime = now();
  let lastEventBeforeSnap;
  const recentWheelEvents = [];

  function normalize(e) {
    // Reasonable defaults
    const PIXEL_STEP = 10;
    const LINE_HEIGHT = 40;
    const PAGE_HEIGHT = 800;
    let sX = 0;
    let sY = 0; // spinX, spinY

    let pX = 0;
    let pY = 0; // pixelX, pixelY
    // Legacy

    if ('detail' in e) {
      sY = e.detail;
    }

    if ('wheelDelta' in e) {
      sY = -e.wheelDelta / 120;
    }

    if ('wheelDeltaY' in e) {
      sY = -e.wheelDeltaY / 120;
    }

    if ('wheelDeltaX' in e) {
      sX = -e.wheelDeltaX / 120;
    } // side scrolling on FF with DOMMouseScroll


    if ('axis' in e && e.axis === e.HORIZONTAL_AXIS) {
      sX = sY;
      sY = 0;
    }

    pX = sX * PIXEL_STEP;
    pY = sY * PIXEL_STEP;

    if ('deltaY' in e) {
      pY = e.deltaY;
    }

    if ('deltaX' in e) {
      pX = e.deltaX;
    }

    if (e.shiftKey && !pX) {
      // if user scrolls with shift he wants horizontal scroll
      pX = pY;
      pY = 0;
    }

    if ((pX || pY) && e.deltaMode) {
      if (e.deltaMode === 1) {
        // delta in LINE units
        pX *= LINE_HEIGHT;
        pY *= LINE_HEIGHT;
      } else {
        // delta in PAGE units
        pX *= PAGE_HEIGHT;
        pY *= PAGE_HEIGHT;
      }
    } // Fall-back if spin cannot be determined


    if (pX && !sX) {
      sX = pX < 1 ? -1 : 1;
    }

    if (pY && !sY) {
      sY = pY < 1 ? -1 : 1;
    }

    return {
      spinX: sX,
      spinY: sY,
      pixelX: pX,
      pixelY: pY
    };
  }

  function handleMouseEnter() {
    if (!swiper.enabled) return;
    swiper.mouseEntered = true;
  }

  function handleMouseLeave() {
    if (!swiper.enabled) return;
    swiper.mouseEntered = false;
  }

  function animateSlider(newEvent) {
    if (swiper.params.mousewheel.thresholdDelta && newEvent.delta < swiper.params.mousewheel.thresholdDelta) {
      // Prevent if delta of wheel scroll delta is below configured threshold
      return false;
    }

    if (swiper.params.mousewheel.thresholdTime && now() - lastScrollTime < swiper.params.mousewheel.thresholdTime) {
      // Prevent if time between scrolls is below configured threshold
      return false;
    } // If the movement is NOT big enough and
    // if the last time the user scrolled was too close to the current one (avoid continuously triggering the slider):
    //   Don't go any further (avoid insignificant scroll movement).


    if (newEvent.delta >= 6 && now() - lastScrollTime < 60) {
      // Return false as a default
      return true;
    } // If user is scrolling towards the end:
    //   If the slider hasn't hit the latest slide or
    //   if the slider is a loop and
    //   if the slider isn't moving right now:
    //     Go to next slide and
    //     emit a scroll event.
    // Else (the user is scrolling towards the beginning) and
    // if the slider hasn't hit the first slide or
    // if the slider is a loop and
    // if the slider isn't moving right now:
    //   Go to prev slide and
    //   emit a scroll event.


    if (newEvent.direction < 0) {
      if ((!swiper.isEnd || swiper.params.loop) && !swiper.animating) {
        swiper.slideNext();
        emit('scroll', newEvent.raw);
      }
    } else if ((!swiper.isBeginning || swiper.params.loop) && !swiper.animating) {
      swiper.slidePrev();
      emit('scroll', newEvent.raw);
    } // If you got here is because an animation has been triggered so store the current time


    lastScrollTime = new window.Date().getTime(); // Return false as a default

    return false;
  }

  function releaseScroll(newEvent) {
    const params = swiper.params.mousewheel;

    if (newEvent.direction < 0) {
      if (swiper.isEnd && !swiper.params.loop && params.releaseOnEdges) {
        // Return true to animate scroll on edges
        return true;
      }
    } else if (swiper.isBeginning && !swiper.params.loop && params.releaseOnEdges) {
      // Return true to animate scroll on edges
      return true;
    }

    return false;
  }

  function handle(event) {
    let e = event;
    let disableParentSwiper = true;
    if (!swiper.enabled) return;
    const params = swiper.params.mousewheel;

    if (swiper.params.cssMode) {
      e.preventDefault();
    }

    let target = swiper.$el;

    if (swiper.params.mousewheel.eventsTarget !== 'container') {
      target = $$1(swiper.params.mousewheel.eventsTarget);
    }

    if (!swiper.mouseEntered && !target[0].contains(e.target) && !params.releaseOnEdges) return true;
    if (e.originalEvent) e = e.originalEvent; // jquery fix

    let delta = 0;
    const rtlFactor = swiper.rtlTranslate ? -1 : 1;
    const data = normalize(e);

    if (params.forceToAxis) {
      if (swiper.isHorizontal()) {
        if (Math.abs(data.pixelX) > Math.abs(data.pixelY)) delta = -data.pixelX * rtlFactor;else return true;
      } else if (Math.abs(data.pixelY) > Math.abs(data.pixelX)) delta = -data.pixelY;else return true;
    } else {
      delta = Math.abs(data.pixelX) > Math.abs(data.pixelY) ? -data.pixelX * rtlFactor : -data.pixelY;
    }

    if (delta === 0) return true;
    if (params.invert) delta = -delta; // Get the scroll positions

    let positions = swiper.getTranslate() + delta * params.sensitivity;
    if (positions >= swiper.minTranslate()) positions = swiper.minTranslate();
    if (positions <= swiper.maxTranslate()) positions = swiper.maxTranslate(); // When loop is true:
    //     the disableParentSwiper will be true.
    // When loop is false:
    //     if the scroll positions is not on edge,
    //     then the disableParentSwiper will be true.
    //     if the scroll on edge positions,
    //     then the disableParentSwiper will be false.

    disableParentSwiper = swiper.params.loop ? true : !(positions === swiper.minTranslate() || positions === swiper.maxTranslate());
    if (disableParentSwiper && swiper.params.nested) e.stopPropagation();

    if (!swiper.params.freeMode || !swiper.params.freeMode.enabled) {
      // Register the new event in a variable which stores the relevant data
      const newEvent = {
        time: now(),
        delta: Math.abs(delta),
        direction: Math.sign(delta),
        raw: event
      }; // Keep the most recent events

      if (recentWheelEvents.length >= 2) {
        recentWheelEvents.shift(); // only store the last N events
      }

      const prevEvent = recentWheelEvents.length ? recentWheelEvents[recentWheelEvents.length - 1] : undefined;
      recentWheelEvents.push(newEvent); // If there is at least one previous recorded event:
      //   If direction has changed or
      //   if the scroll is quicker than the previous one:
      //     Animate the slider.
      // Else (this is the first time the wheel is moved):
      //     Animate the slider.

      if (prevEvent) {
        if (newEvent.direction !== prevEvent.direction || newEvent.delta > prevEvent.delta || newEvent.time > prevEvent.time + 150) {
          animateSlider(newEvent);
        }
      } else {
        animateSlider(newEvent);
      } // If it's time to release the scroll:
      //   Return now so you don't hit the preventDefault.


      if (releaseScroll(newEvent)) {
        return true;
      }
    } else {
      // Freemode or scrollContainer:
      // If we recently snapped after a momentum scroll, then ignore wheel events
      // to give time for the deceleration to finish. Stop ignoring after 500 msecs
      // or if it's a new scroll (larger delta or inverse sign as last event before
      // an end-of-momentum snap).
      const newEvent = {
        time: now(),
        delta: Math.abs(delta),
        direction: Math.sign(delta)
      };
      const ignoreWheelEvents = lastEventBeforeSnap && newEvent.time < lastEventBeforeSnap.time + 500 && newEvent.delta <= lastEventBeforeSnap.delta && newEvent.direction === lastEventBeforeSnap.direction;

      if (!ignoreWheelEvents) {
        lastEventBeforeSnap = undefined;

        if (swiper.params.loop) {
          swiper.loopFix();
        }

        let position = swiper.getTranslate() + delta * params.sensitivity;
        const wasBeginning = swiper.isBeginning;
        const wasEnd = swiper.isEnd;
        if (position >= swiper.minTranslate()) position = swiper.minTranslate();
        if (position <= swiper.maxTranslate()) position = swiper.maxTranslate();
        swiper.setTransition(0);
        swiper.setTranslate(position);
        swiper.updateProgress();
        swiper.updateActiveIndex();
        swiper.updateSlidesClasses();

        if (!wasBeginning && swiper.isBeginning || !wasEnd && swiper.isEnd) {
          swiper.updateSlidesClasses();
        }

        if (swiper.params.freeMode.sticky) {
          // When wheel scrolling starts with sticky (aka snap) enabled, then detect
          // the end of a momentum scroll by storing recent (N=15?) wheel events.
          // 1. do all N events have decreasing or same (absolute value) delta?
          // 2. did all N events arrive in the last M (M=500?) msecs?
          // 3. does the earliest event have an (absolute value) delta that's
          //    at least P (P=1?) larger than the most recent event's delta?
          // 4. does the latest event have a delta that's smaller than Q (Q=6?) pixels?
          // If 1-4 are "yes" then we're near the end of a momentum scroll deceleration.
          // Snap immediately and ignore remaining wheel events in this scroll.
          // See comment above for "remaining wheel events in this scroll" determination.
          // If 1-4 aren't satisfied, then wait to snap until 500ms after the last event.
          clearTimeout(timeout);
          timeout = undefined;

          if (recentWheelEvents.length >= 15) {
            recentWheelEvents.shift(); // only store the last N events
          }

          const prevEvent = recentWheelEvents.length ? recentWheelEvents[recentWheelEvents.length - 1] : undefined;
          const firstEvent = recentWheelEvents[0];
          recentWheelEvents.push(newEvent);

          if (prevEvent && (newEvent.delta > prevEvent.delta || newEvent.direction !== prevEvent.direction)) {
            // Increasing or reverse-sign delta means the user started scrolling again. Clear the wheel event log.
            recentWheelEvents.splice(0);
          } else if (recentWheelEvents.length >= 15 && newEvent.time - firstEvent.time < 500 && firstEvent.delta - newEvent.delta >= 1 && newEvent.delta <= 6) {
            // We're at the end of the deceleration of a momentum scroll, so there's no need
            // to wait for more events. Snap ASAP on the next tick.
            // Also, because there's some remaining momentum we'll bias the snap in the
            // direction of the ongoing scroll because it's better UX for the scroll to snap
            // in the same direction as the scroll instead of reversing to snap.  Therefore,
            // if it's already scrolled more than 20% in the current direction, keep going.
            const snapToThreshold = delta > 0 ? 0.8 : 0.2;
            lastEventBeforeSnap = newEvent;
            recentWheelEvents.splice(0);
            timeout = nextTick(() => {
              swiper.slideToClosest(swiper.params.speed, true, undefined, snapToThreshold);
            }, 0); // no delay; move on next tick
          }

          if (!timeout) {
            // if we get here, then we haven't detected the end of a momentum scroll, so
            // we'll consider a scroll "complete" when there haven't been any wheel events
            // for 500ms.
            timeout = nextTick(() => {
              const snapToThreshold = 0.5;
              lastEventBeforeSnap = newEvent;
              recentWheelEvents.splice(0);
              swiper.slideToClosest(swiper.params.speed, true, undefined, snapToThreshold);
            }, 500);
          }
        } // Emit event


        if (!ignoreWheelEvents) emit('scroll', e); // Stop autoplay

        if (swiper.params.autoplay && swiper.params.autoplayDisableOnInteraction) swiper.autoplay.stop(); // Return page scroll on edge positions

        if (position === swiper.minTranslate() || position === swiper.maxTranslate()) return true;
      }
    }

    if (e.preventDefault) e.preventDefault();else e.returnValue = false;
    return false;
  }

  function events(method) {
    let target = swiper.$el;

    if (swiper.params.mousewheel.eventsTarget !== 'container') {
      target = $$1(swiper.params.mousewheel.eventsTarget);
    }

    target[method]('mouseenter', handleMouseEnter);
    target[method]('mouseleave', handleMouseLeave);
    target[method]('wheel', handle);
  }

  function enable() {
    if (swiper.params.cssMode) {
      swiper.wrapperEl.removeEventListener('wheel', handle);
      return true;
    }

    if (swiper.mousewheel.enabled) return false;
    events('on');
    swiper.mousewheel.enabled = true;
    return true;
  }

  function disable() {
    if (swiper.params.cssMode) {
      swiper.wrapperEl.addEventListener(event, handle);
      return true;
    }

    if (!swiper.mousewheel.enabled) return false;
    events('off');
    swiper.mousewheel.enabled = false;
    return true;
  }

  on('init', () => {
    if (!swiper.params.mousewheel.enabled && swiper.params.cssMode) {
      disable();
    }

    if (swiper.params.mousewheel.enabled) enable();
  });
  on('destroy', () => {
    if (swiper.params.cssMode) {
      enable();
    }

    if (swiper.mousewheel.enabled) disable();
  });
  Object.assign(swiper.mousewheel, {
    enable,
    disable
  });
}function createElementIfNotDefined(swiper, originalParams, params, checkProps) {
  const document = getDocument();

  if (swiper.params.createElements) {
    Object.keys(checkProps).forEach(key => {
      if (!params[key] && params.auto === true) {
        let element = swiper.$el.children(`.${checkProps[key]}`)[0];

        if (!element) {
          element = document.createElement('div');
          element.className = checkProps[key];
          swiper.$el.append(element);
        }

        params[key] = element;
        originalParams[key] = element;
      }
    });
  }

  return params;
}function Navigation({
  swiper,
  extendParams,
  on,
  emit
}) {
  extendParams({
    navigation: {
      nextEl: null,
      prevEl: null,
      hideOnClick: false,
      disabledClass: 'swiper-button-disabled',
      hiddenClass: 'swiper-button-hidden',
      lockClass: 'swiper-button-lock',
      navigationDisabledClass: 'swiper-navigation-disabled'
    }
  });
  swiper.navigation = {
    nextEl: null,
    $nextEl: null,
    prevEl: null,
    $prevEl: null
  };

  function getEl(el) {
    let $el;

    if (el) {
      $el = $$1(el);

      if (swiper.params.uniqueNavElements && typeof el === 'string' && $el.length > 1 && swiper.$el.find(el).length === 1) {
        $el = swiper.$el.find(el);
      }
    }

    return $el;
  }

  function toggleEl($el, disabled) {
    const params = swiper.params.navigation;

    if ($el && $el.length > 0) {
      $el[disabled ? 'addClass' : 'removeClass'](params.disabledClass);
      if ($el[0] && $el[0].tagName === 'BUTTON') $el[0].disabled = disabled;

      if (swiper.params.watchOverflow && swiper.enabled) {
        $el[swiper.isLocked ? 'addClass' : 'removeClass'](params.lockClass);
      }
    }
  }

  function update() {
    // Update Navigation Buttons
    if (swiper.params.loop) return;
    const {
      $nextEl,
      $prevEl
    } = swiper.navigation;
    toggleEl($prevEl, swiper.isBeginning && !swiper.params.rewind);
    toggleEl($nextEl, swiper.isEnd && !swiper.params.rewind);
  }

  function onPrevClick(e) {
    e.preventDefault();
    if (swiper.isBeginning && !swiper.params.loop && !swiper.params.rewind) return;
    swiper.slidePrev();
    emit('navigationPrev');
  }

  function onNextClick(e) {
    e.preventDefault();
    if (swiper.isEnd && !swiper.params.loop && !swiper.params.rewind) return;
    swiper.slideNext();
    emit('navigationNext');
  }

  function init() {
    const params = swiper.params.navigation;
    swiper.params.navigation = createElementIfNotDefined(swiper, swiper.originalParams.navigation, swiper.params.navigation, {
      nextEl: 'swiper-button-next',
      prevEl: 'swiper-button-prev'
    });
    if (!(params.nextEl || params.prevEl)) return;
    const $nextEl = getEl(params.nextEl);
    const $prevEl = getEl(params.prevEl);

    if ($nextEl && $nextEl.length > 0) {
      $nextEl.on('click', onNextClick);
    }

    if ($prevEl && $prevEl.length > 0) {
      $prevEl.on('click', onPrevClick);
    }

    Object.assign(swiper.navigation, {
      $nextEl,
      nextEl: $nextEl && $nextEl[0],
      $prevEl,
      prevEl: $prevEl && $prevEl[0]
    });

    if (!swiper.enabled) {
      if ($nextEl) $nextEl.addClass(params.lockClass);
      if ($prevEl) $prevEl.addClass(params.lockClass);
    }
  }

  function destroy() {
    const {
      $nextEl,
      $prevEl
    } = swiper.navigation;

    if ($nextEl && $nextEl.length) {
      $nextEl.off('click', onNextClick);
      $nextEl.removeClass(swiper.params.navigation.disabledClass);
    }

    if ($prevEl && $prevEl.length) {
      $prevEl.off('click', onPrevClick);
      $prevEl.removeClass(swiper.params.navigation.disabledClass);
    }
  }

  on('init', () => {
    if (swiper.params.navigation.enabled === false) {
      // eslint-disable-next-line
      disable();
    } else {
      init();
      update();
    }
  });
  on('toEdge fromEdge lock unlock', () => {
    update();
  });
  on('destroy', () => {
    destroy();
  });
  on('enable disable', () => {
    const {
      $nextEl,
      $prevEl
    } = swiper.navigation;

    if ($nextEl) {
      $nextEl[swiper.enabled ? 'removeClass' : 'addClass'](swiper.params.navigation.lockClass);
    }

    if ($prevEl) {
      $prevEl[swiper.enabled ? 'removeClass' : 'addClass'](swiper.params.navigation.lockClass);
    }
  });
  on('click', (_s, e) => {
    const {
      $nextEl,
      $prevEl
    } = swiper.navigation;
    const targetEl = e.target;

    if (swiper.params.navigation.hideOnClick && !$$1(targetEl).is($prevEl) && !$$1(targetEl).is($nextEl)) {
      if (swiper.pagination && swiper.params.pagination && swiper.params.pagination.clickable && (swiper.pagination.el === targetEl || swiper.pagination.el.contains(targetEl))) return;
      let isHidden;

      if ($nextEl) {
        isHidden = $nextEl.hasClass(swiper.params.navigation.hiddenClass);
      } else if ($prevEl) {
        isHidden = $prevEl.hasClass(swiper.params.navigation.hiddenClass);
      }

      if (isHidden === true) {
        emit('navigationShow');
      } else {
        emit('navigationHide');
      }

      if ($nextEl) {
        $nextEl.toggleClass(swiper.params.navigation.hiddenClass);
      }

      if ($prevEl) {
        $prevEl.toggleClass(swiper.params.navigation.hiddenClass);
      }
    }
  });

  const enable = () => {
    swiper.$el.removeClass(swiper.params.navigation.navigationDisabledClass);
    init();
    update();
  };

  const disable = () => {
    swiper.$el.addClass(swiper.params.navigation.navigationDisabledClass);
    destroy();
  };

  Object.assign(swiper.navigation, {
    enable,
    disable,
    update,
    init,
    destroy
  });
}function classesToSelector(classes = '') {
  return `.${classes.trim().replace(/([\.:!\/])/g, '\\$1') // eslint-disable-line
  .replace(/ /g, '.')}`;
}function Pagination({
  swiper,
  extendParams,
  on,
  emit
}) {
  const pfx = 'swiper-pagination';
  extendParams({
    pagination: {
      el: null,
      bulletElement: 'span',
      clickable: false,
      hideOnClick: false,
      renderBullet: null,
      renderProgressbar: null,
      renderFraction: null,
      renderCustom: null,
      progressbarOpposite: false,
      type: 'bullets',
      // 'bullets' or 'progressbar' or 'fraction' or 'custom'
      dynamicBullets: false,
      dynamicMainBullets: 1,
      formatFractionCurrent: number => number,
      formatFractionTotal: number => number,
      bulletClass: `${pfx}-bullet`,
      bulletActiveClass: `${pfx}-bullet-active`,
      modifierClass: `${pfx}-`,
      currentClass: `${pfx}-current`,
      totalClass: `${pfx}-total`,
      hiddenClass: `${pfx}-hidden`,
      progressbarFillClass: `${pfx}-progressbar-fill`,
      progressbarOppositeClass: `${pfx}-progressbar-opposite`,
      clickableClass: `${pfx}-clickable`,
      lockClass: `${pfx}-lock`,
      horizontalClass: `${pfx}-horizontal`,
      verticalClass: `${pfx}-vertical`,
      paginationDisabledClass: `${pfx}-disabled`
    }
  });
  swiper.pagination = {
    el: null,
    $el: null,
    bullets: []
  };
  let bulletSize;
  let dynamicBulletIndex = 0;

  function isPaginationDisabled() {
    return !swiper.params.pagination.el || !swiper.pagination.el || !swiper.pagination.$el || swiper.pagination.$el.length === 0;
  }

  function setSideBullets($bulletEl, position) {
    const {
      bulletActiveClass
    } = swiper.params.pagination;
    $bulletEl[position]().addClass(`${bulletActiveClass}-${position}`)[position]().addClass(`${bulletActiveClass}-${position}-${position}`);
  }

  function update() {
    // Render || Update Pagination bullets/items
    const rtl = swiper.rtl;
    const params = swiper.params.pagination;
    if (isPaginationDisabled()) return;
    const slidesLength = swiper.virtual && swiper.params.virtual.enabled ? swiper.virtual.slides.length : swiper.slides.length;
    const $el = swiper.pagination.$el; // Current/Total

    let current;
    const total = swiper.params.loop ? Math.ceil((slidesLength - swiper.loopedSlides * 2) / swiper.params.slidesPerGroup) : swiper.snapGrid.length;

    if (swiper.params.loop) {
      current = Math.ceil((swiper.activeIndex - swiper.loopedSlides) / swiper.params.slidesPerGroup);

      if (current > slidesLength - 1 - swiper.loopedSlides * 2) {
        current -= slidesLength - swiper.loopedSlides * 2;
      }

      if (current > total - 1) current -= total;
      if (current < 0 && swiper.params.paginationType !== 'bullets') current = total + current;
    } else if (typeof swiper.snapIndex !== 'undefined') {
      current = swiper.snapIndex;
    } else {
      current = swiper.activeIndex || 0;
    } // Types


    if (params.type === 'bullets' && swiper.pagination.bullets && swiper.pagination.bullets.length > 0) {
      const bullets = swiper.pagination.bullets;
      let firstIndex;
      let lastIndex;
      let midIndex;

      if (params.dynamicBullets) {
        bulletSize = bullets.eq(0)[swiper.isHorizontal() ? 'outerWidth' : 'outerHeight'](true);
        $el.css(swiper.isHorizontal() ? 'width' : 'height', `${bulletSize * (params.dynamicMainBullets + 4)}px`);

        if (params.dynamicMainBullets > 1 && swiper.previousIndex !== undefined) {
          dynamicBulletIndex += current - (swiper.previousIndex - swiper.loopedSlides || 0);

          if (dynamicBulletIndex > params.dynamicMainBullets - 1) {
            dynamicBulletIndex = params.dynamicMainBullets - 1;
          } else if (dynamicBulletIndex < 0) {
            dynamicBulletIndex = 0;
          }
        }

        firstIndex = Math.max(current - dynamicBulletIndex, 0);
        lastIndex = firstIndex + (Math.min(bullets.length, params.dynamicMainBullets) - 1);
        midIndex = (lastIndex + firstIndex) / 2;
      }

      bullets.removeClass(['', '-next', '-next-next', '-prev', '-prev-prev', '-main'].map(suffix => `${params.bulletActiveClass}${suffix}`).join(' '));

      if ($el.length > 1) {
        bullets.each(bullet => {
          const $bullet = $$1(bullet);
          const bulletIndex = $bullet.index();

          if (bulletIndex === current) {
            $bullet.addClass(params.bulletActiveClass);
          }

          if (params.dynamicBullets) {
            if (bulletIndex >= firstIndex && bulletIndex <= lastIndex) {
              $bullet.addClass(`${params.bulletActiveClass}-main`);
            }

            if (bulletIndex === firstIndex) {
              setSideBullets($bullet, 'prev');
            }

            if (bulletIndex === lastIndex) {
              setSideBullets($bullet, 'next');
            }
          }
        });
      } else {
        const $bullet = bullets.eq(current);
        const bulletIndex = $bullet.index();
        $bullet.addClass(params.bulletActiveClass);

        if (params.dynamicBullets) {
          const $firstDisplayedBullet = bullets.eq(firstIndex);
          const $lastDisplayedBullet = bullets.eq(lastIndex);

          for (let i = firstIndex; i <= lastIndex; i += 1) {
            bullets.eq(i).addClass(`${params.bulletActiveClass}-main`);
          }

          if (swiper.params.loop) {
            if (bulletIndex >= bullets.length) {
              for (let i = params.dynamicMainBullets; i >= 0; i -= 1) {
                bullets.eq(bullets.length - i).addClass(`${params.bulletActiveClass}-main`);
              }

              bullets.eq(bullets.length - params.dynamicMainBullets - 1).addClass(`${params.bulletActiveClass}-prev`);
            } else {
              setSideBullets($firstDisplayedBullet, 'prev');
              setSideBullets($lastDisplayedBullet, 'next');
            }
          } else {
            setSideBullets($firstDisplayedBullet, 'prev');
            setSideBullets($lastDisplayedBullet, 'next');
          }
        }
      }

      if (params.dynamicBullets) {
        const dynamicBulletsLength = Math.min(bullets.length, params.dynamicMainBullets + 4);
        const bulletsOffset = (bulletSize * dynamicBulletsLength - bulletSize) / 2 - midIndex * bulletSize;
        const offsetProp = rtl ? 'right' : 'left';
        bullets.css(swiper.isHorizontal() ? offsetProp : 'top', `${bulletsOffset}px`);
      }
    }

    if (params.type === 'fraction') {
      $el.find(classesToSelector(params.currentClass)).text(params.formatFractionCurrent(current + 1));
      $el.find(classesToSelector(params.totalClass)).text(params.formatFractionTotal(total));
    }

    if (params.type === 'progressbar') {
      let progressbarDirection;

      if (params.progressbarOpposite) {
        progressbarDirection = swiper.isHorizontal() ? 'vertical' : 'horizontal';
      } else {
        progressbarDirection = swiper.isHorizontal() ? 'horizontal' : 'vertical';
      }

      const scale = (current + 1) / total;
      let scaleX = 1;
      let scaleY = 1;

      if (progressbarDirection === 'horizontal') {
        scaleX = scale;
      } else {
        scaleY = scale;
      }

      $el.find(classesToSelector(params.progressbarFillClass)).transform(`translate3d(0,0,0) scaleX(${scaleX}) scaleY(${scaleY})`).transition(swiper.params.speed);
    }

    if (params.type === 'custom' && params.renderCustom) {
      $el.html(params.renderCustom(swiper, current + 1, total));
      emit('paginationRender', $el[0]);
    } else {
      emit('paginationUpdate', $el[0]);
    }

    if (swiper.params.watchOverflow && swiper.enabled) {
      $el[swiper.isLocked ? 'addClass' : 'removeClass'](params.lockClass);
    }
  }

  function render() {
    // Render Container
    const params = swiper.params.pagination;
    if (isPaginationDisabled()) return;
    const slidesLength = swiper.virtual && swiper.params.virtual.enabled ? swiper.virtual.slides.length : swiper.slides.length;
    const $el = swiper.pagination.$el;
    let paginationHTML = '';

    if (params.type === 'bullets') {
      let numberOfBullets = swiper.params.loop ? Math.ceil((slidesLength - swiper.loopedSlides * 2) / swiper.params.slidesPerGroup) : swiper.snapGrid.length;

      if (swiper.params.freeMode && swiper.params.freeMode.enabled && !swiper.params.loop && numberOfBullets > slidesLength) {
        numberOfBullets = slidesLength;
      }

      for (let i = 0; i < numberOfBullets; i += 1) {
        if (params.renderBullet) {
          paginationHTML += params.renderBullet.call(swiper, i, params.bulletClass);
        } else {
          paginationHTML += `<${params.bulletElement} class="${params.bulletClass}"></${params.bulletElement}>`;
        }
      }

      $el.html(paginationHTML);
      swiper.pagination.bullets = $el.find(classesToSelector(params.bulletClass));
    }

    if (params.type === 'fraction') {
      if (params.renderFraction) {
        paginationHTML = params.renderFraction.call(swiper, params.currentClass, params.totalClass);
      } else {
        paginationHTML = `<span class="${params.currentClass}"></span>` + ' / ' + `<span class="${params.totalClass}"></span>`;
      }

      $el.html(paginationHTML);
    }

    if (params.type === 'progressbar') {
      if (params.renderProgressbar) {
        paginationHTML = params.renderProgressbar.call(swiper, params.progressbarFillClass);
      } else {
        paginationHTML = `<span class="${params.progressbarFillClass}"></span>`;
      }

      $el.html(paginationHTML);
    }

    if (params.type !== 'custom') {
      emit('paginationRender', swiper.pagination.$el[0]);
    }
  }

  function init() {
    swiper.params.pagination = createElementIfNotDefined(swiper, swiper.originalParams.pagination, swiper.params.pagination, {
      el: 'swiper-pagination'
    });
    const params = swiper.params.pagination;
    if (!params.el) return;
    let $el = $$1(params.el);
    if ($el.length === 0) return;

    if (swiper.params.uniqueNavElements && typeof params.el === 'string' && $el.length > 1) {
      $el = swiper.$el.find(params.el); // check if it belongs to another nested Swiper

      if ($el.length > 1) {
        $el = $el.filter(el => {
          if ($$1(el).parents('.swiper')[0] !== swiper.el) return false;
          return true;
        });
      }
    }

    if (params.type === 'bullets' && params.clickable) {
      $el.addClass(params.clickableClass);
    }

    $el.addClass(params.modifierClass + params.type);
    $el.addClass(swiper.isHorizontal() ? params.horizontalClass : params.verticalClass);

    if (params.type === 'bullets' && params.dynamicBullets) {
      $el.addClass(`${params.modifierClass}${params.type}-dynamic`);
      dynamicBulletIndex = 0;

      if (params.dynamicMainBullets < 1) {
        params.dynamicMainBullets = 1;
      }
    }

    if (params.type === 'progressbar' && params.progressbarOpposite) {
      $el.addClass(params.progressbarOppositeClass);
    }

    if (params.clickable) {
      $el.on('click', classesToSelector(params.bulletClass), function onClick(e) {
        e.preventDefault();
        let index = $$1(this).index() * swiper.params.slidesPerGroup;
        if (swiper.params.loop) index += swiper.loopedSlides;
        swiper.slideTo(index);
      });
    }

    Object.assign(swiper.pagination, {
      $el,
      el: $el[0]
    });

    if (!swiper.enabled) {
      $el.addClass(params.lockClass);
    }
  }

  function destroy() {
    const params = swiper.params.pagination;
    if (isPaginationDisabled()) return;
    const $el = swiper.pagination.$el;
    $el.removeClass(params.hiddenClass);
    $el.removeClass(params.modifierClass + params.type);
    $el.removeClass(swiper.isHorizontal() ? params.horizontalClass : params.verticalClass);
    if (swiper.pagination.bullets && swiper.pagination.bullets.removeClass) swiper.pagination.bullets.removeClass(params.bulletActiveClass);

    if (params.clickable) {
      $el.off('click', classesToSelector(params.bulletClass));
    }
  }

  on('init', () => {
    if (swiper.params.pagination.enabled === false) {
      // eslint-disable-next-line
      disable();
    } else {
      init();
      render();
      update();
    }
  });
  on('activeIndexChange', () => {
    if (swiper.params.loop) {
      update();
    } else if (typeof swiper.snapIndex === 'undefined') {
      update();
    }
  });
  on('snapIndexChange', () => {
    if (!swiper.params.loop) {
      update();
    }
  });
  on('slidesLengthChange', () => {
    if (swiper.params.loop) {
      render();
      update();
    }
  });
  on('snapGridLengthChange', () => {
    if (!swiper.params.loop) {
      render();
      update();
    }
  });
  on('destroy', () => {
    destroy();
  });
  on('enable disable', () => {
    const {
      $el
    } = swiper.pagination;

    if ($el) {
      $el[swiper.enabled ? 'removeClass' : 'addClass'](swiper.params.pagination.lockClass);
    }
  });
  on('lock unlock', () => {
    update();
  });
  on('click', (_s, e) => {
    const targetEl = e.target;
    const {
      $el
    } = swiper.pagination;

    if (swiper.params.pagination.el && swiper.params.pagination.hideOnClick && $el && $el.length > 0 && !$$1(targetEl).hasClass(swiper.params.pagination.bulletClass)) {
      if (swiper.navigation && (swiper.navigation.nextEl && targetEl === swiper.navigation.nextEl || swiper.navigation.prevEl && targetEl === swiper.navigation.prevEl)) return;
      const isHidden = $el.hasClass(swiper.params.pagination.hiddenClass);

      if (isHidden === true) {
        emit('paginationShow');
      } else {
        emit('paginationHide');
      }

      $el.toggleClass(swiper.params.pagination.hiddenClass);
    }
  });

  const enable = () => {
    swiper.$el.removeClass(swiper.params.pagination.paginationDisabledClass);

    if (swiper.pagination.$el) {
      swiper.pagination.$el.removeClass(swiper.params.pagination.paginationDisabledClass);
    }

    init();
    render();
    update();
  };

  const disable = () => {
    swiper.$el.addClass(swiper.params.pagination.paginationDisabledClass);

    if (swiper.pagination.$el) {
      swiper.pagination.$el.addClass(swiper.params.pagination.paginationDisabledClass);
    }

    destroy();
  };

  Object.assign(swiper.pagination, {
    enable,
    disable,
    render,
    update,
    init,
    destroy
  });
}function Scrollbar({
  swiper,
  extendParams,
  on,
  emit
}) {
  const document = getDocument();
  let isTouched = false;
  let timeout = null;
  let dragTimeout = null;
  let dragStartPos;
  let dragSize;
  let trackSize;
  let divider;
  extendParams({
    scrollbar: {
      el: null,
      dragSize: 'auto',
      hide: false,
      draggable: false,
      snapOnRelease: true,
      lockClass: 'swiper-scrollbar-lock',
      dragClass: 'swiper-scrollbar-drag',
      scrollbarDisabledClass: 'swiper-scrollbar-disabled',
      horizontalClass: `swiper-scrollbar-horizontal`,
      verticalClass: `swiper-scrollbar-vertical`
    }
  });
  swiper.scrollbar = {
    el: null,
    dragEl: null,
    $el: null,
    $dragEl: null
  };

  function setTranslate() {
    if (!swiper.params.scrollbar.el || !swiper.scrollbar.el) return;
    const {
      scrollbar,
      rtlTranslate: rtl,
      progress
    } = swiper;
    const {
      $dragEl,
      $el
    } = scrollbar;
    const params = swiper.params.scrollbar;
    let newSize = dragSize;
    let newPos = (trackSize - dragSize) * progress;

    if (rtl) {
      newPos = -newPos;

      if (newPos > 0) {
        newSize = dragSize - newPos;
        newPos = 0;
      } else if (-newPos + dragSize > trackSize) {
        newSize = trackSize + newPos;
      }
    } else if (newPos < 0) {
      newSize = dragSize + newPos;
      newPos = 0;
    } else if (newPos + dragSize > trackSize) {
      newSize = trackSize - newPos;
    }

    if (swiper.isHorizontal()) {
      $dragEl.transform(`translate3d(${newPos}px, 0, 0)`);
      $dragEl[0].style.width = `${newSize}px`;
    } else {
      $dragEl.transform(`translate3d(0px, ${newPos}px, 0)`);
      $dragEl[0].style.height = `${newSize}px`;
    }

    if (params.hide) {
      clearTimeout(timeout);
      $el[0].style.opacity = 1;
      timeout = setTimeout(() => {
        $el[0].style.opacity = 0;
        $el.transition(400);
      }, 1000);
    }
  }

  function setTransition(duration) {
    if (!swiper.params.scrollbar.el || !swiper.scrollbar.el) return;
    swiper.scrollbar.$dragEl.transition(duration);
  }

  function updateSize() {
    if (!swiper.params.scrollbar.el || !swiper.scrollbar.el) return;
    const {
      scrollbar
    } = swiper;
    const {
      $dragEl,
      $el
    } = scrollbar;
    $dragEl[0].style.width = '';
    $dragEl[0].style.height = '';
    trackSize = swiper.isHorizontal() ? $el[0].offsetWidth : $el[0].offsetHeight;
    divider = swiper.size / (swiper.virtualSize + swiper.params.slidesOffsetBefore - (swiper.params.centeredSlides ? swiper.snapGrid[0] : 0));

    if (swiper.params.scrollbar.dragSize === 'auto') {
      dragSize = trackSize * divider;
    } else {
      dragSize = parseInt(swiper.params.scrollbar.dragSize, 10);
    }

    if (swiper.isHorizontal()) {
      $dragEl[0].style.width = `${dragSize}px`;
    } else {
      $dragEl[0].style.height = `${dragSize}px`;
    }

    if (divider >= 1) {
      $el[0].style.display = 'none';
    } else {
      $el[0].style.display = '';
    }

    if (swiper.params.scrollbar.hide) {
      $el[0].style.opacity = 0;
    }

    if (swiper.params.watchOverflow && swiper.enabled) {
      scrollbar.$el[swiper.isLocked ? 'addClass' : 'removeClass'](swiper.params.scrollbar.lockClass);
    }
  }

  function getPointerPosition(e) {
    if (swiper.isHorizontal()) {
      return e.type === 'touchstart' || e.type === 'touchmove' ? e.targetTouches[0].clientX : e.clientX;
    }

    return e.type === 'touchstart' || e.type === 'touchmove' ? e.targetTouches[0].clientY : e.clientY;
  }

  function setDragPosition(e) {
    const {
      scrollbar,
      rtlTranslate: rtl
    } = swiper;
    const {
      $el
    } = scrollbar;
    let positionRatio;
    positionRatio = (getPointerPosition(e) - $el.offset()[swiper.isHorizontal() ? 'left' : 'top'] - (dragStartPos !== null ? dragStartPos : dragSize / 2)) / (trackSize - dragSize);
    positionRatio = Math.max(Math.min(positionRatio, 1), 0);

    if (rtl) {
      positionRatio = 1 - positionRatio;
    }

    const position = swiper.minTranslate() + (swiper.maxTranslate() - swiper.minTranslate()) * positionRatio;
    swiper.updateProgress(position);
    swiper.setTranslate(position);
    swiper.updateActiveIndex();
    swiper.updateSlidesClasses();
  }

  function onDragStart(e) {
    const params = swiper.params.scrollbar;
    const {
      scrollbar,
      $wrapperEl
    } = swiper;
    const {
      $el,
      $dragEl
    } = scrollbar;
    isTouched = true;
    dragStartPos = e.target === $dragEl[0] || e.target === $dragEl ? getPointerPosition(e) - e.target.getBoundingClientRect()[swiper.isHorizontal() ? 'left' : 'top'] : null;
    e.preventDefault();
    e.stopPropagation();
    $wrapperEl.transition(100);
    $dragEl.transition(100);
    setDragPosition(e);
    clearTimeout(dragTimeout);
    $el.transition(0);

    if (params.hide) {
      $el.css('opacity', 1);
    }

    if (swiper.params.cssMode) {
      swiper.$wrapperEl.css('scroll-snap-type', 'none');
    }

    emit('scrollbarDragStart', e);
  }

  function onDragMove(e) {
    const {
      scrollbar,
      $wrapperEl
    } = swiper;
    const {
      $el,
      $dragEl
    } = scrollbar;
    if (!isTouched) return;
    if (e.preventDefault) e.preventDefault();else e.returnValue = false;
    setDragPosition(e);
    $wrapperEl.transition(0);
    $el.transition(0);
    $dragEl.transition(0);
    emit('scrollbarDragMove', e);
  }

  function onDragEnd(e) {
    const params = swiper.params.scrollbar;
    const {
      scrollbar,
      $wrapperEl
    } = swiper;
    const {
      $el
    } = scrollbar;
    if (!isTouched) return;
    isTouched = false;

    if (swiper.params.cssMode) {
      swiper.$wrapperEl.css('scroll-snap-type', '');
      $wrapperEl.transition('');
    }

    if (params.hide) {
      clearTimeout(dragTimeout);
      dragTimeout = nextTick(() => {
        $el.css('opacity', 0);
        $el.transition(400);
      }, 1000);
    }

    emit('scrollbarDragEnd', e);

    if (params.snapOnRelease) {
      swiper.slideToClosest();
    }
  }

  function events(method) {
    const {
      scrollbar,
      touchEventsTouch,
      touchEventsDesktop,
      params,
      support
    } = swiper;
    const $el = scrollbar.$el;
    if (!$el) return;
    const target = $el[0];
    const activeListener = support.passiveListener && params.passiveListeners ? {
      passive: false,
      capture: false
    } : false;
    const passiveListener = support.passiveListener && params.passiveListeners ? {
      passive: true,
      capture: false
    } : false;
    if (!target) return;
    const eventMethod = method === 'on' ? 'addEventListener' : 'removeEventListener';

    if (!support.touch) {
      target[eventMethod](touchEventsDesktop.start, onDragStart, activeListener);
      document[eventMethod](touchEventsDesktop.move, onDragMove, activeListener);
      document[eventMethod](touchEventsDesktop.end, onDragEnd, passiveListener);
    } else {
      target[eventMethod](touchEventsTouch.start, onDragStart, activeListener);
      target[eventMethod](touchEventsTouch.move, onDragMove, activeListener);
      target[eventMethod](touchEventsTouch.end, onDragEnd, passiveListener);
    }
  }

  function enableDraggable() {
    if (!swiper.params.scrollbar.el || !swiper.scrollbar.el) return;
    events('on');
  }

  function disableDraggable() {
    if (!swiper.params.scrollbar.el || !swiper.scrollbar.el) return;
    events('off');
  }

  function init() {
    const {
      scrollbar,
      $el: $swiperEl
    } = swiper;
    swiper.params.scrollbar = createElementIfNotDefined(swiper, swiper.originalParams.scrollbar, swiper.params.scrollbar, {
      el: 'swiper-scrollbar'
    });
    const params = swiper.params.scrollbar;
    if (!params.el) return;
    let $el = $$1(params.el);

    if (swiper.params.uniqueNavElements && typeof params.el === 'string' && $el.length > 1 && $swiperEl.find(params.el).length === 1) {
      $el = $swiperEl.find(params.el);
    }

    $el.addClass(swiper.isHorizontal() ? params.horizontalClass : params.verticalClass);
    let $dragEl = $el.find(`.${swiper.params.scrollbar.dragClass}`);

    if ($dragEl.length === 0) {
      $dragEl = $$1(`<div class="${swiper.params.scrollbar.dragClass}"></div>`);
      $el.append($dragEl);
    }

    Object.assign(scrollbar, {
      $el,
      el: $el[0],
      $dragEl,
      dragEl: $dragEl[0]
    });

    if (params.draggable) {
      enableDraggable();
    }

    if ($el) {
      $el[swiper.enabled ? 'removeClass' : 'addClass'](swiper.params.scrollbar.lockClass);
    }
  }

  function destroy() {
    const params = swiper.params.scrollbar;
    const $el = swiper.scrollbar.$el;

    if ($el) {
      $el.removeClass(swiper.isHorizontal() ? params.horizontalClass : params.verticalClass);
    }

    disableDraggable();
  }

  on('init', () => {
    if (swiper.params.scrollbar.enabled === false) {
      // eslint-disable-next-line
      disable();
    } else {
      init();
      updateSize();
      setTranslate();
    }
  });
  on('update resize observerUpdate lock unlock', () => {
    updateSize();
  });
  on('setTranslate', () => {
    setTranslate();
  });
  on('setTransition', (_s, duration) => {
    setTransition(duration);
  });
  on('enable disable', () => {
    const {
      $el
    } = swiper.scrollbar;

    if ($el) {
      $el[swiper.enabled ? 'removeClass' : 'addClass'](swiper.params.scrollbar.lockClass);
    }
  });
  on('destroy', () => {
    destroy();
  });

  const enable = () => {
    swiper.$el.removeClass(swiper.params.scrollbar.scrollbarDisabledClass);

    if (swiper.scrollbar.$el) {
      swiper.scrollbar.$el.removeClass(swiper.params.scrollbar.scrollbarDisabledClass);
    }

    init();
    updateSize();
    setTranslate();
  };

  const disable = () => {
    swiper.$el.addClass(swiper.params.scrollbar.scrollbarDisabledClass);

    if (swiper.scrollbar.$el) {
      swiper.scrollbar.$el.addClass(swiper.params.scrollbar.scrollbarDisabledClass);
    }

    destroy();
  };

  Object.assign(swiper.scrollbar, {
    enable,
    disable,
    updateSize,
    setTranslate,
    init,
    destroy
  });
}function Parallax({
  swiper,
  extendParams,
  on
}) {
  extendParams({
    parallax: {
      enabled: false
    }
  });

  const setTransform = (el, progress) => {
    const {
      rtl
    } = swiper;
    const $el = $$1(el);
    const rtlFactor = rtl ? -1 : 1;
    const p = $el.attr('data-swiper-parallax') || '0';
    let x = $el.attr('data-swiper-parallax-x');
    let y = $el.attr('data-swiper-parallax-y');
    const scale = $el.attr('data-swiper-parallax-scale');
    const opacity = $el.attr('data-swiper-parallax-opacity');

    if (x || y) {
      x = x || '0';
      y = y || '0';
    } else if (swiper.isHorizontal()) {
      x = p;
      y = '0';
    } else {
      y = p;
      x = '0';
    }

    if (x.indexOf('%') >= 0) {
      x = `${parseInt(x, 10) * progress * rtlFactor}%`;
    } else {
      x = `${x * progress * rtlFactor}px`;
    }

    if (y.indexOf('%') >= 0) {
      y = `${parseInt(y, 10) * progress}%`;
    } else {
      y = `${y * progress}px`;
    }

    if (typeof opacity !== 'undefined' && opacity !== null) {
      const currentOpacity = opacity - (opacity - 1) * (1 - Math.abs(progress));
      $el[0].style.opacity = currentOpacity;
    }

    if (typeof scale === 'undefined' || scale === null) {
      $el.transform(`translate3d(${x}, ${y}, 0px)`);
    } else {
      const currentScale = scale - (scale - 1) * (1 - Math.abs(progress));
      $el.transform(`translate3d(${x}, ${y}, 0px) scale(${currentScale})`);
    }
  };

  const setTranslate = () => {
    const {
      $el,
      slides,
      progress,
      snapGrid
    } = swiper;
    $el.children('[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y], [data-swiper-parallax-opacity], [data-swiper-parallax-scale]').each(el => {
      setTransform(el, progress);
    });
    slides.each((slideEl, slideIndex) => {
      let slideProgress = slideEl.progress;

      if (swiper.params.slidesPerGroup > 1 && swiper.params.slidesPerView !== 'auto') {
        slideProgress += Math.ceil(slideIndex / 2) - progress * (snapGrid.length - 1);
      }

      slideProgress = Math.min(Math.max(slideProgress, -1), 1);
      $$1(slideEl).find('[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y], [data-swiper-parallax-opacity], [data-swiper-parallax-scale]').each(el => {
        setTransform(el, slideProgress);
      });
    });
  };

  const setTransition = (duration = swiper.params.speed) => {
    const {
      $el
    } = swiper;
    $el.find('[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y], [data-swiper-parallax-opacity], [data-swiper-parallax-scale]').each(parallaxEl => {
      const $parallaxEl = $$1(parallaxEl);
      let parallaxDuration = parseInt($parallaxEl.attr('data-swiper-parallax-duration'), 10) || duration;
      if (duration === 0) parallaxDuration = 0;
      $parallaxEl.transition(parallaxDuration);
    });
  };

  on('beforeInit', () => {
    if (!swiper.params.parallax.enabled) return;
    swiper.params.watchSlidesProgress = true;
    swiper.originalParams.watchSlidesProgress = true;
  });
  on('init', () => {
    if (!swiper.params.parallax.enabled) return;
    setTranslate();
  });
  on('setTranslate', () => {
    if (!swiper.params.parallax.enabled) return;
    setTranslate();
  });
  on('setTransition', (_swiper, duration) => {
    if (!swiper.params.parallax.enabled) return;
    setTransition(duration);
  });
}function Zoom({
  swiper,
  extendParams,
  on,
  emit
}) {
  const window = getWindow();
  extendParams({
    zoom: {
      enabled: false,
      maxRatio: 3,
      minRatio: 1,
      toggle: true,
      containerClass: 'swiper-zoom-container',
      zoomedSlideClass: 'swiper-slide-zoomed'
    }
  });
  swiper.zoom = {
    enabled: false
  };
  let currentScale = 1;
  let isScaling = false;
  let gesturesEnabled;
  let fakeGestureTouched;
  let fakeGestureMoved;
  const gesture = {
    $slideEl: undefined,
    slideWidth: undefined,
    slideHeight: undefined,
    $imageEl: undefined,
    $imageWrapEl: undefined,
    maxRatio: 3
  };
  const image = {
    isTouched: undefined,
    isMoved: undefined,
    currentX: undefined,
    currentY: undefined,
    minX: undefined,
    minY: undefined,
    maxX: undefined,
    maxY: undefined,
    width: undefined,
    height: undefined,
    startX: undefined,
    startY: undefined,
    touchesStart: {},
    touchesCurrent: {}
  };
  const velocity = {
    x: undefined,
    y: undefined,
    prevPositionX: undefined,
    prevPositionY: undefined,
    prevTime: undefined
  };
  let scale = 1;
  Object.defineProperty(swiper.zoom, 'scale', {
    get() {
      return scale;
    },

    set(value) {
      if (scale !== value) {
        const imageEl = gesture.$imageEl ? gesture.$imageEl[0] : undefined;
        const slideEl = gesture.$slideEl ? gesture.$slideEl[0] : undefined;
        emit('zoomChange', value, imageEl, slideEl);
      }

      scale = value;
    }

  });

  function getDistanceBetweenTouches(e) {
    if (e.targetTouches.length < 2) return 1;
    const x1 = e.targetTouches[0].pageX;
    const y1 = e.targetTouches[0].pageY;
    const x2 = e.targetTouches[1].pageX;
    const y2 = e.targetTouches[1].pageY;
    const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    return distance;
  } // Events


  function onGestureStart(e) {
    const support = swiper.support;
    const params = swiper.params.zoom;
    fakeGestureTouched = false;
    fakeGestureMoved = false;

    if (!support.gestures) {
      if (e.type !== 'touchstart' || e.type === 'touchstart' && e.targetTouches.length < 2) {
        return;
      }

      fakeGestureTouched = true;
      gesture.scaleStart = getDistanceBetweenTouches(e);
    }

    if (!gesture.$slideEl || !gesture.$slideEl.length) {
      gesture.$slideEl = $$1(e.target).closest(`.${swiper.params.slideClass}`);
      if (gesture.$slideEl.length === 0) gesture.$slideEl = swiper.slides.eq(swiper.activeIndex);
      gesture.$imageEl = gesture.$slideEl.find(`.${params.containerClass}`).eq(0).find('picture, img, svg, canvas, .swiper-zoom-target').eq(0);
      gesture.$imageWrapEl = gesture.$imageEl.parent(`.${params.containerClass}`);
      gesture.maxRatio = gesture.$imageWrapEl.attr('data-swiper-zoom') || params.maxRatio;

      if (gesture.$imageWrapEl.length === 0) {
        gesture.$imageEl = undefined;
        return;
      }
    }

    if (gesture.$imageEl) {
      gesture.$imageEl.transition(0);
    }

    isScaling = true;
  }

  function onGestureChange(e) {
    const support = swiper.support;
    const params = swiper.params.zoom;
    const zoom = swiper.zoom;

    if (!support.gestures) {
      if (e.type !== 'touchmove' || e.type === 'touchmove' && e.targetTouches.length < 2) {
        return;
      }

      fakeGestureMoved = true;
      gesture.scaleMove = getDistanceBetweenTouches(e);
    }

    if (!gesture.$imageEl || gesture.$imageEl.length === 0) {
      if (e.type === 'gesturechange') onGestureStart(e);
      return;
    }

    if (support.gestures) {
      zoom.scale = e.scale * currentScale;
    } else {
      zoom.scale = gesture.scaleMove / gesture.scaleStart * currentScale;
    }

    if (zoom.scale > gesture.maxRatio) {
      zoom.scale = gesture.maxRatio - 1 + (zoom.scale - gesture.maxRatio + 1) ** 0.5;
    }

    if (zoom.scale < params.minRatio) {
      zoom.scale = params.minRatio + 1 - (params.minRatio - zoom.scale + 1) ** 0.5;
    }

    gesture.$imageEl.transform(`translate3d(0,0,0) scale(${zoom.scale})`);
  }

  function onGestureEnd(e) {
    const device = swiper.device;
    const support = swiper.support;
    const params = swiper.params.zoom;
    const zoom = swiper.zoom;

    if (!support.gestures) {
      if (!fakeGestureTouched || !fakeGestureMoved) {
        return;
      }

      if (e.type !== 'touchend' || e.type === 'touchend' && e.changedTouches.length < 2 && !device.android) {
        return;
      }

      fakeGestureTouched = false;
      fakeGestureMoved = false;
    }

    if (!gesture.$imageEl || gesture.$imageEl.length === 0) return;
    zoom.scale = Math.max(Math.min(zoom.scale, gesture.maxRatio), params.minRatio);
    gesture.$imageEl.transition(swiper.params.speed).transform(`translate3d(0,0,0) scale(${zoom.scale})`);
    currentScale = zoom.scale;
    isScaling = false;
    if (zoom.scale === 1) gesture.$slideEl = undefined;
  }

  function onTouchStart(e) {
    const device = swiper.device;
    if (!gesture.$imageEl || gesture.$imageEl.length === 0) return;
    if (image.isTouched) return;
    if (device.android && e.cancelable) e.preventDefault();
    image.isTouched = true;
    image.touchesStart.x = e.type === 'touchstart' ? e.targetTouches[0].pageX : e.pageX;
    image.touchesStart.y = e.type === 'touchstart' ? e.targetTouches[0].pageY : e.pageY;
  }

  function onTouchMove(e) {
    const zoom = swiper.zoom;
    if (!gesture.$imageEl || gesture.$imageEl.length === 0) return;
    swiper.allowClick = false;
    if (!image.isTouched || !gesture.$slideEl) return;

    if (!image.isMoved) {
      image.width = gesture.$imageEl[0].offsetWidth;
      image.height = gesture.$imageEl[0].offsetHeight;
      image.startX = getTranslate(gesture.$imageWrapEl[0], 'x') || 0;
      image.startY = getTranslate(gesture.$imageWrapEl[0], 'y') || 0;
      gesture.slideWidth = gesture.$slideEl[0].offsetWidth;
      gesture.slideHeight = gesture.$slideEl[0].offsetHeight;
      gesture.$imageWrapEl.transition(0);
    } // Define if we need image drag


    const scaledWidth = image.width * zoom.scale;
    const scaledHeight = image.height * zoom.scale;
    if (scaledWidth < gesture.slideWidth && scaledHeight < gesture.slideHeight) return;
    image.minX = Math.min(gesture.slideWidth / 2 - scaledWidth / 2, 0);
    image.maxX = -image.minX;
    image.minY = Math.min(gesture.slideHeight / 2 - scaledHeight / 2, 0);
    image.maxY = -image.minY;
    image.touchesCurrent.x = e.type === 'touchmove' ? e.targetTouches[0].pageX : e.pageX;
    image.touchesCurrent.y = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.pageY;

    if (!image.isMoved && !isScaling) {
      if (swiper.isHorizontal() && (Math.floor(image.minX) === Math.floor(image.startX) && image.touchesCurrent.x < image.touchesStart.x || Math.floor(image.maxX) === Math.floor(image.startX) && image.touchesCurrent.x > image.touchesStart.x)) {
        image.isTouched = false;
        return;
      }

      if (!swiper.isHorizontal() && (Math.floor(image.minY) === Math.floor(image.startY) && image.touchesCurrent.y < image.touchesStart.y || Math.floor(image.maxY) === Math.floor(image.startY) && image.touchesCurrent.y > image.touchesStart.y)) {
        image.isTouched = false;
        return;
      }
    }

    if (e.cancelable) {
      e.preventDefault();
    }

    e.stopPropagation();
    image.isMoved = true;
    image.currentX = image.touchesCurrent.x - image.touchesStart.x + image.startX;
    image.currentY = image.touchesCurrent.y - image.touchesStart.y + image.startY;

    if (image.currentX < image.minX) {
      image.currentX = image.minX + 1 - (image.minX - image.currentX + 1) ** 0.8;
    }

    if (image.currentX > image.maxX) {
      image.currentX = image.maxX - 1 + (image.currentX - image.maxX + 1) ** 0.8;
    }

    if (image.currentY < image.minY) {
      image.currentY = image.minY + 1 - (image.minY - image.currentY + 1) ** 0.8;
    }

    if (image.currentY > image.maxY) {
      image.currentY = image.maxY - 1 + (image.currentY - image.maxY + 1) ** 0.8;
    } // Velocity


    if (!velocity.prevPositionX) velocity.prevPositionX = image.touchesCurrent.x;
    if (!velocity.prevPositionY) velocity.prevPositionY = image.touchesCurrent.y;
    if (!velocity.prevTime) velocity.prevTime = Date.now();
    velocity.x = (image.touchesCurrent.x - velocity.prevPositionX) / (Date.now() - velocity.prevTime) / 2;
    velocity.y = (image.touchesCurrent.y - velocity.prevPositionY) / (Date.now() - velocity.prevTime) / 2;
    if (Math.abs(image.touchesCurrent.x - velocity.prevPositionX) < 2) velocity.x = 0;
    if (Math.abs(image.touchesCurrent.y - velocity.prevPositionY) < 2) velocity.y = 0;
    velocity.prevPositionX = image.touchesCurrent.x;
    velocity.prevPositionY = image.touchesCurrent.y;
    velocity.prevTime = Date.now();
    gesture.$imageWrapEl.transform(`translate3d(${image.currentX}px, ${image.currentY}px,0)`);
  }

  function onTouchEnd() {
    const zoom = swiper.zoom;
    if (!gesture.$imageEl || gesture.$imageEl.length === 0) return;

    if (!image.isTouched || !image.isMoved) {
      image.isTouched = false;
      image.isMoved = false;
      return;
    }

    image.isTouched = false;
    image.isMoved = false;
    let momentumDurationX = 300;
    let momentumDurationY = 300;
    const momentumDistanceX = velocity.x * momentumDurationX;
    const newPositionX = image.currentX + momentumDistanceX;
    const momentumDistanceY = velocity.y * momentumDurationY;
    const newPositionY = image.currentY + momentumDistanceY; // Fix duration

    if (velocity.x !== 0) momentumDurationX = Math.abs((newPositionX - image.currentX) / velocity.x);
    if (velocity.y !== 0) momentumDurationY = Math.abs((newPositionY - image.currentY) / velocity.y);
    const momentumDuration = Math.max(momentumDurationX, momentumDurationY);
    image.currentX = newPositionX;
    image.currentY = newPositionY; // Define if we need image drag

    const scaledWidth = image.width * zoom.scale;
    const scaledHeight = image.height * zoom.scale;
    image.minX = Math.min(gesture.slideWidth / 2 - scaledWidth / 2, 0);
    image.maxX = -image.minX;
    image.minY = Math.min(gesture.slideHeight / 2 - scaledHeight / 2, 0);
    image.maxY = -image.minY;
    image.currentX = Math.max(Math.min(image.currentX, image.maxX), image.minX);
    image.currentY = Math.max(Math.min(image.currentY, image.maxY), image.minY);
    gesture.$imageWrapEl.transition(momentumDuration).transform(`translate3d(${image.currentX}px, ${image.currentY}px,0)`);
  }

  function onTransitionEnd() {
    const zoom = swiper.zoom;

    if (gesture.$slideEl && swiper.previousIndex !== swiper.activeIndex) {
      if (gesture.$imageEl) {
        gesture.$imageEl.transform('translate3d(0,0,0) scale(1)');
      }

      if (gesture.$imageWrapEl) {
        gesture.$imageWrapEl.transform('translate3d(0,0,0)');
      }

      zoom.scale = 1;
      currentScale = 1;
      gesture.$slideEl = undefined;
      gesture.$imageEl = undefined;
      gesture.$imageWrapEl = undefined;
    }
  }

  function zoomIn(e) {
    const zoom = swiper.zoom;
    const params = swiper.params.zoom;

    if (!gesture.$slideEl) {
      if (e && e.target) {
        gesture.$slideEl = $$1(e.target).closest(`.${swiper.params.slideClass}`);
      }

      if (!gesture.$slideEl) {
        if (swiper.params.virtual && swiper.params.virtual.enabled && swiper.virtual) {
          gesture.$slideEl = swiper.$wrapperEl.children(`.${swiper.params.slideActiveClass}`);
        } else {
          gesture.$slideEl = swiper.slides.eq(swiper.activeIndex);
        }
      }

      gesture.$imageEl = gesture.$slideEl.find(`.${params.containerClass}`).eq(0).find('picture, img, svg, canvas, .swiper-zoom-target').eq(0);
      gesture.$imageWrapEl = gesture.$imageEl.parent(`.${params.containerClass}`);
    }

    if (!gesture.$imageEl || gesture.$imageEl.length === 0 || !gesture.$imageWrapEl || gesture.$imageWrapEl.length === 0) return;

    if (swiper.params.cssMode) {
      swiper.wrapperEl.style.overflow = 'hidden';
      swiper.wrapperEl.style.touchAction = 'none';
    }

    gesture.$slideEl.addClass(`${params.zoomedSlideClass}`);
    let touchX;
    let touchY;
    let offsetX;
    let offsetY;
    let diffX;
    let diffY;
    let translateX;
    let translateY;
    let imageWidth;
    let imageHeight;
    let scaledWidth;
    let scaledHeight;
    let translateMinX;
    let translateMinY;
    let translateMaxX;
    let translateMaxY;
    let slideWidth;
    let slideHeight;

    if (typeof image.touchesStart.x === 'undefined' && e) {
      touchX = e.type === 'touchend' ? e.changedTouches[0].pageX : e.pageX;
      touchY = e.type === 'touchend' ? e.changedTouches[0].pageY : e.pageY;
    } else {
      touchX = image.touchesStart.x;
      touchY = image.touchesStart.y;
    }

    zoom.scale = gesture.$imageWrapEl.attr('data-swiper-zoom') || params.maxRatio;
    currentScale = gesture.$imageWrapEl.attr('data-swiper-zoom') || params.maxRatio;

    if (e) {
      slideWidth = gesture.$slideEl[0].offsetWidth;
      slideHeight = gesture.$slideEl[0].offsetHeight;
      offsetX = gesture.$slideEl.offset().left + window.scrollX;
      offsetY = gesture.$slideEl.offset().top + window.scrollY;
      diffX = offsetX + slideWidth / 2 - touchX;
      diffY = offsetY + slideHeight / 2 - touchY;
      imageWidth = gesture.$imageEl[0].offsetWidth;
      imageHeight = gesture.$imageEl[0].offsetHeight;
      scaledWidth = imageWidth * zoom.scale;
      scaledHeight = imageHeight * zoom.scale;
      translateMinX = Math.min(slideWidth / 2 - scaledWidth / 2, 0);
      translateMinY = Math.min(slideHeight / 2 - scaledHeight / 2, 0);
      translateMaxX = -translateMinX;
      translateMaxY = -translateMinY;
      translateX = diffX * zoom.scale;
      translateY = diffY * zoom.scale;

      if (translateX < translateMinX) {
        translateX = translateMinX;
      }

      if (translateX > translateMaxX) {
        translateX = translateMaxX;
      }

      if (translateY < translateMinY) {
        translateY = translateMinY;
      }

      if (translateY > translateMaxY) {
        translateY = translateMaxY;
      }
    } else {
      translateX = 0;
      translateY = 0;
    }

    gesture.$imageWrapEl.transition(300).transform(`translate3d(${translateX}px, ${translateY}px,0)`);
    gesture.$imageEl.transition(300).transform(`translate3d(0,0,0) scale(${zoom.scale})`);
  }

  function zoomOut() {
    const zoom = swiper.zoom;
    const params = swiper.params.zoom;

    if (!gesture.$slideEl) {
      if (swiper.params.virtual && swiper.params.virtual.enabled && swiper.virtual) {
        gesture.$slideEl = swiper.$wrapperEl.children(`.${swiper.params.slideActiveClass}`);
      } else {
        gesture.$slideEl = swiper.slides.eq(swiper.activeIndex);
      }

      gesture.$imageEl = gesture.$slideEl.find(`.${params.containerClass}`).eq(0).find('picture, img, svg, canvas, .swiper-zoom-target').eq(0);
      gesture.$imageWrapEl = gesture.$imageEl.parent(`.${params.containerClass}`);
    }

    if (!gesture.$imageEl || gesture.$imageEl.length === 0 || !gesture.$imageWrapEl || gesture.$imageWrapEl.length === 0) return;

    if (swiper.params.cssMode) {
      swiper.wrapperEl.style.overflow = '';
      swiper.wrapperEl.style.touchAction = '';
    }

    zoom.scale = 1;
    currentScale = 1;
    gesture.$imageWrapEl.transition(300).transform('translate3d(0,0,0)');
    gesture.$imageEl.transition(300).transform('translate3d(0,0,0) scale(1)');
    gesture.$slideEl.removeClass(`${params.zoomedSlideClass}`);
    gesture.$slideEl = undefined;
  } // Toggle Zoom


  function zoomToggle(e) {
    const zoom = swiper.zoom;

    if (zoom.scale && zoom.scale !== 1) {
      // Zoom Out
      zoomOut();
    } else {
      // Zoom In
      zoomIn(e);
    }
  }

  function getListeners() {
    const support = swiper.support;
    const passiveListener = swiper.touchEvents.start === 'touchstart' && support.passiveListener && swiper.params.passiveListeners ? {
      passive: true,
      capture: false
    } : false;
    const activeListenerWithCapture = support.passiveListener ? {
      passive: false,
      capture: true
    } : true;
    return {
      passiveListener,
      activeListenerWithCapture
    };
  }

  function getSlideSelector() {
    return `.${swiper.params.slideClass}`;
  }

  function toggleGestures(method) {
    const {
      passiveListener
    } = getListeners();
    const slideSelector = getSlideSelector();
    swiper.$wrapperEl[method]('gesturestart', slideSelector, onGestureStart, passiveListener);
    swiper.$wrapperEl[method]('gesturechange', slideSelector, onGestureChange, passiveListener);
    swiper.$wrapperEl[method]('gestureend', slideSelector, onGestureEnd, passiveListener);
  }

  function enableGestures() {
    if (gesturesEnabled) return;
    gesturesEnabled = true;
    toggleGestures('on');
  }

  function disableGestures() {
    if (!gesturesEnabled) return;
    gesturesEnabled = false;
    toggleGestures('off');
  } // Attach/Detach Events


  function enable() {
    const zoom = swiper.zoom;
    if (zoom.enabled) return;
    zoom.enabled = true;
    const support = swiper.support;
    const {
      passiveListener,
      activeListenerWithCapture
    } = getListeners();
    const slideSelector = getSlideSelector(); // Scale image

    if (support.gestures) {
      swiper.$wrapperEl.on(swiper.touchEvents.start, enableGestures, passiveListener);
      swiper.$wrapperEl.on(swiper.touchEvents.end, disableGestures, passiveListener);
    } else if (swiper.touchEvents.start === 'touchstart') {
      swiper.$wrapperEl.on(swiper.touchEvents.start, slideSelector, onGestureStart, passiveListener);
      swiper.$wrapperEl.on(swiper.touchEvents.move, slideSelector, onGestureChange, activeListenerWithCapture);
      swiper.$wrapperEl.on(swiper.touchEvents.end, slideSelector, onGestureEnd, passiveListener);

      if (swiper.touchEvents.cancel) {
        swiper.$wrapperEl.on(swiper.touchEvents.cancel, slideSelector, onGestureEnd, passiveListener);
      }
    } // Move image


    swiper.$wrapperEl.on(swiper.touchEvents.move, `.${swiper.params.zoom.containerClass}`, onTouchMove, activeListenerWithCapture);
  }

  function disable() {
    const zoom = swiper.zoom;
    if (!zoom.enabled) return;
    const support = swiper.support;
    zoom.enabled = false;
    const {
      passiveListener,
      activeListenerWithCapture
    } = getListeners();
    const slideSelector = getSlideSelector(); // Scale image

    if (support.gestures) {
      swiper.$wrapperEl.off(swiper.touchEvents.start, enableGestures, passiveListener);
      swiper.$wrapperEl.off(swiper.touchEvents.end, disableGestures, passiveListener);
    } else if (swiper.touchEvents.start === 'touchstart') {
      swiper.$wrapperEl.off(swiper.touchEvents.start, slideSelector, onGestureStart, passiveListener);
      swiper.$wrapperEl.off(swiper.touchEvents.move, slideSelector, onGestureChange, activeListenerWithCapture);
      swiper.$wrapperEl.off(swiper.touchEvents.end, slideSelector, onGestureEnd, passiveListener);

      if (swiper.touchEvents.cancel) {
        swiper.$wrapperEl.off(swiper.touchEvents.cancel, slideSelector, onGestureEnd, passiveListener);
      }
    } // Move image


    swiper.$wrapperEl.off(swiper.touchEvents.move, `.${swiper.params.zoom.containerClass}`, onTouchMove, activeListenerWithCapture);
  }

  on('init', () => {
    if (swiper.params.zoom.enabled) {
      enable();
    }
  });
  on('destroy', () => {
    disable();
  });
  on('touchStart', (_s, e) => {
    if (!swiper.zoom.enabled) return;
    onTouchStart(e);
  });
  on('touchEnd', (_s, e) => {
    if (!swiper.zoom.enabled) return;
    onTouchEnd();
  });
  on('doubleTap', (_s, e) => {
    if (!swiper.animating && swiper.params.zoom.enabled && swiper.zoom.enabled && swiper.params.zoom.toggle) {
      zoomToggle(e);
    }
  });
  on('transitionEnd', () => {
    if (swiper.zoom.enabled && swiper.params.zoom.enabled) {
      onTransitionEnd();
    }
  });
  on('slideChange', () => {
    if (swiper.zoom.enabled && swiper.params.zoom.enabled && swiper.params.cssMode) {
      onTransitionEnd();
    }
  });
  Object.assign(swiper.zoom, {
    enable,
    disable,
    in: zoomIn,
    out: zoomOut,
    toggle: zoomToggle
  });
}function Lazy({
  swiper,
  extendParams,
  on,
  emit
}) {
  extendParams({
    lazy: {
      checkInView: false,
      enabled: false,
      loadPrevNext: false,
      loadPrevNextAmount: 1,
      loadOnTransitionStart: false,
      scrollingElement: '',
      elementClass: 'swiper-lazy',
      loadingClass: 'swiper-lazy-loading',
      loadedClass: 'swiper-lazy-loaded',
      preloaderClass: 'swiper-lazy-preloader'
    }
  });
  swiper.lazy = {};
  let scrollHandlerAttached = false;
  let initialImageLoaded = false;

  function loadInSlide(index, loadInDuplicate = true) {
    const params = swiper.params.lazy;
    if (typeof index === 'undefined') return;
    if (swiper.slides.length === 0) return;
    const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
    const $slideEl = isVirtual ? swiper.$wrapperEl.children(`.${swiper.params.slideClass}[data-swiper-slide-index="${index}"]`) : swiper.slides.eq(index);
    const $images = $slideEl.find(`.${params.elementClass}:not(.${params.loadedClass}):not(.${params.loadingClass})`);

    if ($slideEl.hasClass(params.elementClass) && !$slideEl.hasClass(params.loadedClass) && !$slideEl.hasClass(params.loadingClass)) {
      $images.push($slideEl[0]);
    }

    if ($images.length === 0) return;
    $images.each(imageEl => {
      const $imageEl = $$1(imageEl);
      $imageEl.addClass(params.loadingClass);
      const background = $imageEl.attr('data-background');
      const src = $imageEl.attr('data-src');
      const srcset = $imageEl.attr('data-srcset');
      const sizes = $imageEl.attr('data-sizes');
      const $pictureEl = $imageEl.parent('picture');
      swiper.loadImage($imageEl[0], src || background, srcset, sizes, false, () => {
        if (typeof swiper === 'undefined' || swiper === null || !swiper || swiper && !swiper.params || swiper.destroyed) return;

        if (background) {
          $imageEl.css('background-image', `url("${background}")`);
          $imageEl.removeAttr('data-background');
        } else {
          if (srcset) {
            $imageEl.attr('srcset', srcset);
            $imageEl.removeAttr('data-srcset');
          }

          if (sizes) {
            $imageEl.attr('sizes', sizes);
            $imageEl.removeAttr('data-sizes');
          }

          if ($pictureEl.length) {
            $pictureEl.children('source').each(sourceEl => {
              const $source = $$1(sourceEl);

              if ($source.attr('data-srcset')) {
                $source.attr('srcset', $source.attr('data-srcset'));
                $source.removeAttr('data-srcset');
              }
            });
          }

          if (src) {
            $imageEl.attr('src', src);
            $imageEl.removeAttr('data-src');
          }
        }

        $imageEl.addClass(params.loadedClass).removeClass(params.loadingClass);
        $slideEl.find(`.${params.preloaderClass}`).remove();

        if (swiper.params.loop && loadInDuplicate) {
          const slideOriginalIndex = $slideEl.attr('data-swiper-slide-index');

          if ($slideEl.hasClass(swiper.params.slideDuplicateClass)) {
            const originalSlide = swiper.$wrapperEl.children(`[data-swiper-slide-index="${slideOriginalIndex}"]:not(.${swiper.params.slideDuplicateClass})`);
            loadInSlide(originalSlide.index(), false);
          } else {
            const duplicatedSlide = swiper.$wrapperEl.children(`.${swiper.params.slideDuplicateClass}[data-swiper-slide-index="${slideOriginalIndex}"]`);
            loadInSlide(duplicatedSlide.index(), false);
          }
        }

        emit('lazyImageReady', $slideEl[0], $imageEl[0]);

        if (swiper.params.autoHeight) {
          swiper.updateAutoHeight();
        }
      });
      emit('lazyImageLoad', $slideEl[0], $imageEl[0]);
    });
  }

  function load() {
    const {
      $wrapperEl,
      params: swiperParams,
      slides,
      activeIndex
    } = swiper;
    const isVirtual = swiper.virtual && swiperParams.virtual.enabled;
    const params = swiperParams.lazy;
    let slidesPerView = swiperParams.slidesPerView;

    if (slidesPerView === 'auto') {
      slidesPerView = 0;
    }

    function slideExist(index) {
      if (isVirtual) {
        if ($wrapperEl.children(`.${swiperParams.slideClass}[data-swiper-slide-index="${index}"]`).length) {
          return true;
        }
      } else if (slides[index]) return true;

      return false;
    }

    function slideIndex(slideEl) {
      if (isVirtual) {
        return $$1(slideEl).attr('data-swiper-slide-index');
      }

      return $$1(slideEl).index();
    }

    if (!initialImageLoaded) initialImageLoaded = true;

    if (swiper.params.watchSlidesProgress) {
      $wrapperEl.children(`.${swiperParams.slideVisibleClass}`).each(slideEl => {
        const index = isVirtual ? $$1(slideEl).attr('data-swiper-slide-index') : $$1(slideEl).index();
        loadInSlide(index);
      });
    } else if (slidesPerView > 1) {
      for (let i = activeIndex; i < activeIndex + slidesPerView; i += 1) {
        if (slideExist(i)) loadInSlide(i);
      }
    } else {
      loadInSlide(activeIndex);
    }

    if (params.loadPrevNext) {
      if (slidesPerView > 1 || params.loadPrevNextAmount && params.loadPrevNextAmount > 1) {
        const amount = params.loadPrevNextAmount;
        const spv = Math.ceil(slidesPerView);
        const maxIndex = Math.min(activeIndex + spv + Math.max(amount, spv), slides.length);
        const minIndex = Math.max(activeIndex - Math.max(spv, amount), 0); // Next Slides

        for (let i = activeIndex + spv; i < maxIndex; i += 1) {
          if (slideExist(i)) loadInSlide(i);
        } // Prev Slides


        for (let i = minIndex; i < activeIndex; i += 1) {
          if (slideExist(i)) loadInSlide(i);
        }
      } else {
        const nextSlide = $wrapperEl.children(`.${swiperParams.slideNextClass}`);
        if (nextSlide.length > 0) loadInSlide(slideIndex(nextSlide));
        const prevSlide = $wrapperEl.children(`.${swiperParams.slidePrevClass}`);
        if (prevSlide.length > 0) loadInSlide(slideIndex(prevSlide));
      }
    }
  }

  function checkInViewOnLoad() {
    const window = getWindow();
    if (!swiper || swiper.destroyed) return;
    const $scrollElement = swiper.params.lazy.scrollingElement ? $$1(swiper.params.lazy.scrollingElement) : $$1(window);
    const isWindow = $scrollElement[0] === window;
    const scrollElementWidth = isWindow ? window.innerWidth : $scrollElement[0].offsetWidth;
    const scrollElementHeight = isWindow ? window.innerHeight : $scrollElement[0].offsetHeight;
    const swiperOffset = swiper.$el.offset();
    const {
      rtlTranslate: rtl
    } = swiper;
    let inView = false;
    if (rtl) swiperOffset.left -= swiper.$el[0].scrollLeft;
    const swiperCoord = [[swiperOffset.left, swiperOffset.top], [swiperOffset.left + swiper.width, swiperOffset.top], [swiperOffset.left, swiperOffset.top + swiper.height], [swiperOffset.left + swiper.width, swiperOffset.top + swiper.height]];

    for (let i = 0; i < swiperCoord.length; i += 1) {
      const point = swiperCoord[i];

      if (point[0] >= 0 && point[0] <= scrollElementWidth && point[1] >= 0 && point[1] <= scrollElementHeight) {
        if (point[0] === 0 && point[1] === 0) continue; // eslint-disable-line

        inView = true;
      }
    }

    const passiveListener = swiper.touchEvents.start === 'touchstart' && swiper.support.passiveListener && swiper.params.passiveListeners ? {
      passive: true,
      capture: false
    } : false;

    if (inView) {
      load();
      $scrollElement.off('scroll', checkInViewOnLoad, passiveListener);
    } else if (!scrollHandlerAttached) {
      scrollHandlerAttached = true;
      $scrollElement.on('scroll', checkInViewOnLoad, passiveListener);
    }
  }

  on('beforeInit', () => {
    if (swiper.params.lazy.enabled && swiper.params.preloadImages) {
      swiper.params.preloadImages = false;
    }
  });
  on('init', () => {
    if (swiper.params.lazy.enabled) {
      if (swiper.params.lazy.checkInView) {
        checkInViewOnLoad();
      } else {
        load();
      }
    }
  });
  on('scroll', () => {
    if (swiper.params.freeMode && swiper.params.freeMode.enabled && !swiper.params.freeMode.sticky) {
      load();
    }
  });
  on('scrollbarDragMove resize _freeModeNoMomentumRelease', () => {
    if (swiper.params.lazy.enabled) {
      if (swiper.params.lazy.checkInView) {
        checkInViewOnLoad();
      } else {
        load();
      }
    }
  });
  on('transitionStart', () => {
    if (swiper.params.lazy.enabled) {
      if (swiper.params.lazy.loadOnTransitionStart || !swiper.params.lazy.loadOnTransitionStart && !initialImageLoaded) {
        if (swiper.params.lazy.checkInView) {
          checkInViewOnLoad();
        } else {
          load();
        }
      }
    }
  });
  on('transitionEnd', () => {
    if (swiper.params.lazy.enabled && !swiper.params.lazy.loadOnTransitionStart) {
      if (swiper.params.lazy.checkInView) {
        checkInViewOnLoad();
      } else {
        load();
      }
    }
  });
  on('slideChange', () => {
    const {
      lazy,
      cssMode,
      watchSlidesProgress,
      touchReleaseOnEdges,
      resistanceRatio
    } = swiper.params;

    if (lazy.enabled && (cssMode || watchSlidesProgress && (touchReleaseOnEdges || resistanceRatio === 0))) {
      load();
    }
  });
  on('destroy', () => {
    if (!swiper.$el) return;
    swiper.$el.find(`.${swiper.params.lazy.loadingClass}`).removeClass(swiper.params.lazy.loadingClass);
  });
  Object.assign(swiper.lazy, {
    load,
    loadInSlide
  });
}/* eslint no-bitwise: ["error", { "allow": [">>"] }] */
function Controller({
  swiper,
  extendParams,
  on
}) {
  extendParams({
    controller: {
      control: undefined,
      inverse: false,
      by: 'slide' // or 'container'

    }
  });
  swiper.controller = {
    control: undefined
  };

  function LinearSpline(x, y) {
    const binarySearch = function search() {
      let maxIndex;
      let minIndex;
      let guess;
      return (array, val) => {
        minIndex = -1;
        maxIndex = array.length;

        while (maxIndex - minIndex > 1) {
          guess = maxIndex + minIndex >> 1;

          if (array[guess] <= val) {
            minIndex = guess;
          } else {
            maxIndex = guess;
          }
        }

        return maxIndex;
      };
    }();

    this.x = x;
    this.y = y;
    this.lastIndex = x.length - 1; // Given an x value (x2), return the expected y2 value:
    // (x1,y1) is the known point before given value,
    // (x3,y3) is the known point after given value.

    let i1;
    let i3;

    this.interpolate = function interpolate(x2) {
      if (!x2) return 0; // Get the indexes of x1 and x3 (the array indexes before and after given x2):

      i3 = binarySearch(this.x, x2);
      i1 = i3 - 1; // We have our indexes i1 & i3, so we can calculate already:
      // y2 := ((x2−x1) × (y3−y1)) ÷ (x3−x1) + y1

      return (x2 - this.x[i1]) * (this.y[i3] - this.y[i1]) / (this.x[i3] - this.x[i1]) + this.y[i1];
    };

    return this;
  } // xxx: for now i will just save one spline function to to


  function getInterpolateFunction(c) {
    if (!swiper.controller.spline) {
      swiper.controller.spline = swiper.params.loop ? new LinearSpline(swiper.slidesGrid, c.slidesGrid) : new LinearSpline(swiper.snapGrid, c.snapGrid);
    }
  }

  function setTranslate(_t, byController) {
    const controlled = swiper.controller.control;
    let multiplier;
    let controlledTranslate;
    const Swiper = swiper.constructor;

    function setControlledTranslate(c) {
      // this will create an Interpolate function based on the snapGrids
      // x is the Grid of the scrolled scroller and y will be the controlled scroller
      // it makes sense to create this only once and recall it for the interpolation
      // the function does a lot of value caching for performance
      const translate = swiper.rtlTranslate ? -swiper.translate : swiper.translate;

      if (swiper.params.controller.by === 'slide') {
        getInterpolateFunction(c); // i am not sure why the values have to be multiplicated this way, tried to invert the snapGrid
        // but it did not work out

        controlledTranslate = -swiper.controller.spline.interpolate(-translate);
      }

      if (!controlledTranslate || swiper.params.controller.by === 'container') {
        multiplier = (c.maxTranslate() - c.minTranslate()) / (swiper.maxTranslate() - swiper.minTranslate());
        controlledTranslate = (translate - swiper.minTranslate()) * multiplier + c.minTranslate();
      }

      if (swiper.params.controller.inverse) {
        controlledTranslate = c.maxTranslate() - controlledTranslate;
      }

      c.updateProgress(controlledTranslate);
      c.setTranslate(controlledTranslate, swiper);
      c.updateActiveIndex();
      c.updateSlidesClasses();
    }

    if (Array.isArray(controlled)) {
      for (let i = 0; i < controlled.length; i += 1) {
        if (controlled[i] !== byController && controlled[i] instanceof Swiper) {
          setControlledTranslate(controlled[i]);
        }
      }
    } else if (controlled instanceof Swiper && byController !== controlled) {
      setControlledTranslate(controlled);
    }
  }

  function setTransition(duration, byController) {
    const Swiper = swiper.constructor;
    const controlled = swiper.controller.control;
    let i;

    function setControlledTransition(c) {
      c.setTransition(duration, swiper);

      if (duration !== 0) {
        c.transitionStart();

        if (c.params.autoHeight) {
          nextTick(() => {
            c.updateAutoHeight();
          });
        }

        c.$wrapperEl.transitionEnd(() => {
          if (!controlled) return;

          if (c.params.loop && swiper.params.controller.by === 'slide') {
            c.loopFix();
          }

          c.transitionEnd();
        });
      }
    }

    if (Array.isArray(controlled)) {
      for (i = 0; i < controlled.length; i += 1) {
        if (controlled[i] !== byController && controlled[i] instanceof Swiper) {
          setControlledTransition(controlled[i]);
        }
      }
    } else if (controlled instanceof Swiper && byController !== controlled) {
      setControlledTransition(controlled);
    }
  }

  function removeSpline() {
    if (!swiper.controller.control) return;

    if (swiper.controller.spline) {
      swiper.controller.spline = undefined;
      delete swiper.controller.spline;
    }
  }

  on('beforeInit', () => {
    swiper.controller.control = swiper.params.controller.control;
  });
  on('update', () => {
    removeSpline();
  });
  on('resize', () => {
    removeSpline();
  });
  on('observerUpdate', () => {
    removeSpline();
  });
  on('setTranslate', (_s, translate, byController) => {
    if (!swiper.controller.control) return;
    swiper.controller.setTranslate(translate, byController);
  });
  on('setTransition', (_s, duration, byController) => {
    if (!swiper.controller.control) return;
    swiper.controller.setTransition(duration, byController);
  });
  Object.assign(swiper.controller, {
    setTranslate,
    setTransition
  });
}function A11y({
  swiper,
  extendParams,
  on
}) {
  extendParams({
    a11y: {
      enabled: true,
      notificationClass: 'swiper-notification',
      prevSlideMessage: 'Previous slide',
      nextSlideMessage: 'Next slide',
      firstSlideMessage: 'This is the first slide',
      lastSlideMessage: 'This is the last slide',
      paginationBulletMessage: 'Go to slide {{index}}',
      slideLabelMessage: '{{index}} / {{slidesLength}}',
      containerMessage: null,
      containerRoleDescriptionMessage: null,
      itemRoleDescriptionMessage: null,
      slideRole: 'group',
      id: null
    }
  });
  swiper.a11y = {
    clicked: false
  };
  let liveRegion = null;

  function notify(message) {
    const notification = liveRegion;
    if (notification.length === 0) return;
    notification.html('');
    notification.html(message);
  }

  function getRandomNumber(size = 16) {
    const randomChar = () => Math.round(16 * Math.random()).toString(16);

    return 'x'.repeat(size).replace(/x/g, randomChar);
  }

  function makeElFocusable($el) {
    $el.attr('tabIndex', '0');
  }

  function makeElNotFocusable($el) {
    $el.attr('tabIndex', '-1');
  }

  function addElRole($el, role) {
    $el.attr('role', role);
  }

  function addElRoleDescription($el, description) {
    $el.attr('aria-roledescription', description);
  }

  function addElControls($el, controls) {
    $el.attr('aria-controls', controls);
  }

  function addElLabel($el, label) {
    $el.attr('aria-label', label);
  }

  function addElId($el, id) {
    $el.attr('id', id);
  }

  function addElLive($el, live) {
    $el.attr('aria-live', live);
  }

  function disableEl($el) {
    $el.attr('aria-disabled', true);
  }

  function enableEl($el) {
    $el.attr('aria-disabled', false);
  }

  function onEnterOrSpaceKey(e) {
    if (e.keyCode !== 13 && e.keyCode !== 32) return;
    const params = swiper.params.a11y;
    const $targetEl = $$1(e.target);

    if (swiper.navigation && swiper.navigation.$nextEl && $targetEl.is(swiper.navigation.$nextEl)) {
      if (!(swiper.isEnd && !swiper.params.loop)) {
        swiper.slideNext();
      }

      if (swiper.isEnd) {
        notify(params.lastSlideMessage);
      } else {
        notify(params.nextSlideMessage);
      }
    }

    if (swiper.navigation && swiper.navigation.$prevEl && $targetEl.is(swiper.navigation.$prevEl)) {
      if (!(swiper.isBeginning && !swiper.params.loop)) {
        swiper.slidePrev();
      }

      if (swiper.isBeginning) {
        notify(params.firstSlideMessage);
      } else {
        notify(params.prevSlideMessage);
      }
    }

    if (swiper.pagination && $targetEl.is(classesToSelector(swiper.params.pagination.bulletClass))) {
      $targetEl[0].click();
    }
  }

  function updateNavigation() {
    if (swiper.params.loop || swiper.params.rewind || !swiper.navigation) return;
    const {
      $nextEl,
      $prevEl
    } = swiper.navigation;

    if ($prevEl && $prevEl.length > 0) {
      if (swiper.isBeginning) {
        disableEl($prevEl);
        makeElNotFocusable($prevEl);
      } else {
        enableEl($prevEl);
        makeElFocusable($prevEl);
      }
    }

    if ($nextEl && $nextEl.length > 0) {
      if (swiper.isEnd) {
        disableEl($nextEl);
        makeElNotFocusable($nextEl);
      } else {
        enableEl($nextEl);
        makeElFocusable($nextEl);
      }
    }
  }

  function hasPagination() {
    return swiper.pagination && swiper.pagination.bullets && swiper.pagination.bullets.length;
  }

  function hasClickablePagination() {
    return hasPagination() && swiper.params.pagination.clickable;
  }

  function updatePagination() {
    const params = swiper.params.a11y;
    if (!hasPagination()) return;
    swiper.pagination.bullets.each(bulletEl => {
      const $bulletEl = $$1(bulletEl);

      if (swiper.params.pagination.clickable) {
        makeElFocusable($bulletEl);

        if (!swiper.params.pagination.renderBullet) {
          addElRole($bulletEl, 'button');
          addElLabel($bulletEl, params.paginationBulletMessage.replace(/\{\{index\}\}/, $bulletEl.index() + 1));
        }
      }

      if ($bulletEl.is(`.${swiper.params.pagination.bulletActiveClass}`)) {
        $bulletEl.attr('aria-current', 'true');
      } else {
        $bulletEl.removeAttr('aria-current');
      }
    });
  }

  const initNavEl = ($el, wrapperId, message) => {
    makeElFocusable($el);

    if ($el[0].tagName !== 'BUTTON') {
      addElRole($el, 'button');
      $el.on('keydown', onEnterOrSpaceKey);
    }

    addElLabel($el, message);
    addElControls($el, wrapperId);
  };

  const handlePointerDown = () => {
    swiper.a11y.clicked = true;
  };

  const handlePointerUp = () => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!swiper.destroyed) {
          swiper.a11y.clicked = false;
        }
      });
    });
  };

  const handleFocus = e => {
    if (swiper.a11y.clicked) return;
    const slideEl = e.target.closest(`.${swiper.params.slideClass}`);
    if (!slideEl || !swiper.slides.includes(slideEl)) return;
    const isActive = swiper.slides.indexOf(slideEl) === swiper.activeIndex;
    const isVisible = swiper.params.watchSlidesProgress && swiper.visibleSlides && swiper.visibleSlides.includes(slideEl);
    if (isActive || isVisible) return;
    if (e.sourceCapabilities && e.sourceCapabilities.firesTouchEvents) return;

    if (swiper.isHorizontal()) {
      swiper.el.scrollLeft = 0;
    } else {
      swiper.el.scrollTop = 0;
    }

    swiper.slideTo(swiper.slides.indexOf(slideEl), 0);
  };

  const initSlides = () => {
    const params = swiper.params.a11y;

    if (params.itemRoleDescriptionMessage) {
      addElRoleDescription($$1(swiper.slides), params.itemRoleDescriptionMessage);
    }

    if (params.slideRole) {
      addElRole($$1(swiper.slides), params.slideRole);
    }

    const slidesLength = swiper.params.loop ? swiper.slides.filter(el => !el.classList.contains(swiper.params.slideDuplicateClass)).length : swiper.slides.length;

    if (params.slideLabelMessage) {
      swiper.slides.each((slideEl, index) => {
        const $slideEl = $$1(slideEl);
        const slideIndex = swiper.params.loop ? parseInt($slideEl.attr('data-swiper-slide-index'), 10) : index;
        const ariaLabelMessage = params.slideLabelMessage.replace(/\{\{index\}\}/, slideIndex + 1).replace(/\{\{slidesLength\}\}/, slidesLength);
        addElLabel($slideEl, ariaLabelMessage);
      });
    }
  };

  const init = () => {
    const params = swiper.params.a11y;
    swiper.$el.append(liveRegion); // Container

    const $containerEl = swiper.$el;

    if (params.containerRoleDescriptionMessage) {
      addElRoleDescription($containerEl, params.containerRoleDescriptionMessage);
    }

    if (params.containerMessage) {
      addElLabel($containerEl, params.containerMessage);
    } // Wrapper


    const $wrapperEl = swiper.$wrapperEl;
    const wrapperId = params.id || $wrapperEl.attr('id') || `swiper-wrapper-${getRandomNumber(16)}`;
    const live = swiper.params.autoplay && swiper.params.autoplay.enabled ? 'off' : 'polite';
    addElId($wrapperEl, wrapperId);
    addElLive($wrapperEl, live); // Slide

    initSlides(); // Navigation

    let $nextEl;
    let $prevEl;

    if (swiper.navigation && swiper.navigation.$nextEl) {
      $nextEl = swiper.navigation.$nextEl;
    }

    if (swiper.navigation && swiper.navigation.$prevEl) {
      $prevEl = swiper.navigation.$prevEl;
    }

    if ($nextEl && $nextEl.length) {
      initNavEl($nextEl, wrapperId, params.nextSlideMessage);
    }

    if ($prevEl && $prevEl.length) {
      initNavEl($prevEl, wrapperId, params.prevSlideMessage);
    } // Pagination


    if (hasClickablePagination()) {
      swiper.pagination.$el.on('keydown', classesToSelector(swiper.params.pagination.bulletClass), onEnterOrSpaceKey);
    } // Tab focus


    swiper.$el.on('focus', handleFocus, true);
    swiper.$el.on('pointerdown', handlePointerDown, true);
    swiper.$el.on('pointerup', handlePointerUp, true);
  };

  function destroy() {
    if (liveRegion && liveRegion.length > 0) liveRegion.remove();
    let $nextEl;
    let $prevEl;

    if (swiper.navigation && swiper.navigation.$nextEl) {
      $nextEl = swiper.navigation.$nextEl;
    }

    if (swiper.navigation && swiper.navigation.$prevEl) {
      $prevEl = swiper.navigation.$prevEl;
    }

    if ($nextEl) {
      $nextEl.off('keydown', onEnterOrSpaceKey);
    }

    if ($prevEl) {
      $prevEl.off('keydown', onEnterOrSpaceKey);
    } // Pagination


    if (hasClickablePagination()) {
      swiper.pagination.$el.off('keydown', classesToSelector(swiper.params.pagination.bulletClass), onEnterOrSpaceKey);
    } // Tab focus


    swiper.$el.off('focus', handleFocus, true);
    swiper.$el.off('pointerdown', handlePointerDown, true);
    swiper.$el.off('pointerup', handlePointerUp, true);
  }

  on('beforeInit', () => {
    liveRegion = $$1(`<span class="${swiper.params.a11y.notificationClass}" aria-live="assertive" aria-atomic="true"></span>`);
  });
  on('afterInit', () => {
    if (!swiper.params.a11y.enabled) return;
    init();
  });
  on('slidesLengthChange snapGridLengthChange slidesGridLengthChange', () => {
    if (!swiper.params.a11y.enabled) return;
    initSlides();
  });
  on('fromEdge toEdge afterInit lock unlock', () => {
    if (!swiper.params.a11y.enabled) return;
    updateNavigation();
  });
  on('paginationUpdate', () => {
    if (!swiper.params.a11y.enabled) return;
    updatePagination();
  });
  on('destroy', () => {
    if (!swiper.params.a11y.enabled) return;
    destroy();
  });
}function History({
  swiper,
  extendParams,
  on
}) {
  extendParams({
    history: {
      enabled: false,
      root: '',
      replaceState: false,
      key: 'slides',
      keepQuery: false
    }
  });
  let initialized = false;
  let paths = {};

  const slugify = text => {
    return text.toString().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
  };

  const getPathValues = urlOverride => {
    const window = getWindow();
    let location;

    if (urlOverride) {
      location = new URL(urlOverride);
    } else {
      location = window.location;
    }

    const pathArray = location.pathname.slice(1).split('/').filter(part => part !== '');
    const total = pathArray.length;
    const key = pathArray[total - 2];
    const value = pathArray[total - 1];
    return {
      key,
      value
    };
  };

  const setHistory = (key, index) => {
    const window = getWindow();
    if (!initialized || !swiper.params.history.enabled) return;
    let location;

    if (swiper.params.url) {
      location = new URL(swiper.params.url);
    } else {
      location = window.location;
    }

    const slide = swiper.slides.eq(index);
    let value = slugify(slide.attr('data-history'));

    if (swiper.params.history.root.length > 0) {
      let root = swiper.params.history.root;
      if (root[root.length - 1] === '/') root = root.slice(0, root.length - 1);
      value = `${root}/${key}/${value}`;
    } else if (!location.pathname.includes(key)) {
      value = `${key}/${value}`;
    }

    if (swiper.params.history.keepQuery) {
      value += location.search;
    }

    const currentState = window.history.state;

    if (currentState && currentState.value === value) {
      return;
    }

    if (swiper.params.history.replaceState) {
      window.history.replaceState({
        value
      }, null, value);
    } else {
      window.history.pushState({
        value
      }, null, value);
    }
  };

  const scrollToSlide = (speed, value, runCallbacks) => {
    if (value) {
      for (let i = 0, length = swiper.slides.length; i < length; i += 1) {
        const slide = swiper.slides.eq(i);
        const slideHistory = slugify(slide.attr('data-history'));

        if (slideHistory === value && !slide.hasClass(swiper.params.slideDuplicateClass)) {
          const index = slide.index();
          swiper.slideTo(index, speed, runCallbacks);
        }
      }
    } else {
      swiper.slideTo(0, speed, runCallbacks);
    }
  };

  const setHistoryPopState = () => {
    paths = getPathValues(swiper.params.url);
    scrollToSlide(swiper.params.speed, paths.value, false);
  };

  const init = () => {
    const window = getWindow();
    if (!swiper.params.history) return;

    if (!window.history || !window.history.pushState) {
      swiper.params.history.enabled = false;
      swiper.params.hashNavigation.enabled = true;
      return;
    }

    initialized = true;
    paths = getPathValues(swiper.params.url);
    if (!paths.key && !paths.value) return;
    scrollToSlide(0, paths.value, swiper.params.runCallbacksOnInit);

    if (!swiper.params.history.replaceState) {
      window.addEventListener('popstate', setHistoryPopState);
    }
  };

  const destroy = () => {
    const window = getWindow();

    if (!swiper.params.history.replaceState) {
      window.removeEventListener('popstate', setHistoryPopState);
    }
  };

  on('init', () => {
    if (swiper.params.history.enabled) {
      init();
    }
  });
  on('destroy', () => {
    if (swiper.params.history.enabled) {
      destroy();
    }
  });
  on('transitionEnd _freeModeNoMomentumRelease', () => {
    if (initialized) {
      setHistory(swiper.params.history.key, swiper.activeIndex);
    }
  });
  on('slideChange', () => {
    if (initialized && swiper.params.cssMode) {
      setHistory(swiper.params.history.key, swiper.activeIndex);
    }
  });
}function HashNavigation({
  swiper,
  extendParams,
  emit,
  on
}) {
  let initialized = false;
  const document = getDocument();
  const window = getWindow();
  extendParams({
    hashNavigation: {
      enabled: false,
      replaceState: false,
      watchState: false
    }
  });

  const onHashChange = () => {
    emit('hashChange');
    const newHash = document.location.hash.replace('#', '');
    const activeSlideHash = swiper.slides.eq(swiper.activeIndex).attr('data-hash');

    if (newHash !== activeSlideHash) {
      const newIndex = swiper.$wrapperEl.children(`.${swiper.params.slideClass}[data-hash="${newHash}"]`).index();
      if (typeof newIndex === 'undefined') return;
      swiper.slideTo(newIndex);
    }
  };

  const setHash = () => {
    if (!initialized || !swiper.params.hashNavigation.enabled) return;

    if (swiper.params.hashNavigation.replaceState && window.history && window.history.replaceState) {
      window.history.replaceState(null, null, `#${swiper.slides.eq(swiper.activeIndex).attr('data-hash')}` || '');
      emit('hashSet');
    } else {
      const slide = swiper.slides.eq(swiper.activeIndex);
      const hash = slide.attr('data-hash') || slide.attr('data-history');
      document.location.hash = hash || '';
      emit('hashSet');
    }
  };

  const init = () => {
    if (!swiper.params.hashNavigation.enabled || swiper.params.history && swiper.params.history.enabled) return;
    initialized = true;
    const hash = document.location.hash.replace('#', '');

    if (hash) {
      const speed = 0;

      for (let i = 0, length = swiper.slides.length; i < length; i += 1) {
        const slide = swiper.slides.eq(i);
        const slideHash = slide.attr('data-hash') || slide.attr('data-history');

        if (slideHash === hash && !slide.hasClass(swiper.params.slideDuplicateClass)) {
          const index = slide.index();
          swiper.slideTo(index, speed, swiper.params.runCallbacksOnInit, true);
        }
      }
    }

    if (swiper.params.hashNavigation.watchState) {
      $$1(window).on('hashchange', onHashChange);
    }
  };

  const destroy = () => {
    if (swiper.params.hashNavigation.watchState) {
      $$1(window).off('hashchange', onHashChange);
    }
  };

  on('init', () => {
    if (swiper.params.hashNavigation.enabled) {
      init();
    }
  });
  on('destroy', () => {
    if (swiper.params.hashNavigation.enabled) {
      destroy();
    }
  });
  on('transitionEnd _freeModeNoMomentumRelease', () => {
    if (initialized) {
      setHash();
    }
  });
  on('slideChange', () => {
    if (initialized && swiper.params.cssMode) {
      setHash();
    }
  });
}/* eslint no-underscore-dangle: "off" */
function Autoplay({
  swiper,
  extendParams,
  on,
  emit
}) {
  let timeout;
  swiper.autoplay = {
    running: false,
    paused: false
  };
  extendParams({
    autoplay: {
      enabled: false,
      delay: 3000,
      waitForTransition: true,
      disableOnInteraction: true,
      stopOnLastSlide: false,
      reverseDirection: false,
      pauseOnMouseEnter: false
    }
  });

  function run() {
    if (!swiper.size) {
      swiper.autoplay.running = false;
      swiper.autoplay.paused = false;
      return;
    }

    const $activeSlideEl = swiper.slides.eq(swiper.activeIndex);
    let delay = swiper.params.autoplay.delay;

    if ($activeSlideEl.attr('data-swiper-autoplay')) {
      delay = $activeSlideEl.attr('data-swiper-autoplay') || swiper.params.autoplay.delay;
    }

    clearTimeout(timeout);
    timeout = nextTick(() => {
      let autoplayResult;

      if (swiper.params.autoplay.reverseDirection) {
        if (swiper.params.loop) {
          swiper.loopFix();
          autoplayResult = swiper.slidePrev(swiper.params.speed, true, true);
          emit('autoplay');
        } else if (!swiper.isBeginning) {
          autoplayResult = swiper.slidePrev(swiper.params.speed, true, true);
          emit('autoplay');
        } else if (!swiper.params.autoplay.stopOnLastSlide) {
          autoplayResult = swiper.slideTo(swiper.slides.length - 1, swiper.params.speed, true, true);
          emit('autoplay');
        } else {
          stop();
        }
      } else if (swiper.params.loop) {
        swiper.loopFix();
        autoplayResult = swiper.slideNext(swiper.params.speed, true, true);
        emit('autoplay');
      } else if (!swiper.isEnd) {
        autoplayResult = swiper.slideNext(swiper.params.speed, true, true);
        emit('autoplay');
      } else if (!swiper.params.autoplay.stopOnLastSlide) {
        autoplayResult = swiper.slideTo(0, swiper.params.speed, true, true);
        emit('autoplay');
      } else {
        stop();
      }

      if (swiper.params.cssMode && swiper.autoplay.running) run();else if (autoplayResult === false) {
        run();
      }
    }, delay);
  }

  function start() {
    if (typeof timeout !== 'undefined') return false;
    if (swiper.autoplay.running) return false;
    swiper.autoplay.running = true;
    emit('autoplayStart');
    run();
    return true;
  }

  function stop() {
    if (!swiper.autoplay.running) return false;
    if (typeof timeout === 'undefined') return false;

    if (timeout) {
      clearTimeout(timeout);
      timeout = undefined;
    }

    swiper.autoplay.running = false;
    emit('autoplayStop');
    return true;
  }

  function pause(speed) {
    if (!swiper.autoplay.running) return;
    if (swiper.autoplay.paused) return;
    if (timeout) clearTimeout(timeout);
    swiper.autoplay.paused = true;

    if (speed === 0 || !swiper.params.autoplay.waitForTransition) {
      swiper.autoplay.paused = false;
      run();
    } else {
      ['transitionend', 'webkitTransitionEnd'].forEach(event => {
        swiper.$wrapperEl[0].addEventListener(event, onTransitionEnd);
      });
    }
  }

  function onVisibilityChange() {
    const document = getDocument();

    if (document.visibilityState === 'hidden' && swiper.autoplay.running) {
      pause();
    }

    if (document.visibilityState === 'visible' && swiper.autoplay.paused) {
      run();
      swiper.autoplay.paused = false;
    }
  }

  function onTransitionEnd(e) {
    if (!swiper || swiper.destroyed || !swiper.$wrapperEl) return;
    if (e.target !== swiper.$wrapperEl[0]) return;
    ['transitionend', 'webkitTransitionEnd'].forEach(event => {
      swiper.$wrapperEl[0].removeEventListener(event, onTransitionEnd);
    });
    swiper.autoplay.paused = false;

    if (!swiper.autoplay.running) {
      stop();
    } else {
      run();
    }
  }

  function onMouseEnter() {
    if (swiper.params.autoplay.disableOnInteraction) {
      stop();
    } else {
      emit('autoplayPause');
      pause();
    }

    ['transitionend', 'webkitTransitionEnd'].forEach(event => {
      swiper.$wrapperEl[0].removeEventListener(event, onTransitionEnd);
    });
  }

  function onMouseLeave() {
    if (swiper.params.autoplay.disableOnInteraction) {
      return;
    }

    swiper.autoplay.paused = false;
    emit('autoplayResume');
    run();
  }

  function attachMouseEvents() {
    if (swiper.params.autoplay.pauseOnMouseEnter) {
      swiper.$el.on('mouseenter', onMouseEnter);
      swiper.$el.on('mouseleave', onMouseLeave);
    }
  }

  function detachMouseEvents() {
    swiper.$el.off('mouseenter', onMouseEnter);
    swiper.$el.off('mouseleave', onMouseLeave);
  }

  on('init', () => {
    if (swiper.params.autoplay.enabled) {
      start();
      const document = getDocument();
      document.addEventListener('visibilitychange', onVisibilityChange);
      attachMouseEvents();
    }
  });
  on('beforeTransitionStart', (_s, speed, internal) => {
    if (swiper.autoplay.running) {
      if (internal || !swiper.params.autoplay.disableOnInteraction) {
        swiper.autoplay.pause(speed);
      } else {
        stop();
      }
    }
  });
  on('sliderFirstMove', () => {
    if (swiper.autoplay.running) {
      if (swiper.params.autoplay.disableOnInteraction) {
        stop();
      } else {
        pause();
      }
    }
  });
  on('touchEnd', () => {
    if (swiper.params.cssMode && swiper.autoplay.paused && !swiper.params.autoplay.disableOnInteraction) {
      run();
    }
  });
  on('destroy', () => {
    detachMouseEvents();

    if (swiper.autoplay.running) {
      stop();
    }

    const document = getDocument();
    document.removeEventListener('visibilitychange', onVisibilityChange);
  });
  Object.assign(swiper.autoplay, {
    pause,
    run,
    start,
    stop
  });
}function Thumb({
  swiper,
  extendParams,
  on
}) {
  extendParams({
    thumbs: {
      swiper: null,
      multipleActiveThumbs: true,
      autoScrollOffset: 0,
      slideThumbActiveClass: 'swiper-slide-thumb-active',
      thumbsContainerClass: 'swiper-thumbs'
    }
  });
  let initialized = false;
  let swiperCreated = false;
  swiper.thumbs = {
    swiper: null
  };

  function onThumbClick() {
    const thumbsSwiper = swiper.thumbs.swiper;
    if (!thumbsSwiper || thumbsSwiper.destroyed) return;
    const clickedIndex = thumbsSwiper.clickedIndex;
    const clickedSlide = thumbsSwiper.clickedSlide;
    if (clickedSlide && $$1(clickedSlide).hasClass(swiper.params.thumbs.slideThumbActiveClass)) return;
    if (typeof clickedIndex === 'undefined' || clickedIndex === null) return;
    let slideToIndex;

    if (thumbsSwiper.params.loop) {
      slideToIndex = parseInt($$1(thumbsSwiper.clickedSlide).attr('data-swiper-slide-index'), 10);
    } else {
      slideToIndex = clickedIndex;
    }

    if (swiper.params.loop) {
      let currentIndex = swiper.activeIndex;

      if (swiper.slides.eq(currentIndex).hasClass(swiper.params.slideDuplicateClass)) {
        swiper.loopFix(); // eslint-disable-next-line

        swiper._clientLeft = swiper.$wrapperEl[0].clientLeft;
        currentIndex = swiper.activeIndex;
      }

      const prevIndex = swiper.slides.eq(currentIndex).prevAll(`[data-swiper-slide-index="${slideToIndex}"]`).eq(0).index();
      const nextIndex = swiper.slides.eq(currentIndex).nextAll(`[data-swiper-slide-index="${slideToIndex}"]`).eq(0).index();
      if (typeof prevIndex === 'undefined') slideToIndex = nextIndex;else if (typeof nextIndex === 'undefined') slideToIndex = prevIndex;else if (nextIndex - currentIndex < currentIndex - prevIndex) slideToIndex = nextIndex;else slideToIndex = prevIndex;
    }

    swiper.slideTo(slideToIndex);
  }

  function init() {
    const {
      thumbs: thumbsParams
    } = swiper.params;
    if (initialized) return false;
    initialized = true;
    const SwiperClass = swiper.constructor;

    if (thumbsParams.swiper instanceof SwiperClass) {
      swiper.thumbs.swiper = thumbsParams.swiper;
      Object.assign(swiper.thumbs.swiper.originalParams, {
        watchSlidesProgress: true,
        slideToClickedSlide: false
      });
      Object.assign(swiper.thumbs.swiper.params, {
        watchSlidesProgress: true,
        slideToClickedSlide: false
      });
    } else if (isObject(thumbsParams.swiper)) {
      const thumbsSwiperParams = Object.assign({}, thumbsParams.swiper);
      Object.assign(thumbsSwiperParams, {
        watchSlidesProgress: true,
        slideToClickedSlide: false
      });
      swiper.thumbs.swiper = new SwiperClass(thumbsSwiperParams);
      swiperCreated = true;
    }

    swiper.thumbs.swiper.$el.addClass(swiper.params.thumbs.thumbsContainerClass);
    swiper.thumbs.swiper.on('tap', onThumbClick);
    return true;
  }

  function update(initial) {
    const thumbsSwiper = swiper.thumbs.swiper;
    if (!thumbsSwiper || thumbsSwiper.destroyed) return;
    const slidesPerView = thumbsSwiper.params.slidesPerView === 'auto' ? thumbsSwiper.slidesPerViewDynamic() : thumbsSwiper.params.slidesPerView; // Activate thumbs

    let thumbsToActivate = 1;
    const thumbActiveClass = swiper.params.thumbs.slideThumbActiveClass;

    if (swiper.params.slidesPerView > 1 && !swiper.params.centeredSlides) {
      thumbsToActivate = swiper.params.slidesPerView;
    }

    if (!swiper.params.thumbs.multipleActiveThumbs) {
      thumbsToActivate = 1;
    }

    thumbsToActivate = Math.floor(thumbsToActivate);
    thumbsSwiper.slides.removeClass(thumbActiveClass);

    if (thumbsSwiper.params.loop || thumbsSwiper.params.virtual && thumbsSwiper.params.virtual.enabled) {
      for (let i = 0; i < thumbsToActivate; i += 1) {
        thumbsSwiper.$wrapperEl.children(`[data-swiper-slide-index="${swiper.realIndex + i}"]`).addClass(thumbActiveClass);
      }
    } else {
      for (let i = 0; i < thumbsToActivate; i += 1) {
        thumbsSwiper.slides.eq(swiper.realIndex + i).addClass(thumbActiveClass);
      }
    }

    const autoScrollOffset = swiper.params.thumbs.autoScrollOffset;
    const useOffset = autoScrollOffset && !thumbsSwiper.params.loop;

    if (swiper.realIndex !== thumbsSwiper.realIndex || useOffset) {
      let currentThumbsIndex = thumbsSwiper.activeIndex;
      let newThumbsIndex;
      let direction;

      if (thumbsSwiper.params.loop) {
        if (thumbsSwiper.slides.eq(currentThumbsIndex).hasClass(thumbsSwiper.params.slideDuplicateClass)) {
          thumbsSwiper.loopFix(); // eslint-disable-next-line

          thumbsSwiper._clientLeft = thumbsSwiper.$wrapperEl[0].clientLeft;
          currentThumbsIndex = thumbsSwiper.activeIndex;
        } // Find actual thumbs index to slide to


        const prevThumbsIndex = thumbsSwiper.slides.eq(currentThumbsIndex).prevAll(`[data-swiper-slide-index="${swiper.realIndex}"]`).eq(0).index();
        const nextThumbsIndex = thumbsSwiper.slides.eq(currentThumbsIndex).nextAll(`[data-swiper-slide-index="${swiper.realIndex}"]`).eq(0).index();

        if (typeof prevThumbsIndex === 'undefined') {
          newThumbsIndex = nextThumbsIndex;
        } else if (typeof nextThumbsIndex === 'undefined') {
          newThumbsIndex = prevThumbsIndex;
        } else if (nextThumbsIndex - currentThumbsIndex === currentThumbsIndex - prevThumbsIndex) {
          newThumbsIndex = thumbsSwiper.params.slidesPerGroup > 1 ? nextThumbsIndex : currentThumbsIndex;
        } else if (nextThumbsIndex - currentThumbsIndex < currentThumbsIndex - prevThumbsIndex) {
          newThumbsIndex = nextThumbsIndex;
        } else {
          newThumbsIndex = prevThumbsIndex;
        }

        direction = swiper.activeIndex > swiper.previousIndex ? 'next' : 'prev';
      } else {
        newThumbsIndex = swiper.realIndex;
        direction = newThumbsIndex > swiper.previousIndex ? 'next' : 'prev';
      }

      if (useOffset) {
        newThumbsIndex += direction === 'next' ? autoScrollOffset : -1 * autoScrollOffset;
      }

      if (thumbsSwiper.visibleSlidesIndexes && thumbsSwiper.visibleSlidesIndexes.indexOf(newThumbsIndex) < 0) {
        if (thumbsSwiper.params.centeredSlides) {
          if (newThumbsIndex > currentThumbsIndex) {
            newThumbsIndex = newThumbsIndex - Math.floor(slidesPerView / 2) + 1;
          } else {
            newThumbsIndex = newThumbsIndex + Math.floor(slidesPerView / 2) - 1;
          }
        } else if (newThumbsIndex > currentThumbsIndex && thumbsSwiper.params.slidesPerGroup === 1) ;

        thumbsSwiper.slideTo(newThumbsIndex, initial ? 0 : undefined);
      }
    }
  }

  on('beforeInit', () => {
    const {
      thumbs
    } = swiper.params;
    if (!thumbs || !thumbs.swiper) return;
    init();
    update(true);
  });
  on('slideChange update resize observerUpdate', () => {
    update();
  });
  on('setTransition', (_s, duration) => {
    const thumbsSwiper = swiper.thumbs.swiper;
    if (!thumbsSwiper || thumbsSwiper.destroyed) return;
    thumbsSwiper.setTransition(duration);
  });
  on('beforeDestroy', () => {
    const thumbsSwiper = swiper.thumbs.swiper;
    if (!thumbsSwiper || thumbsSwiper.destroyed) return;

    if (swiperCreated) {
      thumbsSwiper.destroy();
    }
  });
  Object.assign(swiper.thumbs, {
    init,
    update
  });
}function freeMode({
  swiper,
  extendParams,
  emit,
  once
}) {
  extendParams({
    freeMode: {
      enabled: false,
      momentum: true,
      momentumRatio: 1,
      momentumBounce: true,
      momentumBounceRatio: 1,
      momentumVelocityRatio: 1,
      sticky: false,
      minimumVelocity: 0.02
    }
  });

  function onTouchStart() {
    const translate = swiper.getTranslate();
    swiper.setTranslate(translate);
    swiper.setTransition(0);
    swiper.touchEventsData.velocities.length = 0;
    swiper.freeMode.onTouchEnd({
      currentPos: swiper.rtl ? swiper.translate : -swiper.translate
    });
  }

  function onTouchMove() {
    const {
      touchEventsData: data,
      touches
    } = swiper; // Velocity

    if (data.velocities.length === 0) {
      data.velocities.push({
        position: touches[swiper.isHorizontal() ? 'startX' : 'startY'],
        time: data.touchStartTime
      });
    }

    data.velocities.push({
      position: touches[swiper.isHorizontal() ? 'currentX' : 'currentY'],
      time: now()
    });
  }

  function onTouchEnd({
    currentPos
  }) {
    const {
      params,
      $wrapperEl,
      rtlTranslate: rtl,
      snapGrid,
      touchEventsData: data
    } = swiper; // Time diff

    const touchEndTime = now();
    const timeDiff = touchEndTime - data.touchStartTime;

    if (currentPos < -swiper.minTranslate()) {
      swiper.slideTo(swiper.activeIndex);
      return;
    }

    if (currentPos > -swiper.maxTranslate()) {
      if (swiper.slides.length < snapGrid.length) {
        swiper.slideTo(snapGrid.length - 1);
      } else {
        swiper.slideTo(swiper.slides.length - 1);
      }

      return;
    }

    if (params.freeMode.momentum) {
      if (data.velocities.length > 1) {
        const lastMoveEvent = data.velocities.pop();
        const velocityEvent = data.velocities.pop();
        const distance = lastMoveEvent.position - velocityEvent.position;
        const time = lastMoveEvent.time - velocityEvent.time;
        swiper.velocity = distance / time;
        swiper.velocity /= 2;

        if (Math.abs(swiper.velocity) < params.freeMode.minimumVelocity) {
          swiper.velocity = 0;
        } // this implies that the user stopped moving a finger then released.
        // There would be no events with distance zero, so the last event is stale.


        if (time > 150 || now() - lastMoveEvent.time > 300) {
          swiper.velocity = 0;
        }
      } else {
        swiper.velocity = 0;
      }

      swiper.velocity *= params.freeMode.momentumVelocityRatio;
      data.velocities.length = 0;
      let momentumDuration = 1000 * params.freeMode.momentumRatio;
      const momentumDistance = swiper.velocity * momentumDuration;
      let newPosition = swiper.translate + momentumDistance;
      if (rtl) newPosition = -newPosition;
      let doBounce = false;
      let afterBouncePosition;
      const bounceAmount = Math.abs(swiper.velocity) * 20 * params.freeMode.momentumBounceRatio;
      let needsLoopFix;

      if (newPosition < swiper.maxTranslate()) {
        if (params.freeMode.momentumBounce) {
          if (newPosition + swiper.maxTranslate() < -bounceAmount) {
            newPosition = swiper.maxTranslate() - bounceAmount;
          }

          afterBouncePosition = swiper.maxTranslate();
          doBounce = true;
          data.allowMomentumBounce = true;
        } else {
          newPosition = swiper.maxTranslate();
        }

        if (params.loop && params.centeredSlides) needsLoopFix = true;
      } else if (newPosition > swiper.minTranslate()) {
        if (params.freeMode.momentumBounce) {
          if (newPosition - swiper.minTranslate() > bounceAmount) {
            newPosition = swiper.minTranslate() + bounceAmount;
          }

          afterBouncePosition = swiper.minTranslate();
          doBounce = true;
          data.allowMomentumBounce = true;
        } else {
          newPosition = swiper.minTranslate();
        }

        if (params.loop && params.centeredSlides) needsLoopFix = true;
      } else if (params.freeMode.sticky) {
        let nextSlide;

        for (let j = 0; j < snapGrid.length; j += 1) {
          if (snapGrid[j] > -newPosition) {
            nextSlide = j;
            break;
          }
        }

        if (Math.abs(snapGrid[nextSlide] - newPosition) < Math.abs(snapGrid[nextSlide - 1] - newPosition) || swiper.swipeDirection === 'next') {
          newPosition = snapGrid[nextSlide];
        } else {
          newPosition = snapGrid[nextSlide - 1];
        }

        newPosition = -newPosition;
      }

      if (needsLoopFix) {
        once('transitionEnd', () => {
          swiper.loopFix();
        });
      } // Fix duration


      if (swiper.velocity !== 0) {
        if (rtl) {
          momentumDuration = Math.abs((-newPosition - swiper.translate) / swiper.velocity);
        } else {
          momentumDuration = Math.abs((newPosition - swiper.translate) / swiper.velocity);
        }

        if (params.freeMode.sticky) {
          // If freeMode.sticky is active and the user ends a swipe with a slow-velocity
          // event, then durations can be 20+ seconds to slide one (or zero!) slides.
          // It's easy to see this when simulating touch with mouse events. To fix this,
          // limit single-slide swipes to the default slide duration. This also has the
          // nice side effect of matching slide speed if the user stopped moving before
          // lifting finger or mouse vs. moving slowly before lifting the finger/mouse.
          // For faster swipes, also apply limits (albeit higher ones).
          const moveDistance = Math.abs((rtl ? -newPosition : newPosition) - swiper.translate);
          const currentSlideSize = swiper.slidesSizesGrid[swiper.activeIndex];

          if (moveDistance < currentSlideSize) {
            momentumDuration = params.speed;
          } else if (moveDistance < 2 * currentSlideSize) {
            momentumDuration = params.speed * 1.5;
          } else {
            momentumDuration = params.speed * 2.5;
          }
        }
      } else if (params.freeMode.sticky) {
        swiper.slideToClosest();
        return;
      }

      if (params.freeMode.momentumBounce && doBounce) {
        swiper.updateProgress(afterBouncePosition);
        swiper.setTransition(momentumDuration);
        swiper.setTranslate(newPosition);
        swiper.transitionStart(true, swiper.swipeDirection);
        swiper.animating = true;
        $wrapperEl.transitionEnd(() => {
          if (!swiper || swiper.destroyed || !data.allowMomentumBounce) return;
          emit('momentumBounce');
          swiper.setTransition(params.speed);
          setTimeout(() => {
            swiper.setTranslate(afterBouncePosition);
            $wrapperEl.transitionEnd(() => {
              if (!swiper || swiper.destroyed) return;
              swiper.transitionEnd();
            });
          }, 0);
        });
      } else if (swiper.velocity) {
        emit('_freeModeNoMomentumRelease');
        swiper.updateProgress(newPosition);
        swiper.setTransition(momentumDuration);
        swiper.setTranslate(newPosition);
        swiper.transitionStart(true, swiper.swipeDirection);

        if (!swiper.animating) {
          swiper.animating = true;
          $wrapperEl.transitionEnd(() => {
            if (!swiper || swiper.destroyed) return;
            swiper.transitionEnd();
          });
        }
      } else {
        swiper.updateProgress(newPosition);
      }

      swiper.updateActiveIndex();
      swiper.updateSlidesClasses();
    } else if (params.freeMode.sticky) {
      swiper.slideToClosest();
      return;
    } else if (params.freeMode) {
      emit('_freeModeNoMomentumRelease');
    }

    if (!params.freeMode.momentum || timeDiff >= params.longSwipesMs) {
      swiper.updateProgress();
      swiper.updateActiveIndex();
      swiper.updateSlidesClasses();
    }
  }

  Object.assign(swiper, {
    freeMode: {
      onTouchStart,
      onTouchMove,
      onTouchEnd
    }
  });
}function Grid({
  swiper,
  extendParams
}) {
  extendParams({
    grid: {
      rows: 1,
      fill: 'column'
    }
  });
  let slidesNumberEvenToRows;
  let slidesPerRow;
  let numFullColumns;

  const initSlides = slidesLength => {
    const {
      slidesPerView
    } = swiper.params;
    const {
      rows,
      fill
    } = swiper.params.grid;
    slidesPerRow = slidesNumberEvenToRows / rows;
    numFullColumns = Math.floor(slidesLength / rows);

    if (Math.floor(slidesLength / rows) === slidesLength / rows) {
      slidesNumberEvenToRows = slidesLength;
    } else {
      slidesNumberEvenToRows = Math.ceil(slidesLength / rows) * rows;
    }

    if (slidesPerView !== 'auto' && fill === 'row') {
      slidesNumberEvenToRows = Math.max(slidesNumberEvenToRows, slidesPerView * rows);
    }
  };

  const updateSlide = (i, slide, slidesLength, getDirectionLabel) => {
    const {
      slidesPerGroup,
      spaceBetween
    } = swiper.params;
    const {
      rows,
      fill
    } = swiper.params.grid; // Set slides order

    let newSlideOrderIndex;
    let column;
    let row;

    if (fill === 'row' && slidesPerGroup > 1) {
      const groupIndex = Math.floor(i / (slidesPerGroup * rows));
      const slideIndexInGroup = i - rows * slidesPerGroup * groupIndex;
      const columnsInGroup = groupIndex === 0 ? slidesPerGroup : Math.min(Math.ceil((slidesLength - groupIndex * rows * slidesPerGroup) / rows), slidesPerGroup);
      row = Math.floor(slideIndexInGroup / columnsInGroup);
      column = slideIndexInGroup - row * columnsInGroup + groupIndex * slidesPerGroup;
      newSlideOrderIndex = column + row * slidesNumberEvenToRows / rows;
      slide.css({
        '-webkit-order': newSlideOrderIndex,
        order: newSlideOrderIndex
      });
    } else if (fill === 'column') {
      column = Math.floor(i / rows);
      row = i - column * rows;

      if (column > numFullColumns || column === numFullColumns && row === rows - 1) {
        row += 1;

        if (row >= rows) {
          row = 0;
          column += 1;
        }
      }
    } else {
      row = Math.floor(i / slidesPerRow);
      column = i - row * slidesPerRow;
    }

    slide.css(getDirectionLabel('margin-top'), row !== 0 ? spaceBetween && `${spaceBetween}px` : '');
  };

  const updateWrapperSize = (slideSize, snapGrid, getDirectionLabel) => {
    const {
      spaceBetween,
      centeredSlides,
      roundLengths
    } = swiper.params;
    const {
      rows
    } = swiper.params.grid;
    swiper.virtualSize = (slideSize + spaceBetween) * slidesNumberEvenToRows;
    swiper.virtualSize = Math.ceil(swiper.virtualSize / rows) - spaceBetween;
    swiper.$wrapperEl.css({
      [getDirectionLabel('width')]: `${swiper.virtualSize + spaceBetween}px`
    });

    if (centeredSlides) {
      snapGrid.splice(0, snapGrid.length);
      const newSlidesGrid = [];

      for (let i = 0; i < snapGrid.length; i += 1) {
        let slidesGridItem = snapGrid[i];
        if (roundLengths) slidesGridItem = Math.floor(slidesGridItem);
        if (snapGrid[i] < swiper.virtualSize + snapGrid[0]) newSlidesGrid.push(slidesGridItem);
      }

      snapGrid.push(...newSlidesGrid);
    }
  };

  swiper.grid = {
    initSlides,
    updateSlide,
    updateWrapperSize
  };
}function appendSlide(slides) {
  const swiper = this;
  const {
    $wrapperEl,
    params
  } = swiper;

  if (params.loop) {
    swiper.loopDestroy();
  }

  if (typeof slides === 'object' && 'length' in slides) {
    for (let i = 0; i < slides.length; i += 1) {
      if (slides[i]) $wrapperEl.append(slides[i]);
    }
  } else {
    $wrapperEl.append(slides);
  }

  if (params.loop) {
    swiper.loopCreate();
  }

  if (!params.observer) {
    swiper.update();
  }
}function prependSlide(slides) {
  const swiper = this;
  const {
    params,
    $wrapperEl,
    activeIndex
  } = swiper;

  if (params.loop) {
    swiper.loopDestroy();
  }

  let newActiveIndex = activeIndex + 1;

  if (typeof slides === 'object' && 'length' in slides) {
    for (let i = 0; i < slides.length; i += 1) {
      if (slides[i]) $wrapperEl.prepend(slides[i]);
    }

    newActiveIndex = activeIndex + slides.length;
  } else {
    $wrapperEl.prepend(slides);
  }

  if (params.loop) {
    swiper.loopCreate();
  }

  if (!params.observer) {
    swiper.update();
  }

  swiper.slideTo(newActiveIndex, 0, false);
}function addSlide(index, slides) {
  const swiper = this;
  const {
    $wrapperEl,
    params,
    activeIndex
  } = swiper;
  let activeIndexBuffer = activeIndex;

  if (params.loop) {
    activeIndexBuffer -= swiper.loopedSlides;
    swiper.loopDestroy();
    swiper.slides = $wrapperEl.children(`.${params.slideClass}`);
  }

  const baseLength = swiper.slides.length;

  if (index <= 0) {
    swiper.prependSlide(slides);
    return;
  }

  if (index >= baseLength) {
    swiper.appendSlide(slides);
    return;
  }

  let newActiveIndex = activeIndexBuffer > index ? activeIndexBuffer + 1 : activeIndexBuffer;
  const slidesBuffer = [];

  for (let i = baseLength - 1; i >= index; i -= 1) {
    const currentSlide = swiper.slides.eq(i);
    currentSlide.remove();
    slidesBuffer.unshift(currentSlide);
  }

  if (typeof slides === 'object' && 'length' in slides) {
    for (let i = 0; i < slides.length; i += 1) {
      if (slides[i]) $wrapperEl.append(slides[i]);
    }

    newActiveIndex = activeIndexBuffer > index ? activeIndexBuffer + slides.length : activeIndexBuffer;
  } else {
    $wrapperEl.append(slides);
  }

  for (let i = 0; i < slidesBuffer.length; i += 1) {
    $wrapperEl.append(slidesBuffer[i]);
  }

  if (params.loop) {
    swiper.loopCreate();
  }

  if (!params.observer) {
    swiper.update();
  }

  if (params.loop) {
    swiper.slideTo(newActiveIndex + swiper.loopedSlides, 0, false);
  } else {
    swiper.slideTo(newActiveIndex, 0, false);
  }
}function removeSlide(slidesIndexes) {
  const swiper = this;
  const {
    params,
    $wrapperEl,
    activeIndex
  } = swiper;
  let activeIndexBuffer = activeIndex;

  if (params.loop) {
    activeIndexBuffer -= swiper.loopedSlides;
    swiper.loopDestroy();
    swiper.slides = $wrapperEl.children(`.${params.slideClass}`);
  }

  let newActiveIndex = activeIndexBuffer;
  let indexToRemove;

  if (typeof slidesIndexes === 'object' && 'length' in slidesIndexes) {
    for (let i = 0; i < slidesIndexes.length; i += 1) {
      indexToRemove = slidesIndexes[i];
      if (swiper.slides[indexToRemove]) swiper.slides.eq(indexToRemove).remove();
      if (indexToRemove < newActiveIndex) newActiveIndex -= 1;
    }

    newActiveIndex = Math.max(newActiveIndex, 0);
  } else {
    indexToRemove = slidesIndexes;
    if (swiper.slides[indexToRemove]) swiper.slides.eq(indexToRemove).remove();
    if (indexToRemove < newActiveIndex) newActiveIndex -= 1;
    newActiveIndex = Math.max(newActiveIndex, 0);
  }

  if (params.loop) {
    swiper.loopCreate();
  }

  if (!params.observer) {
    swiper.update();
  }

  if (params.loop) {
    swiper.slideTo(newActiveIndex + swiper.loopedSlides, 0, false);
  } else {
    swiper.slideTo(newActiveIndex, 0, false);
  }
}function removeAllSlides() {
  const swiper = this;
  const slidesIndexes = [];

  for (let i = 0; i < swiper.slides.length; i += 1) {
    slidesIndexes.push(i);
  }

  swiper.removeSlide(slidesIndexes);
}function Manipulation({
  swiper
}) {
  Object.assign(swiper, {
    appendSlide: appendSlide.bind(swiper),
    prependSlide: prependSlide.bind(swiper),
    addSlide: addSlide.bind(swiper),
    removeSlide: removeSlide.bind(swiper),
    removeAllSlides: removeAllSlides.bind(swiper)
  });
}function effectInit(params) {
  const {
    effect,
    swiper,
    on,
    setTranslate,
    setTransition,
    overwriteParams,
    perspective,
    recreateShadows,
    getEffectParams
  } = params;
  on('beforeInit', () => {
    if (swiper.params.effect !== effect) return;
    swiper.classNames.push(`${swiper.params.containerModifierClass}${effect}`);

    if (perspective && perspective()) {
      swiper.classNames.push(`${swiper.params.containerModifierClass}3d`);
    }

    const overwriteParamsResult = overwriteParams ? overwriteParams() : {};
    Object.assign(swiper.params, overwriteParamsResult);
    Object.assign(swiper.originalParams, overwriteParamsResult);
  });
  on('setTranslate', () => {
    if (swiper.params.effect !== effect) return;
    setTranslate();
  });
  on('setTransition', (_s, duration) => {
    if (swiper.params.effect !== effect) return;
    setTransition(duration);
  });
  on('transitionEnd', () => {
    if (swiper.params.effect !== effect) return;

    if (recreateShadows) {
      if (!getEffectParams || !getEffectParams().slideShadows) return; // remove shadows

      swiper.slides.each(slideEl => {
        const $slideEl = swiper.$(slideEl);
        $slideEl.find('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left').remove();
      }); // create new one

      recreateShadows();
    }
  });
  let requireUpdateOnVirtual;
  on('virtualUpdate', () => {
    if (swiper.params.effect !== effect) return;

    if (!swiper.slides.length) {
      requireUpdateOnVirtual = true;
    }

    requestAnimationFrame(() => {
      if (requireUpdateOnVirtual && swiper.slides && swiper.slides.length) {
        setTranslate();
        requireUpdateOnVirtual = false;
      }
    });
  });
}function effectTarget(effectParams, $slideEl) {
  if (effectParams.transformEl) {
    return $slideEl.find(effectParams.transformEl).css({
      'backface-visibility': 'hidden',
      '-webkit-backface-visibility': 'hidden'
    });
  }

  return $slideEl;
}function effectVirtualTransitionEnd({
  swiper,
  duration,
  transformEl,
  allSlides
}) {
  const {
    slides,
    activeIndex,
    $wrapperEl
  } = swiper;

  if (swiper.params.virtualTranslate && duration !== 0) {
    let eventTriggered = false;
    let $transitionEndTarget;

    if (allSlides) {
      $transitionEndTarget = transformEl ? slides.find(transformEl) : slides;
    } else {
      $transitionEndTarget = transformEl ? slides.eq(activeIndex).find(transformEl) : slides.eq(activeIndex);
    }

    $transitionEndTarget.transitionEnd(() => {
      if (eventTriggered) return;
      if (!swiper || swiper.destroyed) return;
      eventTriggered = true;
      swiper.animating = false;
      const triggerEvents = ['webkitTransitionEnd', 'transitionend'];

      for (let i = 0; i < triggerEvents.length; i += 1) {
        $wrapperEl.trigger(triggerEvents[i]);
      }
    });
  }
}function EffectFade({
  swiper,
  extendParams,
  on
}) {
  extendParams({
    fadeEffect: {
      crossFade: false,
      transformEl: null
    }
  });

  const setTranslate = () => {
    const {
      slides
    } = swiper;
    const params = swiper.params.fadeEffect;

    for (let i = 0; i < slides.length; i += 1) {
      const $slideEl = swiper.slides.eq(i);
      const offset = $slideEl[0].swiperSlideOffset;
      let tx = -offset;
      if (!swiper.params.virtualTranslate) tx -= swiper.translate;
      let ty = 0;

      if (!swiper.isHorizontal()) {
        ty = tx;
        tx = 0;
      }

      const slideOpacity = swiper.params.fadeEffect.crossFade ? Math.max(1 - Math.abs($slideEl[0].progress), 0) : 1 + Math.min(Math.max($slideEl[0].progress, -1), 0);
      const $targetEl = effectTarget(params, $slideEl);
      $targetEl.css({
        opacity: slideOpacity
      }).transform(`translate3d(${tx}px, ${ty}px, 0px)`);
    }
  };

  const setTransition = duration => {
    const {
      transformEl
    } = swiper.params.fadeEffect;
    const $transitionElements = transformEl ? swiper.slides.find(transformEl) : swiper.slides;
    $transitionElements.transition(duration);
    effectVirtualTransitionEnd({
      swiper,
      duration,
      transformEl,
      allSlides: true
    });
  };

  effectInit({
    effect: 'fade',
    swiper,
    on,
    setTranslate,
    setTransition,
    overwriteParams: () => ({
      slidesPerView: 1,
      slidesPerGroup: 1,
      watchSlidesProgress: true,
      spaceBetween: 0,
      virtualTranslate: !swiper.params.cssMode
    })
  });
}function EffectCube({
  swiper,
  extendParams,
  on
}) {
  extendParams({
    cubeEffect: {
      slideShadows: true,
      shadow: true,
      shadowOffset: 20,
      shadowScale: 0.94
    }
  });

  const createSlideShadows = ($slideEl, progress, isHorizontal) => {
    let shadowBefore = isHorizontal ? $slideEl.find('.swiper-slide-shadow-left') : $slideEl.find('.swiper-slide-shadow-top');
    let shadowAfter = isHorizontal ? $slideEl.find('.swiper-slide-shadow-right') : $slideEl.find('.swiper-slide-shadow-bottom');

    if (shadowBefore.length === 0) {
      shadowBefore = $$1(`<div class="swiper-slide-shadow-${isHorizontal ? 'left' : 'top'}"></div>`);
      $slideEl.append(shadowBefore);
    }

    if (shadowAfter.length === 0) {
      shadowAfter = $$1(`<div class="swiper-slide-shadow-${isHorizontal ? 'right' : 'bottom'}"></div>`);
      $slideEl.append(shadowAfter);
    }

    if (shadowBefore.length) shadowBefore[0].style.opacity = Math.max(-progress, 0);
    if (shadowAfter.length) shadowAfter[0].style.opacity = Math.max(progress, 0);
  };

  const recreateShadows = () => {
    // create new ones
    const isHorizontal = swiper.isHorizontal();
    swiper.slides.each(slideEl => {
      const progress = Math.max(Math.min(slideEl.progress, 1), -1);
      createSlideShadows($$1(slideEl), progress, isHorizontal);
    });
  };

  const setTranslate = () => {
    const {
      $el,
      $wrapperEl,
      slides,
      width: swiperWidth,
      height: swiperHeight,
      rtlTranslate: rtl,
      size: swiperSize,
      browser
    } = swiper;
    const params = swiper.params.cubeEffect;
    const isHorizontal = swiper.isHorizontal();
    const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
    let wrapperRotate = 0;
    let $cubeShadowEl;

    if (params.shadow) {
      if (isHorizontal) {
        $cubeShadowEl = $wrapperEl.find('.swiper-cube-shadow');

        if ($cubeShadowEl.length === 0) {
          $cubeShadowEl = $$1('<div class="swiper-cube-shadow"></div>');
          $wrapperEl.append($cubeShadowEl);
        }

        $cubeShadowEl.css({
          height: `${swiperWidth}px`
        });
      } else {
        $cubeShadowEl = $el.find('.swiper-cube-shadow');

        if ($cubeShadowEl.length === 0) {
          $cubeShadowEl = $$1('<div class="swiper-cube-shadow"></div>');
          $el.append($cubeShadowEl);
        }
      }
    }

    for (let i = 0; i < slides.length; i += 1) {
      const $slideEl = slides.eq(i);
      let slideIndex = i;

      if (isVirtual) {
        slideIndex = parseInt($slideEl.attr('data-swiper-slide-index'), 10);
      }

      let slideAngle = slideIndex * 90;
      let round = Math.floor(slideAngle / 360);

      if (rtl) {
        slideAngle = -slideAngle;
        round = Math.floor(-slideAngle / 360);
      }

      const progress = Math.max(Math.min($slideEl[0].progress, 1), -1);
      let tx = 0;
      let ty = 0;
      let tz = 0;

      if (slideIndex % 4 === 0) {
        tx = -round * 4 * swiperSize;
        tz = 0;
      } else if ((slideIndex - 1) % 4 === 0) {
        tx = 0;
        tz = -round * 4 * swiperSize;
      } else if ((slideIndex - 2) % 4 === 0) {
        tx = swiperSize + round * 4 * swiperSize;
        tz = swiperSize;
      } else if ((slideIndex - 3) % 4 === 0) {
        tx = -swiperSize;
        tz = 3 * swiperSize + swiperSize * 4 * round;
      }

      if (rtl) {
        tx = -tx;
      }

      if (!isHorizontal) {
        ty = tx;
        tx = 0;
      }

      const transform = `rotateX(${isHorizontal ? 0 : -slideAngle}deg) rotateY(${isHorizontal ? slideAngle : 0}deg) translate3d(${tx}px, ${ty}px, ${tz}px)`;

      if (progress <= 1 && progress > -1) {
        wrapperRotate = slideIndex * 90 + progress * 90;
        if (rtl) wrapperRotate = -slideIndex * 90 - progress * 90;
      }

      $slideEl.transform(transform);

      if (params.slideShadows) {
        createSlideShadows($slideEl, progress, isHorizontal);
      }
    }

    $wrapperEl.css({
      '-webkit-transform-origin': `50% 50% -${swiperSize / 2}px`,
      'transform-origin': `50% 50% -${swiperSize / 2}px`
    });

    if (params.shadow) {
      if (isHorizontal) {
        $cubeShadowEl.transform(`translate3d(0px, ${swiperWidth / 2 + params.shadowOffset}px, ${-swiperWidth / 2}px) rotateX(90deg) rotateZ(0deg) scale(${params.shadowScale})`);
      } else {
        const shadowAngle = Math.abs(wrapperRotate) - Math.floor(Math.abs(wrapperRotate) / 90) * 90;
        const multiplier = 1.5 - (Math.sin(shadowAngle * 2 * Math.PI / 360) / 2 + Math.cos(shadowAngle * 2 * Math.PI / 360) / 2);
        const scale1 = params.shadowScale;
        const scale2 = params.shadowScale / multiplier;
        const offset = params.shadowOffset;
        $cubeShadowEl.transform(`scale3d(${scale1}, 1, ${scale2}) translate3d(0px, ${swiperHeight / 2 + offset}px, ${-swiperHeight / 2 / scale2}px) rotateX(-90deg)`);
      }
    }

    const zFactor = browser.isSafari || browser.isWebView ? -swiperSize / 2 : 0;
    $wrapperEl.transform(`translate3d(0px,0,${zFactor}px) rotateX(${swiper.isHorizontal() ? 0 : wrapperRotate}deg) rotateY(${swiper.isHorizontal() ? -wrapperRotate : 0}deg)`);
    $wrapperEl[0].style.setProperty('--swiper-cube-translate-z', `${zFactor}px`);
  };

  const setTransition = duration => {
    const {
      $el,
      slides
    } = swiper;
    slides.transition(duration).find('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left').transition(duration);

    if (swiper.params.cubeEffect.shadow && !swiper.isHorizontal()) {
      $el.find('.swiper-cube-shadow').transition(duration);
    }
  };

  effectInit({
    effect: 'cube',
    swiper,
    on,
    setTranslate,
    setTransition,
    recreateShadows,
    getEffectParams: () => swiper.params.cubeEffect,
    perspective: () => true,
    overwriteParams: () => ({
      slidesPerView: 1,
      slidesPerGroup: 1,
      watchSlidesProgress: true,
      resistanceRatio: 0,
      spaceBetween: 0,
      centeredSlides: false,
      virtualTranslate: true
    })
  });
}function createShadow(params, $slideEl, side) {
  const shadowClass = `swiper-slide-shadow${side ? `-${side}` : ''}`;
  const $shadowContainer = params.transformEl ? $slideEl.find(params.transformEl) : $slideEl;
  let $shadowEl = $shadowContainer.children(`.${shadowClass}`);

  if (!$shadowEl.length) {
    $shadowEl = $$1(`<div class="swiper-slide-shadow${side ? `-${side}` : ''}"></div>`);
    $shadowContainer.append($shadowEl);
  }

  return $shadowEl;
}function EffectFlip({
  swiper,
  extendParams,
  on
}) {
  extendParams({
    flipEffect: {
      slideShadows: true,
      limitRotation: true,
      transformEl: null
    }
  });

  const createSlideShadows = ($slideEl, progress, params) => {
    let shadowBefore = swiper.isHorizontal() ? $slideEl.find('.swiper-slide-shadow-left') : $slideEl.find('.swiper-slide-shadow-top');
    let shadowAfter = swiper.isHorizontal() ? $slideEl.find('.swiper-slide-shadow-right') : $slideEl.find('.swiper-slide-shadow-bottom');

    if (shadowBefore.length === 0) {
      shadowBefore = createShadow(params, $slideEl, swiper.isHorizontal() ? 'left' : 'top');
    }

    if (shadowAfter.length === 0) {
      shadowAfter = createShadow(params, $slideEl, swiper.isHorizontal() ? 'right' : 'bottom');
    }

    if (shadowBefore.length) shadowBefore[0].style.opacity = Math.max(-progress, 0);
    if (shadowAfter.length) shadowAfter[0].style.opacity = Math.max(progress, 0);
  };

  const recreateShadows = () => {
    // Set shadows
    const params = swiper.params.flipEffect;
    swiper.slides.each(slideEl => {
      const $slideEl = $$1(slideEl);
      let progress = $slideEl[0].progress;

      if (swiper.params.flipEffect.limitRotation) {
        progress = Math.max(Math.min(slideEl.progress, 1), -1);
      }

      createSlideShadows($slideEl, progress, params);
    });
  };

  const setTranslate = () => {
    const {
      slides,
      rtlTranslate: rtl
    } = swiper;
    const params = swiper.params.flipEffect;

    for (let i = 0; i < slides.length; i += 1) {
      const $slideEl = slides.eq(i);
      let progress = $slideEl[0].progress;

      if (swiper.params.flipEffect.limitRotation) {
        progress = Math.max(Math.min($slideEl[0].progress, 1), -1);
      }

      const offset = $slideEl[0].swiperSlideOffset;
      const rotate = -180 * progress;
      let rotateY = rotate;
      let rotateX = 0;
      let tx = swiper.params.cssMode ? -offset - swiper.translate : -offset;
      let ty = 0;

      if (!swiper.isHorizontal()) {
        ty = tx;
        tx = 0;
        rotateX = -rotateY;
        rotateY = 0;
      } else if (rtl) {
        rotateY = -rotateY;
      }

      $slideEl[0].style.zIndex = -Math.abs(Math.round(progress)) + slides.length;

      if (params.slideShadows) {
        createSlideShadows($slideEl, progress, params);
      }

      const transform = `translate3d(${tx}px, ${ty}px, 0px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      const $targetEl = effectTarget(params, $slideEl);
      $targetEl.transform(transform);
    }
  };

  const setTransition = duration => {
    const {
      transformEl
    } = swiper.params.flipEffect;
    const $transitionElements = transformEl ? swiper.slides.find(transformEl) : swiper.slides;
    $transitionElements.transition(duration).find('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left').transition(duration);
    effectVirtualTransitionEnd({
      swiper,
      duration,
      transformEl
    });
  };

  effectInit({
    effect: 'flip',
    swiper,
    on,
    setTranslate,
    setTransition,
    recreateShadows,
    getEffectParams: () => swiper.params.flipEffect,
    perspective: () => true,
    overwriteParams: () => ({
      slidesPerView: 1,
      slidesPerGroup: 1,
      watchSlidesProgress: true,
      spaceBetween: 0,
      virtualTranslate: !swiper.params.cssMode
    })
  });
}function EffectCoverflow({
  swiper,
  extendParams,
  on
}) {
  extendParams({
    coverflowEffect: {
      rotate: 50,
      stretch: 0,
      depth: 100,
      scale: 1,
      modifier: 1,
      slideShadows: true,
      transformEl: null
    }
  });

  const setTranslate = () => {
    const {
      width: swiperWidth,
      height: swiperHeight,
      slides,
      slidesSizesGrid
    } = swiper;
    const params = swiper.params.coverflowEffect;
    const isHorizontal = swiper.isHorizontal();
    const transform = swiper.translate;
    const center = isHorizontal ? -transform + swiperWidth / 2 : -transform + swiperHeight / 2;
    const rotate = isHorizontal ? params.rotate : -params.rotate;
    const translate = params.depth; // Each slide offset from center

    for (let i = 0, length = slides.length; i < length; i += 1) {
      const $slideEl = slides.eq(i);
      const slideSize = slidesSizesGrid[i];
      const slideOffset = $slideEl[0].swiperSlideOffset;
      const centerOffset = (center - slideOffset - slideSize / 2) / slideSize;
      const offsetMultiplier = typeof params.modifier === 'function' ? params.modifier(centerOffset) : centerOffset * params.modifier;
      let rotateY = isHorizontal ? rotate * offsetMultiplier : 0;
      let rotateX = isHorizontal ? 0 : rotate * offsetMultiplier; // var rotateZ = 0

      let translateZ = -translate * Math.abs(offsetMultiplier);
      let stretch = params.stretch; // Allow percentage to make a relative stretch for responsive sliders

      if (typeof stretch === 'string' && stretch.indexOf('%') !== -1) {
        stretch = parseFloat(params.stretch) / 100 * slideSize;
      }

      let translateY = isHorizontal ? 0 : stretch * offsetMultiplier;
      let translateX = isHorizontal ? stretch * offsetMultiplier : 0;
      let scale = 1 - (1 - params.scale) * Math.abs(offsetMultiplier); // Fix for ultra small values

      if (Math.abs(translateX) < 0.001) translateX = 0;
      if (Math.abs(translateY) < 0.001) translateY = 0;
      if (Math.abs(translateZ) < 0.001) translateZ = 0;
      if (Math.abs(rotateY) < 0.001) rotateY = 0;
      if (Math.abs(rotateX) < 0.001) rotateX = 0;
      if (Math.abs(scale) < 0.001) scale = 0;
      const slideTransform = `translate3d(${translateX}px,${translateY}px,${translateZ}px)  rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`;
      const $targetEl = effectTarget(params, $slideEl);
      $targetEl.transform(slideTransform);
      $slideEl[0].style.zIndex = -Math.abs(Math.round(offsetMultiplier)) + 1;

      if (params.slideShadows) {
        // Set shadows
        let $shadowBeforeEl = isHorizontal ? $slideEl.find('.swiper-slide-shadow-left') : $slideEl.find('.swiper-slide-shadow-top');
        let $shadowAfterEl = isHorizontal ? $slideEl.find('.swiper-slide-shadow-right') : $slideEl.find('.swiper-slide-shadow-bottom');

        if ($shadowBeforeEl.length === 0) {
          $shadowBeforeEl = createShadow(params, $slideEl, isHorizontal ? 'left' : 'top');
        }

        if ($shadowAfterEl.length === 0) {
          $shadowAfterEl = createShadow(params, $slideEl, isHorizontal ? 'right' : 'bottom');
        }

        if ($shadowBeforeEl.length) $shadowBeforeEl[0].style.opacity = offsetMultiplier > 0 ? offsetMultiplier : 0;
        if ($shadowAfterEl.length) $shadowAfterEl[0].style.opacity = -offsetMultiplier > 0 ? -offsetMultiplier : 0;
      }
    }
  };

  const setTransition = duration => {
    const {
      transformEl
    } = swiper.params.coverflowEffect;
    const $transitionElements = transformEl ? swiper.slides.find(transformEl) : swiper.slides;
    $transitionElements.transition(duration).find('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left').transition(duration);
  };

  effectInit({
    effect: 'coverflow',
    swiper,
    on,
    setTranslate,
    setTransition,
    perspective: () => true,
    overwriteParams: () => ({
      watchSlidesProgress: true
    })
  });
}function EffectCreative({
  swiper,
  extendParams,
  on
}) {
  extendParams({
    creativeEffect: {
      transformEl: null,
      limitProgress: 1,
      shadowPerProgress: false,
      progressMultiplier: 1,
      perspective: true,
      prev: {
        translate: [0, 0, 0],
        rotate: [0, 0, 0],
        opacity: 1,
        scale: 1
      },
      next: {
        translate: [0, 0, 0],
        rotate: [0, 0, 0],
        opacity: 1,
        scale: 1
      }
    }
  });

  const getTranslateValue = value => {
    if (typeof value === 'string') return value;
    return `${value}px`;
  };

  const setTranslate = () => {
    const {
      slides,
      $wrapperEl,
      slidesSizesGrid
    } = swiper;
    const params = swiper.params.creativeEffect;
    const {
      progressMultiplier: multiplier
    } = params;
    const isCenteredSlides = swiper.params.centeredSlides;

    if (isCenteredSlides) {
      const margin = slidesSizesGrid[0] / 2 - swiper.params.slidesOffsetBefore || 0;
      $wrapperEl.transform(`translateX(calc(50% - ${margin}px))`);
    }

    for (let i = 0; i < slides.length; i += 1) {
      const $slideEl = slides.eq(i);
      const slideProgress = $slideEl[0].progress;
      const progress = Math.min(Math.max($slideEl[0].progress, -params.limitProgress), params.limitProgress);
      let originalProgress = progress;

      if (!isCenteredSlides) {
        originalProgress = Math.min(Math.max($slideEl[0].originalProgress, -params.limitProgress), params.limitProgress);
      }

      const offset = $slideEl[0].swiperSlideOffset;
      const t = [swiper.params.cssMode ? -offset - swiper.translate : -offset, 0, 0];
      const r = [0, 0, 0];
      let custom = false;

      if (!swiper.isHorizontal()) {
        t[1] = t[0];
        t[0] = 0;
      }

      let data = {
        translate: [0, 0, 0],
        rotate: [0, 0, 0],
        scale: 1,
        opacity: 1
      };

      if (progress < 0) {
        data = params.next;
        custom = true;
      } else if (progress > 0) {
        data = params.prev;
        custom = true;
      } // set translate


      t.forEach((value, index) => {
        t[index] = `calc(${value}px + (${getTranslateValue(data.translate[index])} * ${Math.abs(progress * multiplier)}))`;
      }); // set rotates

      r.forEach((value, index) => {
        r[index] = data.rotate[index] * Math.abs(progress * multiplier);
      });
      $slideEl[0].style.zIndex = -Math.abs(Math.round(slideProgress)) + slides.length;
      const translateString = t.join(', ');
      const rotateString = `rotateX(${r[0]}deg) rotateY(${r[1]}deg) rotateZ(${r[2]}deg)`;
      const scaleString = originalProgress < 0 ? `scale(${1 + (1 - data.scale) * originalProgress * multiplier})` : `scale(${1 - (1 - data.scale) * originalProgress * multiplier})`;
      const opacityString = originalProgress < 0 ? 1 + (1 - data.opacity) * originalProgress * multiplier : 1 - (1 - data.opacity) * originalProgress * multiplier;
      const transform = `translate3d(${translateString}) ${rotateString} ${scaleString}`; // Set shadows

      if (custom && data.shadow || !custom) {
        let $shadowEl = $slideEl.children('.swiper-slide-shadow');

        if ($shadowEl.length === 0 && data.shadow) {
          $shadowEl = createShadow(params, $slideEl);
        }

        if ($shadowEl.length) {
          const shadowOpacity = params.shadowPerProgress ? progress * (1 / params.limitProgress) : progress;
          $shadowEl[0].style.opacity = Math.min(Math.max(Math.abs(shadowOpacity), 0), 1);
        }
      }

      const $targetEl = effectTarget(params, $slideEl);
      $targetEl.transform(transform).css({
        opacity: opacityString
      });

      if (data.origin) {
        $targetEl.css('transform-origin', data.origin);
      }
    }
  };

  const setTransition = duration => {
    const {
      transformEl
    } = swiper.params.creativeEffect;
    const $transitionElements = transformEl ? swiper.slides.find(transformEl) : swiper.slides;
    $transitionElements.transition(duration).find('.swiper-slide-shadow').transition(duration);
    effectVirtualTransitionEnd({
      swiper,
      duration,
      transformEl,
      allSlides: true
    });
  };

  effectInit({
    effect: 'creative',
    swiper,
    on,
    setTranslate,
    setTransition,
    perspective: () => swiper.params.creativeEffect.perspective,
    overwriteParams: () => ({
      watchSlidesProgress: true,
      virtualTranslate: !swiper.params.cssMode
    })
  });
}function EffectCards({
  swiper,
  extendParams,
  on
}) {
  extendParams({
    cardsEffect: {
      slideShadows: true,
      transformEl: null,
      rotate: true,
      perSlideRotate: 2,
      perSlideOffset: 8
    }
  });

  const setTranslate = () => {
    const {
      slides,
      activeIndex
    } = swiper;
    const params = swiper.params.cardsEffect;
    const {
      startTranslate,
      isTouched
    } = swiper.touchEventsData;
    const currentTranslate = swiper.translate;

    for (let i = 0; i < slides.length; i += 1) {
      const $slideEl = slides.eq(i);
      const slideProgress = $slideEl[0].progress;
      const progress = Math.min(Math.max(slideProgress, -4), 4);
      let offset = $slideEl[0].swiperSlideOffset;

      if (swiper.params.centeredSlides && !swiper.params.cssMode) {
        swiper.$wrapperEl.transform(`translateX(${swiper.minTranslate()}px)`);
      }

      if (swiper.params.centeredSlides && swiper.params.cssMode) {
        offset -= slides[0].swiperSlideOffset;
      }

      let tX = swiper.params.cssMode ? -offset - swiper.translate : -offset;
      let tY = 0;
      const tZ = -100 * Math.abs(progress);
      let scale = 1;
      let rotate = -params.perSlideRotate * progress;
      let tXAdd = params.perSlideOffset - Math.abs(progress) * 0.75;
      const slideIndex = swiper.virtual && swiper.params.virtual.enabled ? swiper.virtual.from + i : i;
      const isSwipeToNext = (slideIndex === activeIndex || slideIndex === activeIndex - 1) && progress > 0 && progress < 1 && (isTouched || swiper.params.cssMode) && currentTranslate < startTranslate;
      const isSwipeToPrev = (slideIndex === activeIndex || slideIndex === activeIndex + 1) && progress < 0 && progress > -1 && (isTouched || swiper.params.cssMode) && currentTranslate > startTranslate;

      if (isSwipeToNext || isSwipeToPrev) {
        const subProgress = (1 - Math.abs((Math.abs(progress) - 0.5) / 0.5)) ** 0.5;
        rotate += -28 * progress * subProgress;
        scale += -0.5 * subProgress;
        tXAdd += 96 * subProgress;
        tY = `${-25 * subProgress * Math.abs(progress)}%`;
      }

      if (progress < 0) {
        // next
        tX = `calc(${tX}px + (${tXAdd * Math.abs(progress)}%))`;
      } else if (progress > 0) {
        // prev
        tX = `calc(${tX}px + (-${tXAdd * Math.abs(progress)}%))`;
      } else {
        tX = `${tX}px`;
      }

      if (!swiper.isHorizontal()) {
        const prevY = tY;
        tY = tX;
        tX = prevY;
      }

      const scaleString = progress < 0 ? `${1 + (1 - scale) * progress}` : `${1 - (1 - scale) * progress}`;
      const transform = `
        translate3d(${tX}, ${tY}, ${tZ}px)
        rotateZ(${params.rotate ? rotate : 0}deg)
        scale(${scaleString})
      `;

      if (params.slideShadows) {
        // Set shadows
        let $shadowEl = $slideEl.find('.swiper-slide-shadow');

        if ($shadowEl.length === 0) {
          $shadowEl = createShadow(params, $slideEl);
        }

        if ($shadowEl.length) $shadowEl[0].style.opacity = Math.min(Math.max((Math.abs(progress) - 0.5) / 0.5, 0), 1);
      }

      $slideEl[0].style.zIndex = -Math.abs(Math.round(slideProgress)) + slides.length;
      const $targetEl = effectTarget(params, $slideEl);
      $targetEl.transform(transform);
    }
  };

  const setTransition = duration => {
    const {
      transformEl
    } = swiper.params.cardsEffect;
    const $transitionElements = transformEl ? swiper.slides.find(transformEl) : swiper.slides;
    $transitionElements.transition(duration).find('.swiper-slide-shadow').transition(duration);
    effectVirtualTransitionEnd({
      swiper,
      duration,
      transformEl
    });
  };

  effectInit({
    effect: 'cards',
    swiper,
    on,
    setTranslate,
    setTransition,
    perspective: () => true,
    overwriteParams: () => ({
      watchSlidesProgress: true,
      virtualTranslate: !swiper.params.cssMode
    })
  });
}/**
 * Swiper 8.4.7
 * Most modern mobile touch slider and framework with hardware accelerated transitions
 * https://swiperjs.com
 *
 * Copyright 2014-2023 Vladimir Kharlampidi
 *
 * Released under the MIT License
 *
 * Released on: January 30, 2023
 */

// Swiper Class
const modules = [Virtual, Keyboard, Mousewheel, Navigation, Pagination, Scrollbar, Parallax, Zoom, Lazy, Controller, A11y, History, HashNavigation, Autoplay, Thumb, freeMode, Grid, Manipulation, EffectFade, EffectCube, EffectFlip, EffectCoverflow, EffectCreative, EffectCards];
Swiper.use(modules);function _defineProperties$1(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass$1(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$1(Constructor.prototype, protoProps); if (staticProps) _defineProperties$1(Constructor, staticProps); return Constructor; }

/*!
 * Observer 3.11.4
 * https://greensock.com
 *
 * @license Copyright 2008-2022, GreenSock. All rights reserved.
 * Subject to the terms at https://greensock.com/standard-license or for
 * Club GreenSock members, the agreement issued with that membership.
 * @author: Jack Doyle, jack@greensock.com
*/

/* eslint-disable */
var gsap$3,
    _coreInitted$2,
    _win$1,
    _doc$1,
    _docEl$1,
    _body$1,
    _isTouch,
    _pointerType,
    ScrollTrigger$1,
    _root$1,
    _normalizer$1,
    _eventTypes,
    _context$1,
    _getGSAP$2 = function _getGSAP() {
  return gsap$3 || typeof window !== "undefined" && (gsap$3 = window.gsap) && gsap$3.registerPlugin && gsap$3;
},
    _startup$1 = 1,
    _observers = [],
    _scrollers = [],
    _proxies = [],
    _getTime$1 = Date.now,
    _bridge = function _bridge(name, value) {
  return value;
},
    _integrate = function _integrate() {
  var core = ScrollTrigger$1.core,
      data = core.bridge || {},
      scrollers = core._scrollers,
      proxies = core._proxies;
  scrollers.push.apply(scrollers, _scrollers);
  proxies.push.apply(proxies, _proxies);
  _scrollers = scrollers;
  _proxies = proxies;

  _bridge = function _bridge(name, value) {
    return data[name](value);
  };
},
    _getProxyProp = function _getProxyProp(element, property) {
  return ~_proxies.indexOf(element) && _proxies[_proxies.indexOf(element) + 1][property];
},
    _isViewport$1 = function _isViewport(el) {
  return !!~_root$1.indexOf(el);
},
    _addListener$1 = function _addListener(element, type, func, nonPassive, capture) {
  return element.addEventListener(type, func, {
    passive: !nonPassive,
    capture: !!capture
  });
},
    _removeListener$1 = function _removeListener(element, type, func, capture) {
  return element.removeEventListener(type, func, !!capture);
},
    _scrollLeft = "scrollLeft",
    _scrollTop = "scrollTop",
    _onScroll$1 = function _onScroll() {
  return _normalizer$1 && _normalizer$1.isPressed || _scrollers.cache++;
},
    _scrollCacheFunc = function _scrollCacheFunc(f, doNotCache) {
  var cachingFunc = function cachingFunc(value) {
    // since reading the scrollTop/scrollLeft/pageOffsetY/pageOffsetX can trigger a layout, this function allows us to cache the value so it only gets read fresh after a "scroll" event fires (or while we're refreshing because that can lengthen the page and alter the scroll position). when "soft" is true, that means don't actually set the scroll, but cache the new value instead (useful in ScrollSmoother)
    if (value || value === 0) {
      _startup$1 && (_win$1.history.scrollRestoration = "manual"); // otherwise the new position will get overwritten by the browser onload.

      var isNormalizing = _normalizer$1 && _normalizer$1.isPressed;
      value = cachingFunc.v = Math.round(value) || (_normalizer$1 && _normalizer$1.iOS ? 1 : 0); //TODO: iOS Bug: if you allow it to go to 0, Safari can start to report super strange (wildly inaccurate) touch positions!

      f(value);
      cachingFunc.cacheID = _scrollers.cache;
      isNormalizing && _bridge("ss", value); // set scroll (notify ScrollTrigger so it can dispatch a "scrollStart" event if necessary
    } else if (doNotCache || _scrollers.cache !== cachingFunc.cacheID || _bridge("ref")) {
      cachingFunc.cacheID = _scrollers.cache;
      cachingFunc.v = f();
    }

    return cachingFunc.v + cachingFunc.offset;
  };

  cachingFunc.offset = 0;
  return f && cachingFunc;
},
    _horizontal = {
  s: _scrollLeft,
  p: "left",
  p2: "Left",
  os: "right",
  os2: "Right",
  d: "width",
  d2: "Width",
  a: "x",
  sc: _scrollCacheFunc(function (value) {
    return arguments.length ? _win$1.scrollTo(value, _vertical.sc()) : _win$1.pageXOffset || _doc$1[_scrollLeft] || _docEl$1[_scrollLeft] || _body$1[_scrollLeft] || 0;
  })
},
    _vertical = {
  s: _scrollTop,
  p: "top",
  p2: "Top",
  os: "bottom",
  os2: "Bottom",
  d: "height",
  d2: "Height",
  a: "y",
  op: _horizontal,
  sc: _scrollCacheFunc(function (value) {
    return arguments.length ? _win$1.scrollTo(_horizontal.sc(), value) : _win$1.pageYOffset || _doc$1[_scrollTop] || _docEl$1[_scrollTop] || _body$1[_scrollTop] || 0;
  })
},
    _getTarget = function _getTarget(t) {
  return gsap$3.utils.toArray(t)[0] || (typeof t === "string" && gsap$3.config().nullTargetWarn !== false ? console.warn("Element not found:", t) : null);
},
    _getScrollFunc = function _getScrollFunc(element, _ref) {
  var s = _ref.s,
      sc = _ref.sc;
  // we store the scroller functions in an alternating sequenced Array like [element, verticalScrollFunc, horizontalScrollFunc, ...] so that we can minimize memory, maximize performance, and we also record the last position as a ".rec" property in order to revert to that after refreshing to ensure things don't shift around.
  _isViewport$1(element) && (element = _doc$1.scrollingElement || _docEl$1);

  var i = _scrollers.indexOf(element),
      offset = sc === _vertical.sc ? 1 : 2;

  !~i && (i = _scrollers.push(element) - 1);
  _scrollers[i + offset] || element.addEventListener("scroll", _onScroll$1); // clear the cache when a scroll occurs

  var prev = _scrollers[i + offset],
      func = prev || (_scrollers[i + offset] = _scrollCacheFunc(_getProxyProp(element, s), true) || (_isViewport$1(element) ? sc : _scrollCacheFunc(function (value) {
    return arguments.length ? element[s] = value : element[s];
  })));
  func.target = element;
  prev || (func.smooth = gsap$3.getProperty(element, "scrollBehavior") === "smooth"); // only set it the first time (don't reset every time a scrollFunc is requested because perhaps it happens during a refresh() when it's disabled in ScrollTrigger.

  return func;
},
    _getVelocityProp = function _getVelocityProp(value, minTimeRefresh, useDelta) {
  var v1 = value,
      v2 = value,
      t1 = _getTime$1(),
      t2 = t1,
      min = minTimeRefresh || 50,
      dropToZeroTime = Math.max(500, min * 3),
      update = function update(value, force) {
    var t = _getTime$1();

    if (force || t - t1 > min) {
      v2 = v1;
      v1 = value;
      t2 = t1;
      t1 = t;
    } else if (useDelta) {
      v1 += value;
    } else {
      // not totally necessary, but makes it a bit more accurate by adjusting the v1 value according to the new slope. This way we're not just ignoring the incoming data. Removing for now because it doesn't seem to make much practical difference and it's probably not worth the kb.
      v1 = v2 + (value - v2) / (t - t2) * (t1 - t2);
    }
  },
      reset = function reset() {
    v2 = v1 = useDelta ? 0 : v1;
    t2 = t1 = 0;
  },
      getVelocity = function getVelocity(latestValue) {
    var tOld = t2,
        vOld = v2,
        t = _getTime$1();

    (latestValue || latestValue === 0) && latestValue !== v1 && update(latestValue);
    return t1 === t2 || t - t2 > dropToZeroTime ? 0 : (v1 + (useDelta ? vOld : -vOld)) / ((useDelta ? t : t1) - tOld) * 1000;
  };

  return {
    update: update,
    reset: reset,
    getVelocity: getVelocity
  };
},
    _getEvent = function _getEvent(e, preventDefault) {
  preventDefault && !e._gsapAllow && e.preventDefault();
  return e.changedTouches ? e.changedTouches[0] : e;
},
    _getAbsoluteMax = function _getAbsoluteMax(a) {
  var max = Math.max.apply(Math, a),
      min = Math.min.apply(Math, a);
  return Math.abs(max) >= Math.abs(min) ? max : min;
},
    _setScrollTrigger = function _setScrollTrigger() {
  ScrollTrigger$1 = gsap$3.core.globals().ScrollTrigger;
  ScrollTrigger$1 && ScrollTrigger$1.core && _integrate();
},
    _initCore$1 = function _initCore(core) {
  gsap$3 = core || _getGSAP$2();

  if (gsap$3 && typeof document !== "undefined" && document.body) {
    _win$1 = window;
    _doc$1 = document;
    _docEl$1 = _doc$1.documentElement;
    _body$1 = _doc$1.body;
    _root$1 = [_win$1, _doc$1, _docEl$1, _body$1];
    gsap$3.utils.clamp;

    _context$1 = gsap$3.core.context || function () {};

    _pointerType = "onpointerenter" in _body$1 ? "pointer" : "mouse"; // isTouch is 0 if no touch, 1 if ONLY touch, and 2 if it can accommodate touch but also other types like mouse/pointer.

    _isTouch = Observer.isTouch = _win$1.matchMedia && _win$1.matchMedia("(hover: none), (pointer: coarse)").matches ? 1 : "ontouchstart" in _win$1 || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0 ? 2 : 0;
    _eventTypes = Observer.eventTypes = ("ontouchstart" in _docEl$1 ? "touchstart,touchmove,touchcancel,touchend" : !("onpointerdown" in _docEl$1) ? "mousedown,mousemove,mouseup,mouseup" : "pointerdown,pointermove,pointercancel,pointerup").split(",");
    setTimeout(function () {
      return _startup$1 = 0;
    }, 500);

    _setScrollTrigger();

    _coreInitted$2 = 1;
  }

  return _coreInitted$2;
};

_horizontal.op = _vertical;
_scrollers.cache = 0;
var Observer = /*#__PURE__*/function () {
  function Observer(vars) {
    this.init(vars);
  }

  var _proto = Observer.prototype;

  _proto.init = function init(vars) {
    _coreInitted$2 || _initCore$1(gsap$3) || console.warn("Please gsap.registerPlugin(Observer)");
    ScrollTrigger$1 || _setScrollTrigger();
    var tolerance = vars.tolerance,
        dragMinimum = vars.dragMinimum,
        type = vars.type,
        target = vars.target,
        lineHeight = vars.lineHeight,
        debounce = vars.debounce,
        preventDefault = vars.preventDefault,
        onStop = vars.onStop,
        onStopDelay = vars.onStopDelay,
        ignore = vars.ignore,
        wheelSpeed = vars.wheelSpeed,
        event = vars.event,
        onDragStart = vars.onDragStart,
        onDragEnd = vars.onDragEnd,
        onDrag = vars.onDrag,
        onPress = vars.onPress,
        onRelease = vars.onRelease,
        onRight = vars.onRight,
        onLeft = vars.onLeft,
        onUp = vars.onUp,
        onDown = vars.onDown,
        onChangeX = vars.onChangeX,
        onChangeY = vars.onChangeY,
        onChange = vars.onChange,
        onToggleX = vars.onToggleX,
        onToggleY = vars.onToggleY,
        onHover = vars.onHover,
        onHoverEnd = vars.onHoverEnd,
        onMove = vars.onMove,
        ignoreCheck = vars.ignoreCheck,
        isNormalizer = vars.isNormalizer,
        onGestureStart = vars.onGestureStart,
        onGestureEnd = vars.onGestureEnd,
        onWheel = vars.onWheel,
        onEnable = vars.onEnable,
        onDisable = vars.onDisable,
        onClick = vars.onClick,
        scrollSpeed = vars.scrollSpeed,
        capture = vars.capture,
        allowClicks = vars.allowClicks,
        lockAxis = vars.lockAxis,
        onLockAxis = vars.onLockAxis;
    this.target = target = _getTarget(target) || _docEl$1;
    this.vars = vars;
    ignore && (ignore = gsap$3.utils.toArray(ignore));
    tolerance = tolerance || 1e-9;
    dragMinimum = dragMinimum || 0;
    wheelSpeed = wheelSpeed || 1;
    scrollSpeed = scrollSpeed || 1;
    type = type || "wheel,touch,pointer";
    debounce = debounce !== false;
    lineHeight || (lineHeight = parseFloat(_win$1.getComputedStyle(_body$1).lineHeight) || 22); // note: browser may report "normal", so default to 22.

    var id,
        onStopDelayedCall,
        dragged,
        moved,
        wheeled,
        locked,
        axis,
        self = this,
        prevDeltaX = 0,
        prevDeltaY = 0,
        scrollFuncX = _getScrollFunc(target, _horizontal),
        scrollFuncY = _getScrollFunc(target, _vertical),
        scrollX = scrollFuncX(),
        scrollY = scrollFuncY(),
        limitToTouch = ~type.indexOf("touch") && !~type.indexOf("pointer") && _eventTypes[0] === "pointerdown",
        // for devices that accommodate mouse events and touch events, we need to distinguish.
    isViewport = _isViewport$1(target),
        ownerDoc = target.ownerDocument || _doc$1,
        deltaX = [0, 0, 0],
        // wheel, scroll, pointer/touch
    deltaY = [0, 0, 0],
        onClickTime = 0,
        clickCapture = function clickCapture() {
      return onClickTime = _getTime$1();
    },
        _ignoreCheck = function _ignoreCheck(e, isPointerOrTouch) {
      return (self.event = e) && ignore && ~ignore.indexOf(e.target) || isPointerOrTouch && limitToTouch && e.pointerType !== "touch" || ignoreCheck && ignoreCheck(e, isPointerOrTouch);
    },
        onStopFunc = function onStopFunc() {
      self._vx.reset();

      self._vy.reset();

      onStopDelayedCall.pause();
      onStop && onStop(self);
    },
        update = function update() {
      var dx = self.deltaX = _getAbsoluteMax(deltaX),
          dy = self.deltaY = _getAbsoluteMax(deltaY),
          changedX = Math.abs(dx) >= tolerance,
          changedY = Math.abs(dy) >= tolerance;

      onChange && (changedX || changedY) && onChange(self, dx, dy, deltaX, deltaY); // in ScrollTrigger.normalizeScroll(), we need to know if it was touch/pointer so we need access to the deltaX/deltaY Arrays before we clear them out.

      if (changedX) {
        onRight && self.deltaX > 0 && onRight(self);
        onLeft && self.deltaX < 0 && onLeft(self);
        onChangeX && onChangeX(self);
        onToggleX && self.deltaX < 0 !== prevDeltaX < 0 && onToggleX(self);
        prevDeltaX = self.deltaX;
        deltaX[0] = deltaX[1] = deltaX[2] = 0;
      }

      if (changedY) {
        onDown && self.deltaY > 0 && onDown(self);
        onUp && self.deltaY < 0 && onUp(self);
        onChangeY && onChangeY(self);
        onToggleY && self.deltaY < 0 !== prevDeltaY < 0 && onToggleY(self);
        prevDeltaY = self.deltaY;
        deltaY[0] = deltaY[1] = deltaY[2] = 0;
      }

      if (moved || dragged) {
        onMove && onMove(self);

        if (dragged) {
          onDrag(self);
          dragged = false;
        }

        moved = false;
      }

      locked && !(locked = false) && onLockAxis && onLockAxis(self);

      if (wheeled) {
        onWheel(self);
        wheeled = false;
      }

      id = 0;
    },
        onDelta = function onDelta(x, y, index) {
      deltaX[index] += x;
      deltaY[index] += y;

      self._vx.update(x);

      self._vy.update(y);

      debounce ? id || (id = requestAnimationFrame(update)) : update();
    },
        onTouchOrPointerDelta = function onTouchOrPointerDelta(x, y) {
      if (lockAxis && !axis) {
        self.axis = axis = Math.abs(x) > Math.abs(y) ? "x" : "y";
        locked = true;
      }

      if (axis !== "y") {
        deltaX[2] += x;

        self._vx.update(x, true); // update the velocity as frequently as possible instead of in the debounced function so that very quick touch-scrolls (flicks) feel natural. If it's the mouse/touch/pointer, force it so that we get snappy/accurate momentum scroll.

      }

      if (axis !== "x") {
        deltaY[2] += y;

        self._vy.update(y, true);
      }

      debounce ? id || (id = requestAnimationFrame(update)) : update();
    },
        _onDrag = function _onDrag(e) {
      if (_ignoreCheck(e, 1)) {
        return;
      }

      e = _getEvent(e, preventDefault);
      var x = e.clientX,
          y = e.clientY,
          dx = x - self.x,
          dy = y - self.y,
          isDragging = self.isDragging;
      self.x = x;
      self.y = y;

      if (isDragging || Math.abs(self.startX - x) >= dragMinimum || Math.abs(self.startY - y) >= dragMinimum) {
        onDrag && (dragged = true);
        isDragging || (self.isDragging = true);
        onTouchOrPointerDelta(dx, dy);
        isDragging || onDragStart && onDragStart(self);
      }
    },
        _onPress = self.onPress = function (e) {
      if (_ignoreCheck(e, 1)) {
        return;
      }

      self.axis = axis = null;
      onStopDelayedCall.pause();
      self.isPressed = true;
      e = _getEvent(e); // note: may need to preventDefault(?) Won't side-scroll on iOS Safari if we do, though.

      prevDeltaX = prevDeltaY = 0;
      self.startX = self.x = e.clientX;
      self.startY = self.y = e.clientY;

      self._vx.reset(); // otherwise the t2 may be stale if the user touches and flicks super fast and releases in less than 2 requestAnimationFrame ticks, causing velocity to be 0.


      self._vy.reset();

      _addListener$1(isNormalizer ? target : ownerDoc, _eventTypes[1], _onDrag, preventDefault, true);

      self.deltaX = self.deltaY = 0;
      onPress && onPress(self);
    },
        _onRelease = function _onRelease(e) {
      if (_ignoreCheck(e, 1)) {
        return;
      }

      _removeListener$1(isNormalizer ? target : ownerDoc, _eventTypes[1], _onDrag, true);

      var isTrackingDrag = !isNaN(self.y - self.startY),
          wasDragging = self.isDragging && (Math.abs(self.x - self.startX) > 3 || Math.abs(self.y - self.startY) > 3),
          // some touch devices need some wiggle room in terms of sensing clicks - the finger may move a few pixels.
      eventData = _getEvent(e);

      if (!wasDragging && isTrackingDrag) {
        self._vx.reset();

        self._vy.reset();

        if (preventDefault && allowClicks) {
          gsap$3.delayedCall(0.08, function () {
            // some browsers (like Firefox) won't trust script-generated clicks, so if the user tries to click on a video to play it, for example, it simply won't work. Since a regular "click" event will most likely be generated anyway (one that has its isTrusted flag set to true), we must slightly delay our script-generated click so that the "real"/trusted one is prioritized. Remember, when there are duplicate events in quick succession, we suppress all but the first one. Some browsers don't even trigger the "real" one at all, so our synthetic one is a safety valve that ensures that no matter what, a click event does get dispatched.
            if (_getTime$1() - onClickTime > 300 && !e.defaultPrevented) {
              if (e.target.click) {
                //some browsers (like mobile Safari) don't properly trigger the click event
                e.target.click();
              } else if (ownerDoc.createEvent) {
                var syntheticEvent = ownerDoc.createEvent("MouseEvents");
                syntheticEvent.initMouseEvent("click", true, true, _win$1, 1, eventData.screenX, eventData.screenY, eventData.clientX, eventData.clientY, false, false, false, false, 0, null);
                e.target.dispatchEvent(syntheticEvent);
              }
            }
          });
        }
      }

      self.isDragging = self.isGesturing = self.isPressed = false;
      onStop && !isNormalizer && onStopDelayedCall.restart(true);
      onDragEnd && wasDragging && onDragEnd(self);
      onRelease && onRelease(self, wasDragging);
    },
        _onGestureStart = function _onGestureStart(e) {
      return e.touches && e.touches.length > 1 && (self.isGesturing = true) && onGestureStart(e, self.isDragging);
    },
        _onGestureEnd = function _onGestureEnd() {
      return (self.isGesturing = false) || onGestureEnd(self);
    },
        onScroll = function onScroll(e) {
      if (_ignoreCheck(e)) {
        return;
      }

      var x = scrollFuncX(),
          y = scrollFuncY();
      onDelta((x - scrollX) * scrollSpeed, (y - scrollY) * scrollSpeed, 1);
      scrollX = x;
      scrollY = y;
      onStop && onStopDelayedCall.restart(true);
    },
        _onWheel = function _onWheel(e) {
      if (_ignoreCheck(e)) {
        return;
      }

      e = _getEvent(e, preventDefault);
      onWheel && (wheeled = true);
      var multiplier = (e.deltaMode === 1 ? lineHeight : e.deltaMode === 2 ? _win$1.innerHeight : 1) * wheelSpeed;
      onDelta(e.deltaX * multiplier, e.deltaY * multiplier, 0);
      onStop && !isNormalizer && onStopDelayedCall.restart(true);
    },
        _onMove = function _onMove(e) {
      if (_ignoreCheck(e)) {
        return;
      }

      var x = e.clientX,
          y = e.clientY,
          dx = x - self.x,
          dy = y - self.y;
      self.x = x;
      self.y = y;
      moved = true;
      (dx || dy) && onTouchOrPointerDelta(dx, dy);
    },
        _onHover = function _onHover(e) {
      self.event = e;
      onHover(self);
    },
        _onHoverEnd = function _onHoverEnd(e) {
      self.event = e;
      onHoverEnd(self);
    },
        _onClick = function _onClick(e) {
      return _ignoreCheck(e) || _getEvent(e, preventDefault) && onClick(self);
    };

    onStopDelayedCall = self._dc = gsap$3.delayedCall(onStopDelay || 0.25, onStopFunc).pause();
    self.deltaX = self.deltaY = 0;
    self._vx = _getVelocityProp(0, 50, true);
    self._vy = _getVelocityProp(0, 50, true);
    self.scrollX = scrollFuncX;
    self.scrollY = scrollFuncY;
    self.isDragging = self.isGesturing = self.isPressed = false;

    _context$1(this);

    self.enable = function (e) {
      if (!self.isEnabled) {
        _addListener$1(isViewport ? ownerDoc : target, "scroll", _onScroll$1);

        type.indexOf("scroll") >= 0 && _addListener$1(isViewport ? ownerDoc : target, "scroll", onScroll, preventDefault, capture);
        type.indexOf("wheel") >= 0 && _addListener$1(target, "wheel", _onWheel, preventDefault, capture);

        if (type.indexOf("touch") >= 0 && _isTouch || type.indexOf("pointer") >= 0) {
          _addListener$1(target, _eventTypes[0], _onPress, preventDefault, capture);

          _addListener$1(ownerDoc, _eventTypes[2], _onRelease);

          _addListener$1(ownerDoc, _eventTypes[3], _onRelease);

          allowClicks && _addListener$1(target, "click", clickCapture, false, true);
          onClick && _addListener$1(target, "click", _onClick);
          onGestureStart && _addListener$1(ownerDoc, "gesturestart", _onGestureStart);
          onGestureEnd && _addListener$1(ownerDoc, "gestureend", _onGestureEnd);
          onHover && _addListener$1(target, _pointerType + "enter", _onHover);
          onHoverEnd && _addListener$1(target, _pointerType + "leave", _onHoverEnd);
          onMove && _addListener$1(target, _pointerType + "move", _onMove);
        }

        self.isEnabled = true;
        e && e.type && _onPress(e);
        onEnable && onEnable(self);
      }

      return self;
    };

    self.disable = function () {
      if (self.isEnabled) {
        // only remove the _onScroll listener if there aren't any others that rely on the functionality.
        _observers.filter(function (o) {
          return o !== self && _isViewport$1(o.target);
        }).length || _removeListener$1(isViewport ? ownerDoc : target, "scroll", _onScroll$1);

        if (self.isPressed) {
          self._vx.reset();

          self._vy.reset();

          _removeListener$1(isNormalizer ? target : ownerDoc, _eventTypes[1], _onDrag, true);
        }

        _removeListener$1(isViewport ? ownerDoc : target, "scroll", onScroll, capture);

        _removeListener$1(target, "wheel", _onWheel, capture);

        _removeListener$1(target, _eventTypes[0], _onPress, capture);

        _removeListener$1(ownerDoc, _eventTypes[2], _onRelease);

        _removeListener$1(ownerDoc, _eventTypes[3], _onRelease);

        _removeListener$1(target, "click", clickCapture, true);

        _removeListener$1(target, "click", _onClick);

        _removeListener$1(ownerDoc, "gesturestart", _onGestureStart);

        _removeListener$1(ownerDoc, "gestureend", _onGestureEnd);

        _removeListener$1(target, _pointerType + "enter", _onHover);

        _removeListener$1(target, _pointerType + "leave", _onHoverEnd);

        _removeListener$1(target, _pointerType + "move", _onMove);

        self.isEnabled = self.isPressed = self.isDragging = false;
        onDisable && onDisable(self);
      }
    };

    self.kill = self.revert = function () {
      self.disable();

      var i = _observers.indexOf(self);

      i >= 0 && _observers.splice(i, 1);
      _normalizer$1 === self && (_normalizer$1 = 0);
    };

    _observers.push(self);

    isNormalizer && _isViewport$1(target) && (_normalizer$1 = self);
    self.enable(event);
  };

  _createClass$1(Observer, [{
    key: "velocityX",
    get: function get() {
      return this._vx.getVelocity();
    }
  }, {
    key: "velocityY",
    get: function get() {
      return this._vy.getVelocity();
    }
  }]);

  return Observer;
}();
Observer.version = "3.11.4";

Observer.create = function (vars) {
  return new Observer(vars);
};

Observer.register = _initCore$1;

Observer.getAll = function () {
  return _observers.slice();
};

Observer.getById = function (id) {
  return _observers.filter(function (o) {
    return o.vars.id === id;
  })[0];
};

_getGSAP$2() && gsap$3.registerPlugin(Observer);/*!
 * ScrollTrigger 3.11.4
 * https://greensock.com
 *
 * @license Copyright 2008-2022, GreenSock. All rights reserved.
 * Subject to the terms at https://greensock.com/standard-license or for
 * Club GreenSock members, the agreement issued with that membership.
 * @author: Jack Doyle, jack@greensock.com
*/

var gsap$2,
    _coreInitted$1,
    _win,
    _doc,
    _docEl,
    _body,
    _root,
    _resizeDelay,
    _toArray,
    _clamp,
    _time2,
    _syncInterval,
    _refreshing,
    _pointerIsDown,
    _transformProp,
    _i,
    _prevWidth,
    _prevHeight,
    _autoRefresh,
    _sort,
    _suppressOverwrites,
    _ignoreResize,
    _normalizer,
    _ignoreMobileResize,
    _baseScreenHeight,
    _baseScreenWidth,
    _fixIOSBug,
    _context,
    _scrollRestoration,
    _limitCallbacks,
    // if true, we'll only trigger callbacks if the active state toggles, so if you scroll immediately past both the start and end positions of a ScrollTrigger (thus inactive to inactive), neither its onEnter nor onLeave will be called. This is useful during startup.
_startup = 1,
    _getTime = Date.now,
    _time1 = _getTime(),
    _lastScrollTime = 0,
    _enabled = 0,
    _pointerDownHandler = function _pointerDownHandler() {
  return _pointerIsDown = 1;
},
    _pointerUpHandler = function _pointerUpHandler() {
  return _pointerIsDown = 0;
},
    _passThrough = function _passThrough(v) {
  return v;
},
    _round$2 = function _round(value) {
  return Math.round(value * 100000) / 100000 || 0;
},
    _windowExists = function _windowExists() {
  return typeof window !== "undefined";
},
    _getGSAP$1 = function _getGSAP() {
  return gsap$2 || _windowExists() && (gsap$2 = window.gsap) && gsap$2.registerPlugin && gsap$2;
},
    _isViewport = function _isViewport(e) {
  return !!~_root.indexOf(e);
},
    _getBoundsFunc = function _getBoundsFunc(element) {
  return _getProxyProp(element, "getBoundingClientRect") || (_isViewport(element) ? function () {
    _winOffsets.width = _win.innerWidth;
    _winOffsets.height = _win.innerHeight;
    return _winOffsets;
  } : function () {
    return _getBounds(element);
  });
},
    _getSizeFunc = function _getSizeFunc(scroller, isViewport, _ref) {
  var d = _ref.d,
      d2 = _ref.d2,
      a = _ref.a;
  return (a = _getProxyProp(scroller, "getBoundingClientRect")) ? function () {
    return a()[d];
  } : function () {
    return (isViewport ? _win["inner" + d2] : scroller["client" + d2]) || 0;
  };
},
    _getOffsetsFunc = function _getOffsetsFunc(element, isViewport) {
  return !isViewport || ~_proxies.indexOf(element) ? _getBoundsFunc(element) : function () {
    return _winOffsets;
  };
},
    _maxScroll = function _maxScroll(element, _ref2) {
  var s = _ref2.s,
      d2 = _ref2.d2,
      d = _ref2.d,
      a = _ref2.a;
  return (s = "scroll" + d2) && (a = _getProxyProp(element, s)) ? a() - _getBoundsFunc(element)()[d] : _isViewport(element) ? (_docEl[s] || _body[s]) - (_win["inner" + d2] || _docEl["client" + d2] || _body["client" + d2]) : element[s] - element["offset" + d2];
},
    _iterateAutoRefresh = function _iterateAutoRefresh(func, events) {
  for (var i = 0; i < _autoRefresh.length; i += 3) {
    (!events || ~events.indexOf(_autoRefresh[i + 1])) && func(_autoRefresh[i], _autoRefresh[i + 1], _autoRefresh[i + 2]);
  }
},
    _isString = function _isString(value) {
  return typeof value === "string";
},
    _isFunction = function _isFunction(value) {
  return typeof value === "function";
},
    _isNumber$1 = function _isNumber(value) {
  return typeof value === "number";
},
    _isObject = function _isObject(value) {
  return typeof value === "object";
},
    _endAnimation = function _endAnimation(animation, reversed, pause) {
  return animation && animation.progress(reversed ? 0 : 1) && pause && animation.pause();
},
    _callback = function _callback(self, func) {
  if (self.enabled) {
    var result = func(self);
    result && result.totalTime && (self.callbackAnimation = result);
  }
},
    _abs$1 = Math.abs,
    _left = "left",
    _top = "top",
    _right = "right",
    _bottom = "bottom",
    _width = "width",
    _height = "height",
    _Right = "Right",
    _Left = "Left",
    _Top = "Top",
    _Bottom = "Bottom",
    _padding = "padding",
    _margin = "margin",
    _Width = "Width",
    _Height = "Height",
    _px = "px",
    _getComputedStyle = function _getComputedStyle(element) {
  return _win.getComputedStyle(element);
},
    _makePositionable = function _makePositionable(element) {
  // if the element already has position: absolute or fixed, leave that, otherwise make it position: relative
  var position = _getComputedStyle(element).position;

  element.style.position = position === "absolute" || position === "fixed" ? position : "relative";
},
    _setDefaults = function _setDefaults(obj, defaults) {
  for (var p in defaults) {
    p in obj || (obj[p] = defaults[p]);
  }

  return obj;
},
    _getBounds = function _getBounds(element, withoutTransforms) {
  var tween = withoutTransforms && _getComputedStyle(element)[_transformProp] !== "matrix(1, 0, 0, 1, 0, 0)" && gsap$2.to(element, {
    x: 0,
    y: 0,
    xPercent: 0,
    yPercent: 0,
    rotation: 0,
    rotationX: 0,
    rotationY: 0,
    scale: 1,
    skewX: 0,
    skewY: 0
  }).progress(1),
      bounds = element.getBoundingClientRect();
  tween && tween.progress(0).kill();
  return bounds;
},
    _getSize = function _getSize(element, _ref3) {
  var d2 = _ref3.d2;
  return element["offset" + d2] || element["client" + d2] || 0;
},
    _getLabelRatioArray = function _getLabelRatioArray(timeline) {
  var a = [],
      labels = timeline.labels,
      duration = timeline.duration(),
      p;

  for (p in labels) {
    a.push(labels[p] / duration);
  }

  return a;
},
    _getClosestLabel = function _getClosestLabel(animation) {
  return function (value) {
    return gsap$2.utils.snap(_getLabelRatioArray(animation), value);
  };
},
    _snapDirectional = function _snapDirectional(snapIncrementOrArray) {
  var snap = gsap$2.utils.snap(snapIncrementOrArray),
      a = Array.isArray(snapIncrementOrArray) && snapIncrementOrArray.slice(0).sort(function (a, b) {
    return a - b;
  });
  return a ? function (value, direction, threshold) {
    if (threshold === void 0) {
      threshold = 1e-3;
    }

    var i;

    if (!direction) {
      return snap(value);
    }

    if (direction > 0) {
      value -= threshold; // to avoid rounding errors. If we're too strict, it might snap forward, then immediately again, and again.

      for (i = 0; i < a.length; i++) {
        if (a[i] >= value) {
          return a[i];
        }
      }

      return a[i - 1];
    } else {
      i = a.length;
      value += threshold;

      while (i--) {
        if (a[i] <= value) {
          return a[i];
        }
      }
    }

    return a[0];
  } : function (value, direction, threshold) {
    if (threshold === void 0) {
      threshold = 1e-3;
    }

    var snapped = snap(value);
    return !direction || Math.abs(snapped - value) < threshold || snapped - value < 0 === direction < 0 ? snapped : snap(direction < 0 ? value - snapIncrementOrArray : value + snapIncrementOrArray);
  };
},
    _getLabelAtDirection = function _getLabelAtDirection(timeline) {
  return function (value, st) {
    return _snapDirectional(_getLabelRatioArray(timeline))(value, st.direction);
  };
},
    _multiListener = function _multiListener(func, element, types, callback) {
  return types.split(",").forEach(function (type) {
    return func(element, type, callback);
  });
},
    _addListener = function _addListener(element, type, func, nonPassive, capture) {
  return element.addEventListener(type, func, {
    passive: !nonPassive,
    capture: !!capture
  });
},
    _removeListener = function _removeListener(element, type, func, capture) {
  return element.removeEventListener(type, func, !!capture);
},
    _wheelListener = function _wheelListener(func, el, scrollFunc) {
  return scrollFunc && scrollFunc.wheelHandler && func(el, "wheel", scrollFunc);
},
    _markerDefaults = {
  startColor: "green",
  endColor: "red",
  indent: 0,
  fontSize: "16px",
  fontWeight: "normal"
},
    _defaults = {
  toggleActions: "play",
  anticipatePin: 0
},
    _keywords = {
  top: 0,
  left: 0,
  center: 0.5,
  bottom: 1,
  right: 1
},
    _offsetToPx = function _offsetToPx(value, size) {
  if (_isString(value)) {
    var eqIndex = value.indexOf("="),
        relative = ~eqIndex ? +(value.charAt(eqIndex - 1) + 1) * parseFloat(value.substr(eqIndex + 1)) : 0;

    if (~eqIndex) {
      value.indexOf("%") > eqIndex && (relative *= size / 100);
      value = value.substr(0, eqIndex - 1);
    }

    value = relative + (value in _keywords ? _keywords[value] * size : ~value.indexOf("%") ? parseFloat(value) * size / 100 : parseFloat(value) || 0);
  }

  return value;
},
    _createMarker = function _createMarker(type, name, container, direction, _ref4, offset, matchWidthEl, containerAnimation) {
  var startColor = _ref4.startColor,
      endColor = _ref4.endColor,
      fontSize = _ref4.fontSize,
      indent = _ref4.indent,
      fontWeight = _ref4.fontWeight;

  var e = _doc.createElement("div"),
      useFixedPosition = _isViewport(container) || _getProxyProp(container, "pinType") === "fixed",
      isScroller = type.indexOf("scroller") !== -1,
      parent = useFixedPosition ? _body : container,
      isStart = type.indexOf("start") !== -1,
      color = isStart ? startColor : endColor,
      css = "border-color:" + color + ";font-size:" + fontSize + ";color:" + color + ";font-weight:" + fontWeight + ";pointer-events:none;white-space:nowrap;font-family:sans-serif,Arial;z-index:1000;padding:4px 8px;border-width:0;border-style:solid;";

  css += "position:" + ((isScroller || containerAnimation) && useFixedPosition ? "fixed;" : "absolute;");
  (isScroller || containerAnimation || !useFixedPosition) && (css += (direction === _vertical ? _right : _bottom) + ":" + (offset + parseFloat(indent)) + "px;");
  matchWidthEl && (css += "box-sizing:border-box;text-align:left;width:" + matchWidthEl.offsetWidth + "px;");
  e._isStart = isStart;
  e.setAttribute("class", "gsap-marker-" + type + (name ? " marker-" + name : ""));
  e.style.cssText = css;
  e.innerText = name || name === 0 ? type + "-" + name : type;
  parent.children[0] ? parent.insertBefore(e, parent.children[0]) : parent.appendChild(e);
  e._offset = e["offset" + direction.op.d2];

  _positionMarker(e, 0, direction, isStart);

  return e;
},
    _positionMarker = function _positionMarker(marker, start, direction, flipped) {
  var vars = {
    display: "block"
  },
      side = direction[flipped ? "os2" : "p2"],
      oppositeSide = direction[flipped ? "p2" : "os2"];
  marker._isFlipped = flipped;
  vars[direction.a + "Percent"] = flipped ? -100 : 0;
  vars[direction.a] = flipped ? "1px" : 0;
  vars["border" + side + _Width] = 1;
  vars["border" + oppositeSide + _Width] = 0;
  vars[direction.p] = start + "px";
  gsap$2.set(marker, vars);
},
    _triggers = [],
    _ids = {},
    _rafID,
    _sync = function _sync() {
  return _getTime() - _lastScrollTime > 34 && (_rafID || (_rafID = requestAnimationFrame(_updateAll)));
},
    _onScroll = function _onScroll() {
  // previously, we tried to optimize performance by batching/deferring to the next requestAnimationFrame(), but discovered that Safari has a few bugs that make this unworkable (especially on iOS). See https://codepen.io/GreenSock/pen/16c435b12ef09c38125204818e7b45fc?editors=0010 and https://codepen.io/GreenSock/pen/JjOxYpQ/3dd65ccec5a60f1d862c355d84d14562?editors=0010 and https://codepen.io/GreenSock/pen/ExbrPNa/087cef197dc35445a0951e8935c41503?editors=0010
  if (!_normalizer || !_normalizer.isPressed || _normalizer.startX > _body.clientWidth) {
    // if the user is dragging the scrollbar, allow it.
    _scrollers.cache++;

    if (_normalizer) {
      _rafID || (_rafID = requestAnimationFrame(_updateAll));
    } else {
      _updateAll(); // Safari in particular (on desktop) NEEDS the immediate update rather than waiting for a requestAnimationFrame() whereas iOS seems to benefit from waiting for the requestAnimationFrame() tick, at least when normalizing. See https://codepen.io/GreenSock/pen/qBYozqO?editors=0110

    }

    _lastScrollTime || _dispatch("scrollStart");
    _lastScrollTime = _getTime();
  }
},
    _setBaseDimensions = function _setBaseDimensions() {
  _baseScreenWidth = _win.innerWidth;
  _baseScreenHeight = _win.innerHeight;
},
    _onResize = function _onResize() {
  _scrollers.cache++;
  !_refreshing && !_ignoreResize && !_doc.fullscreenElement && !_doc.webkitFullscreenElement && (!_ignoreMobileResize || _baseScreenWidth !== _win.innerWidth || Math.abs(_win.innerHeight - _baseScreenHeight) > _win.innerHeight * 0.25) && _resizeDelay.restart(true);
},
    // ignore resizes triggered by refresh()
_listeners = {},
    _emptyArray = [],
    _softRefresh = function _softRefresh() {
  return _removeListener(ScrollTrigger, "scrollEnd", _softRefresh) || _refreshAll(true);
},
    _dispatch = function _dispatch(type) {
  return _listeners[type] && _listeners[type].map(function (f) {
    return f();
  }) || _emptyArray;
},
    _savedStyles = [],
    // when ScrollTrigger.saveStyles() is called, the inline styles are recorded in this Array in a sequential format like [element, cssText, gsCache, media]. This keeps it very memory-efficient and fast to iterate through.
_revertRecorded = function _revertRecorded(media) {
  for (var i = 0; i < _savedStyles.length; i += 5) {
    if (!media || _savedStyles[i + 4] && _savedStyles[i + 4].query === media) {
      _savedStyles[i].style.cssText = _savedStyles[i + 1];
      _savedStyles[i].getBBox && _savedStyles[i].setAttribute("transform", _savedStyles[i + 2] || "");
      _savedStyles[i + 3].uncache = 1;
    }
  }
},
    _revertAll = function _revertAll(kill, media) {
  var trigger;

  for (_i = 0; _i < _triggers.length; _i++) {
    trigger = _triggers[_i];

    if (trigger && (!media || trigger._ctx === media)) {
      if (kill) {
        trigger.kill(1);
      } else {
        trigger.revert(true, true);
      }
    }
  }

  media && _revertRecorded(media);
  media || _dispatch("revert");
},
    _clearScrollMemory = function _clearScrollMemory(scrollRestoration, force) {
  // zero-out all the recorded scroll positions. Don't use _triggers because if, for example, .matchMedia() is used to create some ScrollTriggers and then the user resizes and it removes ALL ScrollTriggers, and then go back to a size where there are ScrollTriggers, it would have kept the position(s) saved from the initial state.
  _scrollers.cache++;
  (force || !_refreshingAll) && _scrollers.forEach(function (obj) {
    return _isFunction(obj) && obj.cacheID++ && (obj.rec = 0);
  });
  _isString(scrollRestoration) && (_win.history.scrollRestoration = _scrollRestoration = scrollRestoration);
},
    _refreshingAll,
    _refreshID = 0,
    _queueRefreshID,
    _queueRefreshAll = function _queueRefreshAll() {
  // we don't want to call _refreshAll() every time we create a new ScrollTrigger (for performance reasons) - it's better to batch them. Some frameworks dynamically load content and we can't rely on the window's "load" or "DOMContentLoaded" events to trigger it.
  if (_queueRefreshID !== _refreshID) {
    var id = _queueRefreshID = _refreshID;
    requestAnimationFrame(function () {
      return id === _refreshID && _refreshAll(true);
    });
  }
},
    _refreshAll = function _refreshAll(force, skipRevert) {
  if (_lastScrollTime && !force) {
    _addListener(ScrollTrigger, "scrollEnd", _softRefresh);

    return;
  }

  _refreshingAll = ScrollTrigger.isRefreshing = true;

  _scrollers.forEach(function (obj) {
    return _isFunction(obj) && obj.cacheID++ && (obj.rec = obj());
  }); // force the clearing of the cache because some browsers take a little while to dispatch the "scroll" event and the user may have changed the scroll position and then called ScrollTrigger.refresh() right away


  var refreshInits = _dispatch("refreshInit");

  _sort && ScrollTrigger.sort();
  skipRevert || _revertAll();

  _scrollers.forEach(function (obj) {
    if (_isFunction(obj)) {
      obj.smooth && (obj.target.style.scrollBehavior = "auto"); // smooth scrolling interferes

      obj(0);
    }
  });

  _triggers.slice(0).forEach(function (t) {
    return t.refresh();
  }); // don't loop with _i because during a refresh() someone could call ScrollTrigger.update() which would iterate through _i resulting in a skip.


  _triggers.forEach(function (t, i) {
    // nested pins (pinnedContainer) with pinSpacing may expand the container, so we must accommodate that here.
    if (t._subPinOffset && t.pin) {
      var prop = t.vars.horizontal ? "offsetWidth" : "offsetHeight",
          original = t.pin[prop];
      t.revert(true, 1);
      t.adjustPinSpacing(t.pin[prop] - original);
      t.revert(false, 1);
    }
  });

  _triggers.forEach(function (t) {
    return t.vars.end === "max" && t.setPositions(t.start, Math.max(t.start + 1, _maxScroll(t.scroller, t._dir)));
  }); // the scroller's max scroll position may change after all the ScrollTriggers refreshed (like pinning could push it down), so we need to loop back and correct any with end: "max".


  refreshInits.forEach(function (result) {
    return result && result.render && result.render(-1);
  }); // if the onRefreshInit() returns an animation (typically a gsap.set()), revert it. This makes it easy to put things in a certain spot before refreshing for measurement purposes, and then put things back.

  _scrollers.forEach(function (obj) {
    if (_isFunction(obj)) {
      obj.smooth && requestAnimationFrame(function () {
        return obj.target.style.scrollBehavior = "smooth";
      });
      obj.rec && obj(obj.rec);
    }
  });

  _clearScrollMemory(_scrollRestoration, 1);

  _resizeDelay.pause();

  _refreshID++;

  _updateAll(2);

  _triggers.forEach(function (t) {
    return _isFunction(t.vars.onRefresh) && t.vars.onRefresh(t);
  });

  _refreshingAll = ScrollTrigger.isRefreshing = false;

  _dispatch("refresh");
},
    _lastScroll = 0,
    _direction = 1,
    _primary,
    _updateAll = function _updateAll(force) {
  if (!_refreshingAll || force === 2) {
    ScrollTrigger.isUpdating = true;
    _primary && _primary.update(0); // ScrollSmoother uses refreshPriority -9999 to become the primary that gets updated before all others because it affects the scroll position.

    var l = _triggers.length,
        time = _getTime(),
        recordVelocity = time - _time1 >= 50,
        scroll = l && _triggers[0].scroll();

    _direction = _lastScroll > scroll ? -1 : 1;
    _lastScroll = scroll;

    if (recordVelocity) {
      if (_lastScrollTime && !_pointerIsDown && time - _lastScrollTime > 200) {
        _lastScrollTime = 0;

        _dispatch("scrollEnd");
      }

      _time2 = _time1;
      _time1 = time;
    }

    if (_direction < 0) {
      _i = l;

      while (_i-- > 0) {
        _triggers[_i] && _triggers[_i].update(0, recordVelocity);
      }

      _direction = 1;
    } else {
      for (_i = 0; _i < l; _i++) {
        _triggers[_i] && _triggers[_i].update(0, recordVelocity);
      }
    }

    ScrollTrigger.isUpdating = false;
  }

  _rafID = 0;
},
    _propNamesToCopy = [_left, _top, _bottom, _right, _margin + _Bottom, _margin + _Right, _margin + _Top, _margin + _Left, "display", "flexShrink", "float", "zIndex", "gridColumnStart", "gridColumnEnd", "gridRowStart", "gridRowEnd", "gridArea", "justifySelf", "alignSelf", "placeSelf", "order"],
    _stateProps = _propNamesToCopy.concat([_width, _height, "boxSizing", "max" + _Width, "max" + _Height, "position", _margin, _padding, _padding + _Top, _padding + _Right, _padding + _Bottom, _padding + _Left]),
    _swapPinOut = function _swapPinOut(pin, spacer, state) {
  _setState(state);

  var cache = pin._gsap;

  if (cache.spacerIsNative) {
    _setState(cache.spacerState);
  } else if (pin._gsap.swappedIn) {
    var parent = spacer.parentNode;

    if (parent) {
      parent.insertBefore(pin, spacer);
      parent.removeChild(spacer);
    }
  }

  pin._gsap.swappedIn = false;
},
    _swapPinIn = function _swapPinIn(pin, spacer, cs, spacerState) {
  if (!pin._gsap.swappedIn) {
    var i = _propNamesToCopy.length,
        spacerStyle = spacer.style,
        pinStyle = pin.style,
        p;

    while (i--) {
      p = _propNamesToCopy[i];
      spacerStyle[p] = cs[p];
    }

    spacerStyle.position = cs.position === "absolute" ? "absolute" : "relative";
    cs.display === "inline" && (spacerStyle.display = "inline-block");
    pinStyle[_bottom] = pinStyle[_right] = "auto";
    spacerStyle.flexBasis = cs.flexBasis || "auto";
    spacerStyle.overflow = "visible";
    spacerStyle.boxSizing = "border-box";
    spacerStyle[_width] = _getSize(pin, _horizontal) + _px;
    spacerStyle[_height] = _getSize(pin, _vertical) + _px;
    spacerStyle[_padding] = pinStyle[_margin] = pinStyle[_top] = pinStyle[_left] = "0";

    _setState(spacerState);

    pinStyle[_width] = pinStyle["max" + _Width] = cs[_width];
    pinStyle[_height] = pinStyle["max" + _Height] = cs[_height];
    pinStyle[_padding] = cs[_padding];

    if (pin.parentNode !== spacer) {
      pin.parentNode.insertBefore(spacer, pin);
      spacer.appendChild(pin);
    }

    pin._gsap.swappedIn = true;
  }
},
    _capsExp = /([A-Z])/g,
    _setState = function _setState(state) {
  if (state) {
    var style = state.t.style,
        l = state.length,
        i = 0,
        p,
        value;
    (state.t._gsap || gsap$2.core.getCache(state.t)).uncache = 1; // otherwise transforms may be off

    for (; i < l; i += 2) {
      value = state[i + 1];
      p = state[i];

      if (value) {
        style[p] = value;
      } else if (style[p]) {
        style.removeProperty(p.replace(_capsExp, "-$1").toLowerCase());
      }
    }
  }
},
    _getState = function _getState(element) {
  // returns an Array with alternating values like [property, value, property, value] and a "t" property pointing to the target (element). Makes it fast and cheap.
  var l = _stateProps.length,
      style = element.style,
      state = [],
      i = 0;

  for (; i < l; i++) {
    state.push(_stateProps[i], style[_stateProps[i]]);
  }

  state.t = element;
  return state;
},
    _copyState = function _copyState(state, override, omitOffsets) {
  var result = [],
      l = state.length,
      i = omitOffsets ? 8 : 0,
      // skip top, left, right, bottom if omitOffsets is true
  p;

  for (; i < l; i += 2) {
    p = state[i];
    result.push(p, p in override ? override[p] : state[i + 1]);
  }

  result.t = state.t;
  return result;
},
    _winOffsets = {
  left: 0,
  top: 0
},
    // // potential future feature (?) Allow users to calculate where a trigger hits (scroll position) like getScrollPosition("#id", "top bottom")
// _getScrollPosition = (trigger, position, {scroller, containerAnimation, horizontal}) => {
// 	scroller = _getTarget(scroller || _win);
// 	let direction = horizontal ? _horizontal : _vertical,
// 		isViewport = _isViewport(scroller);
// 	_getSizeFunc(scroller, isViewport, direction);
// 	return _parsePosition(position, _getTarget(trigger), _getSizeFunc(scroller, isViewport, direction)(), direction, _getScrollFunc(scroller, direction)(), 0, 0, 0, _getOffsetsFunc(scroller, isViewport)(), isViewport ? 0 : parseFloat(_getComputedStyle(scroller)["border" + direction.p2 + _Width]) || 0, 0, containerAnimation ? containerAnimation.duration() : _maxScroll(scroller), containerAnimation);
// },
_parsePosition = function _parsePosition(value, trigger, scrollerSize, direction, scroll, marker, markerScroller, self, scrollerBounds, borderWidth, useFixedPosition, scrollerMax, containerAnimation) {
  _isFunction(value) && (value = value(self));

  if (_isString(value) && value.substr(0, 3) === "max") {
    value = scrollerMax + (value.charAt(4) === "=" ? _offsetToPx("0" + value.substr(3), scrollerSize) : 0);
  }

  var time = containerAnimation ? containerAnimation.time() : 0,
      p1,
      p2,
      element;
  containerAnimation && containerAnimation.seek(0);

  if (!_isNumber$1(value)) {
    _isFunction(trigger) && (trigger = trigger(self));
    var offsets = (value || "0").split(" "),
        bounds,
        localOffset,
        globalOffset,
        display;
    element = _getTarget(trigger) || _body;
    bounds = _getBounds(element) || {};

    if ((!bounds || !bounds.left && !bounds.top) && _getComputedStyle(element).display === "none") {
      // if display is "none", it won't report getBoundingClientRect() properly
      display = element.style.display;
      element.style.display = "block";
      bounds = _getBounds(element);
      display ? element.style.display = display : element.style.removeProperty("display");
    }

    localOffset = _offsetToPx(offsets[0], bounds[direction.d]);
    globalOffset = _offsetToPx(offsets[1] || "0", scrollerSize);
    value = bounds[direction.p] - scrollerBounds[direction.p] - borderWidth + localOffset + scroll - globalOffset;
    markerScroller && _positionMarker(markerScroller, globalOffset, direction, scrollerSize - globalOffset < 20 || markerScroller._isStart && globalOffset > 20);
    scrollerSize -= scrollerSize - globalOffset; // adjust for the marker
  } else if (markerScroller) {
    _positionMarker(markerScroller, scrollerSize, direction, true);
  }

  if (marker) {
    var position = value + scrollerSize,
        isStart = marker._isStart;
    p1 = "scroll" + direction.d2;

    _positionMarker(marker, position, direction, isStart && position > 20 || !isStart && (useFixedPosition ? Math.max(_body[p1], _docEl[p1]) : marker.parentNode[p1]) <= position + 1);

    if (useFixedPosition) {
      scrollerBounds = _getBounds(markerScroller);
      useFixedPosition && (marker.style[direction.op.p] = scrollerBounds[direction.op.p] - direction.op.m - marker._offset + _px);
    }
  }

  if (containerAnimation && element) {
    p1 = _getBounds(element);
    containerAnimation.seek(scrollerMax);
    p2 = _getBounds(element);
    containerAnimation._caScrollDist = p1[direction.p] - p2[direction.p];
    value = value / containerAnimation._caScrollDist * scrollerMax;
  }

  containerAnimation && containerAnimation.seek(time);
  return containerAnimation ? value : Math.round(value);
},
    _prefixExp = /(webkit|moz|length|cssText|inset)/i,
    _reparent = function _reparent(element, parent, top, left) {
  if (element.parentNode !== parent) {
    var style = element.style,
        p,
        cs;

    if (parent === _body) {
      element._stOrig = style.cssText; // record original inline styles so we can revert them later

      cs = _getComputedStyle(element);

      for (p in cs) {
        // must copy all relevant styles to ensure that nothing changes visually when we reparent to the <body>. Skip the vendor prefixed ones.
        if (!+p && !_prefixExp.test(p) && cs[p] && typeof style[p] === "string" && p !== "0") {
          style[p] = cs[p];
        }
      }

      style.top = top;
      style.left = left;
    } else {
      style.cssText = element._stOrig;
    }

    gsap$2.core.getCache(element).uncache = 1;
    parent.appendChild(element);
  }
},
    // _mergeAnimations = animations => {
// 	let tl = gsap.timeline({smoothChildTiming: true}).startTime(Math.min(...animations.map(a => a.globalTime(0))));
// 	animations.forEach(a => {let time = a.totalTime(); tl.add(a); a.totalTime(time); });
// 	tl.smoothChildTiming = false;
// 	return tl;
// },
// returns a function that can be used to tween the scroll position in the direction provided, and when doing so it'll add a .tween property to the FUNCTION itself, and remove it when the tween completes or gets killed. This gives us a way to have multiple ScrollTriggers use a central function for any given scroller and see if there's a scroll tween running (which would affect if/how things get updated)
_getTweenCreator = function _getTweenCreator(scroller, direction) {
  var getScroll = _getScrollFunc(scroller, direction),
      prop = "_scroll" + direction.p2,
      // add a tweenable property to the scroller that's a getter/setter function, like _scrollTop or _scrollLeft. This way, if someone does gsap.killTweensOf(scroller) it'll kill the scroll tween.
  lastScroll1,
      lastScroll2,
      getTween = function getTween(scrollTo, vars, initialValue, change1, change2) {
    var tween = getTween.tween,
        onComplete = vars.onComplete,
        modifiers = {};
    initialValue = initialValue || getScroll();
    change2 = change1 && change2 || 0; // if change1 is 0, we set that to the difference and ignore change2. Otherwise, there would be a compound effect.

    change1 = change1 || scrollTo - initialValue;
    tween && tween.kill();
    lastScroll1 = Math.round(initialValue);
    vars[prop] = scrollTo;
    vars.modifiers = modifiers;

    modifiers[prop] = function (value) {
      value = Math.round(getScroll()); // round because in some [very uncommon] Windows environments, it can get reported with decimals even though it was set without.

      if (value !== lastScroll1 && value !== lastScroll2 && Math.abs(value - lastScroll1) > 3 && Math.abs(value - lastScroll2) > 3) {
        // if the user scrolls, kill the tween. iOS Safari intermittently misreports the scroll position, it may be the most recently-set one or the one before that! When Safari is zoomed (CMD-+), it often misreports as 1 pixel off too! So if we set the scroll position to 125, for example, it'll actually report it as 124.
        tween.kill();
        getTween.tween = 0;
      } else {
        value = initialValue + change1 * tween.ratio + change2 * tween.ratio * tween.ratio;
      }

      lastScroll2 = lastScroll1;
      return lastScroll1 = Math.round(value);
    };

    vars.onUpdate = function () {
      _scrollers.cache++;

      _updateAll();
    };

    vars.onComplete = function () {
      getTween.tween = 0;
      onComplete && onComplete.call(tween);
    };

    tween = getTween.tween = gsap$2.to(scroller, vars);
    return tween;
  };

  scroller[prop] = getScroll;

  getScroll.wheelHandler = function () {
    return getTween.tween && getTween.tween.kill() && (getTween.tween = 0);
  };

  _addListener(scroller, "wheel", getScroll.wheelHandler); // Windows machines handle mousewheel scrolling in chunks (like "3 lines per scroll") meaning the typical strategy for cancelling the scroll isn't as sensitive. It's much more likely to match one of the previous 2 scroll event positions. So we kill any snapping as soon as there's a wheel event.


  return getTween;
};

var ScrollTrigger = /*#__PURE__*/function () {
  function ScrollTrigger(vars, animation) {
    _coreInitted$1 || ScrollTrigger.register(gsap$2) || console.warn("Please gsap.registerPlugin(ScrollTrigger)");
    this.init(vars, animation);
  }

  var _proto = ScrollTrigger.prototype;

  _proto.init = function init(vars, animation) {
    this.progress = this.start = 0;
    this.vars && this.kill(true, true); // in case it's being initted again

    if (!_enabled) {
      this.update = this.refresh = this.kill = _passThrough;
      return;
    }

    vars = _setDefaults(_isString(vars) || _isNumber$1(vars) || vars.nodeType ? {
      trigger: vars
    } : vars, _defaults);

    var _vars = vars,
        onUpdate = _vars.onUpdate,
        toggleClass = _vars.toggleClass,
        id = _vars.id,
        onToggle = _vars.onToggle,
        onRefresh = _vars.onRefresh,
        scrub = _vars.scrub,
        trigger = _vars.trigger,
        pin = _vars.pin,
        pinSpacing = _vars.pinSpacing,
        invalidateOnRefresh = _vars.invalidateOnRefresh,
        anticipatePin = _vars.anticipatePin,
        onScrubComplete = _vars.onScrubComplete,
        onSnapComplete = _vars.onSnapComplete,
        once = _vars.once,
        snap = _vars.snap,
        pinReparent = _vars.pinReparent,
        pinSpacer = _vars.pinSpacer,
        containerAnimation = _vars.containerAnimation,
        fastScrollEnd = _vars.fastScrollEnd,
        preventOverlaps = _vars.preventOverlaps,
        direction = vars.horizontal || vars.containerAnimation && vars.horizontal !== false ? _horizontal : _vertical,
        isToggle = !scrub && scrub !== 0,
        scroller = _getTarget(vars.scroller || _win),
        scrollerCache = gsap$2.core.getCache(scroller),
        isViewport = _isViewport(scroller),
        useFixedPosition = ("pinType" in vars ? vars.pinType : _getProxyProp(scroller, "pinType") || isViewport && "fixed") === "fixed",
        callbacks = [vars.onEnter, vars.onLeave, vars.onEnterBack, vars.onLeaveBack],
        toggleActions = isToggle && vars.toggleActions.split(" "),
        markers = "markers" in vars ? vars.markers : _defaults.markers,
        borderWidth = isViewport ? 0 : parseFloat(_getComputedStyle(scroller)["border" + direction.p2 + _Width]) || 0,
        self = this,
        onRefreshInit = vars.onRefreshInit && function () {
      return vars.onRefreshInit(self);
    },
        getScrollerSize = _getSizeFunc(scroller, isViewport, direction),
        getScrollerOffsets = _getOffsetsFunc(scroller, isViewport),
        lastSnap = 0,
        lastRefresh = 0,
        scrollFunc = _getScrollFunc(scroller, direction),
        tweenTo,
        pinCache,
        snapFunc,
        scroll1,
        scroll2,
        start,
        end,
        markerStart,
        markerEnd,
        markerStartTrigger,
        markerEndTrigger,
        markerVars,
        change,
        pinOriginalState,
        pinActiveState,
        pinState,
        spacer,
        offset,
        pinGetter,
        pinSetter,
        pinStart,
        pinChange,
        spacingStart,
        spacerState,
        markerStartSetter,
        pinMoves,
        markerEndSetter,
        cs,
        snap1,
        snap2,
        scrubTween,
        scrubSmooth,
        snapDurClamp,
        snapDelayedCall,
        prevProgress,
        prevScroll,
        prevAnimProgress,
        caMarkerSetter,
        customRevertReturn;

    _context(self);

    self._dir = direction;
    anticipatePin *= 45;
    self.scroller = scroller;
    self.scroll = containerAnimation ? containerAnimation.time.bind(containerAnimation) : scrollFunc;
    scroll1 = scrollFunc();
    self.vars = vars;
    animation = animation || vars.animation;

    if ("refreshPriority" in vars) {
      _sort = 1;
      vars.refreshPriority === -9999 && (_primary = self); // used by ScrollSmoother
    }

    scrollerCache.tweenScroll = scrollerCache.tweenScroll || {
      top: _getTweenCreator(scroller, _vertical),
      left: _getTweenCreator(scroller, _horizontal)
    };
    self.tweenTo = tweenTo = scrollerCache.tweenScroll[direction.p];

    self.scrubDuration = function (value) {
      scrubSmooth = _isNumber$1(value) && value;

      if (!scrubSmooth) {
        scrubTween && scrubTween.progress(1).kill();
        scrubTween = 0;
      } else {
        scrubTween ? scrubTween.duration(value) : scrubTween = gsap$2.to(animation, {
          ease: "expo",
          totalProgress: "+=0.001",
          duration: scrubSmooth,
          paused: true,
          onComplete: function onComplete() {
            return onScrubComplete && onScrubComplete(self);
          }
        });
      }
    };

    if (animation) {
      animation.vars.lazy = false;
      animation._initted || animation.vars.immediateRender !== false && vars.immediateRender !== false && animation.duration() && animation.render(0, true, true);
      self.animation = animation.pause();
      animation.scrollTrigger = self;
      self.scrubDuration(scrub);
      snap1 = 0;
      id || (id = animation.vars.id);
    }

    _triggers.push(self);

    if (snap) {
      // TODO: potential idea: use legitimate CSS scroll snapping by pushing invisible elements into the DOM that serve as snap positions, and toggle the document.scrollingElement.style.scrollSnapType onToggle. See https://codepen.io/GreenSock/pen/JjLrgWM for a quick proof of concept.
      if (!_isObject(snap) || snap.push) {
        snap = {
          snapTo: snap
        };
      }

      "scrollBehavior" in _body.style && gsap$2.set(isViewport ? [_body, _docEl] : scroller, {
        scrollBehavior: "auto"
      }); // smooth scrolling doesn't work with snap.

      _scrollers.forEach(function (o) {
        return _isFunction(o) && o.target === (isViewport ? _doc.scrollingElement || _docEl : scroller) && (o.smooth = false);
      }); // note: set smooth to false on both the vertical and horizontal scroll getters/setters


      snapFunc = _isFunction(snap.snapTo) ? snap.snapTo : snap.snapTo === "labels" ? _getClosestLabel(animation) : snap.snapTo === "labelsDirectional" ? _getLabelAtDirection(animation) : snap.directional !== false ? function (value, st) {
        return _snapDirectional(snap.snapTo)(value, _getTime() - lastRefresh < 500 ? 0 : st.direction);
      } : gsap$2.utils.snap(snap.snapTo);
      snapDurClamp = snap.duration || {
        min: 0.1,
        max: 2
      };
      snapDurClamp = _isObject(snapDurClamp) ? _clamp(snapDurClamp.min, snapDurClamp.max) : _clamp(snapDurClamp, snapDurClamp);
      snapDelayedCall = gsap$2.delayedCall(snap.delay || scrubSmooth / 2 || 0.1, function () {
        var scroll = scrollFunc(),
            refreshedRecently = _getTime() - lastRefresh < 500,
            tween = tweenTo.tween;

        if ((refreshedRecently || Math.abs(self.getVelocity()) < 10) && !tween && !_pointerIsDown && lastSnap !== scroll) {
          var progress = (scroll - start) / change,
              totalProgress = animation && !isToggle ? animation.totalProgress() : progress,
              velocity = refreshedRecently ? 0 : (totalProgress - snap2) / (_getTime() - _time2) * 1000 || 0,
              change1 = gsap$2.utils.clamp(-progress, 1 - progress, _abs$1(velocity / 2) * velocity / 0.185),
              naturalEnd = progress + (snap.inertia === false ? 0 : change1),
              endValue = _clamp(0, 1, snapFunc(naturalEnd, self)),
              endScroll = Math.round(start + endValue * change),
              _snap = snap,
              onStart = _snap.onStart,
              _onInterrupt = _snap.onInterrupt,
              _onComplete = _snap.onComplete;

          if (scroll <= end && scroll >= start && endScroll !== scroll) {
            if (tween && !tween._initted && tween.data <= _abs$1(endScroll - scroll)) {
              // there's an overlapping snap! So we must figure out which one is closer and let that tween live.
              return;
            }

            if (snap.inertia === false) {
              change1 = endValue - progress;
            }

            tweenTo(endScroll, {
              duration: snapDurClamp(_abs$1(Math.max(_abs$1(naturalEnd - totalProgress), _abs$1(endValue - totalProgress)) * 0.185 / velocity / 0.05 || 0)),
              ease: snap.ease || "power3",
              data: _abs$1(endScroll - scroll),
              // record the distance so that if another snap tween occurs (conflict) we can prioritize the closest snap.
              onInterrupt: function onInterrupt() {
                return snapDelayedCall.restart(true) && _onInterrupt && _onInterrupt(self);
              },
              onComplete: function onComplete() {
                self.update();
                lastSnap = scrollFunc();
                snap1 = snap2 = animation && !isToggle ? animation.totalProgress() : self.progress;
                onSnapComplete && onSnapComplete(self);
                _onComplete && _onComplete(self);
              }
            }, scroll, change1 * change, endScroll - scroll - change1 * change);
            onStart && onStart(self, tweenTo.tween);
          }
        } else if (self.isActive && lastSnap !== scroll) {
          snapDelayedCall.restart(true);
        }
      }).pause();
    }

    id && (_ids[id] = self);
    trigger = self.trigger = _getTarget(trigger || pin); // if a trigger has some kind of scroll-related effect applied that could contaminate the "y" or "x" position (like a ScrollSmoother effect), we needed a way to temporarily revert it, so we use the stRevert property of the gsCache. It can return another function that we'll call at the end so it can return to its normal state.

    customRevertReturn = trigger && trigger._gsap && trigger._gsap.stRevert;
    customRevertReturn && (customRevertReturn = customRevertReturn(self));
    pin = pin === true ? trigger : _getTarget(pin);
    _isString(toggleClass) && (toggleClass = {
      targets: trigger,
      className: toggleClass
    });

    if (pin) {
      pinSpacing === false || pinSpacing === _margin || (pinSpacing = !pinSpacing && pin.parentNode && pin.parentNode.style && _getComputedStyle(pin.parentNode).display === "flex" ? false : _padding); // if the parent is display: flex, don't apply pinSpacing by default. We should check that pin.parentNode is an element (not shadow dom window)

      self.pin = pin;
      pinCache = gsap$2.core.getCache(pin);

      if (!pinCache.spacer) {
        // record the spacer and pinOriginalState on the cache in case someone tries pinning the same element with MULTIPLE ScrollTriggers - we don't want to have multiple spacers or record the "original" pin state after it has already been affected by another ScrollTrigger.
        if (pinSpacer) {
          pinSpacer = _getTarget(pinSpacer);
          pinSpacer && !pinSpacer.nodeType && (pinSpacer = pinSpacer.current || pinSpacer.nativeElement); // for React & Angular

          pinCache.spacerIsNative = !!pinSpacer;
          pinSpacer && (pinCache.spacerState = _getState(pinSpacer));
        }

        pinCache.spacer = spacer = pinSpacer || _doc.createElement("div");
        spacer.classList.add("pin-spacer");
        id && spacer.classList.add("pin-spacer-" + id);
        pinCache.pinState = pinOriginalState = _getState(pin);
      } else {
        pinOriginalState = pinCache.pinState;
      }

      vars.force3D !== false && gsap$2.set(pin, {
        force3D: true
      });
      self.spacer = spacer = pinCache.spacer;
      cs = _getComputedStyle(pin);
      spacingStart = cs[pinSpacing + direction.os2];
      pinGetter = gsap$2.getProperty(pin);
      pinSetter = gsap$2.quickSetter(pin, direction.a, _px); // pin.firstChild && !_maxScroll(pin, direction) && (pin.style.overflow = "hidden"); // protects from collapsing margins, but can have unintended consequences as demonstrated here: https://codepen.io/GreenSock/pen/1e42c7a73bfa409d2cf1e184e7a4248d so it was removed in favor of just telling people to set up their CSS to avoid the collapsing margins (overflow: hidden | auto is just one option. Another is border-top: 1px solid transparent).

      _swapPinIn(pin, spacer, cs);

      pinState = _getState(pin);
    }

    if (markers) {
      markerVars = _isObject(markers) ? _setDefaults(markers, _markerDefaults) : _markerDefaults;
      markerStartTrigger = _createMarker("scroller-start", id, scroller, direction, markerVars, 0);
      markerEndTrigger = _createMarker("scroller-end", id, scroller, direction, markerVars, 0, markerStartTrigger);
      offset = markerStartTrigger["offset" + direction.op.d2];

      var content = _getTarget(_getProxyProp(scroller, "content") || scroller);

      markerStart = this.markerStart = _createMarker("start", id, content, direction, markerVars, offset, 0, containerAnimation);
      markerEnd = this.markerEnd = _createMarker("end", id, content, direction, markerVars, offset, 0, containerAnimation);
      containerAnimation && (caMarkerSetter = gsap$2.quickSetter([markerStart, markerEnd], direction.a, _px));

      if (!useFixedPosition && !(_proxies.length && _getProxyProp(scroller, "fixedMarkers") === true)) {
        _makePositionable(isViewport ? _body : scroller);

        gsap$2.set([markerStartTrigger, markerEndTrigger], {
          force3D: true
        });
        markerStartSetter = gsap$2.quickSetter(markerStartTrigger, direction.a, _px);
        markerEndSetter = gsap$2.quickSetter(markerEndTrigger, direction.a, _px);
      }
    }

    if (containerAnimation) {
      var oldOnUpdate = containerAnimation.vars.onUpdate,
          oldParams = containerAnimation.vars.onUpdateParams;
      containerAnimation.eventCallback("onUpdate", function () {
        self.update(0, 0, 1);
        oldOnUpdate && oldOnUpdate.apply(oldParams || []);
      });
    }

    self.previous = function () {
      return _triggers[_triggers.indexOf(self) - 1];
    };

    self.next = function () {
      return _triggers[_triggers.indexOf(self) + 1];
    };

    self.revert = function (revert, temp) {
      if (!temp) {
        return self.kill(true);
      } // for compatibility with gsap.context() and gsap.matchMedia() which call revert()


      var r = revert !== false || !self.enabled,
          prevRefreshing = _refreshing;

      if (r !== self.isReverted) {
        if (r) {
          // if (!self.scroll.rec && (_refreshing || _refreshingAll)) {
          // 	self.scroll.rec = scrollFunc();
          // 	_refreshingAll && scrollFunc(0);
          // }
          prevScroll = Math.max(scrollFunc(), self.scroll.rec || 0); // record the scroll so we can revert later (repositioning/pinning things can affect scroll position). In the static refresh() method, we first record all the scroll positions as a reference.

          prevProgress = self.progress;
          prevAnimProgress = animation && animation.progress();
        }

        markerStart && [markerStart, markerEnd, markerStartTrigger, markerEndTrigger].forEach(function (m) {
          return m.style.display = r ? "none" : "block";
        });

        if (r) {
          _refreshing = 1;
          self.update(r); // make sure the pin is back in its original position so that all the measurements are correct. do this BEFORE swapping the pin out
        }

        if (pin && (!pinReparent || !self.isActive)) {
          if (r) {
            _swapPinOut(pin, spacer, pinOriginalState);
          } else {
            _swapPinIn(pin, spacer, _getComputedStyle(pin), spacerState);
          }
        }

        r || self.update(r); // when we're restoring, the update should run AFTER swapping the pin into its pin-spacer.

        _refreshing = prevRefreshing; // restore. We set it to true during the update() so that things fire properly in there.

        self.isReverted = r;
      }
    };

    self.refresh = function (soft, force) {
      if ((_refreshing || !self.enabled) && !force) {
        return;
      }

      if (pin && soft && _lastScrollTime) {
        _addListener(ScrollTrigger, "scrollEnd", _softRefresh);

        return;
      }

      !_refreshingAll && onRefreshInit && onRefreshInit(self);
      _refreshing = 1;
      lastRefresh = _getTime();

      if (tweenTo.tween) {
        tweenTo.tween.kill();
        tweenTo.tween = 0;
      }

      scrubTween && scrubTween.pause();
      invalidateOnRefresh && animation && animation.revert({
        kill: false
      }).invalidate();
      self.isReverted || self.revert(true, true);
      self._subPinOffset = false; // we'll set this to true in the sub-pins if we find any

      var size = getScrollerSize(),
          scrollerBounds = getScrollerOffsets(),
          max = containerAnimation ? containerAnimation.duration() : _maxScroll(scroller, direction),
          offset = 0,
          otherPinOffset = 0,
          parsedEnd = vars.end,
          parsedEndTrigger = vars.endTrigger || trigger,
          parsedStart = vars.start || (vars.start === 0 || !trigger ? 0 : pin ? "0 0" : "0 100%"),
          pinnedContainer = self.pinnedContainer = vars.pinnedContainer && _getTarget(vars.pinnedContainer),
          triggerIndex = trigger && Math.max(0, _triggers.indexOf(self)) || 0,
          i = triggerIndex,
          cs,
          bounds,
          scroll,
          isVertical,
          override,
          curTrigger,
          curPin,
          oppositeScroll,
          initted,
          revertedPins,
          forcedOverflow;

      while (i--) {
        // user might try to pin the same element more than once, so we must find any prior triggers with the same pin, revert them, and determine how long they're pinning so that we can offset things appropriately. Make sure we revert from last to first so that things "rewind" properly.
        curTrigger = _triggers[i];
        curTrigger.end || curTrigger.refresh(0, 1) || (_refreshing = 1); // if it's a timeline-based trigger that hasn't been fully initialized yet because it's waiting for 1 tick, just force the refresh() here, otherwise if it contains a pin that's supposed to affect other ScrollTriggers further down the page, they won't be adjusted properly.

        curPin = curTrigger.pin;

        if (curPin && (curPin === trigger || curPin === pin) && !curTrigger.isReverted) {
          revertedPins || (revertedPins = []);
          revertedPins.unshift(curTrigger); // we'll revert from first to last to make sure things reach their end state properly

          curTrigger.revert(true, true);
        }

        if (curTrigger !== _triggers[i]) {
          // in case it got removed.
          triggerIndex--;
          i--;
        }
      }

      _isFunction(parsedStart) && (parsedStart = parsedStart(self));
      start = _parsePosition(parsedStart, trigger, size, direction, scrollFunc(), markerStart, markerStartTrigger, self, scrollerBounds, borderWidth, useFixedPosition, max, containerAnimation) || (pin ? -0.001 : 0);
      _isFunction(parsedEnd) && (parsedEnd = parsedEnd(self));

      if (_isString(parsedEnd) && !parsedEnd.indexOf("+=")) {
        if (~parsedEnd.indexOf(" ")) {
          parsedEnd = (_isString(parsedStart) ? parsedStart.split(" ")[0] : "") + parsedEnd;
        } else {
          offset = _offsetToPx(parsedEnd.substr(2), size);
          parsedEnd = _isString(parsedStart) ? parsedStart : start + offset; // _parsePosition won't factor in the offset if the start is a number, so do it here.

          parsedEndTrigger = trigger;
        }
      }

      end = Math.max(start, _parsePosition(parsedEnd || (parsedEndTrigger ? "100% 0" : max), parsedEndTrigger, size, direction, scrollFunc() + offset, markerEnd, markerEndTrigger, self, scrollerBounds, borderWidth, useFixedPosition, max, containerAnimation)) || -0.001;
      change = end - start || (start -= 0.01) && 0.001;
      offset = 0;
      i = triggerIndex;

      while (i--) {
        curTrigger = _triggers[i];
        curPin = curTrigger.pin;

        if (curPin && curTrigger.start - curTrigger._pinPush <= start && !containerAnimation && curTrigger.end > 0) {
          cs = curTrigger.end - curTrigger.start;

          if ((curPin === trigger && curTrigger.start - curTrigger._pinPush < start || curPin === pinnedContainer) && !_isNumber$1(parsedStart)) {
            // numeric start values shouldn't be offset at all - treat them as absolute
            offset += cs * (1 - curTrigger.progress);
          }

          curPin === pin && (otherPinOffset += cs);
        }
      }

      start += offset;
      end += offset;
      self._pinPush = otherPinOffset;

      if (markerStart && offset) {
        // offset the markers if necessary
        cs = {};
        cs[direction.a] = "+=" + offset;
        pinnedContainer && (cs[direction.p] = "-=" + scrollFunc());
        gsap$2.set([markerStart, markerEnd], cs);
      }

      if (pin) {
        cs = _getComputedStyle(pin);
        isVertical = direction === _vertical;
        scroll = scrollFunc(); // recalculate because the triggers can affect the scroll

        pinStart = parseFloat(pinGetter(direction.a)) + otherPinOffset;

        if (!max && end > 1) {
          // makes sure the scroller has a scrollbar, otherwise if something has width: 100%, for example, it would be too big (exclude the scrollbar). See https://greensock.com/forums/topic/25182-scrolltrigger-width-of-page-increase-where-markers-are-set-to-false/
          forcedOverflow = (isViewport ? _doc.scrollingElement || _docEl : scroller).style;
          forcedOverflow = {
            style: forcedOverflow,
            value: forcedOverflow["overflow" + direction.a.toUpperCase()]
          };
          forcedOverflow["overflow" + direction.a.toUpperCase()] = "scroll";
        }

        _swapPinIn(pin, spacer, cs);

        pinState = _getState(pin); // transforms will interfere with the top/left/right/bottom placement, so remove them temporarily. getBoundingClientRect() factors in transforms.

        bounds = _getBounds(pin, true);
        oppositeScroll = useFixedPosition && _getScrollFunc(scroller, isVertical ? _horizontal : _vertical)();

        if (pinSpacing) {
          spacerState = [pinSpacing + direction.os2, change + otherPinOffset + _px];
          spacerState.t = spacer;
          i = pinSpacing === _padding ? _getSize(pin, direction) + change + otherPinOffset : 0;
          i && spacerState.push(direction.d, i + _px); // for box-sizing: border-box (must include padding).

          _setState(spacerState);

          if (pinnedContainer) {
            // in ScrollTrigger.refresh(), we need to re-evaluate the pinContainer's size because this pinSpacing may stretch it out, but we can't just add the exact distance because depending on layout, it may not push things down or it may only do so partially.
            _triggers.forEach(function (t) {
              if (t.pin === pinnedContainer && t.vars.pinSpacing !== false) {
                t._subPinOffset = true;
              }
            });
          }

          useFixedPosition && scrollFunc(prevScroll);
        }

        if (useFixedPosition) {
          override = {
            top: bounds.top + (isVertical ? scroll - start : oppositeScroll) + _px,
            left: bounds.left + (isVertical ? oppositeScroll : scroll - start) + _px,
            boxSizing: "border-box",
            position: "fixed"
          };
          override[_width] = override["max" + _Width] = Math.ceil(bounds.width) + _px;
          override[_height] = override["max" + _Height] = Math.ceil(bounds.height) + _px;
          override[_margin] = override[_margin + _Top] = override[_margin + _Right] = override[_margin + _Bottom] = override[_margin + _Left] = "0";
          override[_padding] = cs[_padding];
          override[_padding + _Top] = cs[_padding + _Top];
          override[_padding + _Right] = cs[_padding + _Right];
          override[_padding + _Bottom] = cs[_padding + _Bottom];
          override[_padding + _Left] = cs[_padding + _Left];
          pinActiveState = _copyState(pinOriginalState, override, pinReparent);
          _refreshingAll && scrollFunc(0);
        }

        if (animation) {
          // the animation might be affecting the transform, so we must jump to the end, check the value, and compensate accordingly. Otherwise, when it becomes unpinned, the pinSetter() will get set to a value that doesn't include whatever the animation did.
          initted = animation._initted; // if not, we must invalidate() after this step, otherwise it could lock in starting values prematurely.

          _suppressOverwrites(1);

          animation.render(animation.duration(), true, true);
          pinChange = pinGetter(direction.a) - pinStart + change + otherPinOffset;
          pinMoves = Math.abs(change - pinChange) > 1;
          useFixedPosition && pinMoves && pinActiveState.splice(pinActiveState.length - 2, 2); // transform is the last property/value set in the state Array. Since the animation is controlling that, we should omit it.

          animation.render(0, true, true);
          initted || animation.invalidate(true);
          animation.parent || animation.totalTime(animation.totalTime()); // if, for example, a toggleAction called play() and then refresh() happens and when we render(1) above, it would cause the animation to complete and get removed from its parent, so this makes sure it gets put back in.

          _suppressOverwrites(0);
        } else {
          pinChange = change;
        }

        forcedOverflow && (forcedOverflow.value ? forcedOverflow.style["overflow" + direction.a.toUpperCase()] = forcedOverflow.value : forcedOverflow.style.removeProperty("overflow-" + direction.a));
      } else if (trigger && scrollFunc() && !containerAnimation) {
        // it may be INSIDE a pinned element, so walk up the tree and look for any elements with _pinOffset to compensate because anything with pinSpacing that's already scrolled would throw off the measurements in getBoundingClientRect()
        bounds = trigger.parentNode;

        while (bounds && bounds !== _body) {
          if (bounds._pinOffset) {
            start -= bounds._pinOffset;
            end -= bounds._pinOffset;
          }

          bounds = bounds.parentNode;
        }
      }

      revertedPins && revertedPins.forEach(function (t) {
        return t.revert(false, true);
      });
      self.start = start;
      self.end = end;
      scroll1 = scroll2 = _refreshingAll ? prevScroll : scrollFunc(); // reset velocity

      if (!containerAnimation && !_refreshingAll) {
        scroll1 < prevScroll && scrollFunc(prevScroll);
        self.scroll.rec = 0;
      }

      self.revert(false, true);

      if (snapDelayedCall) {
        lastSnap = -1;
        self.isActive && scrollFunc(start + change * prevProgress); // just so snapping gets re-enabled, clear out any recorded last value

        snapDelayedCall.restart(true);
      }

      _refreshing = 0;
      animation && isToggle && (animation._initted || prevAnimProgress) && animation.progress() !== prevAnimProgress && animation.progress(prevAnimProgress, true).render(animation.time(), true, true); // must force a re-render because if saveStyles() was used on the target(s), the styles could have been wiped out during the refresh().

      if (prevProgress !== self.progress || containerAnimation) {
        // ensures that the direction is set properly (when refreshing, progress is set back to 0 initially, then back again to wherever it needs to be) and that callbacks are triggered.
        animation && !isToggle && animation.totalProgress(prevProgress, true); // to avoid issues where animation callbacks like onStart aren't triggered.

        self.progress = (scroll1 - start) / change === prevProgress ? 0 : prevProgress;
      }

      pin && pinSpacing && (spacer._pinOffset = Math.round(self.progress * pinChange)); //			scrubTween && scrubTween.invalidate();

      onRefresh && !_refreshingAll && onRefresh(self); // when refreshing all, we do extra work to correct pinnedContainer sizes and ensure things don't exceed the maxScroll, so we should do all the refreshes at the end after all that work so that the start/end values are corrected.
    };

    self.getVelocity = function () {
      return (scrollFunc() - scroll2) / (_getTime() - _time2) * 1000 || 0;
    };

    self.endAnimation = function () {
      _endAnimation(self.callbackAnimation);

      if (animation) {
        scrubTween ? scrubTween.progress(1) : !animation.paused() ? _endAnimation(animation, animation.reversed()) : isToggle || _endAnimation(animation, self.direction < 0, 1);
      }
    };

    self.labelToScroll = function (label) {
      return animation && animation.labels && (start || self.refresh() || start) + animation.labels[label] / animation.duration() * change || 0;
    };

    self.getTrailing = function (name) {
      var i = _triggers.indexOf(self),
          a = self.direction > 0 ? _triggers.slice(0, i).reverse() : _triggers.slice(i + 1);

      return (_isString(name) ? a.filter(function (t) {
        return t.vars.preventOverlaps === name;
      }) : a).filter(function (t) {
        return self.direction > 0 ? t.end <= start : t.start >= end;
      });
    };

    self.update = function (reset, recordVelocity, forceFake) {
      if (containerAnimation && !forceFake && !reset) {
        return;
      }

      var scroll = _refreshingAll ? prevScroll : self.scroll(),
          p = reset ? 0 : (scroll - start) / change,
          clipped = p < 0 ? 0 : p > 1 ? 1 : p || 0,
          prevProgress = self.progress,
          isActive,
          wasActive,
          toggleState,
          action,
          stateChanged,
          toggled,
          isAtMax,
          isTakingAction;

      if (recordVelocity) {
        scroll2 = scroll1;
        scroll1 = containerAnimation ? scrollFunc() : scroll;

        if (snap) {
          snap2 = snap1;
          snap1 = animation && !isToggle ? animation.totalProgress() : clipped;
        }
      } // anticipate the pinning a few ticks ahead of time based on velocity to avoid a visual glitch due to the fact that most browsers do scrolling on a separate thread (not synced with requestAnimationFrame).


      anticipatePin && !clipped && pin && !_refreshing && !_startup && _lastScrollTime && start < scroll + (scroll - scroll2) / (_getTime() - _time2) * anticipatePin && (clipped = 0.0001);

      if (clipped !== prevProgress && self.enabled) {
        isActive = self.isActive = !!clipped && clipped < 1;
        wasActive = !!prevProgress && prevProgress < 1;
        toggled = isActive !== wasActive;
        stateChanged = toggled || !!clipped !== !!prevProgress; // could go from start all the way to end, thus it didn't toggle but it did change state in a sense (may need to fire a callback)

        self.direction = clipped > prevProgress ? 1 : -1;
        self.progress = clipped;

        if (stateChanged && !_refreshing) {
          toggleState = clipped && !prevProgress ? 0 : clipped === 1 ? 1 : prevProgress === 1 ? 2 : 3; // 0 = enter, 1 = leave, 2 = enterBack, 3 = leaveBack (we prioritize the FIRST encounter, thus if you scroll really fast past the onEnter and onLeave in one tick, it'd prioritize onEnter.

          if (isToggle) {
            action = !toggled && toggleActions[toggleState + 1] !== "none" && toggleActions[toggleState + 1] || toggleActions[toggleState]; // if it didn't toggle, that means it shot right past and since we prioritize the "enter" action, we should switch to the "leave" in this case (but only if one is defined)

            isTakingAction = animation && (action === "complete" || action === "reset" || action in animation);
          }
        }

        preventOverlaps && (toggled || isTakingAction) && (isTakingAction || scrub || !animation) && (_isFunction(preventOverlaps) ? preventOverlaps(self) : self.getTrailing(preventOverlaps).forEach(function (t) {
          return t.endAnimation();
        }));

        if (!isToggle) {
          if (scrubTween && !_refreshing && !_startup) {
            scrubTween._dp._time - scrubTween._start !== scrubTween._time && scrubTween.render(scrubTween._dp._time - scrubTween._start); // if there's a scrub on both the container animation and this one (or a ScrollSmoother), the update order would cause this one not to have rendered yet, so it wouldn't make any progress before we .restart() it heading toward the new progress so it'd appear stuck thus we force a render here.

            if (scrubTween.resetTo) {
              scrubTween.resetTo("totalProgress", clipped, animation._tTime / animation._tDur);
            } else {
              // legacy support (courtesy), before 3.10.0
              scrubTween.vars.totalProgress = clipped;
              scrubTween.invalidate().restart();
            }
          } else if (animation) {
            animation.totalProgress(clipped, !!_refreshing);
          }
        }

        if (pin) {
          reset && pinSpacing && (spacer.style[pinSpacing + direction.os2] = spacingStart);

          if (!useFixedPosition) {
            pinSetter(_round$2(pinStart + pinChange * clipped));
          } else if (stateChanged) {
            isAtMax = !reset && clipped > prevProgress && end + 1 > scroll && scroll + 1 >= _maxScroll(scroller, direction); // if it's at the VERY end of the page, don't switch away from position: fixed because it's pointless and it could cause a brief flash when the user scrolls back up (when it gets pinned again)

            if (pinReparent) {
              if (!reset && (isActive || isAtMax)) {
                var bounds = _getBounds(pin, true),
                    _offset = scroll - start;

                _reparent(pin, _body, bounds.top + (direction === _vertical ? _offset : 0) + _px, bounds.left + (direction === _vertical ? 0 : _offset) + _px);
              } else {
                _reparent(pin, spacer);
              }
            }

            _setState(isActive || isAtMax ? pinActiveState : pinState);

            pinMoves && clipped < 1 && isActive || pinSetter(pinStart + (clipped === 1 && !isAtMax ? pinChange : 0));
          }
        }

        snap && !tweenTo.tween && !_refreshing && !_startup && snapDelayedCall.restart(true);
        toggleClass && (toggled || once && clipped && (clipped < 1 || !_limitCallbacks)) && _toArray(toggleClass.targets).forEach(function (el) {
          return el.classList[isActive || once ? "add" : "remove"](toggleClass.className);
        }); // classes could affect positioning, so do it even if reset or refreshing is true.

        onUpdate && !isToggle && !reset && onUpdate(self);

        if (stateChanged && !_refreshing) {
          if (isToggle) {
            if (isTakingAction) {
              if (action === "complete") {
                animation.pause().totalProgress(1);
              } else if (action === "reset") {
                animation.restart(true).pause();
              } else if (action === "restart") {
                animation.restart(true);
              } else {
                animation[action]();
              }
            }

            onUpdate && onUpdate(self);
          }

          if (toggled || !_limitCallbacks) {
            // on startup, the page could be scrolled and we don't want to fire callbacks that didn't toggle. For example onEnter shouldn't fire if the ScrollTrigger isn't actually entered.
            onToggle && toggled && _callback(self, onToggle);
            callbacks[toggleState] && _callback(self, callbacks[toggleState]);
            once && (clipped === 1 ? self.kill(false, 1) : callbacks[toggleState] = 0); // a callback shouldn't be called again if once is true.

            if (!toggled) {
              // it's possible to go completely past, like from before the start to after the end (or vice-versa) in which case BOTH callbacks should be fired in that order
              toggleState = clipped === 1 ? 1 : 3;
              callbacks[toggleState] && _callback(self, callbacks[toggleState]);
            }
          }

          if (fastScrollEnd && !isActive && Math.abs(self.getVelocity()) > (_isNumber$1(fastScrollEnd) ? fastScrollEnd : 2500)) {
            _endAnimation(self.callbackAnimation);

            scrubTween ? scrubTween.progress(1) : _endAnimation(animation, action === "reverse" ? 1 : !clipped, 1);
          }
        } else if (isToggle && onUpdate && !_refreshing) {
          onUpdate(self);
        }
      } // update absolutely-positioned markers (only if the scroller isn't the viewport)


      if (markerEndSetter) {
        var n = containerAnimation ? scroll / containerAnimation.duration() * (containerAnimation._caScrollDist || 0) : scroll;
        markerStartSetter(n + (markerStartTrigger._isFlipped ? 1 : 0));
        markerEndSetter(n);
      }

      caMarkerSetter && caMarkerSetter(-scroll / containerAnimation.duration() * (containerAnimation._caScrollDist || 0));
    };

    self.enable = function (reset, refresh) {
      if (!self.enabled) {
        self.enabled = true;

        _addListener(scroller, "resize", _onResize);

        _addListener(isViewport ? _doc : scroller, "scroll", _onScroll);

        onRefreshInit && _addListener(ScrollTrigger, "refreshInit", onRefreshInit);

        if (reset !== false) {
          self.progress = prevProgress = 0;
          scroll1 = scroll2 = lastSnap = scrollFunc();
        }

        refresh !== false && self.refresh();
      }
    };

    self.getTween = function (snap) {
      return snap && tweenTo ? tweenTo.tween : scrubTween;
    };

    self.setPositions = function (newStart, newEnd) {
      // doesn't persist after refresh()! Intended to be a way to override values that were set during refresh(), like you could set it in onRefresh()
      if (pin) {
        pinStart += newStart - start;
        pinChange += newEnd - newStart - change;
        pinSpacing === _padding && self.adjustPinSpacing(newEnd - newStart - change);
      }

      self.start = start = newStart;
      self.end = end = newEnd;
      change = newEnd - newStart;
      self.update();
    };

    self.adjustPinSpacing = function (amount) {
      if (spacerState) {
        var i = spacerState.indexOf(direction.d) + 1;
        spacerState[i] = parseFloat(spacerState[i]) + amount + _px;
        spacerState[1] = parseFloat(spacerState[1]) + amount + _px;

        _setState(spacerState);
      }
    };

    self.disable = function (reset, allowAnimation) {
      if (self.enabled) {
        reset !== false && self.revert(true, true);
        self.enabled = self.isActive = false;
        allowAnimation || scrubTween && scrubTween.pause();
        prevScroll = 0;
        pinCache && (pinCache.uncache = 1);
        onRefreshInit && _removeListener(ScrollTrigger, "refreshInit", onRefreshInit);

        if (snapDelayedCall) {
          snapDelayedCall.pause();
          tweenTo.tween && tweenTo.tween.kill() && (tweenTo.tween = 0);
        }

        if (!isViewport) {
          var i = _triggers.length;

          while (i--) {
            if (_triggers[i].scroller === scroller && _triggers[i] !== self) {
              return; //don't remove the listeners if there are still other triggers referencing it.
            }
          }

          _removeListener(scroller, "resize", _onResize);

          _removeListener(scroller, "scroll", _onScroll);
        }
      }
    };

    self.kill = function (revert, allowAnimation) {
      self.disable(revert, allowAnimation);
      scrubTween && !allowAnimation && scrubTween.kill();
      id && delete _ids[id];

      var i = _triggers.indexOf(self);

      i >= 0 && _triggers.splice(i, 1);
      i === _i && _direction > 0 && _i--; // if we're in the middle of a refresh() or update(), splicing would cause skips in the index, so adjust...
      // if no other ScrollTrigger instances of the same scroller are found, wipe out any recorded scroll position. Otherwise, in a single page application, for example, it could maintain scroll position when it really shouldn't.

      i = 0;

      _triggers.forEach(function (t) {
        return t.scroller === self.scroller && (i = 1);
      });

      i || _refreshingAll || (self.scroll.rec = 0);

      if (animation) {
        animation.scrollTrigger = null;
        revert && animation.revert({
          kill: false
        });
        allowAnimation || animation.kill();
      }

      markerStart && [markerStart, markerEnd, markerStartTrigger, markerEndTrigger].forEach(function (m) {
        return m.parentNode && m.parentNode.removeChild(m);
      });
      _primary === self && (_primary = 0);

      if (pin) {
        pinCache && (pinCache.uncache = 1);
        i = 0;

        _triggers.forEach(function (t) {
          return t.pin === pin && i++;
        });

        i || (pinCache.spacer = 0); // if there aren't any more ScrollTriggers with the same pin, remove the spacer, otherwise it could be contaminated with old/stale values if the user re-creates a ScrollTrigger for the same element.
      }

      vars.onKill && vars.onKill(self);
    };

    self.enable(false, false);
    customRevertReturn && customRevertReturn(self);
    !animation || !animation.add || change ? self.refresh() : gsap$2.delayedCall(0.01, function () {
      return start || end || self.refresh();
    }) && (change = 0.01) && (start = end = 0); // if the animation is a timeline, it may not have been populated yet, so it wouldn't render at the proper place on the first refresh(), thus we should schedule one for the next tick. If "change" is defined, we know it must be re-enabling, thus we can refresh() right away.

    pin && _queueRefreshAll(); // pinning could affect the positions of other things, so make sure we queue a full refresh()
  };

  ScrollTrigger.register = function register(core) {
    if (!_coreInitted$1) {
      gsap$2 = core || _getGSAP$1();
      _windowExists() && window.document && ScrollTrigger.enable();
      _coreInitted$1 = _enabled;
    }

    return _coreInitted$1;
  };

  ScrollTrigger.defaults = function defaults(config) {
    if (config) {
      for (var p in config) {
        _defaults[p] = config[p];
      }
    }

    return _defaults;
  };

  ScrollTrigger.disable = function disable(reset, kill) {
    _enabled = 0;

    _triggers.forEach(function (trigger) {
      return trigger[kill ? "kill" : "disable"](reset);
    });

    _removeListener(_win, "wheel", _onScroll);

    _removeListener(_doc, "scroll", _onScroll);

    clearInterval(_syncInterval);

    _removeListener(_doc, "touchcancel", _passThrough);

    _removeListener(_body, "touchstart", _passThrough);

    _multiListener(_removeListener, _doc, "pointerdown,touchstart,mousedown", _pointerDownHandler);

    _multiListener(_removeListener, _doc, "pointerup,touchend,mouseup", _pointerUpHandler);

    _resizeDelay.kill();

    _iterateAutoRefresh(_removeListener);

    for (var i = 0; i < _scrollers.length; i += 3) {
      _wheelListener(_removeListener, _scrollers[i], _scrollers[i + 1]);

      _wheelListener(_removeListener, _scrollers[i], _scrollers[i + 2]);
    }
  };

  ScrollTrigger.enable = function enable() {
    _win = window;
    _doc = document;
    _docEl = _doc.documentElement;
    _body = _doc.body;

    if (gsap$2) {
      _toArray = gsap$2.utils.toArray;
      _clamp = gsap$2.utils.clamp;
      _context = gsap$2.core.context || _passThrough;
      _suppressOverwrites = gsap$2.core.suppressOverwrites || _passThrough;
      _scrollRestoration = _win.history.scrollRestoration || "auto";
      gsap$2.core.globals("ScrollTrigger", ScrollTrigger); // must register the global manually because in Internet Explorer, functions (classes) don't have a "name" property.

      if (_body) {
        _enabled = 1;
        Observer.register(gsap$2); // isTouch is 0 if no touch, 1 if ONLY touch, and 2 if it can accommodate touch but also other types like mouse/pointer.

        ScrollTrigger.isTouch = Observer.isTouch;
        _fixIOSBug = Observer.isTouch && /(iPad|iPhone|iPod|Mac)/g.test(navigator.userAgent); // since 2017, iOS has had a bug that causes event.clientX/Y to be inaccurate when a scroll occurs, thus we must alternate ignoring every other touchmove event to work around it. See https://bugs.webkit.org/show_bug.cgi?id=181954 and https://codepen.io/GreenSock/pen/ExbrPNa/087cef197dc35445a0951e8935c41503

        _addListener(_win, "wheel", _onScroll); // mostly for 3rd party smooth scrolling libraries.


        _root = [_win, _doc, _docEl, _body];

        if (gsap$2.matchMedia) {
          ScrollTrigger.matchMedia = function (vars) {
            var mm = gsap$2.matchMedia(),
                p;

            for (p in vars) {
              mm.add(p, vars[p]);
            }

            return mm;
          };

          gsap$2.addEventListener("matchMediaInit", function () {
            return _revertAll();
          });
          gsap$2.addEventListener("matchMediaRevert", function () {
            return _revertRecorded();
          });
          gsap$2.addEventListener("matchMedia", function () {
            _refreshAll(0, 1);

            _dispatch("matchMedia");
          });
          gsap$2.matchMedia("(orientation: portrait)", function () {
            // when orientation changes, we should take new base measurements for the ignoreMobileResize feature.
            _setBaseDimensions();

            return _setBaseDimensions;
          });
        } else {
          console.warn("Requires GSAP 3.11.0 or later");
        }

        _setBaseDimensions();

        _addListener(_doc, "scroll", _onScroll); // some browsers (like Chrome), the window stops dispatching scroll events on the window if you scroll really fast, but it's consistent on the document!


        var bodyStyle = _body.style,
            border = bodyStyle.borderTopStyle,
            AnimationProto = gsap$2.core.Animation.prototype,
            bounds,
            i;
        AnimationProto.revert || Object.defineProperty(AnimationProto, "revert", {
          value: function value() {
            return this.time(-0.01, true);
          }
        }); // only for backwards compatibility (Animation.revert() was added after 3.10.4)

        bodyStyle.borderTopStyle = "solid"; // works around an issue where a margin of a child element could throw off the bounds of the _body, making it seem like there's a margin when there actually isn't. The border ensures that the bounds are accurate.

        bounds = _getBounds(_body);
        _vertical.m = Math.round(bounds.top + _vertical.sc()) || 0; // accommodate the offset of the <body> caused by margins and/or padding

        _horizontal.m = Math.round(bounds.left + _horizontal.sc()) || 0;
        border ? bodyStyle.borderTopStyle = border : bodyStyle.removeProperty("border-top-style"); // TODO: (?) maybe move to leveraging the velocity mechanism in Observer and skip intervals.

        _syncInterval = setInterval(_sync, 250);
        gsap$2.delayedCall(0.5, function () {
          return _startup = 0;
        });

        _addListener(_doc, "touchcancel", _passThrough); // some older Android devices intermittently stop dispatching "touchmove" events if we don't listen for "touchcancel" on the document.


        _addListener(_body, "touchstart", _passThrough); //works around Safari bug: https://greensock.com/forums/topic/21450-draggable-in-iframe-on-mobile-is-buggy/


        _multiListener(_addListener, _doc, "pointerdown,touchstart,mousedown", _pointerDownHandler);

        _multiListener(_addListener, _doc, "pointerup,touchend,mouseup", _pointerUpHandler);

        _transformProp = gsap$2.utils.checkPrefix("transform");

        _stateProps.push(_transformProp);

        _coreInitted$1 = _getTime();
        _resizeDelay = gsap$2.delayedCall(0.2, _refreshAll).pause();
        _autoRefresh = [_doc, "visibilitychange", function () {
          var w = _win.innerWidth,
              h = _win.innerHeight;

          if (_doc.hidden) {
            _prevWidth = w;
            _prevHeight = h;
          } else if (_prevWidth !== w || _prevHeight !== h) {
            _onResize();
          }
        }, _doc, "DOMContentLoaded", _refreshAll, _win, "load", _refreshAll, _win, "resize", _onResize];

        _iterateAutoRefresh(_addListener);

        _triggers.forEach(function (trigger) {
          return trigger.enable(0, 1);
        });

        for (i = 0; i < _scrollers.length; i += 3) {
          _wheelListener(_removeListener, _scrollers[i], _scrollers[i + 1]);

          _wheelListener(_removeListener, _scrollers[i], _scrollers[i + 2]);
        }
      }
    }
  };

  ScrollTrigger.config = function config(vars) {
    "limitCallbacks" in vars && (_limitCallbacks = !!vars.limitCallbacks);
    var ms = vars.syncInterval;
    ms && clearInterval(_syncInterval) || (_syncInterval = ms) && setInterval(_sync, ms);
    "ignoreMobileResize" in vars && (_ignoreMobileResize = ScrollTrigger.isTouch === 1 && vars.ignoreMobileResize);

    if ("autoRefreshEvents" in vars) {
      _iterateAutoRefresh(_removeListener) || _iterateAutoRefresh(_addListener, vars.autoRefreshEvents || "none");
      _ignoreResize = (vars.autoRefreshEvents + "").indexOf("resize") === -1;
    }
  };

  ScrollTrigger.scrollerProxy = function scrollerProxy(target, vars) {
    var t = _getTarget(target),
        i = _scrollers.indexOf(t),
        isViewport = _isViewport(t);

    if (~i) {
      _scrollers.splice(i, isViewport ? 6 : 2);
    }

    if (vars) {
      isViewport ? _proxies.unshift(_win, vars, _body, vars, _docEl, vars) : _proxies.unshift(t, vars);
    }
  };

  ScrollTrigger.clearMatchMedia = function clearMatchMedia(query) {
    _triggers.forEach(function (t) {
      return t._ctx && t._ctx.query === query && t._ctx.kill(true, true);
    });
  };

  ScrollTrigger.isInViewport = function isInViewport(element, ratio, horizontal) {
    var bounds = (_isString(element) ? _getTarget(element) : element).getBoundingClientRect(),
        offset = bounds[horizontal ? _width : _height] * ratio || 0;
    return horizontal ? bounds.right - offset > 0 && bounds.left + offset < _win.innerWidth : bounds.bottom - offset > 0 && bounds.top + offset < _win.innerHeight;
  };

  ScrollTrigger.positionInViewport = function positionInViewport(element, referencePoint, horizontal) {
    _isString(element) && (element = _getTarget(element));
    var bounds = element.getBoundingClientRect(),
        size = bounds[horizontal ? _width : _height],
        offset = referencePoint == null ? size / 2 : referencePoint in _keywords ? _keywords[referencePoint] * size : ~referencePoint.indexOf("%") ? parseFloat(referencePoint) * size / 100 : parseFloat(referencePoint) || 0;
    return horizontal ? (bounds.left + offset) / _win.innerWidth : (bounds.top + offset) / _win.innerHeight;
  };

  ScrollTrigger.killAll = function killAll(allowListeners) {
    _triggers.slice(0).forEach(function (t) {
      return t.vars.id !== "ScrollSmoother" && t.kill();
    });

    if (allowListeners !== true) {
      var listeners = _listeners.killAll || [];
      _listeners = {};
      listeners.forEach(function (f) {
        return f();
      });
    }
  };

  return ScrollTrigger;
}();
ScrollTrigger.version = "3.11.4";

ScrollTrigger.saveStyles = function (targets) {
  return targets ? _toArray(targets).forEach(function (target) {
    // saved styles are recorded in a consecutive alternating Array, like [element, cssText, transform attribute, cache, matchMedia, ...]
    if (target && target.style) {
      var i = _savedStyles.indexOf(target);

      i >= 0 && _savedStyles.splice(i, 5);

      _savedStyles.push(target, target.style.cssText, target.getBBox && target.getAttribute("transform"), gsap$2.core.getCache(target), _context());
    }
  }) : _savedStyles;
};

ScrollTrigger.revert = function (soft, media) {
  return _revertAll(!soft, media);
};

ScrollTrigger.create = function (vars, animation) {
  return new ScrollTrigger(vars, animation);
};

ScrollTrigger.refresh = function (safe) {
  return safe ? _onResize() : (_coreInitted$1 || ScrollTrigger.register()) && _refreshAll(true);
};

ScrollTrigger.update = function (force) {
  return ++_scrollers.cache && _updateAll(force === true ? 2 : 0);
};

ScrollTrigger.clearScrollMemory = _clearScrollMemory;

ScrollTrigger.maxScroll = function (element, horizontal) {
  return _maxScroll(element, horizontal ? _horizontal : _vertical);
};

ScrollTrigger.getScrollFunc = function (element, horizontal) {
  return _getScrollFunc(_getTarget(element), horizontal ? _horizontal : _vertical);
};

ScrollTrigger.getById = function (id) {
  return _ids[id];
};

ScrollTrigger.getAll = function () {
  return _triggers.filter(function (t) {
    return t.vars.id !== "ScrollSmoother";
  });
}; // it's common for people to ScrollTrigger.getAll(t => t.kill()) on page routes, for example, and we don't want it to ruin smooth scrolling by killing the main ScrollSmoother one.


ScrollTrigger.isScrolling = function () {
  return !!_lastScrollTime;
};

ScrollTrigger.snapDirectional = _snapDirectional;

ScrollTrigger.addEventListener = function (type, callback) {
  var a = _listeners[type] || (_listeners[type] = []);
  ~a.indexOf(callback) || a.push(callback);
};

ScrollTrigger.removeEventListener = function (type, callback) {
  var a = _listeners[type],
      i = a && a.indexOf(callback);
  i >= 0 && a.splice(i, 1);
};

ScrollTrigger.batch = function (targets, vars) {
  var result = [],
      varsCopy = {},
      interval = vars.interval || 0.016,
      batchMax = vars.batchMax || 1e9,
      proxyCallback = function proxyCallback(type, callback) {
    var elements = [],
        triggers = [],
        delay = gsap$2.delayedCall(interval, function () {
      callback(elements, triggers);
      elements = [];
      triggers = [];
    }).pause();
    return function (self) {
      elements.length || delay.restart(true);
      elements.push(self.trigger);
      triggers.push(self);
      batchMax <= elements.length && delay.progress(1);
    };
  },
      p;

  for (p in vars) {
    varsCopy[p] = p.substr(0, 2) === "on" && _isFunction(vars[p]) && p !== "onRefreshInit" ? proxyCallback(p, vars[p]) : vars[p];
  }

  if (_isFunction(batchMax)) {
    batchMax = batchMax();

    _addListener(ScrollTrigger, "refresh", function () {
      return batchMax = vars.batchMax();
    });
  }

  _toArray(targets).forEach(function (target) {
    var config = {};

    for (p in varsCopy) {
      config[p] = varsCopy[p];
    }

    config.trigger = target;
    result.push(ScrollTrigger.create(config));
  });

  return result;
}; // to reduce file size. clamps the scroll and also returns a duration multiplier so that if the scroll gets chopped shorter, the duration gets curtailed as well (otherwise if you're very close to the top of the page, for example, and swipe up really fast, it'll suddenly slow down and take a long time to reach the top).


var _clampScrollAndGetDurationMultiplier = function _clampScrollAndGetDurationMultiplier(scrollFunc, current, end, max) {
  current > max ? scrollFunc(max) : current < 0 && scrollFunc(0);
  return end > max ? (max - current) / (end - current) : end < 0 ? current / (current - end) : 1;
},
    _allowNativePanning = function _allowNativePanning(target, direction) {
  if (direction === true) {
    target.style.removeProperty("touch-action");
  } else {
    target.style.touchAction = direction === true ? "auto" : direction ? "pan-" + direction + (Observer.isTouch ? " pinch-zoom" : "") : "none"; // note: Firefox doesn't support it pinch-zoom properly, at least in addition to a pan-x or pan-y.
  }

  target === _docEl && _allowNativePanning(_body, direction);
},
    _overflow = {
  auto: 1,
  scroll: 1
},
    _nestedScroll = function _nestedScroll(_ref5) {
  var event = _ref5.event,
      target = _ref5.target,
      axis = _ref5.axis;

  var node = (event.changedTouches ? event.changedTouches[0] : event).target,
      cache = node._gsap || gsap$2.core.getCache(node),
      time = _getTime(),
      cs;

  if (!cache._isScrollT || time - cache._isScrollT > 2000) {
    // cache for 2 seconds to improve performance.
    while (node && node !== _body && (node.scrollHeight <= node.clientHeight && node.scrollWidth <= node.clientWidth || !(_overflow[(cs = _getComputedStyle(node)).overflowY] || _overflow[cs.overflowX]))) {
      node = node.parentNode;
    }

    cache._isScroll = node && node !== target && !_isViewport(node) && (_overflow[(cs = _getComputedStyle(node)).overflowY] || _overflow[cs.overflowX]);
    cache._isScrollT = time;
  }

  if (cache._isScroll || axis === "x") {
    event.stopPropagation();
    event._gsapAllow = true;
  }
},
    // capture events on scrollable elements INSIDE the <body> and allow those by calling stopPropagation() when we find a scrollable ancestor
_inputObserver = function _inputObserver(target, type, inputs, nested) {
  return Observer.create({
    target: target,
    capture: true,
    debounce: false,
    lockAxis: true,
    type: type,
    onWheel: nested = nested && _nestedScroll,
    onPress: nested,
    onDrag: nested,
    onScroll: nested,
    onEnable: function onEnable() {
      return inputs && _addListener(_doc, Observer.eventTypes[0], _captureInputs, false, true);
    },
    onDisable: function onDisable() {
      return _removeListener(_doc, Observer.eventTypes[0], _captureInputs, true);
    }
  });
},
    _inputExp = /(input|label|select|textarea)/i,
    _inputIsFocused,
    _captureInputs = function _captureInputs(e) {
  var isInput = _inputExp.test(e.target.tagName);

  if (isInput || _inputIsFocused) {
    e._gsapAllow = true;
    _inputIsFocused = isInput;
  }
},
    _getScrollNormalizer = function _getScrollNormalizer(vars) {
  _isObject(vars) || (vars = {});
  vars.preventDefault = vars.isNormalizer = vars.allowClicks = true;
  vars.type || (vars.type = "wheel,touch");
  vars.debounce = !!vars.debounce;
  vars.id = vars.id || "normalizer";

  var _vars2 = vars,
      normalizeScrollX = _vars2.normalizeScrollX,
      momentum = _vars2.momentum,
      allowNestedScroll = _vars2.allowNestedScroll,
      self,
      maxY,
      target = _getTarget(vars.target) || _docEl,
      smoother = gsap$2.core.globals().ScrollSmoother,
      smootherInstance = smoother && smoother.get(),
      content = _fixIOSBug && (vars.content && _getTarget(vars.content) || smootherInstance && vars.content !== false && !smootherInstance.smooth() && smootherInstance.content()),
      scrollFuncY = _getScrollFunc(target, _vertical),
      scrollFuncX = _getScrollFunc(target, _horizontal),
      scale = 1,
      initialScale = (Observer.isTouch && _win.visualViewport ? _win.visualViewport.scale * _win.visualViewport.width : _win.outerWidth) / _win.innerWidth,
      wheelRefresh = 0,
      resolveMomentumDuration = _isFunction(momentum) ? function () {
    return momentum(self);
  } : function () {
    return momentum || 2.8;
  },
      lastRefreshID,
      skipTouchMove,
      inputObserver = _inputObserver(target, vars.type, true, allowNestedScroll),
      resumeTouchMove = function resumeTouchMove() {
    return skipTouchMove = false;
  },
      scrollClampX = _passThrough,
      scrollClampY = _passThrough,
      updateClamps = function updateClamps() {
    maxY = _maxScroll(target, _vertical);
    scrollClampY = _clamp(_fixIOSBug ? 1 : 0, maxY);
    normalizeScrollX && (scrollClampX = _clamp(0, _maxScroll(target, _horizontal)));
    lastRefreshID = _refreshID;
  },
      removeContentOffset = function removeContentOffset() {
    content._gsap.y = _round$2(parseFloat(content._gsap.y) + scrollFuncY.offset) + "px";
    content.style.transform = "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, " + parseFloat(content._gsap.y) + ", 0, 1)";
    scrollFuncY.offset = scrollFuncY.cacheID = 0;
  },
      ignoreDrag = function ignoreDrag() {
    if (skipTouchMove) {
      requestAnimationFrame(resumeTouchMove);

      var offset = _round$2(self.deltaY / 2),
          scroll = scrollClampY(scrollFuncY.v - offset);

      if (content && scroll !== scrollFuncY.v + scrollFuncY.offset) {
        scrollFuncY.offset = scroll - scrollFuncY.v;

        var y = _round$2((parseFloat(content && content._gsap.y) || 0) - scrollFuncY.offset);

        content.style.transform = "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, " + y + ", 0, 1)";
        content._gsap.y = y + "px";
        scrollFuncY.cacheID = _scrollers.cache;

        _updateAll();
      }

      return true;
    }

    scrollFuncY.offset && removeContentOffset();
    skipTouchMove = true;
  },
      tween,
      startScrollX,
      startScrollY,
      onStopDelayedCall,
      onResize = function onResize() {
    // if the window resizes, like on an iPhone which Apple FORCES the address bar to show/hide even if we event.preventDefault(), it may be scrolling too far now that the address bar is showing, so we must dynamically adjust the momentum tween.
    updateClamps();

    if (tween.isActive() && tween.vars.scrollY > maxY) {
      scrollFuncY() > maxY ? tween.progress(1) && scrollFuncY(maxY) : tween.resetTo("scrollY", maxY);
    }
  };

  content && gsap$2.set(content, {
    y: "+=0"
  }); // to ensure there's a cache (element._gsap)

  vars.ignoreCheck = function (e) {
    return _fixIOSBug && e.type === "touchmove" && ignoreDrag() || scale > 1.05 && e.type !== "touchstart" || self.isGesturing || e.touches && e.touches.length > 1;
  };

  vars.onPress = function () {
    var prevScale = scale;
    scale = _round$2((_win.visualViewport && _win.visualViewport.scale || 1) / initialScale);
    tween.pause();
    prevScale !== scale && _allowNativePanning(target, scale > 1.01 ? true : normalizeScrollX ? false : "x");
    startScrollX = scrollFuncX();
    startScrollY = scrollFuncY();
    updateClamps();
    lastRefreshID = _refreshID;
  };

  vars.onRelease = vars.onGestureStart = function (self, wasDragging) {
    scrollFuncY.offset && removeContentOffset();

    if (!wasDragging) {
      onStopDelayedCall.restart(true);
    } else {
      _scrollers.cache++; // make sure we're pulling the non-cached value
      // alternate algorithm: durX = Math.min(6, Math.abs(self.velocityX / 800)),	dur = Math.max(durX, Math.min(6, Math.abs(self.velocityY / 800))); dur = dur * (0.4 + (1 - _power4In(dur / 6)) * 0.6)) * (momentumSpeed || 1)

      var dur = resolveMomentumDuration(),
          currentScroll,
          endScroll;

      if (normalizeScrollX) {
        currentScroll = scrollFuncX();
        endScroll = currentScroll + dur * 0.05 * -self.velocityX / 0.227; // the constant .227 is from power4(0.05). velocity is inverted because scrolling goes in the opposite direction.

        dur *= _clampScrollAndGetDurationMultiplier(scrollFuncX, currentScroll, endScroll, _maxScroll(target, _horizontal));
        tween.vars.scrollX = scrollClampX(endScroll);
      }

      currentScroll = scrollFuncY();
      endScroll = currentScroll + dur * 0.05 * -self.velocityY / 0.227; // the constant .227 is from power4(0.05)

      dur *= _clampScrollAndGetDurationMultiplier(scrollFuncY, currentScroll, endScroll, _maxScroll(target, _vertical));
      tween.vars.scrollY = scrollClampY(endScroll);
      tween.invalidate().duration(dur).play(0.01);

      if (_fixIOSBug && tween.vars.scrollY >= maxY || currentScroll >= maxY - 1) {
        // iOS bug: it'll show the address bar but NOT fire the window "resize" event until the animation is done but we must protect against overshoot so we leverage an onUpdate to do so.
        gsap$2.to({}, {
          onUpdate: onResize,
          duration: dur
        });
      }
    }
  };

  vars.onWheel = function () {
    tween._ts && tween.pause();

    if (_getTime() - wheelRefresh > 1000) {
      // after 1 second, refresh the clamps otherwise that'll only happen when ScrollTrigger.refresh() is called or for touch-scrolling.
      lastRefreshID = 0;
      wheelRefresh = _getTime();
    }
  };

  vars.onChange = function (self, dx, dy, xArray, yArray) {
    _refreshID !== lastRefreshID && updateClamps();
    dx && normalizeScrollX && scrollFuncX(scrollClampX(xArray[2] === dx ? startScrollX + (self.startX - self.x) : scrollFuncX() + dx - xArray[1])); // for more precision, we track pointer/touch movement from the start, otherwise it'll drift.

    if (dy) {
      scrollFuncY.offset && removeContentOffset();
      var isTouch = yArray[2] === dy,
          y = isTouch ? startScrollY + self.startY - self.y : scrollFuncY() + dy - yArray[1],
          yClamped = scrollClampY(y);
      isTouch && y !== yClamped && (startScrollY += yClamped - y);
      scrollFuncY(yClamped);
    }

    (dy || dx) && _updateAll();
  };

  vars.onEnable = function () {
    _allowNativePanning(target, normalizeScrollX ? false : "x");

    ScrollTrigger.addEventListener("refresh", onResize);

    _addListener(_win, "resize", onResize);

    if (scrollFuncY.smooth) {
      scrollFuncY.target.style.scrollBehavior = "auto";
      scrollFuncY.smooth = scrollFuncX.smooth = false;
    }

    inputObserver.enable();
  };

  vars.onDisable = function () {
    _allowNativePanning(target, true);

    _removeListener(_win, "resize", onResize);

    ScrollTrigger.removeEventListener("refresh", onResize);
    inputObserver.kill();
  };

  vars.lockAxis = vars.lockAxis !== false;
  self = new Observer(vars);
  self.iOS = _fixIOSBug; // used in the Observer getCachedScroll() function to work around an iOS bug that wreaks havoc with TouchEvent.clientY if we allow scroll to go all the way back to 0.

  _fixIOSBug && !scrollFuncY() && scrollFuncY(1); // iOS bug causes event.clientY values to freak out (wildly inaccurate) if the scroll position is exactly 0.

  _fixIOSBug && gsap$2.ticker.add(_passThrough); // prevent the ticker from sleeping

  onStopDelayedCall = self._dc;
  tween = gsap$2.to(self, {
    ease: "power4",
    paused: true,
    scrollX: normalizeScrollX ? "+=0.1" : "+=0",
    scrollY: "+=0.1",
    onComplete: onStopDelayedCall.vars.onComplete
  });
  return self;
};

ScrollTrigger.sort = function (func) {
  return _triggers.sort(func || function (a, b) {
    return (a.vars.refreshPriority || 0) * -1e6 + a.start - (b.start + (b.vars.refreshPriority || 0) * -1e6);
  });
};

ScrollTrigger.observe = function (vars) {
  return new Observer(vars);
};

ScrollTrigger.normalizeScroll = function (vars) {
  if (typeof vars === "undefined") {
    return _normalizer;
  }

  if (vars === true && _normalizer) {
    return _normalizer.enable();
  }

  if (vars === false) {
    return _normalizer && _normalizer.kill();
  }

  var normalizer = vars instanceof Observer ? vars : _getScrollNormalizer(vars);
  _normalizer && _normalizer.target === normalizer.target && _normalizer.kill();
  _isViewport(normalizer.target) && (_normalizer = normalizer);
  return normalizer;
};

ScrollTrigger.core = {
  // smaller file size way to leverage in ScrollSmoother and Observer
  _getVelocityProp: _getVelocityProp,
  _inputObserver: _inputObserver,
  _scrollers: _scrollers,
  _proxies: _proxies,
  bridge: {
    // when normalizeScroll sets the scroll position (ss = setScroll)
    ss: function ss() {
      _lastScrollTime || _dispatch("scrollStart");
      _lastScrollTime = _getTime();
    },
    // a way to get the _refreshing value in Observer
    ref: function ref() {
      return _refreshing;
    }
  }
};
_getGSAP$1() && gsap$2.registerPlugin(ScrollTrigger);function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly && (symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    })), keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = null != arguments[i] ? arguments[i] : {};
    i % 2 ? ownKeys(Object(source), !0).forEach(function (key) {
      _defineProperty(target, key, source[key]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    });
  }
  return target;
}
function _defineProperty(obj, key, value) {
  key = _toPropertyKey(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _toPrimitive(input, hint) {
  if (typeof input !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== undefined) {
    var res = prim.call(input, hint || "default");
    if (typeof res !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}
function _toPropertyKey(arg) {
  var key = _toPrimitive(arg, "string");
  return typeof key === "symbol" ? key : String(key);
}
var id = 0;
function _classPrivateFieldLooseKey(name) {
  return "__private_" + id++ + "_" + name;
}
function _classPrivateFieldLooseBase(receiver, privateKey) {
  if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) {
    throw new TypeError("attempted to use private field on non-instance");
  }
  return receiver;
}var _options = _classPrivateFieldLooseKey("options");
var _rawChars = _classPrivateFieldLooseKey("rawChars");
var _rawWords = _classPrivateFieldLooseKey("rawWords");
var _isElement = _classPrivateFieldLooseKey("isElement");
var _createElement = _classPrivateFieldLooseKey("createElement");
var _splitChars = _classPrivateFieldLooseKey("splitChars");
var _splitWords = _classPrivateFieldLooseKey("splitWords");
var _splitLines = _classPrivateFieldLooseKey("splitLines");
var _combineAll = _classPrivateFieldLooseKey("combineAll");
var _splitStart = _classPrivateFieldLooseKey("splitStart");
var _getTextContent = _classPrivateFieldLooseKey("getTextContent");
var _clearContent = _classPrivateFieldLooseKey("clearContent");
var _logError = _classPrivateFieldLooseKey("logError");
var _logAndThrowError = _classPrivateFieldLooseKey("logAndThrowError");
var SplitText = function () {
  function SplitText(elementOrSelector, options) {
    Object.defineProperty(this, _logAndThrowError, {
      value: _logAndThrowError2
    });
    Object.defineProperty(this, _logError, {
      value: _logError2
    });
    Object.defineProperty(this, _clearContent, {
      value: _clearContent2
    });
    Object.defineProperty(this, _getTextContent, {
      value: _getTextContent2
    });
    Object.defineProperty(this, _splitStart, {
      value: _splitStart2
    });
    Object.defineProperty(this, _combineAll, {
      value: _combineAll2
    });
    Object.defineProperty(this, _splitLines, {
      value: _splitLines2
    });
    Object.defineProperty(this, _splitWords, {
      value: _splitWords2
    });
    Object.defineProperty(this, _splitChars, {
      value: _splitChars2
    });
    Object.defineProperty(this, _createElement, {
      value: _createElement2
    });
    Object.defineProperty(this, _isElement, {
      value: _isElement2
    });
    Object.defineProperty(this, _options, {
      writable: true,
      value: {
        charClass: "aki__char",
        wordClass: "aki__word",
        lineClass: "aki__line",
        globalClass: "aki_wrapper",
        emptySpaceName: "__AKI__EMPTY__SPACE__"
      }
    });
    Object.defineProperty(this, _rawChars, {
      writable: true,
      value: []
    });
    this.chars = [];
    Object.defineProperty(this, _rawWords, {
      writable: true,
      value: []
    });
    this.words = [];
    this.lines = [];
    _classPrivateFieldLooseBase(this, _options)[_options] = _objectSpread2(_objectSpread2({}, _classPrivateFieldLooseBase(this, _options)[_options]), options);
    this.init(elementOrSelector);
    this.target = null;
    this.textContent = null;
  }
  var _proto = SplitText.prototype;
  _proto.init = function init(elementOrSelector) {
    if (_classPrivateFieldLooseBase(this, _isElement)[_isElement](elementOrSelector)) {
      this.target = elementOrSelector;
      _classPrivateFieldLooseBase(this, _getTextContent)[_getTextContent]();
    } else {
      if (elementOrSelector !== "") {
        var element = document.querySelector("" + elementOrSelector);
        if (element) {
          this.target = element;
          _classPrivateFieldLooseBase(this, _getTextContent)[_getTextContent]();
        } else {
          _classPrivateFieldLooseBase(this, _logAndThrowError)[_logAndThrowError]("can't found %c" + elementOrSelector + "%c in DOM tree!");
        }
      } else {
        _classPrivateFieldLooseBase(this, _logAndThrowError)[_logAndThrowError]("selector is empty! %cplease give a valid%c selector!");
      }
    }
    _classPrivateFieldLooseBase(this, _clearContent)[_clearContent](this.target);
    _classPrivateFieldLooseBase(this, _splitStart)[_splitStart]();
  };
  return SplitText;
}();
function _isElement2(obj) {
  try {
    return obj instanceof HTMLElement;
  } catch (e) {
    return typeof obj === "object" && obj.nodeType === 1 && typeof obj.style === "object" && typeof obj.ownerDocument === "object";
  }
}
function _createElement2(tagname, content, htmlAttributes) {
  var _element__$classList;
  if (content === void 0) {
    content = "";
  }
  if (htmlAttributes === void 0) {
    htmlAttributes = {};
  }
  var __element__ = document.createElement(tagname);
  for (var _len = arguments.length, cssClass = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
    cssClass[_key - 3] = arguments[_key];
  }
  (_element__$classList = __element__.classList).add.apply(_element__$classList, cssClass);
  __element__.innerHTML = content;
  for (var _i = 0, _Object$entries = Object.entries(htmlAttributes); _i < _Object$entries.length; _i++) {
    var _Object$entries$_i = _Object$entries[_i],
      key = _Object$entries$_i[0],
      value = _Object$entries$_i[1];
    __element__.setAttribute(key, value);
  }
  return __element__;
}
function _splitChars2() {
  var _this = this;
  var textChars = ("" + this.textContent).split("");
  textChars.forEach(function (_char) {
    var charElement = _classPrivateFieldLooseBase(_this, _createElement)[_createElement]("div", "" + _char, {
      style: "position:relative; display:inline-block;"
    }, "" + _classPrivateFieldLooseBase(_this, _options)[_options].globalClass, "" + _classPrivateFieldLooseBase(_this, _options)[_options].charClass);
    _classPrivateFieldLooseBase(_this, _rawChars)[_rawChars].push(_char === " " ? " " : charElement);
    _this.chars.push(charElement);
  });
  _classPrivateFieldLooseBase(this, _rawChars)[_rawChars].push(" ");
}
function _splitWords2() {
  var _this2 = this;
  var startIndex = 0;
  _classPrivateFieldLooseBase(this, _rawChars)[_rawChars].forEach(function (rawChar, index) {
    if (rawChar === " ") {
      var wordArray = _classPrivateFieldLooseBase(_this2, _rawChars)[_rawChars].slice(startIndex, index).filter(function (word) {
        return word !== " ";
      });
      var wordDiv = _classPrivateFieldLooseBase(_this2, _createElement)[_createElement]("div", "", {
        style: "position:relative; display:inline-block;"
      }, "" + _classPrivateFieldLooseBase(_this2, _options)[_options].globalClass, "" + _classPrivateFieldLooseBase(_this2, _options)[_options].wordClass);
      wordArray.forEach(function (word) {
        wordDiv.append(word);
      });
      _this2.words.push(wordDiv);
      _classPrivateFieldLooseBase(_this2, _rawWords)[_rawWords].push(wordDiv, " ");
      startIndex = index;
    }
  });
}
function _splitLines2() {
  var _this3 = this;
  var startIndex = 0;
  var lineArrays = [];
  var appendToLineArray = function appendToLineArray() {
    lineArrays.forEach(function (lineArray) {
      var lineDiv = _classPrivateFieldLooseBase(_this3, _createElement)[_createElement]("div", "", {
        style: "position:relative; display:inline-block"
      }, "" + _classPrivateFieldLooseBase(_this3, _options)[_options].globalClass, "" + _classPrivateFieldLooseBase(_this3, _options)[_options].lineClass);
      lineArray.forEach(function (lineWord) {
        lineDiv.append(lineWord);
        lineDiv.append(" ");
      });
      _this3.lines.push(lineDiv);
      _this3.target.append(lineDiv);
    });
  };
  this.words.reduce(function (oldOffsetTop, word, index) {
    var currentOffsetTop = word.offsetTop;
    if (oldOffsetTop !== currentOffsetTop && oldOffsetTop !== null || index === _this3.words.length - 1) {
      var computedIndex = index === _this3.words.length - 1 ? index + 1 : index;
      var lineArray = _this3.words.slice(startIndex, computedIndex);
      lineArrays.push(lineArray);
      startIndex = index;
    }
    return currentOffsetTop;
  }, null);
  appendToLineArray();
}
function _combineAll2() {
  var _this4 = this;
  this.words.forEach(function (word) {
    _this4.target.append(word);
    _this4.target.append(" ");
  });
  _classPrivateFieldLooseBase(this, _splitLines)[_splitLines]();
}
function _splitStart2() {
  _classPrivateFieldLooseBase(this, _splitChars)[_splitChars]();
  _classPrivateFieldLooseBase(this, _splitWords)[_splitWords]();
  _classPrivateFieldLooseBase(this, _combineAll)[_combineAll]();
}
function _getTextContent2() {
  this.textContent = this.target.textContent;
}
function _clearContent2(element) {
  element.innerHTML = "";
}
function _logError2(message) {
  console.error("" + message, "color:red", "color:inherit");
}
function _logAndThrowError2(message) {
  if (message.includes("%c")) {
    console.error("" + message, "color:red", "color:inherit");
  } else {
    console.error("" + message);
  }
  throw "SplitTextException! ⬆️";
}/*!
 * paths 3.11.4
 * https://greensock.com
 *
 * Copyright 2008-2022, GreenSock. All rights reserved.
 * Subject to the terms at https://greensock.com/standard-license or for
 * Club GreenSock members, the agreement issued with that membership.
 * @author: Jack Doyle, jack@greensock.com
*/

/* eslint-disable */
var _svgPathExp = /[achlmqstvz]|(-?\d*\.?\d*(?:e[\-+]?\d+)?)[0-9]/ig,
    _scientific = /[\+\-]?\d*\.?\d+e[\+\-]?\d+/ig,
    _DEG2RAD = Math.PI / 180,
    _sin = Math.sin,
    _cos = Math.cos,
    _abs = Math.abs,
    _sqrt = Math.sqrt,
    _isNumber = function _isNumber(value) {
  return typeof value === "number";
},
    _roundingNum = 1e5,
    //if progress lands on 1, the % will make it 0 which is why we || 1, but not if it's negative because it makes more sense for motion to end at 0 in that case.
_round$1 = function _round(value) {
  return Math.round(value * _roundingNum) / _roundingNum || 0;
};

function transformRawPath(rawPath, a, b, c, d, tx, ty) {
  var j = rawPath.length,
      segment,
      l,
      i,
      x,
      y;

  while (--j > -1) {
    segment = rawPath[j];
    l = segment.length;

    for (i = 0; i < l; i += 2) {
      x = segment[i];
      y = segment[i + 1];
      segment[i] = x * a + y * c + tx;
      segment[i + 1] = x * b + y * d + ty;
    }
  }

  rawPath._dirty = 1;
  return rawPath;
} // translates SVG arc data into a segment (cubic beziers). Angle is in degrees.

function arcToSegment(lastX, lastY, rx, ry, angle, largeArcFlag, sweepFlag, x, y) {
  if (lastX === x && lastY === y) {
    return;
  }

  rx = _abs(rx);
  ry = _abs(ry);

  var angleRad = angle % 360 * _DEG2RAD,
      cosAngle = _cos(angleRad),
      sinAngle = _sin(angleRad),
      PI = Math.PI,
      TWOPI = PI * 2,
      dx2 = (lastX - x) / 2,
      dy2 = (lastY - y) / 2,
      x1 = cosAngle * dx2 + sinAngle * dy2,
      y1 = -sinAngle * dx2 + cosAngle * dy2,
      x1_sq = x1 * x1,
      y1_sq = y1 * y1,
      radiiCheck = x1_sq / (rx * rx) + y1_sq / (ry * ry);

  if (radiiCheck > 1) {
    rx = _sqrt(radiiCheck) * rx;
    ry = _sqrt(radiiCheck) * ry;
  }

  var rx_sq = rx * rx,
      ry_sq = ry * ry,
      sq = (rx_sq * ry_sq - rx_sq * y1_sq - ry_sq * x1_sq) / (rx_sq * y1_sq + ry_sq * x1_sq);

  if (sq < 0) {
    sq = 0;
  }

  var coef = (largeArcFlag === sweepFlag ? -1 : 1) * _sqrt(sq),
      cx1 = coef * (rx * y1 / ry),
      cy1 = coef * -(ry * x1 / rx),
      sx2 = (lastX + x) / 2,
      sy2 = (lastY + y) / 2,
      cx = sx2 + (cosAngle * cx1 - sinAngle * cy1),
      cy = sy2 + (sinAngle * cx1 + cosAngle * cy1),
      ux = (x1 - cx1) / rx,
      uy = (y1 - cy1) / ry,
      vx = (-x1 - cx1) / rx,
      vy = (-y1 - cy1) / ry,
      temp = ux * ux + uy * uy,
      angleStart = (uy < 0 ? -1 : 1) * Math.acos(ux / _sqrt(temp)),
      angleExtent = (ux * vy - uy * vx < 0 ? -1 : 1) * Math.acos((ux * vx + uy * vy) / _sqrt(temp * (vx * vx + vy * vy)));

  isNaN(angleExtent) && (angleExtent = PI); //rare edge case. Math.cos(-1) is NaN.

  if (!sweepFlag && angleExtent > 0) {
    angleExtent -= TWOPI;
  } else if (sweepFlag && angleExtent < 0) {
    angleExtent += TWOPI;
  }

  angleStart %= TWOPI;
  angleExtent %= TWOPI;

  var segments = Math.ceil(_abs(angleExtent) / (TWOPI / 4)),
      rawPath = [],
      angleIncrement = angleExtent / segments,
      controlLength = 4 / 3 * _sin(angleIncrement / 2) / (1 + _cos(angleIncrement / 2)),
      ma = cosAngle * rx,
      mb = sinAngle * rx,
      mc = sinAngle * -ry,
      md = cosAngle * ry,
      i;

  for (i = 0; i < segments; i++) {
    angle = angleStart + i * angleIncrement;
    x1 = _cos(angle);
    y1 = _sin(angle);
    ux = _cos(angle += angleIncrement);
    uy = _sin(angle);
    rawPath.push(x1 - controlLength * y1, y1 + controlLength * x1, ux + controlLength * uy, uy - controlLength * ux, ux, uy);
  } //now transform according to the actual size of the ellipse/arc (the beziers were noramlized, between 0 and 1 on a circle).


  for (i = 0; i < rawPath.length; i += 2) {
    x1 = rawPath[i];
    y1 = rawPath[i + 1];
    rawPath[i] = x1 * ma + y1 * mc + cx;
    rawPath[i + 1] = x1 * mb + y1 * md + cy;
  }

  rawPath[i - 2] = x; //always set the end to exactly where it's supposed to be

  rawPath[i - 1] = y;
  return rawPath;
} //Spits back a RawPath with absolute coordinates. Each segment starts with a "moveTo" command (x coordinate, then y) and then 2 control points (x, y, x, y), then anchor. The goal is to minimize memory and maximize speed.


function stringToRawPath(d) {
  var a = (d + "").replace(_scientific, function (m) {
    var n = +m;
    return n < 0.0001 && n > -0.0001 ? 0 : n;
  }).match(_svgPathExp) || [],
      //some authoring programs spit out very small numbers in scientific notation like "1e-5", so make sure we round that down to 0 first.
  path = [],
      relativeX = 0,
      relativeY = 0,
      twoThirds = 2 / 3,
      elements = a.length,
      points = 0,
      errorMessage = "ERROR: malformed path: " + d,
      i,
      j,
      x,
      y,
      command,
      isRelative,
      segment,
      startX,
      startY,
      difX,
      difY,
      beziers,
      prevCommand,
      flag1,
      flag2,
      line = function line(sx, sy, ex, ey) {
    difX = (ex - sx) / 3;
    difY = (ey - sy) / 3;
    segment.push(sx + difX, sy + difY, ex - difX, ey - difY, ex, ey);
  };

  if (!d || !isNaN(a[0]) || isNaN(a[1])) {
    console.log(errorMessage);
    return path;
  }

  for (i = 0; i < elements; i++) {
    prevCommand = command;

    if (isNaN(a[i])) {
      command = a[i].toUpperCase();
      isRelative = command !== a[i]; //lower case means relative
    } else {
      //commands like "C" can be strung together without any new command characters between.
      i--;
    }

    x = +a[i + 1];
    y = +a[i + 2];

    if (isRelative) {
      x += relativeX;
      y += relativeY;
    }

    if (!i) {
      startX = x;
      startY = y;
    } // "M" (move)


    if (command === "M") {
      if (segment) {
        if (segment.length < 8) {
          //if the path data was funky and just had a M with no actual drawing anywhere, skip it.
          path.length -= 1;
        } else {
          points += segment.length;
        }
      }

      relativeX = startX = x;
      relativeY = startY = y;
      segment = [x, y];
      path.push(segment);
      i += 2;
      command = "L"; //an "M" with more than 2 values gets interpreted as "lineTo" commands ("L").
      // "C" (cubic bezier)
    } else if (command === "C") {
      if (!segment) {
        segment = [0, 0];
      }

      if (!isRelative) {
        relativeX = relativeY = 0;
      } //note: "*1" is just a fast/short way to cast the value as a Number. WAAAY faster in Chrome, slightly slower in Firefox.


      segment.push(x, y, relativeX + a[i + 3] * 1, relativeY + a[i + 4] * 1, relativeX += a[i + 5] * 1, relativeY += a[i + 6] * 1);
      i += 6; // "S" (continuation of cubic bezier)
    } else if (command === "S") {
      difX = relativeX;
      difY = relativeY;

      if (prevCommand === "C" || prevCommand === "S") {
        difX += relativeX - segment[segment.length - 4];
        difY += relativeY - segment[segment.length - 3];
      }

      if (!isRelative) {
        relativeX = relativeY = 0;
      }

      segment.push(difX, difY, x, y, relativeX += a[i + 3] * 1, relativeY += a[i + 4] * 1);
      i += 4; // "Q" (quadratic bezier)
    } else if (command === "Q") {
      difX = relativeX + (x - relativeX) * twoThirds;
      difY = relativeY + (y - relativeY) * twoThirds;

      if (!isRelative) {
        relativeX = relativeY = 0;
      }

      relativeX += a[i + 3] * 1;
      relativeY += a[i + 4] * 1;
      segment.push(difX, difY, relativeX + (x - relativeX) * twoThirds, relativeY + (y - relativeY) * twoThirds, relativeX, relativeY);
      i += 4; // "T" (continuation of quadratic bezier)
    } else if (command === "T") {
      difX = relativeX - segment[segment.length - 4];
      difY = relativeY - segment[segment.length - 3];
      segment.push(relativeX + difX, relativeY + difY, x + (relativeX + difX * 1.5 - x) * twoThirds, y + (relativeY + difY * 1.5 - y) * twoThirds, relativeX = x, relativeY = y);
      i += 2; // "H" (horizontal line)
    } else if (command === "H") {
      line(relativeX, relativeY, relativeX = x, relativeY);
      i += 1; // "V" (vertical line)
    } else if (command === "V") {
      //adjust values because the first (and only one) isn't x in this case, it's y.
      line(relativeX, relativeY, relativeX, relativeY = x + (isRelative ? relativeY - relativeX : 0));
      i += 1; // "L" (line) or "Z" (close)
    } else if (command === "L" || command === "Z") {
      if (command === "Z") {
        x = startX;
        y = startY;
        segment.closed = true;
      }

      if (command === "L" || _abs(relativeX - x) > 0.5 || _abs(relativeY - y) > 0.5) {
        line(relativeX, relativeY, x, y);

        if (command === "L") {
          i += 2;
        }
      }

      relativeX = x;
      relativeY = y; // "A" (arc)
    } else if (command === "A") {
      flag1 = a[i + 4];
      flag2 = a[i + 5];
      difX = a[i + 6];
      difY = a[i + 7];
      j = 7;

      if (flag1.length > 1) {
        // for cases when the flags are merged, like "a8 8 0 018 8" (the 0 and 1 flags are WITH the x value of 8, but it could also be "a8 8 0 01-8 8" so it may include x or not)
        if (flag1.length < 3) {
          difY = difX;
          difX = flag2;
          j--;
        } else {
          difY = flag2;
          difX = flag1.substr(2);
          j -= 2;
        }

        flag2 = flag1.charAt(1);
        flag1 = flag1.charAt(0);
      }

      beziers = arcToSegment(relativeX, relativeY, +a[i + 1], +a[i + 2], +a[i + 3], +flag1, +flag2, (isRelative ? relativeX : 0) + difX * 1, (isRelative ? relativeY : 0) + difY * 1);
      i += j;

      if (beziers) {
        for (j = 0; j < beziers.length; j++) {
          segment.push(beziers[j]);
        }
      }

      relativeX = segment[segment.length - 2];
      relativeY = segment[segment.length - 1];
    } else {
      console.log(errorMessage);
    }
  }

  i = segment.length;

  if (i < 6) {
    //in case there's odd SVG like a M0,0 command at the very end.
    path.pop();
    i = 0;
  } else if (segment[0] === segment[i - 2] && segment[1] === segment[i - 1]) {
    segment.closed = true;
  }

  path.totalPoints = points + i;
  return path;
} //populates the points array in alternating x/y values (like [x, y, x, y...] instead of individual point objects [{x, y}, {x, y}...] to conserve memory and stay in line with how we're handling segment arrays
/*
Takes any of the following and converts it to an all Cubic Bezier SVG data string:
- A <path> data string like "M0,0 L2,4 v20,15 H100"
- A RawPath, like [[x, y, x, y, x, y, x, y][[x, y, x, y, x, y, x, y]]
- A Segment, like [x, y, x, y, x, y, x, y]

Note: all numbers are rounded down to the closest 0.001 to minimize memory, maximize speed, and avoid odd numbers like 1e-13
*/

function rawPathToString(rawPath) {
  if (_isNumber(rawPath[0])) {
    //in case a segment is passed in instead
    rawPath = [rawPath];
  }

  var result = "",
      l = rawPath.length,
      sl,
      s,
      i,
      segment;

  for (s = 0; s < l; s++) {
    segment = rawPath[s];
    result += "M" + _round$1(segment[0]) + "," + _round$1(segment[1]) + " C";
    sl = segment.length;

    for (i = 2; i < sl; i++) {
      result += _round$1(segment[i++]) + "," + _round$1(segment[i++]) + " " + _round$1(segment[i++]) + "," + _round$1(segment[i++]) + " " + _round$1(segment[i++]) + "," + _round$1(segment[i]) + " ";
    }

    if (segment.closed) {
      result += "z";
    }
  }

  return result;
}
/*
// takes a segment with coordinates [x, y, x, y, ...] and converts the control points into angles and lengths [x, y, angle, length, angle, length, x, y, angle, length, ...] so that it animates more cleanly and avoids odd breaks/kinks. For example, if you animate from 1 o'clock to 6 o'clock, it'd just go directly/linearly rather than around. So the length would be very short in the middle of the tween.
export function cpCoordsToAngles(segment, copy) {
	var result = copy ? segment.slice(0) : segment,
		x, y, i;
	for (i = 0; i < segment.length; i+=6) {
		x = segment[i+2] - segment[i];
		y = segment[i+3] - segment[i+1];
		result[i+2] = Math.atan2(y, x);
		result[i+3] = Math.sqrt(x * x + y * y);
		x = segment[i+6] - segment[i+4];
		y = segment[i+7] - segment[i+5];
		result[i+4] = Math.atan2(y, x);
		result[i+5] = Math.sqrt(x * x + y * y);
	}
	return result;
}

// takes a segment that was converted with cpCoordsToAngles() to have angles and lengths instead of coordinates for the control points, and converts it BACK into coordinates.
export function cpAnglesToCoords(segment, copy) {
	var result = copy ? segment.slice(0) : segment,
		length = segment.length,
		rnd = 1000,
		angle, l, i, j;
	for (i = 0; i < length; i+=6) {
		angle = segment[i+2];
		l = segment[i+3]; //length
		result[i+2] = (((segment[i] + Math.cos(angle) * l) * rnd) | 0) / rnd;
		result[i+3] = (((segment[i+1] + Math.sin(angle) * l) * rnd) | 0) / rnd;
		angle = segment[i+4];
		l = segment[i+5]; //length
		result[i+4] = (((segment[i+6] - Math.cos(angle) * l) * rnd) | 0) / rnd;
		result[i+5] = (((segment[i+7] - Math.sin(angle) * l) * rnd) | 0) / rnd;
	}
	return result;
}

//adds an "isSmooth" array to each segment and populates it with a boolean value indicating whether or not it's smooth (the control points have basically the same slope). For any smooth control points, it converts the coordinates into angle (x, in radians) and length (y) and puts them into the same index value in a smoothData array.
export function populateSmoothData(rawPath) {
	let j = rawPath.length,
		smooth, segment, x, y, x2, y2, i, l, a, a2, isSmooth, smoothData;
	while (--j > -1) {
		segment = rawPath[j];
		isSmooth = segment.isSmooth = segment.isSmooth || [0, 0, 0, 0];
		smoothData = segment.smoothData = segment.smoothData || [0, 0, 0, 0];
		isSmooth.length = 4;
		l = segment.length - 2;
		for (i = 6; i < l; i += 6) {
			x = segment[i] - segment[i - 2];
			y = segment[i + 1] - segment[i - 1];
			x2 = segment[i + 2] - segment[i];
			y2 = segment[i + 3] - segment[i + 1];
			a = _atan2(y, x);
			a2 = _atan2(y2, x2);
			smooth = (Math.abs(a - a2) < 0.09);
			if (smooth) {
				smoothData[i - 2] = a;
				smoothData[i + 2] = a2;
				smoothData[i - 1] = _sqrt(x * x + y * y);
				smoothData[i + 3] = _sqrt(x2 * x2 + y2 * y2);
			}
			isSmooth.push(smooth, smooth, 0, 0, smooth, smooth);
		}
		//if the first and last points are identical, check to see if there's a smooth transition. We must handle this a bit differently due to their positions in the array.
		if (segment[l] === segment[0] && segment[l+1] === segment[1]) {
			x = segment[0] - segment[l-2];
			y = segment[1] - segment[l-1];
			x2 = segment[2] - segment[0];
			y2 = segment[3] - segment[1];
			a = _atan2(y, x);
			a2 = _atan2(y2, x2);
			if (Math.abs(a - a2) < 0.09) {
				smoothData[l-2] = a;
				smoothData[2] = a2;
				smoothData[l-1] = _sqrt(x * x + y * y);
				smoothData[3] = _sqrt(x2 * x2 + y2 * y2);
				isSmooth[l-2] = isSmooth[l-1] = true; //don't change indexes 2 and 3 because we'll trigger everything from the END, and this will optimize file size a bit.
			}
		}
	}
	return rawPath;
}
export function pointToScreen(svgElement, point) {
	if (arguments.length < 2) { //by default, take the first set of coordinates in the path as the point
		let rawPath = getRawPath(svgElement);
		point = svgElement.ownerSVGElement.createSVGPoint();
		point.x = rawPath[0][0];
		point.y = rawPath[0][1];
	}
	return point.matrixTransform(svgElement.getScreenCTM());
}

*//*!
 * CustomEase 3.11.4
 * https://greensock.com
 *
 * @license Copyright 2008-2022, GreenSock. All rights reserved.
 * Subject to the terms at https://greensock.com/standard-license or for
 * Club GreenSock members, the agreement issued with that membership.
 * @author: Jack Doyle, jack@greensock.com
*/

var gsap$1,
    _coreInitted,
    _getGSAP = function _getGSAP() {
  return gsap$1 || typeof window !== "undefined" && (gsap$1 = window.gsap) && gsap$1.registerPlugin && gsap$1;
},
    _initCore = function _initCore() {
  gsap$1 = _getGSAP();

  if (gsap$1) {
    gsap$1.registerEase("_CE", CustomEase.create);
    _coreInitted = 1;
  } else {
    console.warn("Please gsap.registerPlugin(CustomEase)");
  }
},
    _bigNum = 1e20,
    _round = function _round(value) {
  return ~~(value * 1000 + (value < 0 ? -.5 : .5)) / 1000;
},
    //<name>CustomEase</name>
_numExp = /[-+=\.]*\d+[\.e\-\+]*\d*[e\-\+]*\d*/gi,
    //finds any numbers, including ones that start with += or -=, negative numbers, and ones in scientific notation like 1e-8.
_needsParsingExp = /[cLlsSaAhHvVtTqQ]/g,
    _findMinimum = function _findMinimum(values) {
  var l = values.length,
      min = _bigNum,
      i;

  for (i = 1; i < l; i += 6) {
    +values[i] < min && (min = +values[i]);
  }

  return min;
},
    //takes all the points and translates/scales them so that the x starts at 0 and ends at 1.
_normalize = function _normalize(values, height, originY) {
  if (!originY && originY !== 0) {
    originY = Math.max(+values[values.length - 1], +values[1]);
  }

  var tx = +values[0] * -1,
      ty = -originY,
      l = values.length,
      sx = 1 / (+values[l - 2] + tx),
      sy = -height || (Math.abs(+values[l - 1] - +values[1]) < 0.01 * (+values[l - 2] - +values[0]) ? _findMinimum(values) + ty : +values[l - 1] + ty),
      i;

  if (sy) {
    //typically y ends at 1 (so that the end values are reached)
    sy = 1 / sy;
  } else {
    //in case the ease returns to its beginning value, scale everything proportionally
    sy = -sx;
  }

  for (i = 0; i < l; i += 2) {
    values[i] = (+values[i] + tx) * sx;
    values[i + 1] = (+values[i + 1] + ty) * sy;
  }
},
    //note that this function returns point objects like {x, y} rather than working with segments which are arrays with alternating x, y values as in the similar function in paths.js
_bezierToPoints = function _bezierToPoints(x1, y1, x2, y2, x3, y3, x4, y4, threshold, points, index) {
  var x12 = (x1 + x2) / 2,
      y12 = (y1 + y2) / 2,
      x23 = (x2 + x3) / 2,
      y23 = (y2 + y3) / 2,
      x34 = (x3 + x4) / 2,
      y34 = (y3 + y4) / 2,
      x123 = (x12 + x23) / 2,
      y123 = (y12 + y23) / 2,
      x234 = (x23 + x34) / 2,
      y234 = (y23 + y34) / 2,
      x1234 = (x123 + x234) / 2,
      y1234 = (y123 + y234) / 2,
      dx = x4 - x1,
      dy = y4 - y1,
      d2 = Math.abs((x2 - x4) * dy - (y2 - y4) * dx),
      d3 = Math.abs((x3 - x4) * dy - (y3 - y4) * dx),
      length;

  if (!points) {
    points = [{
      x: x1,
      y: y1
    }, {
      x: x4,
      y: y4
    }];
    index = 1;
  }

  points.splice(index || points.length - 1, 0, {
    x: x1234,
    y: y1234
  });

  if ((d2 + d3) * (d2 + d3) > threshold * (dx * dx + dy * dy)) {
    length = points.length;

    _bezierToPoints(x1, y1, x12, y12, x123, y123, x1234, y1234, threshold, points, index);

    _bezierToPoints(x1234, y1234, x234, y234, x34, y34, x4, y4, threshold, points, index + 1 + (points.length - length));
  }

  return points;
};

var CustomEase = /*#__PURE__*/function () {
  function CustomEase(id, data, config) {
    _coreInitted || _initCore();
    this.id = id;
    this.setData(data, config);
  }

  var _proto = CustomEase.prototype;

  _proto.setData = function setData(data, config) {
    config = config || {};
    data = data || "0,0,1,1";
    var values = data.match(_numExp),
        closest = 1,
        points = [],
        lookup = [],
        precision = config.precision || 1,
        fast = precision <= 1,
        l,
        a1,
        a2,
        i,
        inc,
        j,
        point,
        prevPoint,
        p;
    this.data = data;

    if (_needsParsingExp.test(data) || ~data.indexOf("M") && data.indexOf("C") < 0) {
      values = stringToRawPath(data)[0];
    }

    l = values.length;

    if (l === 4) {
      values.unshift(0, 0);
      values.push(1, 1);
      l = 8;
    } else if ((l - 2) % 6) {
      throw "Invalid CustomEase";
    }

    if (+values[0] !== 0 || +values[l - 2] !== 1) {
      _normalize(values, config.height, config.originY);
    }

    this.segment = values;

    for (i = 2; i < l; i += 6) {
      a1 = {
        x: +values[i - 2],
        y: +values[i - 1]
      };
      a2 = {
        x: +values[i + 4],
        y: +values[i + 5]
      };
      points.push(a1, a2);

      _bezierToPoints(a1.x, a1.y, +values[i], +values[i + 1], +values[i + 2], +values[i + 3], a2.x, a2.y, 1 / (precision * 200000), points, points.length - 1);
    }

    l = points.length;

    for (i = 0; i < l; i++) {
      point = points[i];
      prevPoint = points[i - 1] || point;

      if ((point.x > prevPoint.x || prevPoint.y !== point.y && prevPoint.x === point.x || point === prevPoint) && point.x <= 1) {
        //if a point goes BACKWARD in time or is a duplicate, just drop it. Also it shouldn't go past 1 on the x axis, as could happen in a string like "M0,0 C0,0 0.12,0.68 0.18,0.788 0.195,0.845 0.308,1 0.32,1 0.403,1.005 0.398,1 0.5,1 0.602,1 0.816,1.005 0.9,1 0.91,1 0.948,0.69 0.962,0.615 1.003,0.376 1,0 1,0".
        prevPoint.cx = point.x - prevPoint.x; //change in x between this point and the next point (performance optimization)

        prevPoint.cy = point.y - prevPoint.y;
        prevPoint.n = point;
        prevPoint.nx = point.x; //next point's x value (performance optimization, making lookups faster in getRatio()). Remember, the lookup will always land on a spot where it's either this point or the very next one (never beyond that)

        if (fast && i > 1 && Math.abs(prevPoint.cy / prevPoint.cx - points[i - 2].cy / points[i - 2].cx) > 2) {
          //if there's a sudden change in direction, prioritize accuracy over speed. Like a bounce ease - you don't want to risk the sampling chunks landing on each side of the bounce anchor and having it clipped off.
          fast = 0;
        }

        if (prevPoint.cx < closest) {
          if (!prevPoint.cx) {
            prevPoint.cx = 0.001; //avoids math problems in getRatio() (dividing by zero)

            if (i === l - 1) {
              //in case the final segment goes vertical RIGHT at the end, make sure we end at the end.
              prevPoint.x -= 0.001;
              closest = Math.min(closest, 0.001);
              fast = 0;
            }
          } else {
            closest = prevPoint.cx;
          }
        }
      } else {
        points.splice(i--, 1);
        l--;
      }
    }

    l = 1 / closest + 1 | 0;
    inc = 1 / l;
    j = 0;
    point = points[0];

    if (fast) {
      for (i = 0; i < l; i++) {
        //for fastest lookups, we just sample along the path at equal x (time) distance. Uses more memory and is slightly less accurate for anchors that don't land on the sampling points, but for the vast majority of eases it's excellent (and fast).
        p = i * inc;

        if (point.nx < p) {
          point = points[++j];
        }

        a1 = point.y + (p - point.x) / point.cx * point.cy;
        lookup[i] = {
          x: p,
          cx: inc,
          y: a1,
          cy: 0,
          nx: 9
        };

        if (i) {
          lookup[i - 1].cy = a1 - lookup[i - 1].y;
        }
      }

      lookup[l - 1].cy = points[points.length - 1].y - a1;
    } else {
      //this option is more accurate, ensuring that EVERY anchor is hit perfectly. Clipping across a bounce, for example, would never happen.
      for (i = 0; i < l; i++) {
        //build a lookup table based on the smallest distance so that we can instantly find the appropriate point (well, it'll either be that point or the very next one). We'll look up based on the linear progress. So it's it's 0.5 and the lookup table has 100 elements, it'd be like lookup[Math.floor(0.5 * 100)]
        if (point.nx < i * inc) {
          point = points[++j];
        }

        lookup[i] = point;
      }

      if (j < points.length - 1) {
        lookup[i - 1] = points[points.length - 2];
      }
    } //this._calcEnd = (points[points.length-1].y !== 1 || points[0].y !== 0); //ensures that we don't run into floating point errors. As long as we're starting at 0 and ending at 1, tell GSAP to skip the final calculation and use 0/1 as the factor.


    this.ease = function (p) {
      var point = lookup[p * l | 0] || lookup[l - 1];

      if (point.nx < p) {
        point = point.n;
      }

      return point.y + (p - point.x) / point.cx * point.cy;
    };

    this.ease.custom = this;
    this.id && gsap$1 && gsap$1.registerEase(this.id, this.ease);
    return this;
  };

  _proto.getSVGData = function getSVGData(config) {
    return CustomEase.getSVGData(this, config);
  };

  CustomEase.create = function create(id, data, config) {
    return new CustomEase(id, data, config).ease;
  };

  CustomEase.register = function register(core) {
    gsap$1 = core;

    _initCore();
  };

  CustomEase.get = function get(id) {
    return gsap$1.parseEase(id);
  };

  CustomEase.getSVGData = function getSVGData(ease, config) {
    config = config || {};
    var width = config.width || 100,
        height = config.height || 100,
        x = config.x || 0,
        y = (config.y || 0) + height,
        e = gsap$1.utils.toArray(config.path)[0],
        a,
        slope,
        i,
        inc,
        tx,
        ty,
        precision,
        threshold,
        prevX,
        prevY;

    if (config.invert) {
      height = -height;
      y = 0;
    }

    if (typeof ease === "string") {
      ease = gsap$1.parseEase(ease);
    }

    if (ease.custom) {
      ease = ease.custom;
    }

    if (ease instanceof CustomEase) {
      a = rawPathToString(transformRawPath([ease.segment], width, 0, 0, -height, x, y));
    } else {
      a = [x, y];
      precision = Math.max(5, (config.precision || 1) * 200);
      inc = 1 / precision;
      precision += 2;
      threshold = 5 / precision;
      prevX = _round(x + inc * width);
      prevY = _round(y + ease(inc) * -height);
      slope = (prevY - y) / (prevX - x);

      for (i = 2; i < precision; i++) {
        tx = _round(x + i * inc * width);
        ty = _round(y + ease(i * inc) * -height);

        if (Math.abs((ty - prevY) / (tx - prevX) - slope) > threshold || i === precision - 1) {
          //only add points when the slope changes beyond the threshold
          a.push(prevX, prevY);
          slope = (ty - prevY) / (tx - prevX);
        }

        prevX = tx;
        prevY = ty;
      }

      a = "M" + a.join(",");
    }

    e && e.setAttribute("d", a);
    return a;
  };

  return CustomEase;
}();
_getGSAP() && gsap$1.registerPlugin(CustomEase);
CustomEase.version = "3.11.4";var _header$split$fade$sp;
var Easings = (_header$split$fade$sp = {
  header: CustomEase.create("custom", "M0,0 C0.11,0.494 0.142,0.762 0.268,0.888 0.4,1.02 0.504,1 1,1 "),
  split: CustomEase.create("custom", "M0,0 C0.11,0.494 0.142,0.762 0.268,0.888 0.4,1.02 0.504,1 1,1 "),
  fade: CustomEase.create("custom", "M0,0 C0.126,0.382 0.205,0.929 0.418,0.972 0.628,1.014 0.818,1.001 1,1 ")
}, _header$split$fade$sp["split"] = CustomEase.create("custom", "M0,0 C0.126,0.382 0.172,0.7 0.33,0.848 0.522,1.028 0.818,1.001 1,1 "), _header$split$fade$sp);var split = document.querySelectorAll("[split]");
gsap.set(split, {
  opacity: 0,
  duration: 0
});
function Split (delay) {
  if (delay === void 0) {
    delay = 0;
  }
  split.forEach(function (s) {
    new SplitText(s, {
      charClass: "st--char",
      wordClass: "st--word",
      lineClass: "st--line",
      globalClass: "st--wrapper",
      emptySpaceName: "st--space"
    });
    setTimeout(function () {
      gsap.set(split, {
        opacity: 1,
        duration: 0
      });
      gsap.utils.toArray(s.children).forEach(function (line, i) {
        gsap.set(line, {
          overflow: 'hidden'
        });
        gsap.utils.toArray(line.children).forEach(function (word, index) {
          gsap.fromTo(word, {
            yPercent: 100
          }, {
            yPercent: 0,
            duration: 1,
            delay: i / 10,
            ease: Easings.split
          });
        });
      });
    }, delay);
  });
}gsap.set('[fade]', {
  opacity: 0,
  duration: 0
});
function has_some_parent_class(element, classname) {
  if (element.className !== undefined) {
    if (element.className.split(' ').indexOf(classname) >= 0) return true;
  }
  return element.parentNode && has_some_parent_class(element.parentNode, classname);
}
function default_animation(item, i, delay) {
  var x = 0,
    y = 0,
    direction = 1,
    start = "top 90%";
  if (has_some_parent_class(item, 'invert')) direction = -1;
  if (item.hasAttribute('left')) x = -100 * direction;
  if (item.hasAttribute('right')) x = 100 * direction;
  if (item.hasAttribute('up')) y = 100 * direction;
  if (item.hasAttribute('down')) y = -100 * direction;
  if (item.hasAttribute('fire')) start = "";
  if ($(window).width() < 768) {
    x = 0;
    y = 0;
  }
  setTimeout(function () {
    gsap.fromTo(item, {
      y: y,
      x: x
    }, {
      duration: 1,
      opacity: 1,
      y: 0,
      x: 0,
      scrollTrigger: {
        trigger: item,
        start: start,
        end: "+=100",
        scrub: 1,
        snap: {
          ease: "linear"
        }
      }
    });
  }, delay);
}
function hero_animation(item, i, delay) {
  var x = 0,
    y = 0,
    direction = 1;
  if (has_some_parent_class(item, 'invert')) direction = -1;
  if (item.hasAttribute('left')) x = -100 * direction;
  if (item.hasAttribute('right')) x = 100 * direction;
  if (item.hasAttribute('up')) y = 100 * direction;
  if (item.hasAttribute('down')) y = -100 * direction;
  if (item.hasAttribute('fire')) ;
  setTimeout(function () {
    gsap.fromTo(item, {
      y: y,
      x: x
    }, {
      duration: 2,
      opacity: 1,
      y: 0,
      x: 0,
      ease: Easings.fade
    });
  }, delay);
}
function Fade (delay) {
  if (delay === void 0) {
    delay = 0;
  }
  var fade_items = gsap.utils.toArray('[fade]');
  fade_items.forEach(function (item, i) {
    if (has_some_parent_class(item, 'composizione--hero')) {
      hero_animation(item, i, delay);
      return;
    }
    default_animation(item, i, delay);
  });
}function Mosaic () {
  gsap.utils.toArray('.mosaic').forEach(function (m) {
    gsap.to(m, {
      opacity: 0,
      duration: 0
    });
    m.setAttribute('fade', true);
    m.setAttribute('fire', true);
  });
  gsap.utils.toArray('.mosaic--item').forEach(function (card) {
    gsap.to(card, {
      duration: 1,
      scrollTrigger: {
        toggleClass: "visible",
        start: "top 70%",
        trigger: card,
        scrub: true,
        duration: {
          min: 1
        }
      }
    });
  });
  gsap.to(".mosaic .col-6:nth-child(odd)", {
    y: -150,
    ease: "none",
    scrollTrigger: {
      trigger: ".mosaic",
      scrub: true
    }
  });
  gsap.to(".mosaic .col-6:nth-child(even)", {
    y: 150,
    ease: "none",
    scrollTrigger: {
      trigger: ".mosaic",
      scrub: true
    }
  });
}function SliderSide () {
  document.querySelectorAll('.slider-side').forEach(function (s) {
    if ($(s).find('.swiper-slide').length == 1) {
      $(s).find('.slider-side--nav').remove();
    } else {
      $(s).addClass('slider-side-ok');
    }
  });
  new Swiper(".slider-side-ok", {
    navigation: {
      nextEl: ".slider-side--next",
      prevEl: ".slider-side--prev"
    },
    fadeEffect: {
      crossFade: true
    },
    speed: 1000,
    loop: true,
    autoHeight: true,
    breakpoints: {
      1024: {
        autoHeight: false
      }
    }
  });
}function Timeline () {
  var timeline = document.querySelectorAll('.timeline');
  if (timeline.length == 0) return;
  $('.timeline').each(function (index, timeline) {
    $(timeline).addClass('timeline-' + index);
    var breakpoints = {
      1024: {
        slidesPerView: 2,
        centeredSlides: true
      }
    };
    if ($(timeline).hasClass('hero')) {
      breakpoints = {};
    }
    var timeline_slides = new Swiper('.timeline-' + index + ' .timeline--content--slides', {
      slidesPerView: 1,
      slideToClickedSlide: true,
      createElements: true,
      containerModifierClass: 'timeline--content--',
      slideClass: 'timeline--content--slide',
      slideNextClass: 'timeline--content--slide--next',
      slidePrevClass: 'timeline--content--slide--prev',
      slideVisibleClass: 'timeline--content--slide--visible',
      slideActiveClass: 'timeline--content--slide--active',
      speed: 1000,
      breakpoints: breakpoints
    });
    function updateTimelineCTA(slider) {
      setTimeout(function() {
        var navSlides = slider.el.querySelectorAll('.timeline--navigation--slide');

        // Rimuovi tutti i CTA esistenti
        navSlides.forEach(function(slide) {
          var cta = slide.querySelector('.cta');
          if (cta) {
            slide.removeChild(cta);
          }
        });

        // Aggiungi il CTA solo alla slide attiva, se ha un link
        var activeSlide = slider.slides[slider.activeIndex];

        // Controlla che la slide attiva esista prima di continuare
        if (!activeSlide) {
          return;
        }

        var url = activeSlide.getAttribute('data-link-url');
        var title = activeSlide.getAttribute('data-link-title');
        var target = activeSlide.getAttribute('data-link-target');

        if (url && title) {
          var ctaDiv = document.createElement('div');
          ctaDiv.className = 'cta';

          var ctaWrapperDiv = document.createElement('div');
          ctaWrapperDiv.className = 'cta--wrapper';

          var ctaContentDiv = document.createElement('div');
          ctaContentDiv.className = 'cta--content';

          var link = document.createElement('a');
          link.href = url;
          link.textContent = title;
          link.target = target;

          ctaContentDiv.appendChild(link);
          ctaWrapperDiv.appendChild(ctaContentDiv);
          ctaDiv.appendChild(ctaWrapperDiv);

          activeSlide.appendChild(ctaDiv);
        }
      }, 0);
    }

    var timeline_navigation = new Swiper('.timeline-' + index + ' .timeline--navigation--slides', {
      slidesPerView: "auto",
      centeredSlides: true,
      slideToClickedSlide: true,
      createElements: true,
      containerModifierClass: 'timeline--navigation--',
      slideClass: 'timeline--navigation--slide',
      slideNextClass: 'timeline--navigation--slide--next',
      slidePrevClass: 'timeline--navigation--slide--prev',
      slideVisibleClass: 'timeline--navigation--slide--visible',
      slideActiveClass: 'timeline--navigation--slide--active',
      speed: 1000,
      on: {
        init: function (slider) {
          updateTimelineCTA(slider);
        },
        slideChange: function (slider) {
          updateTimelineCTA(slider);
        }
      }
    });
    timeline_navigation.on('slideChange', function (slider) {
      timeline_slides.slideTo(slider.activeIndex);
    });
    timeline_slides.on('slideChange', function (slider) {
      timeline_navigation.slideTo(slider.activeIndex);
    });
  });
}function Tabs () {
  $('.tabs--heading').on('click', function () {
    var tabs = $(this).closest('.tabs');
    if ($(this).hasClass('active')) return;
    tabs.find('.tabs--headings > .active, .tabs--contents > .active').removeClass('active');
    $(this).addClass('active');
    var target = $(this).attr('tabs-toggle');
    tabs.find('[tabs-content="' + target + '"]').addClass('active');
  });
  $('.tabs--heading:first-child').trigger('click');
}function Accordion () {
  var accordion_items = gsap.utils.toArray('[accordion-content]');
  var duration = 0.4;
  var easing = 'power2';
  accordion_items.forEach(function (item) {
    gsap.to(item, {
      height: 0,
      overflow: 'hidden',
      duration: 0
    });
  });
  $('.accordion--heading').on('click', function () {
    var target = $(this).attr('accordion-toggle'),
      selector = '[accordion-content="' + target + '"]',
      element = $(selector);
    if ($(this).hasClass('active')) {
      $(this).removeClass('active');
      gsap.to(selector, {
        height: 0,
        duration: duration,
        ease: easing
      });
      return;
    }
    $(this).addClass('active');
    element.addClass('active');
    gsap.to(selector, {
      height: 'auto',
      duration: duration,
      ease: easing
    });
  });
  $('[finiture-toggle]').on('click', function () {
    if ($(this).hasClass('active')) {
      return;
    }
    var finiture = $(this).closest('.finiture--variants');
    finiture.find('[finiture-toggle].active').removeClass('active');
    finiture.find('[finiture-content].active').hide(0);
    $(this).addClass('active');
    var target = $(this).attr('finiture-toggle'),
      selector = '[finiture-content="' + target + '"]',
      element = finiture.find(selector);
    element.addClass('active');
    element.show(0);
  });
  $('[finiture-toggle]:first-child').trigger('click');
}function Modal () {
  var modal_items = gsap.utils.toArray('[modal]');
  modal_items.forEach(function (item) {
    gsap.set(item, {
      display: 'none',
      duration: 0
    });
    $('[modal-toggle]').on('click', function () {
      var target = $(this).attr('modal-toggle'),
        selector = '[modal="' + target + '"]';
      gsap.fromTo(selector, {
        display: 'block',
        height: 0,
        opacity: 0,
        overflow: 'hidden',
        duration: 0,
        pointerEvents: 'all'
      }, {
        height: '100vh',
        opacity: 1,
        duration: 0.5
      });
      gsap.to('body,html', {
        overflow: 'hidden',
        duration: 0
      });
    });
    $('.modal--close').on('click', function () {
      var target = $(this).closest('[modal]').attr('modal'),
        selector = '[modal="' + target + '"]';
      gsap.to(selector, {
        display: 'block',
        height: 0,
        opacity: 0,
        overflow: 'hidden',
        duration: 0.5,
        pointerEvents: 'none'
      });
      gsap.to('body,html', {
        overflow: 'auto',
        duration: 0
      });
    });
  });
}function Filters () {
  document.querySelector(".collection--filters");
  var filters = '.collection--filters--content';
  gsap.set(filters, {
    duration: 0,
    height: 0,
    overflowY: 'hidden',
    overflowX: 'hidden'
  });
  var filters_timeline = gsap.timeline({
    paused: true
  }).to(filters, {
    height: 'auto',
    duration: 0.75,
    ease: 'ease-in-out'
  });
  $('.collection--filters--icon').on('click', function () {
    if ($('html,body').hasClass('filters-open')) {
      filters_timeline.reverse().play().reverse();
    } else {
      filters_timeline.play();
    }
    $('html,body').toggleClass('filters-open');
  });
  ScrollTrigger.create({
    onUpdate: function onUpdate() {
      filters_timeline.reverse().play().reverse();
      $('html,body').removeClass('filters-open');
    }
  });
}function Menu () {
  gsap.set('.menu--wrapper', {
    display: 'none',
    opacity: 0,
    duration: 0
  });
  var tl = gsap.timeline({
      paused: true,
      ease: 'power2.inOut'
    }),
    tx = tl.to('.header--language', {
      duration: 0.15,
      top: 0,
      opacity: 0,
      y: -50
    }).to('.header--search', {
      duration: 0.15,
      top: 0,
      opacity: 0,
      y: -50
    }).to('.menu--wrapper', {
      duration: 0,
      display: 'block'
    }).to('.menu--wrapper', {
      duration: 0.25,
      opacity: 1
    });
  var menu_timeline = gsap.timeline({
    paused: true
  });
  var menu_items = [].concat(gsap.utils.toArray('.menu .menu--content'), gsap.utils.toArray('.menu .menu--primary--item'), gsap.utils.toArray('.menu .menu--secondary--item'), gsap.utils.toArray('.menu .menu--language--item'), gsap.utils.toArray('.menu .menu--social--item'));
  menu_items.forEach(function (item, i) {
    menu_timeline.fromTo(item, {
      opacity: 0,
      y: -20
    }, {
      duration: 0.08,
      opacity: 1,
      y: 0,
      delay: i == 1 ? 0.5 : 0
    });
  });
  $('.header .menu--icon').on('click', function () {
    var menu = $(this),
      body = $('body,html');
    if (menu.hasClass('open')) {
      menu.removeClass('open');
      body.removeClass('menu-open');
      menu_timeline.reverse().play().reverse().then(function () {
        tx.reverse().play().reverse();
      });
      return;
    }
    menu.addClass('open');
    body.addClass('menu-open');
    tx.play().then(function () {
      menu_timeline.play();
    });
  });
  $('.header .dropdown--wrapper').on({
    click: function click() {
      $(this).toggleClass('open');
      $(this).find('.dropdown--items').stop().toggle(200);
    },
    mouseenter: function mouseenter() {
      $(this).addClass('open');
      $(this).find('.dropdown--items').stop().show(200);
    },
    mouseleave: function mouseleave() {
      $(this).removeClass('open');
      $(this).find('.dropdown--items').stop().hide(200);
    }
  });
  var search = gsap.utils.toArray('.search');
  gsap.to(search, {
    height: 0,
    duration: 0
  });
  var search_timeline = gsap.timeline({
    paused: true,
    ease: 'power2.inOut'
  });
  search_timeline.fromTo(search, {
    height: 0
  }, {
    height: 'auto'
  });
  $('.header--search, .search--toggle').on('click', function () {
    var search = $('.search');
    if (search.hasClass('open')) {
      search.removeClass('open');
      search_timeline.reverse().play().reverse().then(function () {
        search_timeline.reverse().play().reverse();
      });
      return;
    }
    search.addClass('open');
    search_timeline.play().then(function () {
      search_timeline.play();
    });
  });
}gsap.registerPlugin(ScrollTrigger);
function Footer () {
  var footer_links = gsap.utils.toArray('[footer-animate-link]');
  footer_links.forEach(function (box, i) {
    var y = 100;
    var x = 0;
    var anim_delay = gsap.fromTo(box, {
      autoAlpha: 0,
      y: y,
      x: x
    }, {
      duration: 1,
      autoAlpha: 1,
      y: 0,
      x: 0,
      delay: i / 10
    });
    ScrollTrigger.create({
      trigger: box,
      animation: anim_delay,
      toggleActions: 'play none none none',
      once: true
    });
  });
  var boxes = gsap.utils.toArray('[footer-animate]');
  boxes.forEach(function (box, i) {
    var y = 0;
    var x = 0;
    var delay = 0;
    if (box.hasAttribute('left')) x = -100;
    if (box.hasAttribute('right')) x = 100;
    if (box.hasAttribute('up')) y = 100;
    if (box.hasAttribute('down')) y = -100;
    if (box.hasAttribute('delay')) delay = i / 10;
    var anim = gsap.fromTo(box, {
      autoAlpha: 0,
      y: y,
      x: x
    }, {
      duration: 1,
      autoAlpha: 1,
      y: 0,
      x: 0,
      delay: delay
    });
    ScrollTrigger.create({
      trigger: box,
      animation: anim,
      toggleActions: 'play none none none',
      once: true
    });
  });
}var filters = $('.collection--filters');
var has_filters = filters.length > 0;
function Header (delay) {
  if (delay === void 0) {
    delay = 0;
  }
  gsap.timeline({
    paused: true
  });
  setTimeout(function () {
    gsap.fromTo('.header--left', {
      xPercent: -5,
      duration: 0
    }, {
      xPercent: 0,
      opacity: 1,
      duration: 0.75
    });
    gsap.fromTo('.header--language,.header--search', {
      yPercent: -100,
      duration: 0
    }, {
      yPercent: 0,
      opacity: 1,
      duration: 1
    });
    gsap.fromTo('.header--toggle', {
      xPercent: 100,
      duration: 0
    }, {
      xPercent: 0,
      opacity: 1,
      duration: 1
    }).play();
    var show_header = gsap.from('.header', {
      yPercent: -100,
      opacity: 0,
      paused: true,
      duration: 1,
      ease: Easings.header
    }).progress(1);
    ScrollTrigger.create({
      start: "top top",
      end: 99999,
      onUpdate: function onUpdate(self) {
        if (self.direction === -1) {
          if (!has_filters) {
            show_header.play();
          } else {
            if ($(window).scrollTop() < 10) show_header.play();
          }
        } else if (self.scroll() > 10) {
          show_header.reverse();
        }
      }
    });
    if (has_filters) {
      var show_filters = gsap.to('.collection--filters', {
        paused: true,
        yPercent: -100,
        duration: 0.5,
        ease: 'none'
      });
      var top = filters.offset().top;
      ScrollTrigger.create({
        start: "top " + top,
        end: 99999,
        onUpdate: function onUpdate(self) {
          if (window.innerWidth < 1023) return;
          var scroll_top = $(window).scrollTop();
          if (scroll_top < $('.section--products > .container').offset().top) {
            show_filters.reverse();
            $('.collection--filters').removeClass('is-pinned');
            return;
          } else {
            $('.collection--filters').addClass('is-pinned');
          }
          if (scroll_top < top && self.direction === -1) {
            show_filters.play();
            $('.collection--filters').removeClass('is-pinned');
            return;
          } else if (self.direction === -1) {
            $('.collection--filters').addClass('is-pinned');
            show_filters.reverse();
          } else {
            show_filters.play();
          }
        }
      });
    }
  }, delay);
}gsap.utils.toArray('[data-content]').forEach(function (card) {
  gsap.to(card, {
    height: 0,
    overflow: 'hidden',
    duration: 0
  });
});
var duration = 0.35;
function Toggle () {
  $('[data-toggle]').on({
    click: function click() {
      var selector = '[data-content="' + $(this).attr('data-toggle') + '"]';
      if (!$(this).hasClass('open')) {
        gsap.to(selector, {
          height: 'auto',
          duration: duration
        });
        if ($(this).parents('.menu').length) {
          gsap.to('.menu--social', {
            opacity: 0,
            duration: 0.5
          });
        }
      } else {
        gsap.to(selector, {
          height: 0,
          duration: duration
        });
        if ($(this).parents('.menu').length) {
          gsap.to('.menu--social', {
            opacity: 1,
            duration: 0.5
          });
        }
      }
      $(this).toggleClass('open');
    }
  });
}/*! @vimeo/player v2.18.0 | (c) 2022 Vimeo | MIT License | https://github.com/vimeo/player.js */
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

/**
 * @module lib/functions
 */

/**
 * Check to see this is a node environment.
 * @type {Boolean}
 */

/* global global */
var isNode = typeof global !== 'undefined' && {}.toString.call(global) === '[object global]';
/**
 * Get the name of the method for a given getter or setter.
 *
 * @param {string} prop The name of the property.
 * @param {string} type Either “get” or “set”.
 * @return {string}
 */

function getMethodName(prop, type) {
  if (prop.indexOf(type.toLowerCase()) === 0) {
    return prop;
  }

  return "".concat(type.toLowerCase()).concat(prop.substr(0, 1).toUpperCase()).concat(prop.substr(1));
}
/**
 * Check to see if the object is a DOM Element.
 *
 * @param {*} element The object to check.
 * @return {boolean}
 */

function isDomElement(element) {
  return Boolean(element && element.nodeType === 1 && 'nodeName' in element && element.ownerDocument && element.ownerDocument.defaultView);
}
/**
 * Check to see whether the value is a number.
 *
 * @see http://dl.dropboxusercontent.com/u/35146/js/tests/isNumber.html
 * @param {*} value The value to check.
 * @param {boolean} integer Check if the value is an integer.
 * @return {boolean}
 */

function isInteger(value) {
  // eslint-disable-next-line eqeqeq
  return !isNaN(parseFloat(value)) && isFinite(value) && Math.floor(value) == value;
}
/**
 * Check to see if the URL is a Vimeo url.
 *
 * @param {string} url The url string.
 * @return {boolean}
 */

function isVimeoUrl(url) {
  return /^(https?:)?\/\/((player|www)\.)?vimeo\.com(?=$|\/)/.test(url);
}
/**
 * Check to see if the URL is for a Vimeo embed.
 *
 * @param {string} url The url string.
 * @return {boolean}
 */

function isVimeoEmbed(url) {
  var expr = /^https:\/\/player\.vimeo\.com\/video\/\d+/;
  return expr.test(url);
}
/**
 * Get the Vimeo URL from an element.
 * The element must have either a data-vimeo-id or data-vimeo-url attribute.
 *
 * @param {object} oEmbedParameters The oEmbed parameters.
 * @return {string}
 */

function getVimeoUrl() {
  var oEmbedParameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var id = oEmbedParameters.id;
  var url = oEmbedParameters.url;
  var idOrUrl = id || url;

  if (!idOrUrl) {
    throw new Error('An id or url must be passed, either in an options object or as a data-vimeo-id or data-vimeo-url attribute.');
  }

  if (isInteger(idOrUrl)) {
    return "https://vimeo.com/".concat(idOrUrl);
  }

  if (isVimeoUrl(idOrUrl)) {
    return idOrUrl.replace('http:', 'https:');
  }

  if (id) {
    throw new TypeError("\u201C".concat(id, "\u201D is not a valid video id."));
  }

  throw new TypeError("\u201C".concat(idOrUrl, "\u201D is not a vimeo.com url."));
}

var arrayIndexOfSupport = typeof Array.prototype.indexOf !== 'undefined';
var postMessageSupport = typeof window !== 'undefined' && typeof window.postMessage !== 'undefined';

if (!isNode && (!arrayIndexOfSupport || !postMessageSupport)) {
  throw new Error('Sorry, the Vimeo Player API is not available in this browser.');
}

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

/*!
 * weakmap-polyfill v2.0.4 - ECMAScript6 WeakMap polyfill
 * https://github.com/polygonplanet/weakmap-polyfill
 * Copyright (c) 2015-2021 polygonplanet <polygon.planet.aqua@gmail.com>
 * @license MIT
 */
(function (self) {

  if (self.WeakMap) {
    return;
  }

  var hasOwnProperty = Object.prototype.hasOwnProperty;

  var hasDefine = Object.defineProperty && function () {
    try {
      // Avoid IE8's broken Object.defineProperty
      return Object.defineProperty({}, 'x', {
        value: 1
      }).x === 1;
    } catch (e) {}
  }();

  var defineProperty = function (object, name, value) {
    if (hasDefine) {
      Object.defineProperty(object, name, {
        configurable: true,
        writable: true,
        value: value
      });
    } else {
      object[name] = value;
    }
  };

  self.WeakMap = function () {
    // ECMA-262 23.3 WeakMap Objects
    function WeakMap() {
      if (this === void 0) {
        throw new TypeError("Constructor WeakMap requires 'new'");
      }

      defineProperty(this, '_id', genId('_WeakMap')); // ECMA-262 23.3.1.1 WeakMap([iterable])

      if (arguments.length > 0) {
        // Currently, WeakMap `iterable` argument is not supported
        throw new TypeError('WeakMap iterable is not supported');
      }
    } // ECMA-262 23.3.3.2 WeakMap.prototype.delete(key)


    defineProperty(WeakMap.prototype, 'delete', function (key) {
      checkInstance(this, 'delete');

      if (!isObject(key)) {
        return false;
      }

      var entry = key[this._id];

      if (entry && entry[0] === key) {
        delete key[this._id];
        return true;
      }

      return false;
    }); // ECMA-262 23.3.3.3 WeakMap.prototype.get(key)

    defineProperty(WeakMap.prototype, 'get', function (key) {
      checkInstance(this, 'get');

      if (!isObject(key)) {
        return void 0;
      }

      var entry = key[this._id];

      if (entry && entry[0] === key) {
        return entry[1];
      }

      return void 0;
    }); // ECMA-262 23.3.3.4 WeakMap.prototype.has(key)

    defineProperty(WeakMap.prototype, 'has', function (key) {
      checkInstance(this, 'has');

      if (!isObject(key)) {
        return false;
      }

      var entry = key[this._id];

      if (entry && entry[0] === key) {
        return true;
      }

      return false;
    }); // ECMA-262 23.3.3.5 WeakMap.prototype.set(key, value)

    defineProperty(WeakMap.prototype, 'set', function (key, value) {
      checkInstance(this, 'set');

      if (!isObject(key)) {
        throw new TypeError('Invalid value used as weak map key');
      }

      var entry = key[this._id];

      if (entry && entry[0] === key) {
        entry[1] = value;
        return this;
      }

      defineProperty(key, this._id, [key, value]);
      return this;
    });

    function checkInstance(x, methodName) {
      if (!isObject(x) || !hasOwnProperty.call(x, '_id')) {
        throw new TypeError(methodName + ' method called on incompatible receiver ' + typeof x);
      }
    }

    function genId(prefix) {
      return prefix + '_' + rand() + '.' + rand();
    }

    function rand() {
      return Math.random().toString().substring(2);
    }

    defineProperty(WeakMap, '_polyfill', true);
    return WeakMap;
  }();

  function isObject(x) {
    return Object(x) === x;
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : typeof commonjsGlobal !== 'undefined' ? commonjsGlobal : commonjsGlobal);

var npo_src = createCommonjsModule(function (module) {
/*! Native Promise Only
    v0.8.1 (c) Kyle Simpson
    MIT License: http://getify.mit-license.org
*/
(function UMD(name, context, definition) {
  // special form of UMD for polyfilling across evironments
  context[name] = context[name] || definition();

  if ( module.exports) {
    module.exports = context[name];
  }
})("Promise", typeof commonjsGlobal != "undefined" ? commonjsGlobal : commonjsGlobal, function DEF() {

  var builtInProp,
      cycle,
      scheduling_queue,
      ToString = Object.prototype.toString,
      timer = typeof setImmediate != "undefined" ? function timer(fn) {
    return setImmediate(fn);
  } : setTimeout; // dammit, IE8.

  try {
    Object.defineProperty({}, "x", {});

    builtInProp = function builtInProp(obj, name, val, config) {
      return Object.defineProperty(obj, name, {
        value: val,
        writable: true,
        configurable: config !== false
      });
    };
  } catch (err) {
    builtInProp = function builtInProp(obj, name, val) {
      obj[name] = val;
      return obj;
    };
  } // Note: using a queue instead of array for efficiency


  scheduling_queue = function Queue() {
    var first, last, item;

    function Item(fn, self) {
      this.fn = fn;
      this.self = self;
      this.next = void 0;
    }

    return {
      add: function add(fn, self) {
        item = new Item(fn, self);

        if (last) {
          last.next = item;
        } else {
          first = item;
        }

        last = item;
        item = void 0;
      },
      drain: function drain() {
        var f = first;
        first = last = cycle = void 0;

        while (f) {
          f.fn.call(f.self);
          f = f.next;
        }
      }
    };
  }();

  function schedule(fn, self) {
    scheduling_queue.add(fn, self);

    if (!cycle) {
      cycle = timer(scheduling_queue.drain);
    }
  } // promise duck typing


  function isThenable(o) {
    var _then,
        o_type = typeof o;

    if (o != null && (o_type == "object" || o_type == "function")) {
      _then = o.then;
    }

    return typeof _then == "function" ? _then : false;
  }

  function notify() {
    for (var i = 0; i < this.chain.length; i++) {
      notifyIsolated(this, this.state === 1 ? this.chain[i].success : this.chain[i].failure, this.chain[i]);
    }

    this.chain.length = 0;
  } // NOTE: This is a separate function to isolate
  // the `try..catch` so that other code can be
  // optimized better


  function notifyIsolated(self, cb, chain) {
    var ret, _then;

    try {
      if (cb === false) {
        chain.reject(self.msg);
      } else {
        if (cb === true) {
          ret = self.msg;
        } else {
          ret = cb.call(void 0, self.msg);
        }

        if (ret === chain.promise) {
          chain.reject(TypeError("Promise-chain cycle"));
        } else if (_then = isThenable(ret)) {
          _then.call(ret, chain.resolve, chain.reject);
        } else {
          chain.resolve(ret);
        }
      }
    } catch (err) {
      chain.reject(err);
    }
  }

  function resolve(msg) {
    var _then,
        self = this; // already triggered?


    if (self.triggered) {
      return;
    }

    self.triggered = true; // unwrap

    if (self.def) {
      self = self.def;
    }

    try {
      if (_then = isThenable(msg)) {
        schedule(function () {
          var def_wrapper = new MakeDefWrapper(self);

          try {
            _then.call(msg, function $resolve$() {
              resolve.apply(def_wrapper, arguments);
            }, function $reject$() {
              reject.apply(def_wrapper, arguments);
            });
          } catch (err) {
            reject.call(def_wrapper, err);
          }
        });
      } else {
        self.msg = msg;
        self.state = 1;

        if (self.chain.length > 0) {
          schedule(notify, self);
        }
      }
    } catch (err) {
      reject.call(new MakeDefWrapper(self), err);
    }
  }

  function reject(msg) {
    var self = this; // already triggered?

    if (self.triggered) {
      return;
    }

    self.triggered = true; // unwrap

    if (self.def) {
      self = self.def;
    }

    self.msg = msg;
    self.state = 2;

    if (self.chain.length > 0) {
      schedule(notify, self);
    }
  }

  function iteratePromises(Constructor, arr, resolver, rejecter) {
    for (var idx = 0; idx < arr.length; idx++) {
      (function IIFE(idx) {
        Constructor.resolve(arr[idx]).then(function $resolver$(msg) {
          resolver(idx, msg);
        }, rejecter);
      })(idx);
    }
  }

  function MakeDefWrapper(self) {
    this.def = self;
    this.triggered = false;
  }

  function MakeDef(self) {
    this.promise = self;
    this.state = 0;
    this.triggered = false;
    this.chain = [];
    this.msg = void 0;
  }

  function Promise(executor) {
    if (typeof executor != "function") {
      throw TypeError("Not a function");
    }

    if (this.__NPO__ !== 0) {
      throw TypeError("Not a promise");
    } // instance shadowing the inherited "brand"
    // to signal an already "initialized" promise


    this.__NPO__ = 1;
    var def = new MakeDef(this);

    this["then"] = function then(success, failure) {
      var o = {
        success: typeof success == "function" ? success : true,
        failure: typeof failure == "function" ? failure : false
      }; // Note: `then(..)` itself can be borrowed to be used against
      // a different promise constructor for making the chained promise,
      // by substituting a different `this` binding.

      o.promise = new this.constructor(function extractChain(resolve, reject) {
        if (typeof resolve != "function" || typeof reject != "function") {
          throw TypeError("Not a function");
        }

        o.resolve = resolve;
        o.reject = reject;
      });
      def.chain.push(o);

      if (def.state !== 0) {
        schedule(notify, def);
      }

      return o.promise;
    };

    this["catch"] = function $catch$(failure) {
      return this.then(void 0, failure);
    };

    try {
      executor.call(void 0, function publicResolve(msg) {
        resolve.call(def, msg);
      }, function publicReject(msg) {
        reject.call(def, msg);
      });
    } catch (err) {
      reject.call(def, err);
    }
  }

  var PromisePrototype = builtInProp({}, "constructor", Promise,
  /*configurable=*/
  false); // Note: Android 4 cannot use `Object.defineProperty(..)` here

  Promise.prototype = PromisePrototype; // built-in "brand" to signal an "uninitialized" promise

  builtInProp(PromisePrototype, "__NPO__", 0,
  /*configurable=*/
  false);
  builtInProp(Promise, "resolve", function Promise$resolve(msg) {
    var Constructor = this; // spec mandated checks
    // note: best "isPromise" check that's practical for now

    if (msg && typeof msg == "object" && msg.__NPO__ === 1) {
      return msg;
    }

    return new Constructor(function executor(resolve, reject) {
      if (typeof resolve != "function" || typeof reject != "function") {
        throw TypeError("Not a function");
      }

      resolve(msg);
    });
  });
  builtInProp(Promise, "reject", function Promise$reject(msg) {
    return new this(function executor(resolve, reject) {
      if (typeof resolve != "function" || typeof reject != "function") {
        throw TypeError("Not a function");
      }

      reject(msg);
    });
  });
  builtInProp(Promise, "all", function Promise$all(arr) {
    var Constructor = this; // spec mandated checks

    if (ToString.call(arr) != "[object Array]") {
      return Constructor.reject(TypeError("Not an array"));
    }

    if (arr.length === 0) {
      return Constructor.resolve([]);
    }

    return new Constructor(function executor(resolve, reject) {
      if (typeof resolve != "function" || typeof reject != "function") {
        throw TypeError("Not a function");
      }

      var len = arr.length,
          msgs = Array(len),
          count = 0;
      iteratePromises(Constructor, arr, function resolver(idx, msg) {
        msgs[idx] = msg;

        if (++count === len) {
          resolve(msgs);
        }
      }, reject);
    });
  });
  builtInProp(Promise, "race", function Promise$race(arr) {
    var Constructor = this; // spec mandated checks

    if (ToString.call(arr) != "[object Array]") {
      return Constructor.reject(TypeError("Not an array"));
    }

    return new Constructor(function executor(resolve, reject) {
      if (typeof resolve != "function" || typeof reject != "function") {
        throw TypeError("Not a function");
      }

      iteratePromises(Constructor, arr, function resolver(idx, msg) {
        resolve(msg);
      }, reject);
    });
  });
  return Promise;
});
});

/**
 * @module lib/callbacks
 */
var callbackMap = new WeakMap();
/**
 * Store a callback for a method or event for a player.
 *
 * @param {Player} player The player object.
 * @param {string} name The method or event name.
 * @param {(function(this:Player, *): void|{resolve: function, reject: function})} callback
 *        The callback to call or an object with resolve and reject functions for a promise.
 * @return {void}
 */

function storeCallback(player, name, callback) {
  var playerCallbacks = callbackMap.get(player.element) || {};

  if (!(name in playerCallbacks)) {
    playerCallbacks[name] = [];
  }

  playerCallbacks[name].push(callback);
  callbackMap.set(player.element, playerCallbacks);
}
/**
 * Get the callbacks for a player and event or method.
 *
 * @param {Player} player The player object.
 * @param {string} name The method or event name
 * @return {function[]}
 */

function getCallbacks(player, name) {
  var playerCallbacks = callbackMap.get(player.element) || {};
  return playerCallbacks[name] || [];
}
/**
 * Remove a stored callback for a method or event for a player.
 *
 * @param {Player} player The player object.
 * @param {string} name The method or event name
 * @param {function} [callback] The specific callback to remove.
 * @return {boolean} Was this the last callback?
 */

function removeCallback(player, name, callback) {
  var playerCallbacks = callbackMap.get(player.element) || {};

  if (!playerCallbacks[name]) {
    return true;
  } // If no callback is passed, remove all callbacks for the event


  if (!callback) {
    playerCallbacks[name] = [];
    callbackMap.set(player.element, playerCallbacks);
    return true;
  }

  var index = playerCallbacks[name].indexOf(callback);

  if (index !== -1) {
    playerCallbacks[name].splice(index, 1);
  }

  callbackMap.set(player.element, playerCallbacks);
  return playerCallbacks[name] && playerCallbacks[name].length === 0;
}
/**
 * Return the first stored callback for a player and event or method.
 *
 * @param {Player} player The player object.
 * @param {string} name The method or event name.
 * @return {function} The callback, or false if there were none
 */

function shiftCallbacks(player, name) {
  var playerCallbacks = getCallbacks(player, name);

  if (playerCallbacks.length < 1) {
    return false;
  }

  var callback = playerCallbacks.shift();
  removeCallback(player, name, callback);
  return callback;
}
/**
 * Move callbacks associated with an element to another element.
 *
 * @param {HTMLElement} oldElement The old element.
 * @param {HTMLElement} newElement The new element.
 * @return {void}
 */

function swapCallbacks(oldElement, newElement) {
  var playerCallbacks = callbackMap.get(oldElement);
  callbackMap.set(newElement, playerCallbacks);
  callbackMap.delete(oldElement);
}

/**
 * @module lib/postmessage
 */
/**
 * Parse a message received from postMessage.
 *
 * @param {*} data The data received from postMessage.
 * @return {object}
 */

function parseMessageData(data) {
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data);
    } catch (error) {
      // If the message cannot be parsed, throw the error as a warning
      console.warn(error);
      return {};
    }
  }

  return data;
}
/**
 * Post a message to the specified target.
 *
 * @param {Player} player The player object to use.
 * @param {string} method The API method to call.
 * @param {object} params The parameters to send to the player.
 * @return {void}
 */

function postMessage(player, method, params) {
  if (!player.element.contentWindow || !player.element.contentWindow.postMessage) {
    return;
  }

  var message = {
    method: method
  };

  if (params !== undefined) {
    message.value = params;
  } // IE 8 and 9 do not support passing messages, so stringify them


  var ieVersion = parseFloat(navigator.userAgent.toLowerCase().replace(/^.*msie (\d+).*$/, '$1'));

  if (ieVersion >= 8 && ieVersion < 10) {
    message = JSON.stringify(message);
  }

  player.element.contentWindow.postMessage(message, player.origin);
}
/**
 * Parse the data received from a message event.
 *
 * @param {Player} player The player that received the message.
 * @param {(Object|string)} data The message data. Strings will be parsed into JSON.
 * @return {void}
 */

function processData(player, data) {
  data = parseMessageData(data);
  var callbacks = [];
  var param;

  if (data.event) {
    if (data.event === 'error') {
      var promises = getCallbacks(player, data.data.method);
      promises.forEach(function (promise) {
        var error = new Error(data.data.message);
        error.name = data.data.name;
        promise.reject(error);
        removeCallback(player, data.data.method, promise);
      });
    }

    callbacks = getCallbacks(player, "event:".concat(data.event));
    param = data.data;
  } else if (data.method) {
    var callback = shiftCallbacks(player, data.method);

    if (callback) {
      callbacks.push(callback);
      param = data.value;
    }
  }

  callbacks.forEach(function (callback) {
    try {
      if (typeof callback === 'function') {
        callback.call(player, param);
        return;
      }

      callback.resolve(param);
    } catch (e) {// empty
    }
  });
}

/**
 * @module lib/embed
 */
var oEmbedParameters = ['autopause', 'autoplay', 'background', 'byline', 'color', 'controls', 'dnt', 'height', 'id', 'interactive_params', 'keyboard', 'loop', 'maxheight', 'maxwidth', 'muted', 'playsinline', 'portrait', 'responsive', 'speed', 'texttrack', 'title', 'transparent', 'url', 'width'];
/**
 * Get the 'data-vimeo'-prefixed attributes from an element as an object.
 *
 * @param {HTMLElement} element The element.
 * @param {Object} [defaults={}] The default values to use.
 * @return {Object<string, string>}
 */

function getOEmbedParameters(element) {
  var defaults = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return oEmbedParameters.reduce(function (params, param) {
    var value = element.getAttribute("data-vimeo-".concat(param));

    if (value || value === '') {
      params[param] = value === '' ? 1 : value;
    }

    return params;
  }, defaults);
}
/**
 * Create an embed from oEmbed data inside an element.
 *
 * @param {object} data The oEmbed data.
 * @param {HTMLElement} element The element to put the iframe in.
 * @return {HTMLIFrameElement} The iframe embed.
 */

function createEmbed(_ref, element) {
  var html = _ref.html;

  if (!element) {
    throw new TypeError('An element must be provided');
  }

  if (element.getAttribute('data-vimeo-initialized') !== null) {
    return element.querySelector('iframe');
  }

  var div = document.createElement('div');
  div.innerHTML = html;
  element.appendChild(div.firstChild);
  element.setAttribute('data-vimeo-initialized', 'true');
  return element.querySelector('iframe');
}
/**
 * Make an oEmbed call for the specified URL.
 *
 * @param {string} videoUrl The vimeo.com url for the video.
 * @param {Object} [params] Parameters to pass to oEmbed.
 * @param {HTMLElement} element The element.
 * @return {Promise}
 */

function getOEmbedData(videoUrl) {
  var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var element = arguments.length > 2 ? arguments[2] : undefined;
  return new Promise(function (resolve, reject) {
    if (!isVimeoUrl(videoUrl)) {
      throw new TypeError("\u201C".concat(videoUrl, "\u201D is not a vimeo.com url."));
    }

    var url = "https://vimeo.com/api/oembed.json?url=".concat(encodeURIComponent(videoUrl));

    for (var param in params) {
      if (params.hasOwnProperty(param)) {
        url += "&".concat(param, "=").concat(encodeURIComponent(params[param]));
      }
    }

    var xhr = 'XDomainRequest' in window ? new XDomainRequest() : new XMLHttpRequest();
    xhr.open('GET', url, true);

    xhr.onload = function () {
      if (xhr.status === 404) {
        reject(new Error("\u201C".concat(videoUrl, "\u201D was not found.")));
        return;
      }

      if (xhr.status === 403) {
        reject(new Error("\u201C".concat(videoUrl, "\u201D is not embeddable.")));
        return;
      }

      try {
        var json = JSON.parse(xhr.responseText); // Check api response for 403 on oembed

        if (json.domain_status_code === 403) {
          // We still want to create the embed to give users visual feedback
          createEmbed(json, element);
          reject(new Error("\u201C".concat(videoUrl, "\u201D is not embeddable.")));
          return;
        }

        resolve(json);
      } catch (error) {
        reject(error);
      }
    };

    xhr.onerror = function () {
      var status = xhr.status ? " (".concat(xhr.status, ")") : '';
      reject(new Error("There was an error fetching the embed code from Vimeo".concat(status, ".")));
    };

    xhr.send();
  });
}
/**
 * Initialize all embeds within a specific element
 *
 * @param {HTMLElement} [parent=document] The parent element.
 * @return {void}
 */

function initializeEmbeds() {
  var parent = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document;
  var elements = [].slice.call(parent.querySelectorAll('[data-vimeo-id], [data-vimeo-url]'));

  var handleError = function handleError(error) {
    if ('console' in window && console.error) {
      console.error("There was an error creating an embed: ".concat(error));
    }
  };

  elements.forEach(function (element) {
    try {
      // Skip any that have data-vimeo-defer
      if (element.getAttribute('data-vimeo-defer') !== null) {
        return;
      }

      var params = getOEmbedParameters(element);
      var url = getVimeoUrl(params);
      getOEmbedData(url, params, element).then(function (data) {
        return createEmbed(data, element);
      }).catch(handleError);
    } catch (error) {
      handleError(error);
    }
  });
}
/**
 * Resize embeds when messaged by the player.
 *
 * @param {HTMLElement} [parent=document] The parent element.
 * @return {void}
 */

function resizeEmbeds() {
  var parent = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document;

  // Prevent execution if users include the player.js script multiple times.
  if (window.VimeoPlayerResizeEmbeds_) {
    return;
  }

  window.VimeoPlayerResizeEmbeds_ = true;

  var onMessage = function onMessage(event) {
    if (!isVimeoUrl(event.origin)) {
      return;
    } // 'spacechange' is fired only on embeds with cards


    if (!event.data || event.data.event !== 'spacechange') {
      return;
    }

    var iframes = parent.querySelectorAll('iframe');

    for (var i = 0; i < iframes.length; i++) {
      if (iframes[i].contentWindow !== event.source) {
        continue;
      } // Change padding-bottom of the enclosing div to accommodate
      // card carousel without distorting aspect ratio


      var space = iframes[i].parentElement;
      space.style.paddingBottom = "".concat(event.data.data[0].bottom, "px");
      break;
    }
  };

  window.addEventListener('message', onMessage);
}
/**
 * Add chapters to existing metadata for Google SEO
 *
 * @param {HTMLElement} [parent=document] The parent element.
 * @return {void}
 */

function initAppendVideoMetadata() {
  var parent = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document;

  //  Prevent execution if users include the player.js script multiple times.
  if (window.VimeoSeoMetadataAppended) {
    return;
  }

  window.VimeoSeoMetadataAppended = true;

  var onMessage = function onMessage(event) {
    if (!isVimeoUrl(event.origin)) {
      return;
    }

    var data = parseMessageData(event.data);

    if (!data || data.event !== 'ready') {
      return;
    }

    var iframes = parent.querySelectorAll('iframe');

    for (var i = 0; i < iframes.length; i++) {
      var iframe = iframes[i]; // Initiate appendVideoMetadata if iframe is a Vimeo embed

      var isValidMessageSource = iframe.contentWindow === event.source;

      if (isVimeoEmbed(iframe.src) && isValidMessageSource) {
        var player = new Player(iframe);
        player.callMethod('appendVideoMetadata', window.location.href);
      }
    }
  };

  window.addEventListener('message', onMessage);
}
/**
 * Seek to time indicated by vimeo_t query parameter if present in URL
 *
 * @param {HTMLElement} [parent=document] The parent element.
 * @return {void}
 */

function checkUrlTimeParam() {
  var parent = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document;

  //  Prevent execution if users include the player.js script multiple times.
  if (window.VimeoCheckedUrlTimeParam) {
    return;
  }

  window.VimeoCheckedUrlTimeParam = true;

  var handleError = function handleError(error) {
    if ('console' in window && console.error) {
      console.error("There was an error getting video Id: ".concat(error));
    }
  };

  var onMessage = function onMessage(event) {
    if (!isVimeoUrl(event.origin)) {
      return;
    }

    var data = parseMessageData(event.data);

    if (!data || data.event !== 'ready') {
      return;
    }

    var iframes = parent.querySelectorAll('iframe');

    for (var i = 0; i < iframes.length; i++) {
      var iframe = iframes[i];
      var isValidMessageSource = iframe.contentWindow === event.source;

      if (isVimeoEmbed(iframe.src) && isValidMessageSource) {
        (function () {
          var player = new Player(iframe);
          player.getVideoId().then(function (videoId) {
            var matches = new RegExp("[?&]vimeo_t_".concat(videoId, "=([^&#]*)")).exec(window.location.href);

            if (matches && matches[1]) {
              var sec = decodeURI(matches[1]);
              player.setCurrentTime(sec);
            }

            return;
          }).catch(handleError);
        })();
      }
    }
  };

  window.addEventListener('message', onMessage);
}

/* MIT License

Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
Terms */
function initializeScreenfull() {
  var fn = function () {
    var val;
    var fnMap = [['requestFullscreen', 'exitFullscreen', 'fullscreenElement', 'fullscreenEnabled', 'fullscreenchange', 'fullscreenerror'], // New WebKit
    ['webkitRequestFullscreen', 'webkitExitFullscreen', 'webkitFullscreenElement', 'webkitFullscreenEnabled', 'webkitfullscreenchange', 'webkitfullscreenerror'], // Old WebKit
    ['webkitRequestFullScreen', 'webkitCancelFullScreen', 'webkitCurrentFullScreenElement', 'webkitCancelFullScreen', 'webkitfullscreenchange', 'webkitfullscreenerror'], ['mozRequestFullScreen', 'mozCancelFullScreen', 'mozFullScreenElement', 'mozFullScreenEnabled', 'mozfullscreenchange', 'mozfullscreenerror'], ['msRequestFullscreen', 'msExitFullscreen', 'msFullscreenElement', 'msFullscreenEnabled', 'MSFullscreenChange', 'MSFullscreenError']];
    var i = 0;
    var l = fnMap.length;
    var ret = {};

    for (; i < l; i++) {
      val = fnMap[i];

      if (val && val[1] in document) {
        for (i = 0; i < val.length; i++) {
          ret[fnMap[0][i]] = val[i];
        }

        return ret;
      }
    }

    return false;
  }();

  var eventNameMap = {
    fullscreenchange: fn.fullscreenchange,
    fullscreenerror: fn.fullscreenerror
  };
  var screenfull = {
    request: function request(element) {
      return new Promise(function (resolve, reject) {
        var onFullScreenEntered = function onFullScreenEntered() {
          screenfull.off('fullscreenchange', onFullScreenEntered);
          resolve();
        };

        screenfull.on('fullscreenchange', onFullScreenEntered);
        element = element || document.documentElement;
        var returnPromise = element[fn.requestFullscreen]();

        if (returnPromise instanceof Promise) {
          returnPromise.then(onFullScreenEntered).catch(reject);
        }
      });
    },
    exit: function exit() {
      return new Promise(function (resolve, reject) {
        if (!screenfull.isFullscreen) {
          resolve();
          return;
        }

        var onFullScreenExit = function onFullScreenExit() {
          screenfull.off('fullscreenchange', onFullScreenExit);
          resolve();
        };

        screenfull.on('fullscreenchange', onFullScreenExit);
        var returnPromise = document[fn.exitFullscreen]();

        if (returnPromise instanceof Promise) {
          returnPromise.then(onFullScreenExit).catch(reject);
        }
      });
    },
    on: function on(event, callback) {
      var eventName = eventNameMap[event];

      if (eventName) {
        document.addEventListener(eventName, callback);
      }
    },
    off: function off(event, callback) {
      var eventName = eventNameMap[event];

      if (eventName) {
        document.removeEventListener(eventName, callback);
      }
    }
  };
  Object.defineProperties(screenfull, {
    isFullscreen: {
      get: function get() {
        return Boolean(document[fn.fullscreenElement]);
      }
    },
    element: {
      enumerable: true,
      get: function get() {
        return document[fn.fullscreenElement];
      }
    },
    isEnabled: {
      enumerable: true,
      get: function get() {
        // Coerce to boolean in case of old WebKit
        return Boolean(document[fn.fullscreenEnabled]);
      }
    }
  });
  return screenfull;
}

var playerMap = new WeakMap();
var readyMap = new WeakMap();
var screenfull = {};

var Player = /*#__PURE__*/function () {
  /**
   * Create a Player.
   *
   * @param {(HTMLIFrameElement|HTMLElement|string|jQuery)} element A reference to the Vimeo
   *        player iframe, and id, or a jQuery object.
   * @param {object} [options] oEmbed parameters to use when creating an embed in the element.
   * @return {Player}
   */
  function Player(element) {
    var _this = this;

    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Player);

    /* global jQuery */
    if (window.jQuery && element instanceof jQuery) {
      if (element.length > 1 && window.console && console.warn) {
        console.warn('A jQuery object with multiple elements was passed, using the first element.');
      }

      element = element[0];
    } // Find an element by ID


    if (typeof document !== 'undefined' && typeof element === 'string') {
      element = document.getElementById(element);
    } // Not an element!


    if (!isDomElement(element)) {
      throw new TypeError('You must pass either a valid element or a valid id.');
    } // Already initialized an embed in this div, so grab the iframe


    if (element.nodeName !== 'IFRAME') {
      var iframe = element.querySelector('iframe');

      if (iframe) {
        element = iframe;
      }
    } // iframe url is not a Vimeo url


    if (element.nodeName === 'IFRAME' && !isVimeoUrl(element.getAttribute('src') || '')) {
      throw new Error('The player element passed isn’t a Vimeo embed.');
    } // If there is already a player object in the map, return that


    if (playerMap.has(element)) {
      return playerMap.get(element);
    }

    this._window = element.ownerDocument.defaultView;
    this.element = element;
    this.origin = '*';
    var readyPromise = new npo_src(function (resolve, reject) {
      _this._onMessage = function (event) {
        if (!isVimeoUrl(event.origin) || _this.element.contentWindow !== event.source) {
          return;
        }

        if (_this.origin === '*') {
          _this.origin = event.origin;
        }

        var data = parseMessageData(event.data);
        var isError = data && data.event === 'error';
        var isReadyError = isError && data.data && data.data.method === 'ready';

        if (isReadyError) {
          var error = new Error(data.data.message);
          error.name = data.data.name;
          reject(error);
          return;
        }

        var isReadyEvent = data && data.event === 'ready';
        var isPingResponse = data && data.method === 'ping';

        if (isReadyEvent || isPingResponse) {
          _this.element.setAttribute('data-ready', 'true');

          resolve();
          return;
        }

        processData(_this, data);
      };

      _this._window.addEventListener('message', _this._onMessage);

      if (_this.element.nodeName !== 'IFRAME') {
        var params = getOEmbedParameters(element, options);
        var url = getVimeoUrl(params);
        getOEmbedData(url, params, element).then(function (data) {
          var iframe = createEmbed(data, element); // Overwrite element with the new iframe,
          // but store reference to the original element

          _this.element = iframe;
          _this._originalElement = element;
          swapCallbacks(element, iframe);
          playerMap.set(_this.element, _this);
          return data;
        }).catch(reject);
      }
    }); // Store a copy of this Player in the map

    readyMap.set(this, readyPromise);
    playerMap.set(this.element, this); // Send a ping to the iframe so the ready promise will be resolved if
    // the player is already ready.

    if (this.element.nodeName === 'IFRAME') {
      postMessage(this, 'ping');
    }

    if (screenfull.isEnabled) {
      var exitFullscreen = function exitFullscreen() {
        return screenfull.exit();
      };

      this.fullscreenchangeHandler = function () {
        if (screenfull.isFullscreen) {
          storeCallback(_this, 'event:exitFullscreen', exitFullscreen);
        } else {
          removeCallback(_this, 'event:exitFullscreen', exitFullscreen);
        } // eslint-disable-next-line


        _this.ready().then(function () {
          postMessage(_this, 'fullscreenchange', screenfull.isFullscreen);
        });
      };

      screenfull.on('fullscreenchange', this.fullscreenchangeHandler);
    }

    return this;
  }
  /**
   * Get a promise for a method.
   *
   * @param {string} name The API method to call.
   * @param {Object} [args={}] Arguments to send via postMessage.
   * @return {Promise}
   */


  _createClass(Player, [{
    key: "callMethod",
    value: function callMethod(name) {
      var _this2 = this;

      var args = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return new npo_src(function (resolve, reject) {
        // We are storing the resolve/reject handlers to call later, so we
        // can’t return here.
        // eslint-disable-next-line promise/always-return
        return _this2.ready().then(function () {
          storeCallback(_this2, name, {
            resolve: resolve,
            reject: reject
          });
          postMessage(_this2, name, args);
        }).catch(reject);
      });
    }
    /**
     * Get a promise for the value of a player property.
     *
     * @param {string} name The property name
     * @return {Promise}
     */

  }, {
    key: "get",
    value: function get(name) {
      var _this3 = this;

      return new npo_src(function (resolve, reject) {
        name = getMethodName(name, 'get'); // We are storing the resolve/reject handlers to call later, so we
        // can’t return here.
        // eslint-disable-next-line promise/always-return

        return _this3.ready().then(function () {
          storeCallback(_this3, name, {
            resolve: resolve,
            reject: reject
          });
          postMessage(_this3, name);
        }).catch(reject);
      });
    }
    /**
     * Get a promise for setting the value of a player property.
     *
     * @param {string} name The API method to call.
     * @param {mixed} value The value to set.
     * @return {Promise}
     */

  }, {
    key: "set",
    value: function set(name, value) {
      var _this4 = this;

      return new npo_src(function (resolve, reject) {
        name = getMethodName(name, 'set');

        if (value === undefined || value === null) {
          throw new TypeError('There must be a value to set.');
        } // We are storing the resolve/reject handlers to call later, so we
        // can’t return here.
        // eslint-disable-next-line promise/always-return


        return _this4.ready().then(function () {
          storeCallback(_this4, name, {
            resolve: resolve,
            reject: reject
          });
          postMessage(_this4, name, value);
        }).catch(reject);
      });
    }
    /**
     * Add an event listener for the specified event. Will call the
     * callback with a single parameter, `data`, that contains the data for
     * that event.
     *
     * @param {string} eventName The name of the event.
     * @param {function(*)} callback The function to call when the event fires.
     * @return {void}
     */

  }, {
    key: "on",
    value: function on(eventName, callback) {
      if (!eventName) {
        throw new TypeError('You must pass an event name.');
      }

      if (!callback) {
        throw new TypeError('You must pass a callback function.');
      }

      if (typeof callback !== 'function') {
        throw new TypeError('The callback must be a function.');
      }

      var callbacks = getCallbacks(this, "event:".concat(eventName));

      if (callbacks.length === 0) {
        this.callMethod('addEventListener', eventName).catch(function () {// Ignore the error. There will be an error event fired that
          // will trigger the error callback if they are listening.
        });
      }

      storeCallback(this, "event:".concat(eventName), callback);
    }
    /**
     * Remove an event listener for the specified event. Will remove all
     * listeners for that event if a `callback` isn’t passed, or only that
     * specific callback if it is passed.
     *
     * @param {string} eventName The name of the event.
     * @param {function} [callback] The specific callback to remove.
     * @return {void}
     */

  }, {
    key: "off",
    value: function off(eventName, callback) {
      if (!eventName) {
        throw new TypeError('You must pass an event name.');
      }

      if (callback && typeof callback !== 'function') {
        throw new TypeError('The callback must be a function.');
      }

      var lastCallback = removeCallback(this, "event:".concat(eventName), callback); // If there are no callbacks left, remove the listener

      if (lastCallback) {
        this.callMethod('removeEventListener', eventName).catch(function (e) {// Ignore the error. There will be an error event fired that
          // will trigger the error callback if they are listening.
        });
      }
    }
    /**
     * A promise to load a new video.
     *
     * @promise LoadVideoPromise
     * @fulfill {number} The video with this id or url successfully loaded.
     * @reject {TypeError} The id was not a number.
     */

    /**
     * Load a new video into this embed. The promise will be resolved if
     * the video is successfully loaded, or it will be rejected if it could
     * not be loaded.
     *
     * @param {number|string|object} options The id of the video, the url of the video, or an object with embed options.
     * @return {LoadVideoPromise}
     */

  }, {
    key: "loadVideo",
    value: function loadVideo(options) {
      return this.callMethod('loadVideo', options);
    }
    /**
     * A promise to perform an action when the Player is ready.
     *
     * @todo document errors
     * @promise LoadVideoPromise
     * @fulfill {void}
     */

    /**
     * Trigger a function when the player iframe has initialized. You do not
     * need to wait for `ready` to trigger to begin adding event listeners
     * or calling other methods.
     *
     * @return {ReadyPromise}
     */

  }, {
    key: "ready",
    value: function ready() {
      var readyPromise = readyMap.get(this) || new npo_src(function (resolve, reject) {
        reject(new Error('Unknown player. Probably unloaded.'));
      });
      return npo_src.resolve(readyPromise);
    }
    /**
     * A promise to add a cue point to the player.
     *
     * @promise AddCuePointPromise
     * @fulfill {string} The id of the cue point to use for removeCuePoint.
     * @reject {RangeError} the time was less than 0 or greater than the
     *         video’s duration.
     * @reject {UnsupportedError} Cue points are not supported with the current
     *         player or browser.
     */

    /**
     * Add a cue point to the player.
     *
     * @param {number} time The time for the cue point.
     * @param {object} [data] Arbitrary data to be returned with the cue point.
     * @return {AddCuePointPromise}
     */

  }, {
    key: "addCuePoint",
    value: function addCuePoint(time) {
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return this.callMethod('addCuePoint', {
        time: time,
        data: data
      });
    }
    /**
     * A promise to remove a cue point from the player.
     *
     * @promise AddCuePointPromise
     * @fulfill {string} The id of the cue point that was removed.
     * @reject {InvalidCuePoint} The cue point with the specified id was not
     *         found.
     * @reject {UnsupportedError} Cue points are not supported with the current
     *         player or browser.
     */

    /**
     * Remove a cue point from the video.
     *
     * @param {string} id The id of the cue point to remove.
     * @return {RemoveCuePointPromise}
     */

  }, {
    key: "removeCuePoint",
    value: function removeCuePoint(id) {
      return this.callMethod('removeCuePoint', id);
    }
    /**
     * A representation of a text track on a video.
     *
     * @typedef {Object} VimeoTextTrack
     * @property {string} language The ISO language code.
     * @property {string} kind The kind of track it is (captions or subtitles).
     * @property {string} label The human‐readable label for the track.
     */

    /**
     * A promise to enable a text track.
     *
     * @promise EnableTextTrackPromise
     * @fulfill {VimeoTextTrack} The text track that was enabled.
     * @reject {InvalidTrackLanguageError} No track was available with the
     *         specified language.
     * @reject {InvalidTrackError} No track was available with the specified
     *         language and kind.
     */

    /**
     * Enable the text track with the specified language, and optionally the
     * specified kind (captions or subtitles).
     *
     * When set via the API, the track language will not change the viewer’s
     * stored preference.
     *
     * @param {string} language The two‐letter language code.
     * @param {string} [kind] The kind of track to enable (captions or subtitles).
     * @return {EnableTextTrackPromise}
     */

  }, {
    key: "enableTextTrack",
    value: function enableTextTrack(language, kind) {
      if (!language) {
        throw new TypeError('You must pass a language.');
      }

      return this.callMethod('enableTextTrack', {
        language: language,
        kind: kind
      });
    }
    /**
     * A promise to disable the active text track.
     *
     * @promise DisableTextTrackPromise
     * @fulfill {void} The track was disabled.
     */

    /**
     * Disable the currently-active text track.
     *
     * @return {DisableTextTrackPromise}
     */

  }, {
    key: "disableTextTrack",
    value: function disableTextTrack() {
      return this.callMethod('disableTextTrack');
    }
    /**
     * A promise to pause the video.
     *
     * @promise PausePromise
     * @fulfill {void} The video was paused.
     */

    /**
     * Pause the video if it’s playing.
     *
     * @return {PausePromise}
     */

  }, {
    key: "pause",
    value: function pause() {
      return this.callMethod('pause');
    }
    /**
     * A promise to play the video.
     *
     * @promise PlayPromise
     * @fulfill {void} The video was played.
     */

    /**
     * Play the video if it’s paused. **Note:** on iOS and some other
     * mobile devices, you cannot programmatically trigger play. Once the
     * viewer has tapped on the play button in the player, however, you
     * will be able to use this function.
     *
     * @return {PlayPromise}
     */

  }, {
    key: "play",
    value: function play() {
      return this.callMethod('play');
    }
    /**
     * Request that the player enters fullscreen.
     * @return {Promise}
     */

  }, {
    key: "requestFullscreen",
    value: function requestFullscreen() {
      if (screenfull.isEnabled) {
        return screenfull.request(this.element);
      }

      return this.callMethod('requestFullscreen');
    }
    /**
     * Request that the player exits fullscreen.
     * @return {Promise}
     */

  }, {
    key: "exitFullscreen",
    value: function exitFullscreen() {
      if (screenfull.isEnabled) {
        return screenfull.exit();
      }

      return this.callMethod('exitFullscreen');
    }
    /**
     * Returns true if the player is currently fullscreen.
     * @return {Promise}
     */

  }, {
    key: "getFullscreen",
    value: function getFullscreen() {
      if (screenfull.isEnabled) {
        return npo_src.resolve(screenfull.isFullscreen);
      }

      return this.get('fullscreen');
    }
    /**
     * Request that the player enters picture-in-picture.
     * @return {Promise}
     */

  }, {
    key: "requestPictureInPicture",
    value: function requestPictureInPicture() {
      return this.callMethod('requestPictureInPicture');
    }
    /**
     * Request that the player exits picture-in-picture.
     * @return {Promise}
     */

  }, {
    key: "exitPictureInPicture",
    value: function exitPictureInPicture() {
      return this.callMethod('exitPictureInPicture');
    }
    /**
     * Returns true if the player is currently picture-in-picture.
     * @return {Promise}
     */

  }, {
    key: "getPictureInPicture",
    value: function getPictureInPicture() {
      return this.get('pictureInPicture');
    }
    /**
     * A promise to unload the video.
     *
     * @promise UnloadPromise
     * @fulfill {void} The video was unloaded.
     */

    /**
     * Return the player to its initial state.
     *
     * @return {UnloadPromise}
     */

  }, {
    key: "unload",
    value: function unload() {
      return this.callMethod('unload');
    }
    /**
     * Cleanup the player and remove it from the DOM
     *
     * It won't be usable and a new one should be constructed
     *  in order to do any operations.
     *
     * @return {Promise}
     */

  }, {
    key: "destroy",
    value: function destroy() {
      var _this5 = this;

      return new npo_src(function (resolve) {
        readyMap.delete(_this5);
        playerMap.delete(_this5.element);

        if (_this5._originalElement) {
          playerMap.delete(_this5._originalElement);

          _this5._originalElement.removeAttribute('data-vimeo-initialized');
        }

        if (_this5.element && _this5.element.nodeName === 'IFRAME' && _this5.element.parentNode) {
          // If we've added an additional wrapper div, remove that from the DOM.
          // If not, just remove the iframe element.
          if (_this5.element.parentNode.parentNode && _this5._originalElement && _this5._originalElement !== _this5.element.parentNode) {
            _this5.element.parentNode.parentNode.removeChild(_this5.element.parentNode);
          } else {
            _this5.element.parentNode.removeChild(_this5.element);
          }
        } // If the clip is private there is a case where the element stays the
        // div element. Destroy should reset the div and remove the iframe child.


        if (_this5.element && _this5.element.nodeName === 'DIV' && _this5.element.parentNode) {
          _this5.element.removeAttribute('data-vimeo-initialized');

          var iframe = _this5.element.querySelector('iframe');

          if (iframe && iframe.parentNode) {
            // If we've added an additional wrapper div, remove that from the DOM.
            // If not, just remove the iframe element.
            if (iframe.parentNode.parentNode && _this5._originalElement && _this5._originalElement !== iframe.parentNode) {
              iframe.parentNode.parentNode.removeChild(iframe.parentNode);
            } else {
              iframe.parentNode.removeChild(iframe);
            }
          }
        }

        _this5._window.removeEventListener('message', _this5._onMessage);

        if (screenfull.isEnabled) {
          screenfull.off('fullscreenchange', _this5.fullscreenchangeHandler);
        }

        resolve();
      });
    }
    /**
     * A promise to get the autopause behavior of the video.
     *
     * @promise GetAutopausePromise
     * @fulfill {boolean} Whether autopause is turned on or off.
     * @reject {UnsupportedError} Autopause is not supported with the current
     *         player or browser.
     */

    /**
     * Get the autopause behavior for this player.
     *
     * @return {GetAutopausePromise}
     */

  }, {
    key: "getAutopause",
    value: function getAutopause() {
      return this.get('autopause');
    }
    /**
     * A promise to set the autopause behavior of the video.
     *
     * @promise SetAutopausePromise
     * @fulfill {boolean} Whether autopause is turned on or off.
     * @reject {UnsupportedError} Autopause is not supported with the current
     *         player or browser.
     */

    /**
     * Enable or disable the autopause behavior of this player.
     *
     * By default, when another video is played in the same browser, this
     * player will automatically pause. Unless you have a specific reason
     * for doing so, we recommend that you leave autopause set to the
     * default (`true`).
     *
     * @param {boolean} autopause
     * @return {SetAutopausePromise}
     */

  }, {
    key: "setAutopause",
    value: function setAutopause(autopause) {
      return this.set('autopause', autopause);
    }
    /**
     * A promise to get the buffered property of the video.
     *
     * @promise GetBufferedPromise
     * @fulfill {Array} Buffered Timeranges converted to an Array.
     */

    /**
     * Get the buffered property of the video.
     *
     * @return {GetBufferedPromise}
     */

  }, {
    key: "getBuffered",
    value: function getBuffered() {
      return this.get('buffered');
    }
    /**
     * @typedef {Object} CameraProperties
     * @prop {number} props.yaw - Number between 0 and 360.
     * @prop {number} props.pitch - Number between -90 and 90.
     * @prop {number} props.roll - Number between -180 and 180.
     * @prop {number} props.fov - The field of view in degrees.
     */

    /**
     * A promise to get the camera properties of the player.
     *
     * @promise GetCameraPromise
     * @fulfill {CameraProperties} The camera properties.
     */

    /**
     * For 360° videos get the camera properties for this player.
     *
     * @return {GetCameraPromise}
     */

  }, {
    key: "getCameraProps",
    value: function getCameraProps() {
      return this.get('cameraProps');
    }
    /**
     * A promise to set the camera properties of the player.
     *
     * @promise SetCameraPromise
     * @fulfill {Object} The camera was successfully set.
     * @reject {RangeError} The range was out of bounds.
     */

    /**
     * For 360° videos set the camera properties for this player.
     *
     * @param {CameraProperties} camera The camera properties
     * @return {SetCameraPromise}
     */

  }, {
    key: "setCameraProps",
    value: function setCameraProps(camera) {
      return this.set('cameraProps', camera);
    }
    /**
     * A representation of a chapter.
     *
     * @typedef {Object} VimeoChapter
     * @property {number} startTime The start time of the chapter.
     * @property {object} title The title of the chapter.
     * @property {number} index The place in the order of Chapters. Starts at 1.
     */

    /**
     * A promise to get chapters for the video.
     *
     * @promise GetChaptersPromise
     * @fulfill {VimeoChapter[]} The chapters for the video.
     */

    /**
     * Get an array of all the chapters for the video.
     *
     * @return {GetChaptersPromise}
     */

  }, {
    key: "getChapters",
    value: function getChapters() {
      return this.get('chapters');
    }
    /**
     * A promise to get the currently active chapter.
     *
     * @promise GetCurrentChaptersPromise
     * @fulfill {VimeoChapter|undefined} The current chapter for the video.
     */

    /**
     * Get the currently active chapter for the video.
     *
     * @return {GetCurrentChaptersPromise}
     */

  }, {
    key: "getCurrentChapter",
    value: function getCurrentChapter() {
      return this.get('currentChapter');
    }
    /**
     * A promise to get the color of the player.
     *
     * @promise GetColorPromise
     * @fulfill {string} The hex color of the player.
     */

    /**
     * Get the color for this player.
     *
     * @return {GetColorPromise}
     */

  }, {
    key: "getColor",
    value: function getColor() {
      return this.get('color');
    }
    /**
     * A promise to set the color of the player.
     *
     * @promise SetColorPromise
     * @fulfill {string} The color was successfully set.
     * @reject {TypeError} The string was not a valid hex or rgb color.
     * @reject {ContrastError} The color was set, but the contrast is
     *         outside of the acceptable range.
     * @reject {EmbedSettingsError} The owner of the player has chosen to
     *         use a specific color.
     */

    /**
     * Set the color of this player to a hex or rgb string. Setting the
     * color may fail if the owner of the video has set their embed
     * preferences to force a specific color.
     *
     * @param {string} color The hex or rgb color string to set.
     * @return {SetColorPromise}
     */

  }, {
    key: "setColor",
    value: function setColor(color) {
      return this.set('color', color);
    }
    /**
     * A representation of a cue point.
     *
     * @typedef {Object} VimeoCuePoint
     * @property {number} time The time of the cue point.
     * @property {object} data The data passed when adding the cue point.
     * @property {string} id The unique id for use with removeCuePoint.
     */

    /**
     * A promise to get the cue points of a video.
     *
     * @promise GetCuePointsPromise
     * @fulfill {VimeoCuePoint[]} The cue points added to the video.
     * @reject {UnsupportedError} Cue points are not supported with the current
     *         player or browser.
     */

    /**
     * Get an array of the cue points added to the video.
     *
     * @return {GetCuePointsPromise}
     */

  }, {
    key: "getCuePoints",
    value: function getCuePoints() {
      return this.get('cuePoints');
    }
    /**
     * A promise to get the current time of the video.
     *
     * @promise GetCurrentTimePromise
     * @fulfill {number} The current time in seconds.
     */

    /**
     * Get the current playback position in seconds.
     *
     * @return {GetCurrentTimePromise}
     */

  }, {
    key: "getCurrentTime",
    value: function getCurrentTime() {
      return this.get('currentTime');
    }
    /**
     * A promise to set the current time of the video.
     *
     * @promise SetCurrentTimePromise
     * @fulfill {number} The actual current time that was set.
     * @reject {RangeError} the time was less than 0 or greater than the
     *         video’s duration.
     */

    /**
     * Set the current playback position in seconds. If the player was
     * paused, it will remain paused. Likewise, if the player was playing,
     * it will resume playing once the video has buffered.
     *
     * You can provide an accurate time and the player will attempt to seek
     * to as close to that time as possible. The exact time will be the
     * fulfilled value of the promise.
     *
     * @param {number} currentTime
     * @return {SetCurrentTimePromise}
     */

  }, {
    key: "setCurrentTime",
    value: function setCurrentTime(currentTime) {
      return this.set('currentTime', currentTime);
    }
    /**
     * A promise to get the duration of the video.
     *
     * @promise GetDurationPromise
     * @fulfill {number} The duration in seconds.
     */

    /**
     * Get the duration of the video in seconds. It will be rounded to the
     * nearest second before playback begins, and to the nearest thousandth
     * of a second after playback begins.
     *
     * @return {GetDurationPromise}
     */

  }, {
    key: "getDuration",
    value: function getDuration() {
      return this.get('duration');
    }
    /**
     * A promise to get the ended state of the video.
     *
     * @promise GetEndedPromise
     * @fulfill {boolean} Whether or not the video has ended.
     */

    /**
     * Get the ended state of the video. The video has ended if
     * `currentTime === duration`.
     *
     * @return {GetEndedPromise}
     */

  }, {
    key: "getEnded",
    value: function getEnded() {
      return this.get('ended');
    }
    /**
     * A promise to get the loop state of the player.
     *
     * @promise GetLoopPromise
     * @fulfill {boolean} Whether or not the player is set to loop.
     */

    /**
     * Get the loop state of the player.
     *
     * @return {GetLoopPromise}
     */

  }, {
    key: "getLoop",
    value: function getLoop() {
      return this.get('loop');
    }
    /**
     * A promise to set the loop state of the player.
     *
     * @promise SetLoopPromise
     * @fulfill {boolean} The loop state that was set.
     */

    /**
     * Set the loop state of the player. When set to `true`, the player
     * will start over immediately once playback ends.
     *
     * @param {boolean} loop
     * @return {SetLoopPromise}
     */

  }, {
    key: "setLoop",
    value: function setLoop(loop) {
      return this.set('loop', loop);
    }
    /**
     * A promise to set the muted state of the player.
     *
     * @promise SetMutedPromise
     * @fulfill {boolean} The muted state that was set.
     */

    /**
     * Set the muted state of the player. When set to `true`, the player
     * volume will be muted.
     *
     * @param {boolean} muted
     * @return {SetMutedPromise}
     */

  }, {
    key: "setMuted",
    value: function setMuted(muted) {
      return this.set('muted', muted);
    }
    /**
     * A promise to get the muted state of the player.
     *
     * @promise GetMutedPromise
     * @fulfill {boolean} Whether or not the player is muted.
     */

    /**
     * Get the muted state of the player.
     *
     * @return {GetMutedPromise}
     */

  }, {
    key: "getMuted",
    value: function getMuted() {
      return this.get('muted');
    }
    /**
     * A promise to get the paused state of the player.
     *
     * @promise GetLoopPromise
     * @fulfill {boolean} Whether or not the video is paused.
     */

    /**
     * Get the paused state of the player.
     *
     * @return {GetLoopPromise}
     */

  }, {
    key: "getPaused",
    value: function getPaused() {
      return this.get('paused');
    }
    /**
     * A promise to get the playback rate of the player.
     *
     * @promise GetPlaybackRatePromise
     * @fulfill {number} The playback rate of the player on a scale from 0.5 to 2.
     */

    /**
     * Get the playback rate of the player on a scale from `0.5` to `2`.
     *
     * @return {GetPlaybackRatePromise}
     */

  }, {
    key: "getPlaybackRate",
    value: function getPlaybackRate() {
      return this.get('playbackRate');
    }
    /**
     * A promise to set the playbackrate of the player.
     *
     * @promise SetPlaybackRatePromise
     * @fulfill {number} The playback rate was set.
     * @reject {RangeError} The playback rate was less than 0.5 or greater than 2.
     */

    /**
     * Set the playback rate of the player on a scale from `0.5` to `2`. When set
     * via the API, the playback rate will not be synchronized to other
     * players or stored as the viewer's preference.
     *
     * @param {number} playbackRate
     * @return {SetPlaybackRatePromise}
     */

  }, {
    key: "setPlaybackRate",
    value: function setPlaybackRate(playbackRate) {
      return this.set('playbackRate', playbackRate);
    }
    /**
     * A promise to get the played property of the video.
     *
     * @promise GetPlayedPromise
     * @fulfill {Array} Played Timeranges converted to an Array.
     */

    /**
     * Get the played property of the video.
     *
     * @return {GetPlayedPromise}
     */

  }, {
    key: "getPlayed",
    value: function getPlayed() {
      return this.get('played');
    }
    /**
     * A promise to get the qualities available of the current video.
     *
     * @promise GetQualitiesPromise
     * @fulfill {Array} The qualities of the video.
     */

    /**
     * Get the qualities of the current video.
     *
     * @return {GetQualitiesPromise}
     */

  }, {
    key: "getQualities",
    value: function getQualities() {
      return this.get('qualities');
    }
    /**
     * A promise to get the current set quality of the video.
     *
     * @promise GetQualityPromise
     * @fulfill {string} The current set quality.
     */

    /**
     * Get the current set quality of the video.
     *
     * @return {GetQualityPromise}
     */

  }, {
    key: "getQuality",
    value: function getQuality() {
      return this.get('quality');
    }
    /**
     * A promise to set the video quality.
     *
     * @promise SetQualityPromise
     * @fulfill {number} The quality was set.
     * @reject {RangeError} The quality is not available.
     */

    /**
     * Set a video quality.
     *
     * @param {string} quality
     * @return {SetQualityPromise}
     */

  }, {
    key: "setQuality",
    value: function setQuality(quality) {
      return this.set('quality', quality);
    }
    /**
     * A promise to get the seekable property of the video.
     *
     * @promise GetSeekablePromise
     * @fulfill {Array} Seekable Timeranges converted to an Array.
     */

    /**
     * Get the seekable property of the video.
     *
     * @return {GetSeekablePromise}
     */

  }, {
    key: "getSeekable",
    value: function getSeekable() {
      return this.get('seekable');
    }
    /**
     * A promise to get the seeking property of the player.
     *
     * @promise GetSeekingPromise
     * @fulfill {boolean} Whether or not the player is currently seeking.
     */

    /**
     * Get if the player is currently seeking.
     *
     * @return {GetSeekingPromise}
     */

  }, {
    key: "getSeeking",
    value: function getSeeking() {
      return this.get('seeking');
    }
    /**
     * A promise to get the text tracks of a video.
     *
     * @promise GetTextTracksPromise
     * @fulfill {VimeoTextTrack[]} The text tracks associated with the video.
     */

    /**
     * Get an array of the text tracks that exist for the video.
     *
     * @return {GetTextTracksPromise}
     */

  }, {
    key: "getTextTracks",
    value: function getTextTracks() {
      return this.get('textTracks');
    }
    /**
     * A promise to get the embed code for the video.
     *
     * @promise GetVideoEmbedCodePromise
     * @fulfill {string} The `<iframe>` embed code for the video.
     */

    /**
     * Get the `<iframe>` embed code for the video.
     *
     * @return {GetVideoEmbedCodePromise}
     */

  }, {
    key: "getVideoEmbedCode",
    value: function getVideoEmbedCode() {
      return this.get('videoEmbedCode');
    }
    /**
     * A promise to get the id of the video.
     *
     * @promise GetVideoIdPromise
     * @fulfill {number} The id of the video.
     */

    /**
     * Get the id of the video.
     *
     * @return {GetVideoIdPromise}
     */

  }, {
    key: "getVideoId",
    value: function getVideoId() {
      return this.get('videoId');
    }
    /**
     * A promise to get the title of the video.
     *
     * @promise GetVideoTitlePromise
     * @fulfill {number} The title of the video.
     */

    /**
     * Get the title of the video.
     *
     * @return {GetVideoTitlePromise}
     */

  }, {
    key: "getVideoTitle",
    value: function getVideoTitle() {
      return this.get('videoTitle');
    }
    /**
     * A promise to get the native width of the video.
     *
     * @promise GetVideoWidthPromise
     * @fulfill {number} The native width of the video.
     */

    /**
     * Get the native width of the currently‐playing video. The width of
     * the highest‐resolution available will be used before playback begins.
     *
     * @return {GetVideoWidthPromise}
     */

  }, {
    key: "getVideoWidth",
    value: function getVideoWidth() {
      return this.get('videoWidth');
    }
    /**
     * A promise to get the native height of the video.
     *
     * @promise GetVideoHeightPromise
     * @fulfill {number} The native height of the video.
     */

    /**
     * Get the native height of the currently‐playing video. The height of
     * the highest‐resolution available will be used before playback begins.
     *
     * @return {GetVideoHeightPromise}
     */

  }, {
    key: "getVideoHeight",
    value: function getVideoHeight() {
      return this.get('videoHeight');
    }
    /**
     * A promise to get the vimeo.com url for the video.
     *
     * @promise GetVideoUrlPromise
     * @fulfill {number} The vimeo.com url for the video.
     * @reject {PrivacyError} The url isn’t available because of the video’s privacy setting.
     */

    /**
     * Get the vimeo.com url for the video.
     *
     * @return {GetVideoUrlPromise}
     */

  }, {
    key: "getVideoUrl",
    value: function getVideoUrl() {
      return this.get('videoUrl');
    }
    /**
     * A promise to get the volume level of the player.
     *
     * @promise GetVolumePromise
     * @fulfill {number} The volume level of the player on a scale from 0 to 1.
     */

    /**
     * Get the current volume level of the player on a scale from `0` to `1`.
     *
     * Most mobile devices do not support an independent volume from the
     * system volume. In those cases, this method will always return `1`.
     *
     * @return {GetVolumePromise}
     */

  }, {
    key: "getVolume",
    value: function getVolume() {
      return this.get('volume');
    }
    /**
     * A promise to set the volume level of the player.
     *
     * @promise SetVolumePromise
     * @fulfill {number} The volume was set.
     * @reject {RangeError} The volume was less than 0 or greater than 1.
     */

    /**
     * Set the volume of the player on a scale from `0` to `1`. When set
     * via the API, the volume level will not be synchronized to other
     * players or stored as the viewer’s preference.
     *
     * Most mobile devices do not support setting the volume. An error will
     * *not* be triggered in that situation.
     *
     * @param {number} volume
     * @return {SetVolumePromise}
     */

  }, {
    key: "setVolume",
    value: function setVolume(volume) {
      return this.set('volume', volume);
    }
  }]);

  return Player;
}(); // Setup embed only if this is not a node environment


if (!isNode) {
  screenfull = initializeScreenfull();
  initializeEmbeds();
  resizeEmbeds();
  initAppendVideoMetadata();
  checkUrlTimeParam();
}function Vimeo () {
  var iframes = document.querySelectorAll('iframe.vimeo');
  if (iframes == null) return;
  iframes.forEach(function (iframe) {
    var player = new Player(iframe);
    var play = $(iframe).parent().find('.play');
    var pause = $(iframe).parent().find('.pause');
    play.on('click', function () {
      player.play();
      window.console.log('TEST');
    });
    pause.on('click', function () {
      player.pause();
    });
  });
}function Caleidoscopio () {
  var selector = ".caleidoscopio--clients";
  if (gsap.utils.toArray(selector).length == 0) return;
  gsap.to(".page", {
    scrollTrigger: {
      trigger: selector,
      start: "top 50%",
      end: "+=50",
      scrub: 1,
      snap: {
        snapTo: "labels",
        delay: 0.2,
        ease: "power1.inOut"
      }
    },
    backgroundColor: '#000000'
  });
  gsap.to(".page", {
    scrollTrigger: {
      trigger: selector,
      start: "top 70%",
      end: "100%",
      toggleClass: {
        targets: ".page",
        className: "blackened"
      }
    }
  });
}function Clients () {
  var clients_caleidoscopio = gsap.utils.toArray('.page--caleidoscopio .caleidoscopio--clients--item');
  clients_caleidoscopio.forEach(function (item, i) {
    var right, fromLeft;
    if (i == 0 | i % 4 == 0) {
      fromLeft = 0;
      right = 0;
    }
    if (i == 1 | i % 4 == 1) {
      fromLeft = -100;
      right = 50;
    }
    if (i == 2 | i % 4 == 2) {
      fromLeft = 0;
      right = 80;
    }
    if (i == 3 | i % 4 == 3) {
      fromLeft = -100;
      right = 160;
    }
    gsap.fromTo(item, {
      xPercent: fromLeft
    }, {
      ease: 'linear',
      scrollTrigger: {
        trigger: item,
        scrub: true,
        start: "top 50%",
        end: "+=250"
      },
      xPercent: right,
      delay: i
    });
  });
  var clients_brand_platform = gsap.utils.toArray('.page--brand-platform .caleidoscopio--clients--item');
  clients_brand_platform.forEach(function (item, i) {
    var from, to;
    if (i == 0) {
      from = {
        left: 0
      };
      to = {
        left: 0
      };
    }
    if (i == 1) {
      from = {
        left: 0
      };
      to = {
        left: '100%',
        xPercent: -100
      };
    }
    if (i == 2) {
      from = {
        left: 0
      };
      to = {
        left: 0,
        right: 0
      };
    }
    if (i == 3) {
      from = {
        left: 0
      };
      to = {
        left: '80%',
        xPercent: -100
      };
    }
    if (i == 4) {
      from = {
        left: 0
      };
      to = {
        left: '20%',
        right: 0
      };
    }
    if (i == 5) {
      from = {
        left: 0
      };
      to = {
        left: '100%',
        xPercent: -100
      };
    }
    if (i == 6) {
      from = {
        left: 0
      };
      to = {
        left: 0
      };
    }
    if (i == 7) {
      from = {
        left: 0
      };
      to = {
        left: '90%',
        xPercent: -100
      };
    }
    if (i == 8) {
      from = {
        left: 0
      };
      to = {
        left: '20%',
        right: 0
      };
    }
    if (i == 9) {
      from = {
        left: 0
      };
      to = {
        left: '100%',
        xPercent: -100
      };
    }
    gsap.fromTo(item, from, _objectSpread2(_objectSpread2({}, to), {}, {
      ease: 'linear',
      scrollTrigger: {
        trigger: item,
        scrub: true,
        start: "top 80%",
        end: "top 70%"
      },
      delay: i
    }));
  });
}function Crew () {
  gsap.utils.toArray(".crew--half--item").forEach(function (c) {
    gsap.to(c, {
      opacity: 0,
      duration: 0
    });
    gsap.to(c, {
      duration: 1,
      opacity: 1,
      scrollTrigger: {
        start: "top 70%",
        end: "+=50%",
        trigger: c,
        scrub: true
      }
    });
    gsap.to(c, {
      scrollTrigger: {
        toggleClass: "visible",
        start: "top 50%",
        trigger: c
      }
    });
  });
}function HomeHero () {
  if ($('.homepage--hero').length == 0) return;
  var hero_image = '.homepage--hero--image';
  gsap.fromTo(hero_image, {
    yPercent: 0
  }, {
    yPercent: -40,
    scrollTrigger: {
      trigger: hero_image,
      scrub: 1
    }
  });
  var foreground = '.homepage--timeless--image--foreground';
  var background = '.homepage--timeless--image--background';
  var foreground_image = '.homepage--timeless--image--foreground img';
  var background_width = gsap.getProperty(background, "width", "px");
  gsap.set(foreground_image, {
    width: background_width,
    duration: 0
  });
  gsap.fromTo(foreground, {
    width: "0%"
  }, {
    width: "100%",
    scrollTrigger: {
      trigger: foreground,
      start: "top 75%",
      end: "bottom center",
      scrub: 1
    }
  });
  gsap.fromTo(background, {
    opacity: 0.1
  }, {
    opacity: 1,
    scrollTrigger: {
      trigger: foreground,
      start: "top bottom",
      end: "bottom center",
      scrub: 1
    }
  });
  var vertical = '.timeline--vertical';
  gsap.fromTo(vertical, {
    y: 100
  }, {
    y: -100,
    scrollTrigger: {
      trigger: '.timeline',
      scrub: 1
    }
  });
  var vertical_text = '.homepage--text-image--vertical';
  gsap.fromTo(vertical_text, {
    y: 100
  }, {
    y: 200,
    scrollTrigger: {
      trigger: '.homepage--text-image',
      scrub: 1
    }
  });
  var dots_foreground = '.homepage--dots--foreground';
  var dots_exclusion = '.homepage--dots--exclusion';
  gsap.fromTo(dots_foreground, {
    opacity: 1
  }, {
    opacity: 0,
    scrollTrigger: {
      trigger: dots_foreground,
      start: "top 75%",
      end: "top 10%",
      scrub: 1
    }
  });
  gsap.fromTo(dots_exclusion, {
    yPercent: 0
  }, {
    yPercent: -100,
    scrollTrigger: {
      trigger: dots_foreground,
      start: "top top",
      end: "top -35%",
      scrub: 1
    }
  });
  gsap.fromTo('.homepage--dots--white', {
    opacity: 1,
    zIndex: 2
  }, {
    opacity: 0,
    zIndex: 1,
    scrollTrigger: {
      trigger: '.homepage--dots--white',
      start: "bottom top",
      end: "top -1%",
      scrub: 1
    }
  });
  var dots_white_foreground = '.homepage--dots--white--foreground';
  var dots_white_exclusion = '.homepage--dots--white--exclusion';
  gsap.fromTo(dots_white_foreground, {
    opacity: 1
  }, {
    opacity: 0,
    scrollTrigger: {
      trigger: dots_white_foreground,
      start: "top 75%",
      end: "top 10%",
      scrub: 1
    }
  });
  gsap.fromTo(dots_white_exclusion, {
    yPercent: 0
  }, {
    yPercent: -100,
    scrollTrigger: {
      trigger: dots_white_foreground,
      start: "top top",
      end: "top -35%",
      scrub: 1
    }
  });
  gsap.fromTo(dots_white_foreground, {
    yPercent: 0
  }, {
    yPercent: -100,
    scrollTrigger: {
      trigger: dots_white_foreground,
      start: "top top",
      end: "top -35%",
      scrub: 1
    }
  });
  var parallax = '.homepage--parallax--backdrop--image';
  gsap.fromTo(parallax, {
    yPercent: -40
  }, {
    yPercent: 0,
    scrollTrigger: {
      trigger: parallax,
      start: "top bottom",
      end: "bottom -100%",
      scrub: 1
    }
  });
}function BrandPlatform () {
  if ($('.page--brand-platform').length == 0) return;
  var hero_image = '.brand-platform--hero--image';
  gsap.fromTo(hero_image, {
    yPercent: -30
  }, {
    yPercent: 0,
    scrollTrigger: {
      trigger: hero_image,
      start: "top bottom",
      end: "bottom -100%",
      scrub: 1
    }
  });
  var foreground = '.brand-platform--text-image--backdrop .foreground';
  gsap.fromTo(foreground, {
    width: '0%',
    left: '0%'
  }, {
    width: '100%',
    scrollTrigger: {
      trigger: foreground,
      start: "top 75%",
      end: "top 0%",
      scrub: 1
    }
  });
  var foreground_invert = '.brand-platform--text-image--backdrop .foreground-invert';
  gsap.fromTo(foreground_invert, {
    width: '0%',
    right: '0%',
    left: '100%'
  }, {
    width: '100%',
    left: '0%',
    scrollTrigger: {
      trigger: foreground_invert,
      start: "top 50%",
      end: "top -25%",
      scrub: 1
    }
  });
}function BrandStoria () {
  var storia_images = gsap.utils.toArray('.page--storia .text-image img');
  storia_images.forEach(function (item, i) {
    gsap.fromTo(item, {
      yPercent: 25
    }, {
      ease: 'linear',
      scrollTrigger: {
        trigger: item,
        scrub: true
      },
      yPercent: -15,
      delay: i
    });
  });
}var Main = function () {
  function Main() {
    this.init();
  }
  var _proto = Main.prototype;
  _proto.init = function init() {
    gsap.registerPlugin(ScrollTrigger);
    SliderSide();
    Mosaic();
    Timeline();
    Tabs();
    Accordion();
    Modal();
    Filters();
    Menu();
    Footer();
    Toggle();
    Vimeo();
    Caleidoscopio();
    Clients();
    Crew();
    HomeHero();
    BrandPlatform();
    BrandStoria();
    var toggle = gsap.utils.toArray('.section--hero--plus--content .full');
    toggle.forEach(function (item) {
      gsap.to(item, {
        height: 0,
        overflow: 'hidden',
        duration: 0
      });
      $(item).closest('.section--hero--plus--content').find('.section--hero--plus--icon').on('click', function () {
        if ($(item).hasClass('show')) {
          gsap.to(item, {
            height: 0,
            duration: 0.5
          });
        } else {
          gsap.to(item, {
            height: 'auto',
            duration: 0.5
          });
        }
        $(item).toggleClass('show');
      });
    });
    new Swiper(".composizione--slider-full .swiper--default", {
      navigation: {
        nextEl: ".composizione--slider-full .swiper--default--next",
        prevEl: ".composizione--slider-full .swiper--default--prev"
      },
      effect: 'fade',
      fadeEffect: {
        crossFade: true
      },
      speed: 1000,
      loop: true
    });
    new Swiper(".section--multiple-slider .swiper--multiple", {
      navigation: {
        nextEl: ".section--multiple-slider--next",
        prevEl: ".section--multiple-slider--prev"
      },
      speed: 1000,
      loop: true,
      slidesPerView: "auto",
      spaceBetween: 30
    });
    new Swiper(".crew--designers--slider", {
      navigation: {
        nextEl: ".crew--designers--next",
        prevEl: ".crew--designers--prev"
      },
      speed: 1000,
      slidesPerView: "auto"
    });
    new Swiper(".section--preview-products", {
      navigation: {
        nextEl: ".section--preview-products .swiper--default--next",
        prevEl: ".section--preview-products .swiper--default--prev"
      },
      speed: 1000,
      breakpoints: {
        1024: {
          slidesPerView: 2
        },
        1140: {
          slidesPerView: 3
        },
        1600: {
          slidesPerView: 4
        }
      }
    });
    function animate_page() {
      var delay_header = 2000,
        delay_split = 2000,
        delay_fade = 2000;
      page_timeline.call(Header(delay_header)).call(Split(delay_split)).call(Fade(delay_fade)).play();
    }
    var preloader = document.getElementsByClassName('.preloader');
    var page_timeline = gsap.timeline({
      paused: true
    });
    if (preloader !== null) {
      gsap.set('body,html', {
        overflow: 'hidden',
        duration: 0
      });
      var prelaoder_timeline = gsap.timeline({
        paused: true,
        ease: 'linear'
      });
      window.addEventListener('DOMContentLoaded', function (event) {
        setTimeout(function () {
          var tx = prelaoder_timeline.to('.preloader svg', {
            display: 'none',
            duration: 1,
            scale: 100,
            opacity: 0
          }).to('.preloader', {
            opacity: 0,
            display: 'none',
            duration: 0.5
          });
          tx.play().then(function () {
            $('html,body').removeAttr('style');
          });
          animate_page();
        }, 2000);
      });
    } else {
      $('html,body').removeAttr('style');
      animate_page();
    }
  };
  return Main;
}();
new Main();return Main;})();