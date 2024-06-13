import React from 'react';
import Sample from '../components/settings/Sample';
import ExposedComponentWrapper from '../components/common/ExposedComponentWrapper/ExposedComponentWrapper';

const SamplePage: React.FC = () => {
  return (
    <ExposedComponentWrapper>
      <Sample />
    </ExposedComponentWrapper>
  );
};

export default SamplePage;
