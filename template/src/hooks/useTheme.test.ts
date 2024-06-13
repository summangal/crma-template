import { renderHook, act } from '@testing-library/react';
import useTheme from './useTheme';

describe('useTheme', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should return default theme when localStorage is empty', () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current).toBeUndefined();
  });

  it('should return theme from localStorage if available', () => {
    localStorage.setItem('theme', 'dark');
    const { result } = renderHook(() => useTheme());
    expect(result.current).toBe('dark');
  });

  it('should update theme when custom event is triggered', () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current).toBeUndefined();

    const newTheme = 'dark';
    act(() => {
      window.dispatchEvent(
        new CustomEvent('themeChange', { detail: newTheme }),
      );
    });
    expect(result.current).toBe('dark');
  });

  it('should use fallback theme in development mode if localStorage is empty', () => {
    process.env.NODE_ENV = 'development';
    const { result } = renderHook(() => useTheme());
    expect(result.current).toBe('light');
  });

  it('should use theme from localStorage instead of fallback theme in development mode if available', () => {
    process.env.NODE_ENV = 'development';
    localStorage.setItem('theme', 'dark');
    const { result } = renderHook(() => useTheme());
    expect(result.current).toBe('dark');
  });
});
