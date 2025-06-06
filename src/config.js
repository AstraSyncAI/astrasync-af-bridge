/**
 * Configuration validator for AstraSync AF Bridge
 * Ensures environment variables are properly set
 */

export function validateConfig() {
  const required = ['ASTRASYNC_API_KEY'];
  const missing = [];
  
  for (const key of required) {
    if (!process.env[key]) {
      missing.push(key);
    }
  }
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check your .env file or set them in your environment.'
    );
  }
  
  // Validate API URL format if provided
  if (process.env.ASTRASYNC_API_URL) {
    try {
      new URL(process.env.ASTRASYNC_API_URL);
    } catch (e) {
      throw new Error('Invalid ASTRASYNC_API_URL format. Must be a valid URL.');
    }
  }
  
  return {
    apiKey: process.env.ASTRASYNC_API_KEY,
    apiUrl: process.env.ASTRASYNC_API_URL || 'https://api.astrasync.ai',
    nodeEnv: process.env.NODE_ENV || 'production'
  };
}

export default validateConfig;