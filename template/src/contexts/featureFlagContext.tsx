/* eslint-disable */
import React, { useContext, createContext, ReactElement } from 'react';
import { useOktaAuth } from '@okta/okta-react';
import {
  map as _map,
  startsWith as _startsWith,
  includes as _includes,
  sortBy as _sortBy,
  compact as _compact,
  toUpper as _toUpper,
  every as _every,
  isEmpty as _isEmpty,
} from 'lodash';
import { FEATURE_FLAG_PREFIX } from '../utils/constants';

interface IFeatureFlagContextType {
  hasFeatureFlag: Function;
}
/**
 * default values for all the context variables
 * hasFeatureFlags- to check this set flag is available.
 */
const defaultValue = {
  hasFeatureFlag: () => {},
} as IFeatureFlagContextType;

export const FeatureFlagContext =
  createContext<IFeatureFlagContextType>(defaultValue);

interface IFeatureFlagProviderProps {
  children: React.ReactNode;
}

interface IFeatureFlagConsumerProps {
  children: React.ReactNode;
  flag: string;
}

interface IMultipleFeatureFlagsConsumerProps {
  children: React.ReactNode;
  flags: string[];
}
/**
 * Initialize the context provider with all required state values
 * This is wrapped around the IDPManagement component in pages folder
 */
export const FeatureFlagProvider = (
  props: IFeatureFlagProviderProps,
): ReactElement => {
  /**
   * Using authState , without UseEffect as the authState does not refresh the okta groups unless the session is timed-out.
   * Which means user has to logout/login to see new groups in okta. hence we do not need a watch for Okta groups on our end.
   */
  const { authState }: any = useOktaAuth();

  /**
   * Return the array of flags from okta.
   */
  const getMatches = (): string[] | null => {
    if (!authState?.isAuthenticated) {
      return [];
    }
    const matches: string[] | null = _map(
      authState.idToken?.claims.groups,
      (group: any) => {
        if (_startsWith(_toUpper(group), _toUpper(FEATURE_FLAG_PREFIX))) {
          const flagUpperCase = _toUpper(group) as any;
          return flagUpperCase.substr(FEATURE_FLAG_PREFIX.length);
        }
        return null; // not a feature flag
      },
    );
    return matches;
  };

  /**
   * Function to check if flag is available on OKTA.
   * @param flag : flag name as per defined in OKTA GROUPS | feature-flag-constant.ts
   * @returns if flag present true , else false.
   */
  const hasFeatureFlag = (flag: string): boolean => {
    const matches: string[] | null = getMatches();
    const hasFlag = _includes(_sortBy(_compact(matches)), flag);
    return hasFlag;
  };

  return (
    <FeatureFlagContext.Provider
      value={{
        hasFeatureFlag,
      }}>
      {props.children}
    </FeatureFlagContext.Provider>
  );
};

/**
 * Hook to use the context values in any component. This prevents importing the context and
 * useContext in every component. Rather just import useFeatureFlagContext and use the
 * variables and condition for flag
 */
export const useFeatureFlagContext = (): IFeatureFlagContextType => {
  const { hasFeatureFlag } = useContext(FeatureFlagContext);
  return {
    hasFeatureFlag,
  };
};

/**
 * Consumer to use directly for a multi-component instead of using above context hook.
 * Using this parent component and flag, user can disable the feature.
 */
export const FeatureFlagged = (
  props: IFeatureFlagConsumerProps,
): ReactElement => {
  return (
    <FeatureFlagContext.Consumer>
      {({ hasFeatureFlag }) => (
        <>{hasFeatureFlag(props.flag) && props.children}</>
      )}
    </FeatureFlagContext.Consumer>
  );
};

/**
 * This is the same as <FeatureFlagged /> above but you pass array of feature flags.
 * Enables feature (returns "props.children") ONLY when ALL feature flaggs are enabled.
 * If "props.flags" is EMPTY ARRAY - the same as feature DISABLED.
 */
export const MultipleFeatureFlagged = (
  props: IMultipleFeatureFlagsConsumerProps,
): ReactElement => {
  return (
    <FeatureFlagContext.Consumer>
      {({ hasFeatureFlag }) => (
        <>
          {!_isEmpty(props.flags) &&
            _every(props.flags, hasFeatureFlag) &&
            props.children}
        </>
      )}
    </FeatureFlagContext.Consumer>
  );
};
