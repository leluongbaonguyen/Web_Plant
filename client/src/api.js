const JSON_HEADERS = { 'Content-Type': 'application/json' };

async function request(url, options = {}) {
  const response = await fetch(url, options);
  if (!response.ok) {
    let message = 'Không thể kết nối máy chủ.';
    try {
      const body = await response.json();
      message = body.message || message;
    } catch {
      // Bỏ qua lỗi đọc JSON.
    }
    throw new Error(message);
  }
  return response;
}

export async function getPlan() {
  return (await request('/api/plan')).json();
}

export async function savePlan(plan) {
  return (await request('/api/plan', {
    method: 'PUT',
    headers: JSON_HEADERS,
    body: JSON.stringify(plan),
  })).json();
}

export async function resetPlan() {
  return (await request('/api/plan/reset', { method: 'POST' })).json();
}

export async function getWordFile() {
  return (await request('/api/export/word')).blob();
}
