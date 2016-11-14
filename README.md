# Method Subscribe

Allows subscribing to method or function calls for any object/instance.

Works by proxying a method (or function) and firing events on every call.

Different from other spy libraries that record interactions with methods this is intended to provide real-time events for method calls.

Useful for testing background logic or firing events from third-party code.

## Use

```js
const methodSubscribe = require('method-subscribe');
const proxy = methodSubscribe.proxy(myService, 'doStuff');

proxy.on('call', (e) => {
  console.log('myService.doStuff called', e.arguments);
});

myService.doStuff(123);
```

- An `call` event is first emitted with the called arguments
- The original `doStuff` method is then called
