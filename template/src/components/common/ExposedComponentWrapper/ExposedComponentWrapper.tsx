import React, { ReactElement, useMemo } from 'react';
import { IThemeContextType } from '@interfaces/IThemeContextType';
import useConfigJsonData from '../../../hooks/useConfiguration';
import useEnterpriseId from '../../../hooks/useEnterpriseId';
import useTheme from '../../../hooks/useTheme';
import ThemeContext from '../../../contexts/themeContext';
import ErrorComp from '../ErrorBoundary/ErrorComp';
import Spinner from '../Spinner/Spinner';
import AppLayout from '../appLayout/AppLayout';
import '../../../locales/i18n';
import '../../../index.scss';
import { ApiConfigProvider } from '../../../contexts/apiConfigurationContext';

interface IExposedComponentWrapperProps {
  children: React.ReactNode;
}

const ExposedComponentWrapper: React.FC<IExposedComponentWrapperProps> = (
  props: IExposedComponentWrapperProps,
): ReactElement => {
  const { loading, error, config } = useConfigJsonData();
  const selectedEnterpriseId = useEnterpriseId();
  const selectedTheme = useTheme();
  const value: IThemeContextType = useMemo(() => {
    return { selectedTheme };
  }, [selectedTheme]);

  if (loading || !selectedTheme) {
    return <Spinner />;
  }

  if (error !== null) {
    return <ErrorComp />;
  }

  const { children } = props;

  return (
    <ThemeContext.Provider value={value}>
      <AppLayout>
        <ApiConfigProvider
          key={`${selectedEnterpriseId}`}
          apiConfig={config}
          selectedEnterpriseId={selectedEnterpriseId}>
          {children}
        </ApiConfigProvider>
      </AppLayout>
    </ThemeContext.Provider>
  );
};

export default ExposedComponentWrapper;
