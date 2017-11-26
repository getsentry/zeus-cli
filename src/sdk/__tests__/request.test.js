'use strict';

/* eslint-env jest */

// TODO(ja): Update to jest v21.3.0 once released:
//            - use expect(promise).rejects.toThrow()
//            - use expect(jest.fn).toMatchSnapshot()

const fetch = require('node-fetch');
const request = require('../request');

const mockPromise = (value, reason) =>
  new Promise((resolve, reject) => {
    setImmediate(() => (reason ? reject(reason) : resolve(value)));
  });

function mockFetch(status, json, statusText) {
  const ok = status >= 200 && status <= 300;
  fetch.mockReturnValue(mockPromise({ status, ok, json, statusText }));
}

describe('request', () => {
  beforeEach(() => {
    fetch.mockReset();
  });

  test('passes all parameters to fetch', () => {
    expect.assertions(1);
    mockFetch(200, () => mockPromise());

    return request('http://example.org', {
      method: 'POST',
      headers: { Authorization: 'bearer yo!' },
    }).then(() => {
      expect(fetch.mock.calls[0]).toMatchSnapshot();
    });
  });

  test('resolves the parsed JSON result for status 200', () => {
    mockFetch(200, () => mockPromise({ foo: 'bar' }));
    return expect(request('http://example.org')).resolves.toEqual({
      foo: 'bar',
    });
  });

  test('resolves undefined for status 204', () => {
    mockFetch(204, () => {
      throw new Error('should not be called');
    });

    return expect(request('http://example.org')).resolves.toBeUndefined();
  });

  test('throws an error containing the status text', () => {
    mockFetch(400, () => mockPromise(null, 'empty'), 'BAD REQUEST');
    const err = new Error('400 BAD REQUEST');
    return expect(request('http://example.org')).rejects.toEqual(err);
  });

  test('throws an error containing the resolved error message', () => {
    const message = 'Error message';
    mockFetch(400, () => mockPromise({ message }));
    const err = new Error(message);
    return expect(request('http://example.org')).rejects.toEqual(err);
  });

  test('falls back to the status text when parsing errors', () => {
    expect.assertions(1);
    mockFetch(400, () => mockPromise({}), 'BAD REQUEST');
    const err = new Error('400 BAD REQUEST');
    return expect(request('http://example.org')).rejects.toEqual(err);
  });
});
