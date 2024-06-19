import React, { Suspense, useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { CDSFlex } from '@ciscodesignsystems/cds-react-flex';
import { CDSHeading } from '@ciscodesignsystems/cds-react-heading';
import SampleSkeleton from './SampleSkeleton';
import LoadAfter5Second from './LoadableCDSComponent/LoadAfter5Second';
import LoadAfter15SecondWithError from './LoadableCDSComponent/LoadAfter15SecondWithError';
import LoadAfter10Second from './LoadableCDSComponent/LoadAfter10Second';
import '../../index.scss';
import LoadFeatureFlagged from './LoadableCDSComponent/LoadFeatureFlagged';
import { useFeatureFlagContext } from '../../contexts/featureFlagContext';
import { FEATURE_FLAG_CONSTANTS } from '../../utils/constants';

const DashBoard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const { hasFeatureFlag } = useFeatureFlagContext();
  const { t } = useTranslation();
  useEffect(() => {
    setLoading(false);
  }, [loading]);

  return (
    <Suspense fallback={<SampleSkeleton />}>
      <CDSFlex
        data-testid="global-settings"
        grow
        gap="md"
        direction="vertical">
        <CDSHeading size="h1">{t('Dashboard')}</CDSHeading>
        <CDSFlex
          direction="horizontal"
          gap="md"
          grow
          wrap>
          <LoadAfter5Second />
          <LoadAfter10Second />
          <LoadAfter15SecondWithError />
          {hasFeatureFlag(FEATURE_FLAG_CONSTANTS.MICRO_APP_TEMPLATE) && (
            <LoadFeatureFlagged />
          )}
        </CDSFlex>
      </CDSFlex>
    </Suspense>
  );
};
export default DashBoard;
