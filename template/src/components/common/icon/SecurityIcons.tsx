import React, { ReactNode } from 'react';
import duoSecurityLogo from '../../../assets/duo-logo.svg';
import googleAuthenticatorLogo from '../../../assets/google-authenticator.svg';

export const DuoSecurityLogo: ReactNode = (
  <img
    src={duoSecurityLogo}
    alt="Duo Security"
  />
);
export const GoogleAuthenticatorLogo: ReactNode = (
  <img
    src={googleAuthenticatorLogo}
    alt="Google Authenticator"
  />
);
