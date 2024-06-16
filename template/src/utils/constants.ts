import { IConfigData } from '@interfaces/IConfiguration';

type FeatureFlagConstantRecord = Record<string, string>;

export const API_JSON_CONFIG: IConfigData = {
  okta: { issuer: '', clientId: '' },
  backendUrlConfig: { prometheusUrl: '', phanesUrl: '' },
};
export const ACTIVE = 'ACTIVE';

export const FEATURE_FLAG_PREFIX = 'MERCURY-FF-';

/* Strictly used uppercase to avoid String case-issue. */
export const FEATURE_FLAG_CONSTANTS: FeatureFlagConstantRecord = {
  MICRO_APP_TEMPLATE: 'MICRO-APP-TEMPLATE',
};
