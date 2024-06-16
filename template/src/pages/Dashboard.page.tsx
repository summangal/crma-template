import React from 'react';
import ExposedComponentWrapper from '../components/common/ExposedComponentWrapper/ExposedComponentWrapper';
import DashBoard from '../components/settings/Dashboard';

const DashBoardPage: React.FC = () => {
  return (
    <ExposedComponentWrapper>
      <DashBoard />
    </ExposedComponentWrapper>
  );
};

export default DashBoardPage;
