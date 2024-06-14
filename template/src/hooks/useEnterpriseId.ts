import { useEffect, useState } from 'react';

const useEnterpriseId = () => {
  const [selectedEnterpriseId, setSelectedEnterpriseId] = useState<string>('');

  useEffect(() => {
    // Check if enterpriseId exists in sessionStorage
    const storedEnterpriseId = sessionStorage.getItem('selectedEnterprise');
    if (storedEnterpriseId) {
      setSelectedEnterpriseId(storedEnterpriseId);
    }

    // Listen for custom event
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleSelectedEnterpriseChanged = (event: any) => {
      if (typeof event?.detail?.id === 'string') {
        setSelectedEnterpriseId(event?.detail?.id);
      }
    };

    window.addEventListener(
      'selectedEnterpriseChanged',
      handleSelectedEnterpriseChanged,
    );

    // Set enterpriseId from environment variable in development mode
    if (process.env.NODE_ENV === 'development' && process.env.ENTERPRISE) {
      setSelectedEnterpriseId(process.env.ENTERPRISE || '');
    }

    return () => {
      window.removeEventListener(
        'selectedEnterpriseChanged',
        handleSelectedEnterpriseChanged,
      );
    };
  }, []);

  return selectedEnterpriseId;
};

export default useEnterpriseId;
