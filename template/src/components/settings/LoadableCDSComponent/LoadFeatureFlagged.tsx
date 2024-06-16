import { useEffect, useState } from 'react';

import { CDSCard } from '@ciscodesignsystems/cds-react-card';
import { CDSFlex } from '@ciscodesignsystems/cds-react-flex';
import { CDSHeading } from '@ciscodesignsystems/cds-react-heading';
import { CDSText } from '@ciscodesignsystems/cds-react-text';
import { CDSDivider } from '@ciscodesignsystems/cds-react-divider';
import { CDSSpinner } from '@ciscodesignsystems/cds-react-spinner';
import { t } from 'i18next';

const LoadFeatureFlagged = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const interval = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(interval);
  }, []);

  return (
    <CDSCard
      interactive
      className="card-width">
      <CDSHeading>{t('Load under Feature Flag!')}</CDSHeading>
      <CDSDivider />
      <CDSFlex
        direction="vertical"
        gap="lg">
        {loading ? (
          <CDSSpinner />
        ) : (
          <CDSFlex
            direction="vertical"
            gap="xxs">
            <CDSText
              size="xxs"
              weight="semi-bold">
              {t(
                'This component loaded under the feature flag of "Mercury-ff-micro-app-template"!',
              )}
            </CDSText>
          </CDSFlex>
        )}
      </CDSFlex>
    </CDSCard>
  );
};

export default LoadFeatureFlagged;
