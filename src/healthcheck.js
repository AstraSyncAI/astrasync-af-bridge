/**
 * Health check for AstraSync API connectivity
 * Validates that the bridge can connect to the API
 */

import axios from 'axios';

export async function checkApiHealth(apiUrl, apiKey) {
  try {
    const response = await axios.get(`${apiUrl}/health`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      },
      timeout: 5000
    });
    
    return {
      healthy: response.status === 200,
      status: response.data.status || 'unknown',
      version: response.data.version || 'unknown',
      message: 'API connection successful'
    };
  } catch (error) {
    return {
      healthy: false,
      status: 'error',
      message: error.message,
      details: error.response?.data || 'Unable to connect to AstraSync API'
    };
  }
}

export default checkApiHealth;