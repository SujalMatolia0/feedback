const BASE_URL = import.meta.env.VITE_BASE_URL || '';

// Helper function to make API requests with error handling

async function request(path = '', opts = {}) {
  const url = path.startsWith('http') ? path : `${BASE_URL}${path}`;
  const res = await fetch(url, opts);
  if (!res.ok) {
    const text = await res.text().catch(() => null);
    const err = new Error(`API error ${res.status}`);
    err.status = res.status;
    err.body = text;
    throw err;
  }
  return res.json();
}

// Fetch all feedback entries from the backend

export const getFeedbacks = async () => {
  return request('');
};

export const createFeedback = async (data) => {
  return request('', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
};

export const deleteFeedback = async (id) => {
  return request(`/${id}`, { method: 'DELETE' });
};
