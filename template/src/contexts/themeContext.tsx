import React from 'react';
import { IThemeContextType } from '@interfaces/IThemeContextType';

const ThemeContext = React.createContext<IThemeContextType | undefined>(
  undefined,
);

export default ThemeContext;
