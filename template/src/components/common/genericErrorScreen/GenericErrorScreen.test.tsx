import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../../locales/i18n';
import GenericErrorScreen from './GenericErrorScreen';

describe('GenericErrorScreen Component', () => {
  it('renders without crashing', () => {
    const mockOnRefresh = jest.fn();
    render(<GenericErrorScreen onRefresh={mockOnRefresh} />);
    const errorComponent = screen.getByTestId('error-comp');
    expect(errorComponent).toBeInTheDocument();
  });

  it('displays generic error message', () => {
    const mockOnRefresh = jest.fn();
    render(
      <I18nextProvider i18n={i18n}>
        <GenericErrorScreen onRefresh={mockOnRefresh} />
      </I18nextProvider>,
    );
    const genericErrorTitle = screen.getByText('Content could not load');
    expect(genericErrorTitle).toBeInTheDocument();
  });

  it('displays refresh message', () => {
    const mockOnRefresh = jest.fn();
    render(
      <I18nextProvider i18n={i18n}>
        <GenericErrorScreen onRefresh={mockOnRefresh} />
      </I18nextProvider>,
    );
    const refreshMessage = screen.getByText('Click and try again', {
      exact: false,
    });
    expect(refreshMessage).toBeInTheDocument();
  });

  it('calls onRefresh function when "Refresh" button is clicked', () => {
    const mockOnRefresh = jest.fn();

    render(
      <GenericErrorScreen
        onRefresh={mockOnRefresh}
        refreshButtonId="refresh-button"
      />,
    );
    const refreshButton = screen.getByTestId('refresh-button');
    fireEvent.click(refreshButton);
    expect(mockOnRefresh).toHaveBeenCalled();
  });

  it('displays refresh message passing customize size of illustration and button', () => {
    const mockOnRefresh = jest.fn();
    render(
      <I18nextProvider i18n={i18n}>
        <GenericErrorScreen
          onRefresh={mockOnRefresh}
          illustrationSize="100"
          buttonSize="sm"
          refreshButtonId="refresh-id"
        />
      </I18nextProvider>,
    );
    const refreshButton = screen.queryByTestId('refresh-id');
    fireEvent.click(screen.getByTestId('refresh-id'));
    expect(mockOnRefresh).toHaveBeenCalled();
    expect(refreshButton).toBeInTheDocument();
  });
});
