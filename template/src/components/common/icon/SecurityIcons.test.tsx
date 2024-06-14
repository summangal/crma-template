import React from 'react';
import { render, screen } from '@testing-library/react';
import { DuoSecurityLogo, GoogleAuthenticatorLogo } from './SecurityIcons';

describe('Test Duo Security Logo Component', () => {
  it('Test DuoSecurityLogo Component', () => {
    render(<DuoSecurityLogo />);
    expect(screen.getByTestId('duo-security')).toBeTruthy();
  });
});

describe('Test Google Authenticator logo Component', () => {
  it('Test Google Authenticator logo Component', () => {
    render(<GoogleAuthenticatorLogo />);
    expect(screen.getByTestId('google-authenticator')).toBeTruthy();
  });
});
