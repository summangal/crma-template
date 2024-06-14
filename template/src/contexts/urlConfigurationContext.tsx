import React, { ReactElement, createContext, useContext, useMemo } from 'react';
import { IApiConfig, IConfigData } from '@interfaces/IConfiguration';
import { API_JSON_CONFIG } from '../utils/constants';

const defaultValue: IApiConfig = {
  config: API_JSON_CONFIG,
  enterpriseId: '',
};
export const APIConfigContext = createContext<IApiConfig>(defaultValue);
export const useUrlConfig = (): IApiConfig => {
  const { config, enterpriseId } = useContext(APIConfigContext);
  return {
    config,
    enterpriseId,
  };
};

interface IAPIConfigProvider {
  apiConfig: IConfigData;
  children: React.ReactNode;
  selectedEnterpriseId: string;
}

export const ApiConfigProvider = ({
  apiConfig,
  children,
  selectedEnterpriseId,
}: IAPIConfigProvider): ReactElement => {
  const config = useMemo(() => apiConfig ?? API_JSON_CONFIG, [apiConfig]);
  const enterpriseId = useMemo(
    () => selectedEnterpriseId ?? '',
    [selectedEnterpriseId],
  );

  const contextValue = useMemo(
    () => ({
      config,
      enterpriseId,
    }),
    [config, enterpriseId],
  );

  return (
    <APIConfigContext.Provider value={contextValue}>
      {children}
    </APIConfigContext.Provider>
  );
};
