const API = '/api';

function getToken() {
  try {
    const stored = localStorage.getItem('consulthub-auth');
    if (stored) return JSON.parse(stored).token;
  } catch {
    return null;
  }
  return null;
}

async function request(url, options = {}) {
  const token = getToken();
  const headers = { ...options.headers };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (options.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = headers['Content-Type'] || 'application/json';
  }

  const response = await fetch(`${API}${url}`, { ...options, headers });
  const contentType = response.headers.get('content-type');

  if (!response.ok) {
    let message = 'Request failed';
    if (contentType?.includes('application/json')) {
      const data = await response.json();
      message = data.message || message;
    }
    throw new Error(message);
  }

  if (contentType?.includes('application/json')) {
    return response.json();
  }

  return response.text();
}

export const authApi = {
  login: (data) => request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  signup: (data) => request('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  me: () => request('/auth/me'),
};

export const dashboardApi = {
  get: () => request('/dashboard'),
};

export const clientApi = {
  getAll: () => request('/clients'),
  getPage: (page, size) => request(`/clients/page?page=${page}&size=${size}`),
  search: (name) => request(`/clients/search?name=${encodeURIComponent(name)}`),
  create: (data) => request('/clients', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => request(`/clients/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  remove: (id) => request(`/clients/${id}`, { method: 'DELETE' }),
};

export const consultationApi = {
  getAll: () => request('/consultations'),
  search: (q) => request(`/consultations/search?q=${encodeURIComponent(q)}`),
  create: (clientId, data) => request(`/consultations/client/${clientId}`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => request(`/consultations/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  remove: (id) => request(`/consultations/${id}`, { method: 'DELETE' }),
  recordingCount: (id) => request(`/consultations/${id}/recordings/count`),
};

export const recordingApi = {
  getAll: () => request('/recordings'),
  search: (fileName) => request(`/recordings/search?fileName=${encodeURIComponent(fileName)}`),
  upload: (consultationId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return request(`/recordings/upload/${consultationId}`, {
      method: 'POST',
      body: formData,
    });
  },
  remove: (id) => request(`/recordings/${id}`, { method: 'DELETE' }),
  downloadUrl: (id) => `${API}/recordings/download/${id}`,
  download: async (id, fileName) => {
    const token = getToken();
    const response = await fetch(`${API}/recordings/download/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!response.ok) throw new Error('Download failed');
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName || 'recording';
    link.click();
    URL.revokeObjectURL(url);
  },
};

export const adminApi = {
  getStats: () => request('/admin/stats'),
};
