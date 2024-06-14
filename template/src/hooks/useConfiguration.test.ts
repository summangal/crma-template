import { renderHook } from '@testing-library/react';
import useConfigJsonData from './useConfiguration';
import * as loadConfig from '../utils/loadConfig';

describe('useConfiguration', () => {
  beforeEach(() => {
    sessionStorage.clear();
    jest.clearAllMocks();
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it('should return error when loadConfig is failed', () => {
    jest.spyOn(loadConfig, 'default').mockImplementationOnce(() => {
      throw new Error('Error');
    });

    const { result } = renderHook(() => useConfigJsonData());
    expect(result.current.error).toEqual(new Error('Error'));
  });
});
