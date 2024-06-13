import React, { useCallback } from 'react';
import { Security } from '@okta/okta-react';
import { OktaAuth, OktaAuthOptions, toRelativeUrl } from '@okta/okta-auth-js';
import { useNavigate } from 'react-router-dom';
import AppRoutes from '../../../../AppRoutes';
import { IOktaConfig } from '../../../../interfaces/IConfiguration';

export interface IOktaConfiguration {
  config: IOktaConfig;
}
const OktaConfiguration: React.FC<IOktaConfiguration> = ({ config }) => {
  const oktaOptions = {
    issuer: config.issuer ?? '',
    clientId: config.clientId ?? '',
    redirectUri: `${window.location.origin}/login/callback`,
    pkce: true,
    postLogoutRedirectUri: `${window.location.origin}/logout/callback`,
  };
  const oktaAuth = new OktaAuth(oktaOptions as OktaAuthOptions);

  const navigate = useNavigate();

  const restoreOriginalUri = useCallback(
    (appOktaAuth: OktaAuth, originalUri: string): void => {
      navigate(toRelativeUrl(originalUri || '/', window.location.origin));
    },
    [],
  );
  return (
    <Security
      oktaAuth={oktaAuth}
      restoreOriginalUri={restoreOriginalUri}>
      <AppRoutes />
    </Security>
  );
};
export default OktaConfiguration;
