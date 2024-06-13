import { CDSEmptyState } from '@ciscodesignsystems/cds-react-empty-state';
import { CDSFlex } from '@ciscodesignsystems/cds-react-flex';
import { CDSSpinner } from '@ciscodesignsystems/cds-react-spinner';

const Spinner: React.FC = () => {
  return (
    <CDSEmptyState data-testid="spinner">
      <CDSFlex
        justify="center"
        align="center">
        <CDSSpinner label="Loading" />
      </CDSFlex>
    </CDSEmptyState>
  );
};

export default Spinner;
