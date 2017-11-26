'use strict';

/* eslint-env jest */

const Client = require('../client');
const request = require('../request');

jest.mock('../request');

describe('Client', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    request.mockReturnValue(Promise.resolve({ some: 'data' }));
  });

  describe('constructor', () => {
    const env = Object.assign({}, process.env);

    afterEach(() => {
      process.env = Object.assign({}, env);
    });

    test('initializes with the default URL', () => {
      const client = new Client();
      expect(client.url).toBe(Client.DEFAULT_URL);
    });

    test('reads from the ZEUS_URL environment variable', () => {
      const url = 'https://example.org/';
      process.env.ZEUS_URL = url;
      const client = new Client();
      expect(client.url).toBe(url);
    });

    test('reads from the url option', () => {
      const url = 'https://example.org/';
      process.env.ZEUS_URL = 'invalid';
      const client = new Client({ url });
      expect(client.url).toBe(url);
    });

    test('fails with an invalid URL', () => {
      const url = 'https://';
      expect(() => new Client({ url })).toThrow(/valid URL/);
    });

    test('initializes with an empty token', () => {
      const client = new Client();
      expect(client.token).toBeFalsy();
    });

    test('reads from the ZEUS_TOKEN environment variable', () => {
      const token = 'zeus-u-1234567890';
      process.env.ZEUS_TOKEN = token;
      const client = new Client();
      expect(client.token).toBe(token);
    });

    test('reads from the token option', () => {
      const token = 'zeus-u-1234567890';
      process.env.ZEUS_TOKEN = 'invalid';
      const client = new Client({ token });
      expect(client.token).toBe(token);
    });

    test('uses the provided logger', () => {
      const logger = {};
      const client = new Client({ logger });
      expect(client.logger).toBe(logger);
    });
  });

  describe('request', () => {
    test('issues a request without options', () => {
      expect.assertions(1);

      const client = new Client();
      return client.request('something').then(() => {
        expect(request.mock.calls[0]).toMatchSnapshot();
      });
    });

    test('resolves the response value', () => {
      const client = new Client();
      return expect(client.request('something')).resolves.toEqual({
        some: 'data',
      });
    });

    test('accepts options', () => {
      expect.assertions(1);

      const options = { method: 'POST', body: '{"some":"data"}' };
      const client = new Client();
      return client.request('something', options).then(() => {
        expect(request.mock.calls[0]).toMatchSnapshot();
      });
    });

    test('accepts absolute URLs', () => {
      expect.assertions(1);

      const client = new Client();
      return client.request('http://example.org').then(() => {
        expect(request.mock.calls[0]).toMatchSnapshot();
      });
    });

    test('adds the Authorization token header', () => {
      expect.assertions(1);

      const headers = { Accept: 'application/json' };
      const token = 'zeus-u-1234567890';

      const client = new Client({ token });
      return client.request('something', { headers }).then(() => {
        expect(request.mock.calls[0]).toMatchSnapshot();
      });
    });

    test('accepts Authorization header overrides', () => {
      expect.assertions(1);

      const headers = { Authorization: 'custom' };
      const token = 'zeus-u-1234567890';

      const client = new Client({ token });
      return client.request('something', { headers }).then(() => {
        expect(request.mock.calls[0]).toMatchSnapshot();
      });
    });

    test('rejects invalid URLs', () => {
      const client = new Client();
      return expect(client.request('///')).rejects.toMatchSnapshot();
    });
  });

  describe('uploadArtifact', () => {
    const env = Object.assign({}, process.env);
    const client = new Client();
    let params;

    beforeEach(() => {
      process.env.ZEUS_HOOK_BASE = 'https://example.org/hooks/feedbeef';
      params = {
        build: '12345',
        job: '54321',
        file: 'FILE_DATA',
      };
    });

    afterEach(() => {
      process.env = Object.assign({}, env);
    });

    test('uploads a file without explicit type', () => {
      expect.assertions(1);
      return client.uploadArtifact(params).then(() => {
        expect(request.mock.calls[0]).toMatchSnapshot();
      });
    });

    test('uploads a file with explicit type', () => {
      expect.assertions(1);
      params.type = 'text/plain';
      return client.uploadArtifact(params).then(() => {
        expect(request.mock.calls[0]).toMatchSnapshot();
      });
    });

    test('rejects without parameters', () =>
      // This should probably become an error message at some point
      expect(client.uploadArtifact()).rejects.toBeDefined());

    test('rejects without ZEUS_HOOK_BASE', () => {
      delete process.env.ZEUS_HOOK_BASE;
      return expect(client.uploadArtifact(params)).rejects.toMatchSnapshot();
    });

    test('rejects without the build parameter', () => {
      delete params.build;
      return expect(client.uploadArtifact(params)).rejects.toMatchSnapshot();
    });

    test('rejects without the job parameter', () => {
      delete params.job;
      return expect(client.uploadArtifact(params)).rejects.toMatchSnapshot();
    });

    test('rejects without the file parameter', () => {
      delete params.file;
      return expect(client.uploadArtifact(params)).rejects.toMatchSnapshot();
    });
  });
});
