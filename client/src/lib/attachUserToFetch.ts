// This module patches the global `fetch` to automatically attach
// `userId` and `role` from `localStorage` to API requests.
// - For GET/DELETE: adds `userId` and `role` as query params
// - For POST/PUT/PATCH: injects `userId` and `role` into JSON body or FormData

if (typeof window !== 'undefined') {
  try {
    const originalFetch = window.fetch.bind(window);

    window.fetch = async (input: RequestInfo, init?: RequestInit) => {
      try {
        const stored = localStorage.getItem('user');
        const user = stored ? JSON.parse(stored) : null;
        const userId = user?.id;
        const role = user?.role;

        let url = typeof input === 'string' ? input : input instanceof Request ? input.url : String(input);
        const method = ((init && init.method) || (input instanceof Request && input.method) || 'GET').toUpperCase();

        // Only modify API calls (adjust this check if your API sits on a different path)
        if (typeof url === 'string' && url.includes('/api/')) {
          if (method === 'GET' || method === 'DELETE') {
            const u = new URL(url, window.location.origin);
            if (userId && !u.searchParams.has('userId')) u.searchParams.set('userId', userId);
            if (role && !u.searchParams.has('role')) u.searchParams.set('role', role);
            url = u.pathname + u.search;
          } else if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
            const headers = new Headers(init?.headers as HeadersInit || {});
            const contentType = headers.get('content-type') || '';

            if (!init) init = {};

            if (init.body == null || contentType.includes('application/json')) {
              let bodyObj: any = {};
              if (init.body) {
                try {
                  bodyObj = typeof init.body === 'string' ? JSON.parse(init.body) : init.body;
                } catch (e) {
                  bodyObj = {};
                }
              }

              if (userId && bodyObj && !('userId' in bodyObj)) bodyObj.userId = userId;
              if (role && bodyObj && !('role' in bodyObj)) bodyObj.role = role;

              init.body = JSON.stringify(bodyObj);
              headers.set('content-type', 'application/json');
              init.headers = headers;
            } else if (init.body instanceof FormData) {
              if (userId) init.body.append('userId', userId);
              if (role) init.body.append('role', role);
            }
          }
        }

        const finalInput = typeof input === 'string' ? url : new Request(url, input as RequestInit);
        return originalFetch(finalInput, init);
      } catch (innerErr) {
        return originalFetch(input, init);
      }
    };
  } catch (err) {
    // If patching fetch fails, don't crash the app.
    // eslint-disable-next-line no-console
    console.warn('attachUserToFetch failed to patch fetch:', err);
  }
}

export {};
