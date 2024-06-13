import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { CDSThemeType } from '@ciscodesignsystems/cds-react-theme-provider';
import ExposedComponentWrapper from './ExposedComponentWrapper';
import useConfigJsonData from '../../../hooks/useConfiguration';
import useTheme from '../../../hooks/useTheme';
import ThemeContext from '../../../contexts/themeContext';

// Mock the hooks
jest.mock('../../../hooks/useConfiguration');
jest.mock('../../../hooks/useEnterpriseId');
jest.mock('../../../hooks/useTheme');

describe('ExposedComponentWrapper', () => {
  it('renders Spinner when loading or no selectedEnterpriseId', async () => {
    (useConfigJsonData as jest.Mock).mockReturnValue({
      loading: true,
      error: null,
      config: null,
    });
    (useTheme as jest.Mock).mockReturnValue('light');

    const { getByTestId } = render(
      <ExposedComponentWrapper>Test Child</ExposedComponentWrapper>,
    );

    await waitFor(() => {
      expect(getByTestId('spinner')).toBeInTheDocument();
    });
  });

  it('renders ErrorComp when there is an error', async () => {
    (useConfigJsonData as jest.Mock).mockReturnValue({
      loading: false,
      error: 'Error message',
      config: null,
    });
    (useTheme as jest.Mock).mockReturnValue('light');

    const { getByTestId } = render(
      <ExposedComponentWrapper>Test Child</ExposedComponentWrapper>,
    );

    await waitFor(() => {
      expect(getByTestId('error-comp')).toBeInTheDocument();
    });
  });

  it('renders children when there is no error and not loading', async () => {
    (useConfigJsonData as jest.Mock).mockReturnValue({
      loading: false,
      error: null,
      config: {},
    });
    (useTheme as jest.Mock).mockReturnValue('light');
    const mockContext = {
      selectedTheme: 'light' as CDSThemeType | undefined,
    };

    const { getByText } = render(
      <ThemeContext.Provider value={mockContext}>
        <ExposedComponentWrapper>Test Child</ExposedComponentWrapper>
      </ThemeContext.Provider>,
    );

    await waitFor(() => {
      expect(getByText('Test Child')).toBeInTheDocument();
    });
  });
});
