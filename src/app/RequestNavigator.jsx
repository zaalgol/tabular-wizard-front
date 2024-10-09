import makeRequest from './api';

const handleMakeRequest = async (navigate, ...args) => {
  try {
    return await makeRequest(...args);
  } catch (error) {
    if (error.response && error.response.status === 401) {
      try {
        const refreshResponse = await makeRequest('/api/refresh_token/', 'POST', null, {}, false);
        if (refreshResponse.status === 200) {
          localStorage.setItem('access_token', refreshResponse.data.access_token);
          return await makeRequest(...args);
        } else {
          navigate('/login', { replace: true });
        }
      } catch (refreshError) {
        navigate('/login', { replace: true });
      }
    } else {
      throw error;
    }
  }
};

export { handleMakeRequest };
