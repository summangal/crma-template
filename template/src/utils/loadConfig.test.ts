import loadConfig from './loadConfig';

describe('formatUTCDateTime util function', () => {
  afterEach(() => {
    process.env.ENVIRONMENT = 'development';
  });
  it('should return error when loadConfig is failed', () => {
    process.env.ENVIRONMENT = 'test';
    loadConfig().catch(e => {
      expect(e).toEqual(
        new Error('Could not dynamically import the configuration file.'),
      );
    });
  });
});
