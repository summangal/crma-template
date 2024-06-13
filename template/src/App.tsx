import React from 'react';
import './locales/i18n';
import useConfigJsonData from './hooks/useConfiguration';
import Spinner from './components/common/Spinner/Spinner';
import OktaConfiguration from './components/auth/Okta/OktaConfiguration/OktaConfiguration';

const App: React.FC = () => {
  const { loading, error, config } = useConfigJsonData();

  if (loading) {
    return <Spinner />;
  }

  if (
    process.env.NODE_ENV === 'development' &&
    (error !== null ||
      config?.okta.issuer == null ||
      config?.okta.clientId == null)
  ) {
    throw new Error('Error: Unable to initialize Okta!');
  }

  return process.env.NODE_ENV === 'development' ? (
    <OktaConfiguration config={config.okta} />
  ) : (
    <></>
  );
};

export default App;
