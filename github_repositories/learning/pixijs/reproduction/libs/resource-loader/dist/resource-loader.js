console.info('resource-loader');
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Loader = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var has = Object.prototype.hasOwnProperty
  , prefix = '~';

/**
 * Constructor to create a storage for our `EE` objects.
 * An `Events` instance is a plain object whose properties are event names.
 *
 * @constructor
 * @api private
 */
function Events() {}

//
// We try to not inherit from `Object.prototype`. In some engines creating an
// instance in this way is faster than calling `Object.create(null)` directly.
// If `Object.create(null)` is not supported we prefix the event names with a
// character to make sure that the built-in object properties are not
// overridden or used as an attack vector.
//
if (Object.create) {
  Events.prototype = Object.create(null);

  //
  // This hack is needed because the `__proto__` property is still inherited in
  // some old browsers like Android 4, iPhone 5.1, Opera 11 and Safari 5.
  //
  if (!new Events().__proto__) prefix = false;
}

/**
 * Representation of a single event listener.
 *
 * @param {Function} fn The listener function.
 * @param {Mixed} context The context to invoke the listener with.
 * @param {Boolean} [once=false] Specify if the listener is a one-time listener.
 * @constructor
 * @api private
 */
function EE(fn, context, once) {
  this.fn = fn;
  this.context = context;
  this.once = once || false;
}

/**
 * Minimal `EventEmitter` interface that is molded against the Node.js
 * `EventEmitter` interface.
 *
 * @constructor
 * @api public
 */
function EventEmitter() {
  this._events = new Events();
  this._eventsCount = 0;
}

/**
 * Return an array listing the events for which the emitter has registered
 * listeners.
 *
 * @returns {Array}
 * @api public
 */
EventEmitter.prototype.eventNames = function eventNames() {
  var names = []
    , events
    , name;

  if (this._eventsCount === 0) return names;

  for (name in (events = this._events)) {
    if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
  }

  if (Object.getOwnPropertySymbols) {
    return names.concat(Object.getOwnPropertySymbols(events));
  }

  return names;
};

/**
 * Return the listeners registered for a given event.
 *
 * @param {String|Symbol} event The event name.
 * @param {Boolean} exists Only check if there are listeners.
 * @returns {Array|Boolean}
 * @api public
 */
EventEmitter.prototype.listeners = function listeners(event, exists) {
  var evt = prefix ? prefix + event : event
    , available = this._events[evt];

  if (exists) return !!available;
  if (!available) return [];
  if (available.fn) return [available.fn];

  for (var i = 0, l = available.length, ee = new Array(l); i < l; i++) {
    ee[i] = available[i].fn;
  }

  return ee;
};

/**
 * Calls each of the listeners registered for a given event.
 *
 * @param {String|Symbol} event The event name.
 * @returns {Boolean} `true` if the event had listeners, else `false`.
 * @api public
 */
EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
  var evt = prefix ? prefix + event : event;

  if (!this._events[evt]) return false;

  var listeners = this._events[evt]
    , len = arguments.length
    , args
    , i;

  if (listeners.fn) {
    if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);

    switch (len) {
      case 1: return listeners.fn.call(listeners.context), true;
      case 2: return listeners.fn.call(listeners.context, a1), true;
      case 3: return listeners.fn.call(listeners.context, a1, a2), true;
      case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
      case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
      case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
    }

    for (i = 1, args = new Array(len -1); i < len; i++) {
      args[i - 1] = arguments[i];
    }

    listeners.fn.apply(listeners.context, args);
  } else {
    var length = listeners.length
      , j;

    for (i = 0; i < length; i++) {
      if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);

      switch (len) {
        case 1: listeners[i].fn.call(listeners[i].context); break;
        case 2: listeners[i].fn.call(listeners[i].context, a1); break;
        case 3: listeners[i].fn.call(listeners[i].context, a1, a2); break;
        case 4: listeners[i].fn.call(listeners[i].context, a1, a2, a3); break;
        default:
          if (!args) for (j = 1, args = new Array(len -1); j < len; j++) {
            args[j - 1] = arguments[j];
          }

          listeners[i].fn.apply(listeners[i].context, args);
      }
    }
  }

  return true;
};

/**
 * Add a listener for a given event.
 *
 * @param {String|Symbol} event The event name.
 * @param {Function} fn The listener function.
 * @param {Mixed} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @api public
 */
EventEmitter.prototype.on = function on(event, fn, context) {
  var listener = new EE(fn, context || this)
    , evt = prefix ? prefix + event : event;

  if (!this._events[evt]) this._events[evt] = listener, this._eventsCount++;
  else if (!this._events[evt].fn) this._events[evt].push(listener);
  else this._events[evt] = [this._events[evt], listener];

  return this;
};

/**
 * Add a one-time listener for a given event.
 *
 * @param {String|Symbol} event The event name.
 * @param {Function} fn The listener function.
 * @param {Mixed} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @api public
 */
EventEmitter.prototype.once = function once(event, fn, context) {
  var listener = new EE(fn, context || this, true)
    , evt = prefix ? prefix + event : event;

  if (!this._events[evt]) this._events[evt] = listener, this._eventsCount++;
  else if (!this._events[evt].fn) this._events[evt].push(listener);
  else this._events[evt] = [this._events[evt], listener];

  return this;
};

/**
 * Remove the listeners of a given event.
 *
 * @param {String|Symbol} event The event name.
 * @param {Function} fn Only remove the listeners that match this function.
 * @param {Mixed} context Only remove the listeners that have this context.
 * @param {Boolean} once Only remove one-time listeners.
 * @returns {EventEmitter} `this`.
 * @api public
 */
EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
  var evt = prefix ? prefix + event : event;

  if (!this._events[evt]) return this;
  if (!fn) {
    if (--this._eventsCount === 0) this._events = new Events();
    else delete this._events[evt];
    return this;
  }

  var listeners = this._events[evt];

  if (listeners.fn) {
    if (
         listeners.fn === fn
      && (!once || listeners.once)
      && (!context || listeners.context === context)
    ) {
      if (--this._eventsCount === 0) this._events = new Events();
      else delete this._events[evt];
    }
  } else {
    for (var i = 0, events = [], length = listeners.length; i < length; i++) {
      if (
           listeners[i].fn !== fn
        || (once && !listeners[i].once)
        || (context && listeners[i].context !== context)
      ) {
        events.push(listeners[i]);
      }
    }

    //
    // Reset the array, or remove it completely if we have no more listeners.
    //
    if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
    else if (--this._eventsCount === 0) this._events = new Events();
    else delete this._events[evt];
  }

  return this;
};

/**
 * Remove all listeners, or those of the specified event.
 *
 * @param {String|Symbol} [event] The event name.
 * @returns {EventEmitter} `this`.
 * @api public
 */
EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
  var evt;

  if (event) {
    evt = prefix ? prefix + event : event;
    if (this._events[evt]) {
      if (--this._eventsCount === 0) this._events = new Events();
      else delete this._events[evt];
    }
  } else {
    this._events = new Events();
    this._eventsCount = 0;
  }

  return this;
};

//
// Alias methods names because people roll like that.
//
EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
EventEmitter.prototype.addListener = EventEmitter.prototype.on;

//
// This function doesn't apply anymore.
//
EventEmitter.prototype.setMaxListeners = function setMaxListeners() {
  return this;
};

//
// Expose the prefix.
//
EventEmitter.prefixed = prefix;

//
// Allow `EventEmitter` to be imported as module namespace.
//
EventEmitter.EventEmitter = EventEmitter;

//
// Expose the module.
//
if ('undefined' !== typeof module) {
  module.exports = EventEmitter;
}

},{}],2:[function(require,module,exports){
'use strict'

module.exports = function parseURI (str, opts) {
  opts = opts || {}

  var o = {
    key: ['source', 'protocol', 'authority', 'userInfo', 'user', 'password', 'host', 'port', 'relative', 'path', 'directory', 'file', 'query', 'anchor'],
    q: {
      name: 'queryKey',
      parser: /(?:^|&)([^&=]*)=?([^&]*)/g
    },
    parser: {
      strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
      loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
    }
  }

  var m = o.parser[opts.strictMode ? 'strict' : 'loose'].exec(str)
  var uri = {}
  var i = 14

  while (i--) uri[o.key[i]] = m[i] || ''

  uri[o.q.name] = {}
  uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
    if ($1) uri[o.q.name][$1] = $2
  })

  return uri
}

},{}],3:[function(require,module,exports){
'use strict';

var parseUri        = require('parse-uri');
var async           = require('./async');
var Resource        = require('./Resource');
var EventEmitter    = require('eventemitter3');

// some constants
var DEFAULT_CONCURRENCY = 10;
var MAX_PROGRESS = 100;

/**
 * Manages the state and loading of multiple resources to load.
 *
 * @class
 * @param {string} [baseUrl=''] - The base url for all resources loaded by this loader.
 * @param {number} [concurrency=10] - The number of resources to load concurrently.
 */
function Loader(baseUrl, concurrency) {
    EventEmitter.call(this);

    concurrency = concurrency || DEFAULT_CONCURRENCY;

    /**
     * The base url for all resources loaded by this loader.
     *
     * @member {string}
     */
    this.baseUrl = baseUrl || '';

    /**
     * The progress percent of the loader going through the queue.
     *
     * @member {number}
     */
    this.progress = 0;

    /**
     * Loading state of the loader, true if it is currently loading resources.
     *
     * @member {boolean}
     */
    this.loading = false;

    /**
     * The percentage of total progress that a single resource represents.
     *
     * @member {number}
     */
    this._progressChunk = 0;

    /**
     * The middleware to run before loading each resource.
     *
     * @member {function[]}
     */
    this._beforeMiddleware = [];

    /**
     * The middleware to run after loading each resource.
     *
     * @member {function[]}
     */
    this._afterMiddleware = [];

    /**
     * The `_loadResource` function bound with this object context.
     *
     * @private
     * @member {function}
     */
    this._boundLoadResource = this._loadResource.bind(this);

    /**
     * The resource buffer that fills until `load` is called to start loading resources.
     *
     * @private
     * @member {Resource[]}
     */
    this._buffer = [];

    /**
     * Used to track load completion.
     *
     * @private
     * @member {number}
     */
    this._numToLoad = 0;

    /**
     * The resources waiting to be loaded.
     *
     * @private
     * @member {Resource[]}
     */
    this._queue = async.queue(this._boundLoadResource, concurrency);

    /**
     * All the resources for this loader keyed by name.
     *
     * @member {object<string, Resource>}
     */
    this.resources = {};

    /**
     * Emitted once per loaded or errored resource.
     *
     * @event progress
     * @memberof Loader#
     */

    /**
     * Emitted once per errored resource.
     *
     * @event error
     * @memberof Loader#
     */

    /**
     * Emitted once per loaded resource.
     *
     * @event load
     * @memberof Loader#
     */

    /**
     * Emitted when the loader begins to process the queue.
     *
     * @event start
     * @memberof Loader#
     */

    /**
     * Emitted when the queued resources all load.
     *
     * @event complete
     * @memberof Loader#
     */
}

Loader.prototype = Object.create(EventEmitter.prototype);
Loader.prototype.constructor = Loader;
module.exports = Loader;

/**
 * Adds a resource (or multiple resources) to the loader queue.
 *
 * This function can take a wide variety of different parameters. The only thing that is always
 * required the url to load. All the following will work:
 *
 * ```js
 * loader
 *     // normal param syntax
 *     .add('key', 'http://...', function () {})
 *     .add('http://...', function () {})
 *     .add('http://...')
 *
 *     // object syntax
 *     .add({
 *         name: 'key2',
 *         url: 'http://...'
 *     }, function () {})
 *     .add({
 *         url: 'http://...'
 *     }, function () {})
 *     .add({
 *         name: 'key3',
 *         url: 'http://...'
 *         onComplete: function () {}
 *     })
 *     .add({
 *         url: 'https://...',
 *         onComplete: function () {},
 *         crossOrigin: true
 *     })
 *
 *     // you can also pass an array of objects or urls or both
 *     .add([
 *         { name: 'key4', url: 'http://...', onComplete: function () {} },
 *         { url: 'http://...', onComplete: function () {} },
 *         'http://...'
 *     ])
 *
 *     // and you can use both params and options
 *     .add('key', 'http://...', { crossOrigin: true }, function () {})
 *     .add('http://...', { crossOrigin: true }, function () {});
 * ```
 *
 * @alias enqueue
 * @param {string} [name] - The name of the resource to load, if not passed the url is used.
 * @param {string} [url] - The url for this resource, relative to the baseUrl of this loader.
 * @param {object} [options] - The options for the load.
 * @param {boolean} [options.crossOrigin] - Is this request cross-origin? Default is to determine automatically.
 * @param {Resource.XHR_LOAD_TYPE} [options.loadType=Resource.LOAD_TYPE.XHR] - How should this resource be loaded?
 * @param {Resource.XHR_RESPONSE_TYPE} [options.xhrType=Resource.XHR_RESPONSE_TYPE.DEFAULT] - How should the data being
 *      loaded be interpreted when using XHR?
 * @param {function} [cb] - Function to call when this specific resource completes loading.
 * @return {Loader} Returns itself.
 */
Loader.prototype.add = Loader.prototype.enqueue = function (name, url, options, cb) {
    // special case of an array of objects or urls
    if (Array.isArray(name)) {
        for (var i = 0; i < name.length; ++i) {
            this.add(name[i]);
        }

        return this;
    }

    // if an object is passed instead of params
    if (typeof name === 'object') {
        cb = url || name.callback || name.onComplete;
        options = name;
        url = name.url;
        name = name.name || name.key || name.url;
    }

    // case where no name is passed shift all args over by one.
    if (typeof url !== 'string') {
        cb = options;
        options = url;
        url = name;
    }

    // now that we shifted make sure we have a proper url.
    if (typeof url !== 'string') {
        throw new Error('No url passed to add resource to loader.');
    }

    // options are optional so people might pass a function and no options
    if (typeof options === 'function') {
        cb = options;
        options = null;
    }

    // check if resource already exists.
    if (this.resources[name]) {
        throw new Error('Resource with name "' + name + '" already exists.');
    }

    // add base url if this isn't an absolute url
    url = this._prepareUrl(url);

    // create the store the resource
    this.resources[name] = new Resource(name, url, options);

    if (typeof cb === 'function') {
        this.resources[name].once('afterMiddleware', cb);
    }

    this._numToLoad++;

    // if already loading add it to the worker queue
    if (this._queue.started) {
        this._queue.push(this.resources[name]);
        this._progressChunk = (MAX_PROGRESS - this.progress) / (this._queue.length() + this._queue.running());
    }
    // otherwise buffer it to be added to the queue later
    else {
        this._buffer.push(this.resources[name]);
        this._progressChunk = MAX_PROGRESS / this._buffer.length;
    }

    return this;
};

/**
 * Sets up a middleware function that will run *before* the
 * resource is loaded.
 *
 * @alias pre
 * @method before
 * @param {function} fn - The middleware function to register.
 * @return {Loader} Returns itself.
 */
Loader.prototype.before = Loader.prototype.pre = function (fn) {
    this._beforeMiddleware.push(fn);

    return this;
};

/**
 * Sets up a middleware function that will run *after* the
 * resource is loaded.
 *
 * @alias use
 * @method after
 * @param {function} fn - The middleware function to register.
 * @return {Loader} Returns itself.
 */
Loader.prototype.after = Loader.prototype.use = function (fn) {
    this._afterMiddleware.push(fn);

    return this;
};

/**
 * Resets the queue of the loader to prepare for a new load.
 *
 * @return {Loader} Returns itself.
 */
Loader.prototype.reset = function () {
    // this.baseUrl = baseUrl || '';

    this.progress = 0;

    this.loading = false;

    this._progressChunk = 0;

    // this._beforeMiddleware.length = 0;
    // this._afterMiddleware.length = 0;

    this._buffer.length = 0;

    this._numToLoad = 0;

    this._queue.kill();
    this._queue.started = false;

    // abort all resource loads
    for (var k in this.resources) {
        var res = this.resources[k];

        res.off('complete', this._onLoad, this);

        if (res.isLoading) {
            res.abort();
        }
    }

    this.resources = {};

    return this;
};

/**
 * Starts loading the queued resources.
 *
 * @fires start
 * @param {function} [cb] - Optional callback that will be bound to the `complete` event.
 * @return {Loader} Returns itself.
 */
Loader.prototype.load = function (cb) {
    // register complete callback if they pass one
    if (typeof cb === 'function') {
        this.once('complete', cb);
    }

    // if the queue has already started we are done here
    if (this._queue.started) {
        return this;
    }

    // notify of start
    this.emit('start', this);

    // update loading state
    this.loading = true;

    // start the internal queue
    for (var i = 0; i < this._buffer.length; ++i) {
        this._queue.push(this._buffer[i]);
    }

    // empty the buffer
    this._buffer.length = 0;

    return this;
};

/**
 * Prepares a url for usage based on the configuration of this object
 *
 * @private
 * @param {string} url - The url to prepare.
 * @return {string} The prepared url.
 */
Loader.prototype._prepareUrl = function (url) {
    var parsedUrl = parseUri(url, { strictMode: true });

    // absolute url, just use it as is.
    if (parsedUrl.protocol || !parsedUrl.path || parsedUrl.path.indexOf('//') === 0) {
        return url;
    }

    // if baseUrl doesn't end in slash and url doesn't start with slash, then add a slash inbetween
    if (this.baseUrl.length
        && this.baseUrl.lastIndexOf('/') !== this.baseUrl.length - 1
        && url.charAt(0) !== '/'
    ) {
        return this.baseUrl + '/' + url;
    }

    return this.baseUrl + url;
};

/**
 * Loads a single resource.
 *
 * @private
 * @param {Resource} resource - The resource to load.
 * @param {function} dequeue - The function to call when we need to dequeue this item.
 */
Loader.prototype._loadResource = function (resource, dequeue) {
    var self = this;

    resource._dequeue = dequeue;

    // run before middleware
    async.eachSeries(
        this._beforeMiddleware,
        function (fn, next) {
            fn.call(self, resource, function () {
                // if the before middleware marks the resource as complete,
                // break and don't process any more before middleware
                next(resource.isComplete ? {} : null);
            });
        },
        function () {
            // resource.on('progress', self.emit.bind(self, 'progress'));

            if (resource.isComplete) {
                self._onLoad(resource);
            }
            else {
                resource.once('complete', self._onLoad, self);
                resource.load();
            }
        }
    );
};

/**
 * Called once each resource has loaded.
 *
 * @fires complete
 * @private
 */
Loader.prototype._onComplete = function () {
    this.loading = false;

    this.emit('complete', this, this.resources);
};

/**
 * Called each time a resources is loaded.
 *
 * @fires progress
 * @fires error
 * @fires load
 * @private
 * @param {Resource} resource - The resource that was loaded
 */
Loader.prototype._onLoad = function (resource) {
    var self = this;

    // run middleware, this *must* happen before dequeue so sub-assets get added properly
    async.eachSeries(
        this._afterMiddleware,
        function (fn, next) {
            fn.call(self, resource, next);
        },
        function () {
            resource.emit('afterMiddleware', resource);

            self._numToLoad--;

            self.progress += self._progressChunk;
            self.emit('progress', self, resource);

            if (resource.error) {
                self.emit('error', resource.error, self, resource);
            }
            else {
                self.emit('load', self, resource);
            }

            // do completion check
            if (self._numToLoad === 0) {
                self.progress = 100;
                self._onComplete();
            }
        }
    );

    // remove this resource from the async queue
    resource._dequeue();
};

Loader.LOAD_TYPE = Resource.LOAD_TYPE;
Loader.XHR_RESPONSE_TYPE = Resource.XHR_RESPONSE_TYPE;

},{"./Resource":4,"./async":5,"eventemitter3":1,"parse-uri":2}],4:[function(require,module,exports){
'use strict';

var EventEmitter    = require('eventemitter3');
var parseUri        = require('parse-uri');

// tests is CORS is supported in XHR, if not we need to use XDR
var useXdr = !!(window.XDomainRequest && !('withCredentials' in (new XMLHttpRequest())));
var tempAnchor = null;

// some status constants
var STATUS_NONE = 0;
var STATUS_OK = 200;
var STATUS_EMPTY = 204;

/**
 * Manages the state and loading of a single resource represented by
 * a single URL.
 *
 * @class
 * @param {string} name - The name of the resource to load.
 * @param {string|string[]} url - The url for this resource, for audio/video loads you can pass an array of sources.
 * @param {object} [options] - The options for the load.
 * @param {string|boolean} [options.crossOrigin] - Is this request cross-origin? Default is to determine automatically.
 * @param {Resource.LOAD_TYPE} [options.loadType=Resource.LOAD_TYPE.XHR] - How should this resource be loaded?
 * @param {Resource.XHR_RESPONSE_TYPE} [options.xhrType=Resource.XHR_RESPONSE_TYPE.DEFAULT] - How should the data being
 *      loaded be interpreted when using XHR?
 * @param {object} [options.metadata] - Extra info for middleware.
 */
function Resource(name, url, options) {
    EventEmitter.call(this);

    options = options || {};

    if (typeof name !== 'string' || typeof url !== 'string') {
        throw new Error('Both name and url are required for constructing a resource.');
    }

    /**
     * The name of this resource.
     *
     * @member {string}
     * @readonly
     */
    this.name = name;

    /**
     * The url used to load this resource.
     *
     * @member {string}
     * @readonly
     */
    this.url = url;

    /**
     * Stores whether or not this url is a data url.
     *
     * @member {boolean}
     * @readonly
     */
    this.isDataUrl = this.url.indexOf('data:') === 0;

    /**
     * The data that was loaded by the resource.
     *
     * @member {any}
     */
    this.data = null;

    /**
     * Is this request cross-origin? If unset, determined automatically.
     *
     * @member {string}
     */
    this.crossOrigin = options.crossOrigin === true ? 'anonymous' : options.crossOrigin;

    /**
     * The method of loading to use for this resource.
     *
     * @member {Resource.LOAD_TYPE}
     */
    this.loadType = options.loadType || this._determineLoadType();

    /**
     * The type used to load the resource via XHR. If unset, determined automatically.
     *
     * @member {string}
     */
    this.xhrType = options.xhrType;

    /**
     * Extra info for middleware, and controlling specifics about how the resource loads.
     *
     * Note that if you pass in a `loadElement`, the Resource class takes ownership of it.
     * Meaning it will modify it as it sees fit.
     *
     * @member {object}
     * @property {HTMLImageElement|HTMLAudioElement|HTMLVideoElement} [loadElement=null] - The
     *  element to use for loading, instead of creating one.
     * @property {boolean} [skipSource=false] - Skips adding source(s) to the load element. This
     *  is useful if you want to pass in a `loadElement` that you already added load sources
     *  to.
     */
    this.metadata = options.metadata || {};

    /**
     * The error that occurred while loading (if any).
     *
     * @member {Error}
     * @readonly
     */
    this.error = null;

    /**
     * The XHR object that was used to load this resource. This is only set
     * when `loadType` is `Resource.LOAD_TYPE.XHR`.
     *
     * @member {XMLHttpRequest}
     */
    this.xhr = null;

    /**
     * Describes if this resource was loaded as json. Only valid after the resource
     * has completely loaded.
     *
     * @member {boolean}
     */
    this.isJson = false;

    /**
     * Describes if this resource was loaded as xml. Only valid after the resource
     * has completely loaded.
     *
     * @member {boolean}
     */
    this.isXml = false;

    /**
     * Describes if this resource was loaded as an image tag. Only valid after the resource
     * has completely loaded.
     *
     * @member {boolean}
     */
    this.isImage = false;

    /**
     * Describes if this resource was loaded as an audio tag. Only valid after the resource
     * has completely loaded.
     *
     * @member {boolean}
     */
    this.isAudio = false;

    /**
     * Describes if this resource was loaded as a video tag. Only valid after the resource
     * has completely loaded.
     *
     * @member {boolean}
     */
    this.isVideo = false;

    /**
     * Describes if this resource has finished loading. Is true when the resource has completely
     * loaded.
     *
     * @member {boolean}
     */
    this.isComplete = false;

    /**
     * Describes if this resource is currently loading. Is true when the resource starts loading,
     * and is false again when complete.
     *
     * @member {boolean}
     */
    this.isLoading = false;

    /**
     * The `dequeue` method that will be used a storage place for the async queue dequeue method
     * used privately by the loader.
     *
     * @private
     * @member {function}
     */
    this._dequeue = null;

    /**
     * The `complete` function bound to this resource's context.
     *
     * @private
     * @member {function}
     */
    this._boundComplete = this.complete.bind(this);

    /**
     * The `_onError` function bound to this resource's context.
     *
     * @private
     * @member {function}
     */
    this._boundOnError = this._onError.bind(this);

    /**
     * The `_onProgress` function bound to this resource's context.
     *
     * @private
     * @member {function}
     */
    this._boundOnProgress = this._onProgress.bind(this);

    // xhr callbacks
    this._boundXhrOnError = this._xhrOnError.bind(this);
    this._boundXhrOnAbort = this._xhrOnAbort.bind(this);
    this._boundXhrOnLoad = this._xhrOnLoad.bind(this);
    this._boundXdrOnTimeout = this._xdrOnTimeout.bind(this);

    /**
     * Emitted when the resource beings to load.
     *
     * @event start
     * @memberof Resource#
     */

    /**
     * Emitted each time progress of this resource load updates.
     * Not all resources types and loader systems can support this event
     * so sometimes it may not be available. If the resource
     * is being loaded on a modern browser, using XHR, and the remote server
     * properly sets Content-Length headers, then this will be available.
     *
     * @event progress
     * @memberof Resource#
     */

    /**
     * Emitted once this resource has loaded, if there was an error it will
     * be in the `error` property.
     *
     * @event complete
     * @memberof Resource#
     */
}

Resource.prototype = Object.create(EventEmitter.prototype);
Resource.prototype.constructor = Resource;
module.exports = Resource;

/**
 * Marks the resource as complete.
 *
 * @fires complete
 */
Resource.prototype.complete = function () {
    // TODO: Clean this up in a wrapper or something...gross....
    if (this.data && this.data.removeEventListener) {
        this.data.removeEventListener('error', this._boundOnError, false);
        this.data.removeEventListener('load', this._boundComplete, false);
        this.data.removeEventListener('progress', this._boundOnProgress, false);
        this.data.removeEventListener('canplaythrough', this._boundComplete, false);
    }

    if (this.xhr) {
        if (this.xhr.removeEventListener) {
            this.xhr.removeEventListener('error', this._boundXhrOnError, false);
            this.xhr.removeEventListener('abort', this._boundXhrOnAbort, false);
            this.xhr.removeEventListener('progress', this._boundOnProgress, false);
            this.xhr.removeEventListener('load', this._boundXhrOnLoad, false);
        }
        else {
            this.xhr.onerror = null;
            this.xhr.ontimeout = null;
            this.xhr.onprogress = null;
            this.xhr.onload = null;
        }
    }

    if (this.isComplete) {
        throw new Error('Complete called again for an already completed resource.');
    }

    this.isComplete = true;
    this.isLoading = false;

    this.emit('complete', this);
};

/**
 * Aborts the loading of this resource, with an optional message.
 *
 * @param {string} message - The message to use for the error
 */
Resource.prototype.abort = function (message) {
    // abort can be called multiple times, ignore subsequent calls.
    if (this.error) {
        return;
    }

    // store error
    this.error = new Error(message);

    // abort the actual loading
    if (this.xhr) {
        this.xhr.abort();
    }
    else if (this.xdr) {
        this.xdr.abort();
    }
    else if (this.data) {
        // single source
        if (typeof this.data.src !== 'undefined') {
            this.data.src = '';
        }
        // multi-source
        else {
            while (this.data.firstChild) {
                this.data.removeChild(this.data.firstChild);
            }
        }
    }

    // done now.
    this.complete();
};

/**
 * Kicks off loading of this resource. This method is asynchronous.
 *
 * @fires start
 * @param {function} [cb] - Optional callback to call once the resource is loaded.
 */
Resource.prototype.load = function (cb) {
    if (this.isLoading) {
        return;
    }

    if (this.isComplete) {
        if (cb) {
            var self = this;

            setTimeout(function () {
                cb(self);
            }, 1);
        }

        return;
    }
    else if (cb) {
        this.once('complete', cb);
    }

    this.isLoading = true;

    this.emit('start', this);

    // if unset, determine the value
    if (this.crossOrigin === false || typeof this.crossOrigin !== 'string') {
        this.crossOrigin = this._determineCrossOrigin(this.url);
    }

    switch (this.loadType) {
        case Resource.LOAD_TYPE.IMAGE:
            this._loadElement('image');
            break;

        case Resource.LOAD_TYPE.AUDIO:
            this._loadSourceElement('audio');
            break;

        case Resource.LOAD_TYPE.VIDEO:
            this._loadSourceElement('video');
            break;

        case Resource.LOAD_TYPE.XHR:
            /* falls through */
        default:
            if (useXdr && this.crossOrigin) {
                this._loadXdr();
            }
            else {
                this._loadXhr();
            }
            break;
    }
};

/**
 * Loads this resources using an element that has a single source,
 * like an HTMLImageElement.
 *
 * @private
 * @param {string} type - The type of element to use.
 */
Resource.prototype._loadElement = function (type) {
    if (this.metadata.loadElement) {
        this.data = this.metadata.loadElement;
    }
    else if (type === 'image' && typeof window.Image !== 'undefined') {
        this.data = new Image();
    }
    else {
        this.data = document.createElement(type);
    }

    if (this.crossOrigin) {
        this.data.crossOrigin = this.crossOrigin;
    }

    if (!this.metadata.skipSource) {
        this.data.src = this.url;
    }

    var typeName = 'is' + type[0].toUpperCase() + type.substring(1);

    if (this[typeName] === false) {
        this[typeName] = true;
    }

    this.data.addEventListener('error', this._boundOnError, false);
    this.data.addEventListener('load', this._boundComplete, false);
    this.data.addEventListener('progress', this._boundOnProgress, false);
};

/**
 * Loads this resources using an element that has multiple sources,
 * like an HTMLAudioElement or HTMLVideoElement.
 *
 * @private
 * @param {string} type - The type of element to use.
 */
Resource.prototype._loadSourceElement = function (type) {
    if (this.metadata.loadElement) {
        this.data = this.metadata.loadElement;
    }
    else if (type === 'audio' && typeof window.Audio !== 'undefined') {
        this.data = new Audio();
    }
    else {
        this.data = document.createElement(type);
    }

    if (this.data === null) {
        this.abort('Unsupported element ' + type);

        return;
    }

    if (!this.metadata.skipSource) {
        // support for CocoonJS Canvas+ runtime, lacks document.createElement('source')
        if (navigator.isCocoonJS) {
            this.data.src = Array.isArray(this.url) ? this.url[0] : this.url;
        }
        else if (Array.isArray(this.url)) {
            for (var i = 0; i < this.url.length; ++i) {
                this.data.appendChild(this._createSource(type, this.url[i]));
            }
        }
        else {
            this.data.appendChild(this._createSource(type, this.url));
        }
    }

    this['is' + type[0].toUpperCase() + type.substring(1)] = true;

    this.data.addEventListener('error', this._boundOnError, false);
    this.data.addEventListener('load', this._boundComplete, false);
    this.data.addEventListener('progress', this._boundOnProgress, false);
    this.data.addEventListener('canplaythrough', this._boundComplete, false);

    this.data.load();
};

/**
 * Loads this resources using an XMLHttpRequest.
 *
 * @private
 */
Resource.prototype._loadXhr = function () {
    // if unset, determine the value
    if (typeof this.xhrType !== 'string') {
        this.xhrType = this._determineXhrType();
    }

    var xhr = this.xhr = new XMLHttpRequest();

    // set the request type and url
    xhr.open('GET', this.url, true);

    // load json as text and parse it ourselves. We do this because some browsers
    // *cough* safari *cough* can't deal with it.
    if (this.xhrType === Resource.XHR_RESPONSE_TYPE.JSON || this.xhrType === Resource.XHR_RESPONSE_TYPE.DOCUMENT) {
        xhr.responseType = Resource.XHR_RESPONSE_TYPE.TEXT;
    }
    else {
        xhr.responseType = this.xhrType;
    }

    xhr.addEventListener('error', this._boundXhrOnError, false);
    xhr.addEventListener('abort', this._boundXhrOnAbort, false);
    xhr.addEventListener('progress', this._boundOnProgress, false);
    xhr.addEventListener('load', this._boundXhrOnLoad, false);

    xhr.send();
};

/**
 * Loads this resources using an XDomainRequest. This is here because we need to support IE9 (gross).
 *
 * @private
 */
Resource.prototype._loadXdr = function () {
    // if unset, determine the value
    if (typeof this.xhrType !== 'string') {
        this.xhrType = this._determineXhrType();
    }

    var xdr = this.xhr = new XDomainRequest();

    // XDomainRequest has a few quirks. Occasionally it will abort requests
    // A way to avoid this is to make sure ALL callbacks are set even if not used
    // More info here: http://stackoverflow.com/questions/15786966/xdomainrequest-aborts-post-on-ie-9
    xdr.timeout = 5000;

    xdr.onerror = this._boundXhrOnError;
    xdr.ontimeout = this._boundXdrOnTimeout;
    xdr.onprogress = this._boundOnProgress;
    xdr.onload = this._boundXhrOnLoad;

    xdr.open('GET', this.url, true);

    // Note: The xdr.send() call is wrapped in a timeout to prevent an
    // issue with the interface where some requests are lost if multiple
    // XDomainRequests are being sent at the same time.
    // Some info here: https://github.com/photonstorm/phaser/issues/1248
    setTimeout(function () {
        xdr.send();
    }, 0);
};

/**
 * Creates a source used in loading via an element.
 *
 * @private
 * @param {string} type - The element type (video or audio).
 * @param {string} url - The source URL to load from.
 * @param {string} [mime] - The mime type of the video
 * @return {HTMLSourceElement} The source element.
 */
Resource.prototype._createSource = function (type, url, mime) {
    if (!mime) {
        mime = type + '/' + url.substr(url.lastIndexOf('.') + 1);
    }

    var source = document.createElement('source');

    source.src = url;
    source.type = mime;

    return source;
};

/**
 * Called if a load errors out.
 *
 * @param {Event} event - The error event from the element that emits it.
 * @private
 */
Resource.prototype._onError = function (event) {
    this.abort('Failed to load element using ' + event.target.nodeName);
};

/**
 * Called if a load progress event fires for xhr/xdr.
 *
 * @fires progress
 * @private
 * @param {XMLHttpRequestProgressEvent|Event} event - Progress event.
 */
Resource.prototype._onProgress = function (event) {
    if (event && event.lengthComputable) {
        this.emit('progress', this, event.loaded / event.total);
    }
};

/**
 * Called if an error event fires for xhr/xdr.
 *
 * @private
 * @param {XMLHttpRequestErrorEvent|Event} event - Error event.
 */
Resource.prototype._xhrOnError = function () {
    var xhr = this.xhr;

    this.abort(reqType(xhr) + ' Request failed. Status: ' + xhr.status + ', text: "' + xhr.statusText + '"');
};

/**
 * Called if an abort event fires for xhr.
 *
 * @private
 * @param {XMLHttpRequestAbortEvent} event - Abort Event
 */
Resource.prototype._xhrOnAbort = function () {
    this.abort(reqType(this.xhr) + ' Request was aborted by the user.');
};

/**
 * Called if a timeout event fires for xdr.
 *
 * @private
 * @param {Event} event - Timeout event.
 */
Resource.prototype._xdrOnTimeout = function () {
    this.abort(reqType(this.xhr) + ' Request timed out.');
};

/**
 * Called when data successfully loads from an xhr/xdr request.
 *
 * @private
 * @param {XMLHttpRequestLoadEvent|Event} event - Load event
 */
Resource.prototype._xhrOnLoad = function () {
    var xhr = this.xhr;
    var status = typeof xhr.status === 'undefined' ? xhr.status : STATUS_OK; // XDR has no `.status`, assume 200.

    // status can be 0 when using the file:// protocol, also check if a response was found
    if (status === STATUS_OK || status === STATUS_EMPTY || (status === STATUS_NONE && xhr.responseText.length > 0)) {
        // if text, just return it
        if (this.xhrType === Resource.XHR_RESPONSE_TYPE.TEXT) {
            this.data = xhr.responseText;
        }
        // if json, parse into json object
        else if (this.xhrType === Resource.XHR_RESPONSE_TYPE.JSON) {
            try {
                this.data = JSON.parse(xhr.responseText);
                this.isJson = true;
            }
            catch (e) {
                this.abort('Error trying to parse loaded json:', e);

                return;
            }
        }
        // if xml, parse into an xml document or div element
        else if (this.xhrType === Resource.XHR_RESPONSE_TYPE.DOCUMENT) {
            try {
                if (window.DOMParser) {
                    var domparser = new DOMParser();

                    this.data = domparser.parseFromString(xhr.responseText, 'text/xml');
                }
                else {
                    var div = document.createElement('div');

                    div.innerHTML = xhr.responseText;
                    this.data = div;
                }
                this.isXml = true;
            }
            catch (e) {
                this.abort('Error trying to parse loaded xml:', e);

                return;
            }
        }
        // other types just return the response
        else {
            this.data = xhr.response || xhr.responseText;
        }
    }
    else {
        this.abort('[' + xhr.status + ']' + xhr.statusText + ':' + xhr.responseURL);

        return;
    }

    this.complete();
};

/**
 * Sets the `crossOrigin` property for this resource based on if the url
 * for this resource is cross-origin. If crossOrigin was manually set, this
 * function does nothing.
 *
 * @private
 * @param {string} url - The url to test.
 * @param {object} [loc=window.location] - The location object to test against.
 * @return {string} The crossOrigin value to use (or empty string for none).
 */
Resource.prototype._determineCrossOrigin = function (url, loc) {
    // data: and javascript: urls are considered same-origin
    if (url.indexOf('data:') === 0) {
        return '';
    }

    // default is window.location
    loc = loc || window.location;

    if (!tempAnchor) {
        tempAnchor = document.createElement('a');
    }

    // let the browser determine the full href for the url of this resource and then
    // parse with the node url lib, we can't use the properties of the anchor element
    // because they don't work in IE9 :(
    tempAnchor.href = url;
    url = parseUri(tempAnchor.href, { strictMode: true });

    var samePort = (!url.port && loc.port === '') || (url.port === loc.port);
    var protocol = url.protocol ? url.protocol + ':' : '';

    // if cross origin
    if (url.host !== loc.hostname || !samePort || protocol !== loc.protocol) {
        return 'anonymous';
    }

    return '';
};

/**
 * Determines the responseType of an XHR request based on the extension of the
 * resource being loaded.
 *
 * @private
 * @return {Resource.XHR_RESPONSE_TYPE} The responseType to use.
 */
Resource.prototype._determineXhrType = function () {
    return Resource._xhrTypeMap[this._getExtension()] || Resource.XHR_RESPONSE_TYPE.TEXT;
};

Resource.prototype._determineLoadType = function () {
    return Resource._loadTypeMap[this._getExtension()] || Resource.LOAD_TYPE.XHR;
};

Resource.prototype._getExtension = function () {
    var url = this.url;
    var ext = '';

    if (this.isDataUrl) {
        var slashIndex = url.indexOf('/');

        ext = url.substring(slashIndex + 1, url.indexOf(';', slashIndex));
    }
    else {
        var queryStart = url.indexOf('?');

        if (queryStart !== -1) {
            url = url.substring(0, queryStart);
        }

        ext = url.substring(url.lastIndexOf('.') + 1);
    }

    return ext.toLowerCase();
};

/**
 * Determines the mime type of an XHR request based on the responseType of
 * resource being loaded.
 *
 * @private
 * @param {Resource.XHR_RESPONSE_TYPE} type - The type to get a mime type for.
 * @return {string} The mime type to use.
 */
Resource.prototype._getMimeFromXhrType = function (type) {
    switch (type) {
        case Resource.XHR_RESPONSE_TYPE.BUFFER:
            return 'application/octet-binary';

        case Resource.XHR_RESPONSE_TYPE.BLOB:
            return 'application/blob';

        case Resource.XHR_RESPONSE_TYPE.DOCUMENT:
            return 'application/xml';

        case Resource.XHR_RESPONSE_TYPE.JSON:
            return 'application/json';

        case Resource.XHR_RESPONSE_TYPE.DEFAULT:
        case Resource.XHR_RESPONSE_TYPE.TEXT:
            /* falls through */
        default:
            return 'text/plain';

    }
};

/**
 * Quick helper to get string xhr type.
 *
 * @ignore
 * @param {XMLHttpRequest|XDomainRequest} xhr - The request to check.
 * @return {string} The type.
 */
function reqType(xhr) {
    return xhr.toString().replace('object ', '');
}

/**
 * The types of loading a resource can use.
 *
 * @static
 * @readonly
 * @enum {number}
 */
Resource.LOAD_TYPE = {
    /** Uses XMLHttpRequest to load the resource. */
    XHR:    1,
    /** Uses an `Image` object to load the resource. */
    IMAGE:  2,
    /** Uses an `Audio` object to load the resource. */
    AUDIO:  3,
    /** Uses a `Video` object to load the resource. */
    VIDEO:  4
};

/**
 * The XHR ready states, used internally.
 *
 * @static
 * @readonly
 * @enum {string}
 */
Resource.XHR_RESPONSE_TYPE = {
    /** defaults to text */
    DEFAULT:    'text',
    /** ArrayBuffer */
    BUFFER:     'arraybuffer',
    /** Blob */
    BLOB:       'blob',
    /** Document */
    DOCUMENT:   'document',
    /** Object */
    JSON:       'json',
    /** String */
    TEXT:       'text'
};

Resource._loadTypeMap = {
    gif:      Resource.LOAD_TYPE.IMAGE,
    png:      Resource.LOAD_TYPE.IMAGE,
    bmp:      Resource.LOAD_TYPE.IMAGE,
    jpg:      Resource.LOAD_TYPE.IMAGE,
    jpeg:     Resource.LOAD_TYPE.IMAGE,
    tif:      Resource.LOAD_TYPE.IMAGE,
    tiff:     Resource.LOAD_TYPE.IMAGE,
    webp:     Resource.LOAD_TYPE.IMAGE,
    tga:      Resource.LOAD_TYPE.IMAGE,
    'svg+xml':  Resource.LOAD_TYPE.IMAGE
};

Resource._xhrTypeMap = {
    // xml
    xhtml:    Resource.XHR_RESPONSE_TYPE.DOCUMENT,
    html:     Resource.XHR_RESPONSE_TYPE.DOCUMENT,
    htm:      Resource.XHR_RESPONSE_TYPE.DOCUMENT,
    xml:      Resource.XHR_RESPONSE_TYPE.DOCUMENT,
    tmx:      Resource.XHR_RESPONSE_TYPE.DOCUMENT,
    tsx:      Resource.XHR_RESPONSE_TYPE.DOCUMENT,
    svg:      Resource.XHR_RESPONSE_TYPE.DOCUMENT,

    // images
    gif:      Resource.XHR_RESPONSE_TYPE.BLOB,
    png:      Resource.XHR_RESPONSE_TYPE.BLOB,
    bmp:      Resource.XHR_RESPONSE_TYPE.BLOB,
    jpg:      Resource.XHR_RESPONSE_TYPE.BLOB,
    jpeg:     Resource.XHR_RESPONSE_TYPE.BLOB,
    tif:      Resource.XHR_RESPONSE_TYPE.BLOB,
    tiff:     Resource.XHR_RESPONSE_TYPE.BLOB,
    webp:     Resource.XHR_RESPONSE_TYPE.BLOB,
    tga:      Resource.XHR_RESPONSE_TYPE.BLOB,

    // json
    json:     Resource.XHR_RESPONSE_TYPE.JSON,

    // text
    text:     Resource.XHR_RESPONSE_TYPE.TEXT,
    txt:      Resource.XHR_RESPONSE_TYPE.TEXT
};

/**
 * Sets the load type to be used for a specific extension.
 *
 * @static
 * @param {string} extname - The extension to set the type for, e.g. "png" or "fnt"
 * @param {Resource.LOAD_TYPE} loadType - The load type to set it to.
 */
Resource.setExtensionLoadType = function (extname, loadType) {
    setExtMap(Resource._loadTypeMap, extname, loadType);
};

/**
 * Sets the load type to be used for a specific extension.
 *
 * @static
 * @param {string} extname - The extension to set the type for, e.g. "png" or "fnt"
 * @param {Resource.XHR_RESPONSE_TYPE} xhrType - The xhr type to set it to.
 */
Resource.setExtensionXhrType = function (extname, xhrType) {
    setExtMap(Resource._xhrTypeMap, extname, xhrType);
};

function setExtMap(map, extname, val) {
    if (extname && extname.indexOf('.') === 0) {
        extname = extname.substring(1);
    }

    if (!extname) {
        return;
    }

    map[extname] = val;
}

},{"eventemitter3":1,"parse-uri":2}],5:[function(require,module,exports){
'use strict';

/**
 * Smaller version of the async library constructs.
 *
 */

module.exports = {
    eachSeries: asyncEachSeries,
    queue: asyncQueue
};

function _noop() { /* empty */ }

/**
 * Iterates an array in series.
 *
 * @param {*[]} array - Array to iterate.
 * @param {function} iterator - Function to call for each element.
 * @param {function} callback - Function to call when done, or on error.
 */
function asyncEachSeries(array, iterator, callback) {
    var i = 0;
    var len = array.length;

    (function next(err) {
        if (err || i === len) {
            if (callback) {
                callback(err);
            }

            return;
        }

        iterator(array[i++], next);
    })();
}

/**
 * Ensures a function is only called once.
 *
 * @param {function} fn - The function to wrap.
 * @return {function} The wrapping function.
 */
function onlyOnce(fn) {
    return function onceWrapper() {
        if (fn === null) {
            throw new Error('Callback was already called.');
        }

        var callFn = fn;

        fn = null;
        callFn.apply(this, arguments);
    };
}

/**
 * Async queue implementation,
 *
 * @param {function} worker - The worker function to call for each task.
 * @param {number} concurrency - How many workers to run in parrallel.
 * @return {*} The async queue object.
 */
function asyncQueue(worker, concurrency) {
    if (concurrency == null) { // eslint-disable-line no-eq-null,eqeqeq
        concurrency = 1;
    }
    else if (concurrency === 0) {
        throw new Error('Concurrency must not be zero');
    }

    var workers = 0;
    var q = {
        _tasks: [],
        concurrency: concurrency,
        saturated: _noop,
        unsaturated: _noop,
        buffer: concurrency / 4,
        empty: _noop,
        drain: _noop,
        error: _noop,
        started: false,
        paused: false,
        push: function (data, callback) {
            _insert(data, false, callback);
        },
        kill: function () {
            q.drain = _noop;
            q._tasks = [];
        },
        unshift: function (data, callback) {
            _insert(data, true, callback);
        },
        process: function () {
            while (!q.paused && workers < q.concurrency && q._tasks.length) {
                var task = q._tasks.shift();

                if (q._tasks.length === 0) {
                    q.empty();
                }

                workers += 1;

                if (workers === q.concurrency) {
                    q.saturated();
                }

                worker(task.data, onlyOnce(_next(task)));
            }
        },
        length: function () {
            return q._tasks.length;
        },
        running: function () {
            return workers;
        },
        idle: function () {
            return q._tasks.length + workers === 0;
        },
        pause: function () {
            if (q.paused === true) {
                return;
            }

            q.paused = true;
        },
        resume: function () {
            if (q.paused === false) {
                return;
            }

            q.paused = false;

            // Need to call q.process once per concurrent
            // worker to preserve full concurrency after pause
            for (var w = 1; w <= q.concurrency; w++) {
                q.process();
            }
        }
    };

    function _insert(data, insertAtFront, callback) {
        if (callback != null && typeof callback !== 'function') { // eslint-disable-line no-eq-null,eqeqeq
            throw new Error('task callback must be a function');
        }

        q.started = true;

        if (data == null && q.idle()) { // eslint-disable-line no-eq-null,eqeqeq
            // call drain immediately if there are no tasks
            setTimeout(function () {
                q.drain();
            }, 1);

            return;
        }

        var item = {
            data: data,
            callback: typeof callback === 'function' ? callback : _noop
        };

        if (insertAtFront) {
            q._tasks.unshift(item);
        }
        else {
            q._tasks.push(item);
        }

        setTimeout(function () {
            q.process();
        }, 1);
    }

    function _next(task) {
        return function () {
            workers -= 1;

            task.callback.apply(task, arguments);

            if (arguments[0] != null) { // eslint-disable-line no-eq-null,eqeqeq
                q.error(arguments[0], task.data);
            }

            if (workers <= (q.concurrency - q.buffer)) {
                q.unsaturated();
            }

            if (q.idle()) {
                q.drain();
            }

            q.process();
        };
    }

    return q;
}

},{}],6:[function(require,module,exports){
/* eslint no-magic-numbers: 0 */
'use strict';

module.exports = {
    // private property
    _keyStr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',

    encodeBinary: function (input) {
        var output = '';
        var bytebuffer;
        var encodedCharIndexes = new Array(4);
        var inx = 0;
        var jnx = 0;
        var paddingBytes = 0;

        while (inx < input.length) {
            // Fill byte buffer array
            bytebuffer = new Array(3);

            for (jnx = 0; jnx < bytebuffer.length; jnx++) {
                if (inx < input.length) {
                    // throw away high-order byte, as documented at:
                    // https://developer.mozilla.org/En/Using_XMLHttpRequest#Handling_binary_data
                    bytebuffer[jnx] = input.charCodeAt(inx++) & 0xff;
                }
                else {
                    bytebuffer[jnx] = 0;
                }
            }

            // Get each encoded character, 6 bits at a time
            // index 1: first 6 bits
            encodedCharIndexes[0] = bytebuffer[0] >> 2;
            // index 2: second 6 bits (2 least significant bits from input byte 1 + 4 most significant bits from byte 2)
            encodedCharIndexes[1] = ((bytebuffer[0] & 0x3) << 4) | (bytebuffer[1] >> 4);
            // index 3: third 6 bits (4 least significant bits from input byte 2 + 2 most significant bits from byte 3)
            encodedCharIndexes[2] = ((bytebuffer[1] & 0x0f) << 2) | (bytebuffer[2] >> 6);
            // index 3: forth 6 bits (6 least significant bits from input byte 3)
            encodedCharIndexes[3] = bytebuffer[2] & 0x3f;

            // Determine whether padding happened, and adjust accordingly
            paddingBytes = inx - (input.length - 1);
            switch (paddingBytes) {
                case 2:
                    // Set last 2 characters to padding char
                    encodedCharIndexes[3] = 64;
                    encodedCharIndexes[2] = 64;
                    break;

                case 1:
                    // Set last character to padding char
                    encodedCharIndexes[3] = 64;
                    break;

                default:
                    break; // No padding - proceed
            }

            // Now we will grab each appropriate character out of our keystring
            // based on our index array and append it to the output string
            for (jnx = 0; jnx < encodedCharIndexes.length; jnx++) {
                output += this._keyStr.charAt(encodedCharIndexes[jnx]);
            }
        }

        return output;
    }
};

},{}],7:[function(require,module,exports){
/* eslint global-require: 0 */
'use strict';

module.exports = require('./Loader');
module.exports.Resource = require('./Resource');
module.exports.middleware = {
    caching: {
        memory: require('./middlewares/caching/memory')
    },
    parsing: {
        blob: require('./middlewares/parsing/blob')
    }
};

module.exports.async = require('./async');

},{"./Loader":3,"./Resource":4,"./async":5,"./middlewares/caching/memory":8,"./middlewares/parsing/blob":9}],8:[function(require,module,exports){
'use strict';

// a simple in-memory cache for resources
var cache = {};

module.exports = function () {
    return function (resource, next) {
        // if cached, then set data and complete the resource
        if (cache[resource.url]) {
            resource.data = cache[resource.url];
            resource.complete(); // marks resource load complete and stops processing before middlewares
        }
        // if not cached, wait for complete and store it in the cache.
        else {
            resource.once('complete', function () {
                cache[this.url] = this.data;
            });
        }

        next();
    };
};

},{}],9:[function(require,module,exports){
'use strict';

var Resource = require('../../Resource');
var b64 = require('../../b64');

var Url = window.URL || window.webkitURL;

// a middleware for transforming XHR loaded Blobs into more useful objects

module.exports = function () {
    return function (resource, next) {
        if (!resource.data) {
            next();

            return;
        }

        // if this was an XHR load of a blob
        if (resource.xhr && resource.xhrType === Resource.XHR_RESPONSE_TYPE.BLOB) {
            // if there is no blob support we probably got a binary string back
            if (!window.Blob || typeof resource.data === 'string') {
                var type = resource.xhr.getResponseHeader('content-type');

                // this is an image, convert the binary string into a data url
                if (type && type.indexOf('image') === 0) {
                    resource.data = new Image();
                    resource.data.src = 'data:' + type + ';base64,' + b64.encodeBinary(resource.xhr.responseText);

                    resource.isImage = true;

                    // wait until the image loads and then callback
                    resource.data.onload = function () {
                        resource.data.onload = null;

                        next();
                    };

                    // next will be called on load
                    return;
                }
            }
            // if content type says this is an image, then we should transform the blob into an Image object
            else if (resource.data.type.indexOf('image') === 0) {
                var src = Url.createObjectURL(resource.data);

                resource.blob = resource.data;
                resource.data = new Image();
                resource.data.src = src;

                resource.isImage = true;

                // cleanup the no longer used blob after the image loads
                resource.data.onload = function () {
                    Url.revokeObjectURL(src);
                    resource.data.onload = null;

                    next();
                };

                // next will be called on load.
                return;
            }
        }

        next();
    };
};

console.info('resource');
},{"../../Resource":4,"../../b64":6}]},{},[7])(7)
});
console.info('resource-loader end');