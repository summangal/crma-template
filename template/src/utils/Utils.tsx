export const getAuthToken: () => string = () => {
  const oktaTokenStorage = JSON.parse(
    localStorage.getItem('okta-token-storage') as string,
  );
  return oktaTokenStorage?.accessToken?.accessToken ?? '';
};

export const openInNewTab = (url: string): void => {
  window.open(url, '_blank', 'noreferrer');
};

export const rootComponent = (): HTMLElement => {
  return document.querySelector('div[data-cds-theme]') as HTMLElement;
};

export const loadConfig = async () => {
  try {
    // If no environment is provided, default to preview
    const configFileName = process.env.ENVIRONMENT
      ? `config-${process.env.ENVIRONMENT}.json`
      : 'config-preview.json';

    return await import(`../config/${configFileName}`);
  } catch (error) {
    console.error(
      'Could not dynamically import the configuration file: ',
      error,
    );
    return Promise.reject(
      new Error('Could not dynamically import the configuration file.'),
    );
  }
};
