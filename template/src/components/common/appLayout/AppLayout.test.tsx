import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { CDSThemeType } from '@ciscodesignsystems/cds-react-theme-provider';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../../locales/i18n';
import AppLayout from './AppLayout';
import ThemeContext from '../../../contexts/themeContext';

describe('AppLayout', () => {
  it('renders children component', async () => {
    const mockContext = undefined;
    const { getByTestId } = render(
      <I18nextProvider i18n={i18n}>
        <ThemeContext.Provider value={mockContext}>
          <AppLayout>
            <div>Dark Child component</div>
          </AppLayout>
        </ThemeContext.Provider>
      </I18nextProvider>,
    );
    await waitFor(() => {
      expect(getByTestId('error-comp')).toBeInTheDocument();
    });
  });
  it('renders children component', () => {
    const mockContext = {
      selectedTheme: 'light' as CDSThemeType | undefined,
    };
    const { getByText } = render(
      <I18nextProvider i18n={i18n}>
        <ThemeContext.Provider value={mockContext}>
          <AppLayout>
            <div>Child component</div>
          </AppLayout>
        </ThemeContext.Provider>
      </I18nextProvider>,
    );

    expect(getByText('Child component')).toBeInTheDocument();
  });
  it('renders children component', () => {
    const mockContext = {
      selectedTheme: 'dark' as CDSThemeType | undefined,
    };
    const { getByText } = render(
      <I18nextProvider i18n={i18n}>
        <ThemeContext.Provider value={mockContext}>
          <AppLayout>
            <div>Dark Child component</div>
          </AppLayout>
        </ThemeContext.Provider>
      </I18nextProvider>,
    );

    expect(getByText('Dark Child component')).toBeInTheDocument();
  });
});
