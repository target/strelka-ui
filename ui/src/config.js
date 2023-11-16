const APP_CONFIG = {
  BACKEND_URL: process.env.REACT_APP_BACKEND_URL || "http://localhost:8080/api",
  API_TIMEOUT: 8000,
  LOGIN_TIMEOUT: 30000,
  SEARCH_URL: process.env.REACT_APP_SEARCH_URL,
  SEARCH_NAME: process.env.REACT_APP_SEARCH_NAME
};

export { APP_CONFIG };
