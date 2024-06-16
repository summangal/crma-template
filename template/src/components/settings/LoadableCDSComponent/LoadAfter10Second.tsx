import { useEffect, useState } from 'react';

import { CDSCard } from '@ciscodesignsystems/cds-react-card';
import { CDSFlex } from '@ciscodesignsystems/cds-react-flex';
import { CDSText } from '@ciscodesignsystems/cds-react-text';
import { CDSHeading } from '@ciscodesignsystems/cds-react-heading';
import { CDSDivider } from '@ciscodesignsystems/cds-react-divider';
import { CDSSpinner } from '@ciscodesignsystems/cds-react-spinner';

import { t } from 'i18next';

const LoadAfterTenSecond = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const interval = setTimeout(() => {
      setLoading(false);
    }, 10000);

    return () => clearTimeout(interval);
  }, []);

  return (
    <CDSCard
      interactive
      className="card-width">
      <CDSHeading>{t('Load after 10 second')}</CDSHeading>
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
                'Reiciendis neque necessitatibus officiis cumque soluta incidunt quisquam quos omnis. Ducimus temporibus ex ipsum quam placeat sint voluptatem. Placeat dolor itaque quam nemo error quod saepe. Autem nesciunt similique. Autem in harum molestiae',
              )}
            </CDSText>
          </CDSFlex>
        )}
      </CDSFlex>
    </CDSCard>
  );
};

export default LoadAfterTenSecond;
