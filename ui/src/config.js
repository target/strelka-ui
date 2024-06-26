const APP_CONFIG = {
  BACKEND_URL: process.env.REACT_APP_BACKEND_URL || "/api",
  DEFAULT_EXCLUDED_SUBMITTERS: process.env.DEFAULT_EXCLUDED_SUBMITTERS || ["User_1"],
  API_TIMEOUT: 60000,
  LOGIN_TIMEOUT: 30000,
  SEARCH_URL: process.env.REACT_APP_SEARCH_URL,
  SEARCH_NAME: process.env.REACT_APP_SEARCH_NAME
};

export { APP_CONFIG };
