import { useEffect, useState } from 'react';
import { CDSThemeType } from '@ciscodesignsystems/cds-react-theme-provider';

const useTheme = () => {
  const [selectedTheme, setSelectedTheme] = useState<CDSThemeType | undefined>(
    undefined,
  );

  useEffect(() => {
    // Check if theme exists in localStorage
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      setSelectedTheme(storedTheme as CDSThemeType);
    }

    // Listen for custom event
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleSelectedThemeChanged = (event: any) => {
      if (typeof event?.detail) {
        setSelectedTheme(event?.detail);
      }
    };

    window.addEventListener('themeChange', handleSelectedThemeChanged);

    // Set fallback theme in development mode
    if (process.env.NODE_ENV === 'development') {
      setSelectedTheme(
        storedTheme ? (storedTheme as CDSThemeType) : ('light' as CDSThemeType),
      );
    }

    return () => {
      window.removeEventListener('themeChange', handleSelectedThemeChanged);
    };
  }, []);

  return selectedTheme;
};

export default useTheme;
