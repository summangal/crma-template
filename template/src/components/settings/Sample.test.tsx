import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { render, screen } from '@testing-library/react';
import { CDSThemeType } from '@ciscodesignsystems/cds-react-theme-provider';
import ThemeContext from '../../contexts/themeContext';
import i18n from '../../locales/i18n';
import Sample from './Sample';
import { IThemeContextType } from '../../interfaces/IThemeContextType';

describe('Test Sample Page', () => {
  it('Test Sample Component', () => {
    const mockContext: IThemeContextType = {
      selectedTheme: 'light' as CDSThemeType,
    };
    render(
      <I18nextProvider i18n={i18n}>
        <ThemeContext.Provider value={mockContext}>
          <Sample />
        </ThemeContext.Provider>
      </I18nextProvider>,
    );
    expect(screen.getByText('Sample Component')).toBeInTheDocument();
    expect(screen.getByTestId('sample-comp')).toBeTruthy();
  });
});
