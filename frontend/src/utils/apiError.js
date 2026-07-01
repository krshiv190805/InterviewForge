export const getAuthErrorMessage = (err, fallback) => {
  if (err.response?.data?.message) {
    return err.response.data.message;
  }

  if (!err.response) {
    return 'Cannot reach the backend API. Start it with npm run backend (port 5001), or run both apps with npm run dev from the project root.';
  }

  return fallback;
};
