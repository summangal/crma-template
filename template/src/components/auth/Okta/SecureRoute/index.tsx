import React, { useEffect } from 'react';
import { useOktaAuth } from '@okta/okta-react';
import { toRelativeUrl } from '@okta/okta-auth-js';
import { Outlet } from 'react-router-dom';
import Spinner from '../../../common/Spinner/Spinner';

const RequiredAuth: React.FC = () => {
  const { oktaAuth, authState } = useOktaAuth();
  useEffect(() => {
    if (!authState) {
      return;
    }

    if (!authState?.isAuthenticated) {
      const originalUri = toRelativeUrl(
        window.location.href,
        window.location.origin,
      );
      oktaAuth.setOriginalUri(originalUri);
      oktaAuth.signInWithRedirect();
    }
  }, [oktaAuth, !!authState, authState?.isAuthenticated]);

  if (!authState || !authState?.isAuthenticated) {
    return (
      <h3 data-testid="loading-icon">
        <Spinner />
      </h3>
    );
  }

  return <Outlet />;
};

export default RequiredAuth;
