import React from 'react';
import { CDSFlex } from '@ciscodesignsystems/cds-react-flex';
import { CDSToaster } from '@ciscodesignsystems/cds-react-toaster';
import { useToasterNotficiation } from '../../../contexts/toasterContext';

const AppNotification: React.FC = () => {
  const { toastList } = useToasterNotficiation();

  return (
    <CDSFlex>
      <CDSToaster
        toastList={toastList}
        placement="top-right"
        className="toasts-message custom-font-family"
      />
    </CDSFlex>
  );
};
export default AppNotification;
