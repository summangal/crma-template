import { useEffect, useState } from 'react';
import { IConfigData, IConfigResponse } from '../interfaces/IConfiguration';
import { API_JSON_CONFIG } from '../utils/Constants';
import { loadConfig } from '../utils/Utils';

function useConfigJsonData(): IConfigResponse {
  const [loading, setLoading] = useState<boolean>(true);
  const [config, setConfig] = useState<IConfigData>(API_JSON_CONFIG);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchConfig(): Promise<void> {
      setError(null);
      try {
        const response = await loadConfig();
        setConfig(response.default);
        setLoading(false);
      } catch (err) {
        setError(err as Error);
        setLoading(false);
      }
    }

    fetchConfig();
  }, []);

  return { loading, error, config };
}

export default useConfigJsonData;
