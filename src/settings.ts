const numberFromEnv = (envVar: string, isInteger: boolean, isPositive: boolean): number => {
  const rawValue = process.env[envVar];
  if (!rawValue) {
    throw new Error(`Environment variable ${envVar} is not set`);
  }
  const value = Number(rawValue);
  if (Number.isNaN(value)) {
    throw new Error(`Invalid ${envVar} value: ${rawValue} - not a number`);
  }
  if (isInteger && !Number.isInteger(value)) {
    throw new Error(`Invalid ${envVar} value: ${rawValue} - expected integer`);
  }
  if (isPositive && value < 0) {
    throw new Error(`Invalid ${envVar} value: ${rawValue} - expected positive`);
  }
  return value;
};

const stringFromEnv = (envVar: string): string => {
  const value = process.env[envVar];
  if (!value) {
    throw new Error(`Environment variable ${envVar} is not set`);
  }
  return value;
};

const getSettings = () => {
  if (process.env['RUNNING_IN_DOCKER']) {
    return {
      // config for docker run
      connectroPort: numberFromEnv('SC_CONNECTRO_PORT', true, true),
      stellariumHost: stringFromEnv('SC_STELLARIUM_HOST'),
      stellariumPort: numberFromEnv('SC_STELLARIUM_PORT', true, true),
      logLevel: stringFromEnv('SC_LOG_LEVEL'),
    };
  } else {
    return {
      // config for standalone run
      connectroPort: 10000,
      stellariumHost: 'localhost',
      stellariumPort: 8090,
      logLevel: stringFromEnv('SC_LOG_LEVEL'),
    };
  }
};

export const settings = getSettings();
