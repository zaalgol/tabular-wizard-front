import axios from 'axios';
import appConfig from './config/config.json';

/**
 * Make an HTTP request using axios with optional token authentication and credentials.
 * 
 * @param {string} url The URL for the request.
 * @param {'GET'|'POST'|'PUT'|'DELETE'} method The HTTP method to use.
 * @param {Object} [body] The request body, for methods that use it (like POST or PUT).
 * @param {Object} [headers] Optional headers to include in the request.
 * @param {boolean} [useToken=true] Whether to include an Authorization token.
 * @param {boolean} [withCredentials=true] Whether to include credentials in the request.
 * @returns {Promise} Axios response.
 */
const makeRequest = async (url, method, body = null, headers = {}, useToken = true, withCredentials = true) => {
  try {
    // Add Authorization token to headers if useToken is true
    if (useToken) {
      const token = localStorage.getItem('access_token');
    headers['Authorization'] = `Bearer ${token}`;
    }
    url = `${appConfig.SERVER_ADDRESS}:${appConfig.SERVER_PORT}` + url;
    // Configurations for the axios request
    const config = {
      method,
      url,
      headers,
      withCredentials,
      ...(body && { data: body }), // Conditionally add body if it exists
    };

    // Make the request
    console.log("&".repeat(500) + JSON.stringify(config))
    return await axios(config);

  } catch (error) {
    // Handle error
    console.error("HTTP Request Error:", error);
    throw error; // Rethrow if you want the calling function to handle it
  }
};

export default makeRequest;

