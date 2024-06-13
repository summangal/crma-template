import React from 'react';
import { render, cleanup, act } from '@testing-library/react';
import axios from 'axios';
import App from './App';

jest.mock('axios', () => {
  return {
    create: jest.fn(() => ({
      get: jest.fn(),
      interceptors: {
        request: { use: jest.fn(), eject: jest.fn() },
        response: { use: jest.fn(), eject: jest.fn() },
      },
    })),
  };
});

const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock('@okta/okta-react', () => ({
  useOktaAuth: () => ({
    authState: { isAuthenticated: true },
    authService: { handleAuthentication: jest.fn() },
    oktaAuth: {
      getUser: async (): Promise<string> =>
        new Promise(resolve => {
          resolve('user');
        }),
    },
  }),
}));

describe('App Tests', () => {
  afterEach(cleanup);

  it('should render the body', async () => {
    const mockConfig = {
      issuer: 'http://localhost.local/iss',
      clientId: 'clientId',
    };

    mockedAxios.get = jest
      .fn()
      .mockReturnValueOnce({ data: { okta: mockConfig } });

    const { container } = render(<App />);
    await act(async () => {
      await Promise.resolve();
    });
    expect(container).toBeTruthy();
  });
});
