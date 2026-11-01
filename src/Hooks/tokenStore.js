// Tiny module-level store so axios interceptors can always read the freshest JWT
// without waiting for a React re-render.
let accessToken = null;

export const setAccessToken = (token) => {
  accessToken = token || null;
};

export const getAccessToken = () => accessToken;
