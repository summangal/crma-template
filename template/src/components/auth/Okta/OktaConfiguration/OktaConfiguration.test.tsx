import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import OktaConfiguration from './OktaConfiguration';

// Mock the IOktaConfiguration interface for testing purposes
const mockConfig = {
  issuer:
    'https://sso-preview.test.security.cisco.com/oauth2/ausrbsiz6hbu5Dt6l0h7',
  clientId: '',
};

// Mock the useNavigate hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('OktaConfiguration', () => {
  xit('renders without crashing', async () => {
    // Mocking useNavigate
    // const mockNavigate = jest.fn();
    // require('react-router-dom').useNavigate.mockReturnValue(mockNavigate);

    render(
      <MemoryRouter>
        <OktaConfiguration config={mockConfig} />
      </MemoryRouter>,
    );

    // Wait for any asynchronous operations to complete
    await waitFor(() => {});

    // Expect Security component to be rendered
    expect(document.querySelector('.okta-security')).toBeInTheDocument();
  });

  xit('calls navigate with the correct original uri', async () => {
    const originalUri = '/protected-route';
    const mockNavigate = jest.fn();
    // require('react-router-dom').useNavigate.mockReturnValue(mockNavigate);

    render(
      <MemoryRouter initialEntries={[originalUri]}>
        <OktaConfiguration config={mockConfig} />
      </MemoryRouter>,
    );

    // Wait for any asynchronous operations to complete
    await waitFor(() => {});

    // Expect navigate to be called with the relative originalUri
    expect(mockNavigate).toHaveBeenCalledWith(originalUri);
  });
});
