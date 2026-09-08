// Storage is injected so authentication retries can be tested without a browser.
export function installAuthInterceptors(api, cookies) {
  let refreshPromise = null;
  api.interceptors.request.use((config) => {
    const id = cookies.get('_id');
    const token = cookies.get('accessToken');
    if (id) config.headers.set('x-client-id', id);
    else config.headers.delete('x-client-id');
    if (token) config.headers.set('authorization', token);
    else config.headers.delete('authorization');
    return config;
  });
  api.interceptors.response.use((response) => response, async (error) => {
    const request = error.config;
    const canRefresh = error.response?.status === 401 &&
      error.response?.data?.message === 'ACCESS_TOKEN_EXPIRED' &&
      request && !request._retry && !request.url?.includes('/user/handleRefreshToken');
    if (!canRefresh || !cookies.get('refreshToken')) return Promise.reject(error);
    request._retry = true;
    if (!refreshPromise) {
      refreshPromise = api.post('/user/handleRefreshToken', { refreshToken: cookies.get('refreshToken') })
        .then((response) => {
          const { accessToken, refreshToken } = response.data.metadata.tokens;
          cookies.set('accessToken', accessToken, { expires: 1 });
          cookies.set('refreshToken', refreshToken, { expires: 7 });
        })
        .catch((refreshError) => {
          if ([400, 401, 403].includes(refreshError.response?.status)) {
            cookies.remove('accessToken');
            cookies.remove('refreshToken');
          }
          throw refreshError;
        })
        .finally(() => { refreshPromise = null; });
    }
    await refreshPromise;
    return api(request);
  });
}
