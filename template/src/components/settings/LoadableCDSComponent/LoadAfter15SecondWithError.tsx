import { useEffect, useState } from 'react';
import { CDSCard } from '@ciscodesignsystems/cds-react-card';
import { CDSFlex } from '@ciscodesignsystems/cds-react-flex';
import { CDSHeading } from '@ciscodesignsystems/cds-react-heading';
import { CDSDivider } from '@ciscodesignsystems/cds-react-divider';
import { CDSSpinner } from '@ciscodesignsystems/cds-react-spinner';
import { t } from 'i18next';
import GenericErrorScreen from '../../common/genericErrorScreen/GenericErrorScreen';

const LoadAfter15SecondWithError = () => {
  const [error, setError] = useState(false);

  useEffect(() => {
    const interval = setTimeout(() => {
      setError(true);
    }, 15000);

    return () => clearTimeout(interval);
  }, []);
  return (
    <CDSCard
      interactive
      className="card-width">
      <CDSHeading>{t('Load after 15 second with Error')}</CDSHeading>
      <CDSDivider />
      <CDSFlex
        direction="vertical"
        gap="lg"
        wrap>
        {error ? (
          <GenericErrorScreen
            buttonSize="sm"
            illustrationSize="100"
            onRefresh={() => {}}
            refreshButtonId="recent-activity-refresh"
          />
        ) : (
          <CDSSpinner />
        )}
      </CDSFlex>
    </CDSCard>
  );
};

export default LoadAfter15SecondWithError;
