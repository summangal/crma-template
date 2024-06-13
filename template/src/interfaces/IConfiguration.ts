export interface IBackendConfig {
  prometheusUrl: string;
  phanesUrl: string;
}
export interface IOktaConfig {
  issuer: string;
  clientId: string;
}
export interface IConfigData {
  okta: IOktaConfig;
  backendUrlConfig: IBackendConfig;
}

export interface IConfigResponse {
  loading: boolean;
  config: IConfigData;
  error: Error | null;
}

export interface IApiConfig {
  config: IConfigData;
  enterpriseId: string;
}
