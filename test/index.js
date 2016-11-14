import test from 'ava';
const lib = require('../lib');

test('proxy() should override an existing method', t => {
  // ARRANGE
  const testMethod = function () { };
  const obj = {
    testMethod: testMethod
  };
  t.is(obj.testMethod, testMethod);

  // ACT
  lib.proxy(obj, 'testMethod');

  // ASSERT
  t.not(obj.testMethod, testMethod);
});

test('proxy() should wrap an existing function', t => {
  // ARRANGE
  const testMethod = function () { };

  // ACT
  const proxied = lib.proxy(testMethod);

  // ASSERT
  t.is(typeof proxied, 'function');
  t.not(proxied, testMethod);
});

test('proxied methods should proxy calls to existing method', t => {
  // ARRANGE
  const testMethod = function () {
    this.called = true;
  };
  const obj = { called: false, testMethod: testMethod };
  lib.proxy(obj, 'testMethod');
  t.false(obj.called);

  // ACT
  obj.testMethod();

  // ASSERT
  t.true(obj.called);
});

test('proxied functions should proxy calls to existing function', t => {
  // ARRANGE
  let called = false;
  const testMethod = function () {
    called = true;
  };
  const proxied = lib.proxy(testMethod);
  t.false(called);

  // ACT
  proxied();

  // ASSERT
  t.true(called);
});

test('proxied methods should proxy arguments to existing method', t => {
  // ARRANGE
  const testMethod = function () {
    this.calledWith = arguments;
  };
  const obj = { testMethod: testMethod };
  lib.proxy(obj, 'testMethod');

  // ACT
  obj.testMethod(1, 'a');

  // ASSERT
  t.is(obj.calledWith[0], 1);
  t.is(obj.calledWith[1], 'a');
});

test('proxied functions should proxy arguments to existing function', t => {
  // ARRANGE
  let calledWith;
  const testMethod = function () {
    calledWith = arguments;
  };
  const proxied = lib.proxy(testMethod);

  // ACT
  proxied(1, 'a');

  // ASSERT
  t.is(calledWith[0], 1);
  t.is(calledWith[1], 'a');
});

test('proxied methods should emit events when called', t => {
  // ARRANGE
  let callCount = 0;
  const testMethod = function () { };
  const obj = { testMethod: testMethod };
  const proxy = lib.proxy(obj, 'testMethod');
  proxy.on('call', e => { callCount++; });

  // ACT
  obj.testMethod();

  // ASSERT
  t.is(callCount, 1);
});

test('proxied functions should emit events when called', t => {
  // ARRANGE
  let callCount = 0;
  const testMethod = function () { };
  const proxied = lib.proxy(testMethod);
  proxied.on('call', e => { callCount++; });

  // ACT
  proxied();

  // ASSERT
  t.is(callCount, 1);
});

test('proxied methods should emit call data when called', t => {
  // ARRANGE
  let call = null;
  const testMethod = function () { };
  const obj = { testMethod: testMethod };
  const proxy = lib.proxy(obj, 'testMethod');
  proxy.on('call', e => {
    call = e;
  });

  // ACT
  obj.testMethod(9, 'x');

  // ASSERT
  t.is(call.this, obj);
  t.is(call.method, 'testMethod');
  t.is(call.arguments[0], 9);
  t.is(call.arguments[1], 'x');
});

test('proxied functions should emit call data when called', t => {
  // ARRANGE
  let call = null;
  const testMethod = function () { };
  const proxy = lib.proxy(testMethod);
  proxy.on('call', e => {
    call = e;
  });

  // ACT
  proxy(9, 'x');

  // ASSERT
  t.is(call.function, testMethod);
  t.is(call.arguments[0], 9);
  t.is(call.arguments[1], 'x');
});

test('restore() should restore a proxied method', t => {
  // ARRANGE
  const testMethod = function () { };
  const obj = {
    testMethod: testMethod
  };
  const proxied = lib.proxy(obj, 'testMethod');
  t.not(obj.testMethod, testMethod);

  // ACT
  proxied.restore();

  // ASSERT
  t.is(obj.testMethod, testMethod);
});
