import React from 'react';
import { CDSFlex } from '@ciscodesignsystems/cds-react-flex';
import { CDSSkeleton } from '@ciscodesignsystems/cds-react-skeleton';
import { CDSCard } from '@ciscodesignsystems/cds-react-card';

const SampleSkeleton: React.FC = () => {
  return (
    <CDSCard data-testid="settings-skeleton-loading">
      <CDSFlex
        direction="vertical"
        gap={12}>
        <CDSSkeleton
          height={262}
          lines={1}
          shade="dark"
        />
      </CDSFlex>
    </CDSCard>
  );
};

export default SampleSkeleton;
