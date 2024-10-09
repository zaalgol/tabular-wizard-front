import axios from 'axios';
import appConfig from '../config/config.json';

/**
 * Make an HTTP request using axios with optional token authentication and credentials.
 * 
 * @param {string} url The URL for the request.
 * @param {'GET'|'POST'|'PUT'|'DELETE'} method The HTTP method to use.
 * @param {Object} [body] The request body, for methods that use it (like POST or PUT).
 * @param {Object} [headers] Optional headers to include in the request.
 * @param {boolean} [useToken=true] Whether to include an Authorization token.
 * @returns {Promise} Axios response.
 */
const makeRequest = async (url, method, body = null, headers = {}, useToken = true) => {
  try {
    if (useToken) {
      const token = localStorage.getItem('access_token');
      headers['Authorization'] = `Bearer ${token}`;
    }
    url = `${appConfig.SERVER_ADDRESS}:${appConfig.SERVER_PORT}` + url;
    const config = {
      method,
      url,
      headers,
      withCredentials: true, // Include cookies
      ...(body && { data: body }),
    };
    return await axios(config);
  } catch (error) {
    console.error("HTTP Request Error:", error);
    throw error;
  }
};

export default makeRequest;

