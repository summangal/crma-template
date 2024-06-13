import { LoginCallback } from '@okta/okta-react';
import React from 'react';

export interface IErrorComponent {
  error: Error;
}

const ErrorComponent: React.FC<IErrorComponent> = () => {
  return null;
};

const CustomLoginCallback: React.FC = () => {
  return <LoginCallback errorComponent={ErrorComponent} />;
};

export default CustomLoginCallback;
