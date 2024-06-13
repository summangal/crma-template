import React, { Suspense, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CDSFlex } from '@ciscodesignsystems/cds-react-flex';
import { CDSHeading } from '@ciscodesignsystems/cds-react-heading';
import SampleSkeleton from './SampleSkeleton';

const Sample: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  useEffect(() => {
    setLoading(false);
  }, [loading]);

  return (
    <Suspense fallback={<SampleSkeleton />}>
      <CDSFlex
        data-testid="sample-comp"
        grow
        gap="md"
        direction="vertical">
        <CDSHeading size="h1">{t('sample:title')}</CDSHeading>
      </CDSFlex>
    </Suspense>
  );
};
export default Sample;
