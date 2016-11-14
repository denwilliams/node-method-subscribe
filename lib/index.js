const EventEmitter = require('events').EventEmitter;

exports.proxy = function (context, method) {
  if (typeof method === 'string') return proxyMethod(context, method);
  return proxyFunction(context);
};

function proxyMethod(obj, method) {
  const original = obj[method];
  const e = new EventEmitter();
  const proxy = function () {
    e.emit('call', {
      this: obj,
      method: method,
      arguments: arguments
    });
    return original.apply(obj, arguments);
  }

  proxy.addListener = e.addListener.bind(e);
  proxy.on = e.on.bind(e);
  proxy.once = e.once.bind(e);
  proxy.removeListener = e.removeListener.bind(e);
  proxy.removeAllListeners = e.removeAllListeners.bind(e);

  proxy.restore = function () {
    obj[method] = original;
  }
  obj[method] = proxy;
  return proxy;
}

function proxyFunction(fn) {
  const e = new EventEmitter();
  const proxy = function () {
    e.emit('call', { function: fn, arguments: arguments });
    return fn.apply(null, arguments);
  }

  proxy.addListener = e.addListener.bind(e);
  proxy.on = e.on.bind(e);
  proxy.once = e.once.bind(e);
  proxy.removeListener = e.removeListener.bind(e);
  proxy.removeAllListeners = e.removeAllListeners.bind(e);

  return proxy;
}
