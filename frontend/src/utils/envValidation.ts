export function validateEnvironment() {
  const requiredVars = [
    'REACT_APP_MAPBOX_ACCESS_TOKEN',
    'REACT_APP_API_BASE_URL'
  ];

  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}. ` +
      'Please check your .env file.'
    );
  }
} 