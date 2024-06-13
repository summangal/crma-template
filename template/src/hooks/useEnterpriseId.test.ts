import { renderHook, act } from '@testing-library/react';
import useEnterpriseId from './useEnterpriseId';

describe('useEnterpriseId', () => {
  beforeEach(() => {
    sessionStorage.clear();
    jest.clearAllMocks();
  });

  afterEach(() => {
    sessionStorage.clear();
    delete process.env.ENTERPRISE;
  });

  it('should return empty string when sessionStorage is empty', () => {
    const { result } = renderHook(() => useEnterpriseId());
    expect(result.current).toBe('');
  });

  it('should return enterpriseId from sessionStorage if available', () => {
    const enterpriseId = 'test_enterprise_id';
    sessionStorage.setItem('selectedEnterprise', enterpriseId);
    const { result } = renderHook(() => useEnterpriseId());
    expect(result.current).toBe(enterpriseId);
  });

  it('should update enterpriseId when custom event is triggered', () => {
    const { result } = renderHook(() => useEnterpriseId());
    expect(result.current).toBe('');

    const newEnterpriseId = 'test_enterprise_id';
    act(() => {
      window.dispatchEvent(
        new CustomEvent('selectedEnterpriseChanged', {
          detail: { id: newEnterpriseId },
        }),
      );
    });
    expect(result.current).toBe(newEnterpriseId);
  });

  it('should use enterpriseId from environment variable in development mode', () => {
    process.env.NODE_ENV = 'development';
    process.env.ENTERPRISE = 'devEnterprise';
    const { result } = renderHook(() => useEnterpriseId());
    expect(result.current).toBe('devEnterprise');
  });
});
