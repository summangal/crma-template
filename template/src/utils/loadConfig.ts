const loadConfig = async () => {
  try {
    // If no environment is provided, default to preview
    const configFileName = process.env.ENVIRONMENT
      ? `config-${process.env.ENVIRONMENT}.json`
      : 'config-preview.json';

    return await import(`../config/${configFileName}`);
  } catch (error) {
    return Promise.reject(
      new Error('Could not dynamically import the configuration file.'),
    );
  }
};

export default loadConfig;
