import React, { type ReactNode, useContext } from 'react';
import { CDSContainer } from '@ciscodesignsystems/cds-react-container';
import { CDSFlex } from '@ciscodesignsystems/cds-react-flex';
import { CDSThemeProvider } from '@ciscodesignsystems/cds-react-theme-provider';
import { ToasterContextProvider } from '../../../contexts/toasterContext';
import AppNotification from '../commonNotificiation/AppNotification';
import ThemeContext from '../../../contexts/themeContext';
import ErrorComp from '../ErrorBoundary/ErrorComp';

export interface IAppLayout {
  children: ReactNode;
}

const AppLayout: React.FC<IAppLayout> = props => {
  const { children } = props;

  const themeContext = useContext(ThemeContext);
  if (!themeContext) {
    return <ErrorComp />;
  }
  const { selectedTheme } = themeContext;

  return (
    <CDSThemeProvider
      theme={selectedTheme}
      brand="magnetic">
      <CDSContainer className="app-container p0">
        <ToasterContextProvider>
          <CDSFlex
            direction="vertical"
            grow
            gap="md"
            className="delegated-view-container">
            <CDSFlex
              className="mr0"
              direction="vertical"
              grow
              gap="xs"
              justify="center">
              <AppNotification />
              {children}
            </CDSFlex>
          </CDSFlex>
        </ToasterContextProvider>
      </CDSContainer>
    </CDSThemeProvider>
  );
};

export default AppLayout;
