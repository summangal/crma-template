import React from 'react';
import { CDSFlex } from '@ciscodesignsystems/cds-react-flex';
import { CDSEmptyState } from '@ciscodesignsystems/cds-react-empty-state';

const ErrorComp: React.FC = () => {
  return (
    <CDSEmptyState data-testid="error-comp">
      <CDSEmptyState.Illustration variant="negative" />
      <CDSFlex
        justify="center"
        align="center">
        <CDSEmptyState.Title>
          Something went wrong! Please try refreshing the page or contact your
          IT administrator.
        </CDSEmptyState.Title>
      </CDSFlex>
    </CDSEmptyState>
  );
};

export default ErrorComp;
