const JSON_HEADERS = { 'Content-Type': 'application/json' };
let activeRole = localStorage.getItem('chrono_user_role') || 'admin';

export function setApiRole(role) {
  activeRole = role;
  localStorage.setItem('chrono_user_role', role);
}

export function getApiRole() {
  return activeRole;
}

async function request(url, options = {}) {
  const headers = {
    ...JSON_HEADERS,
    'x-user-role': activeRole,
    ...(options.headers || {}),
  };

  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    let message = 'Không thể kết nối máy chủ.';
    try {
      const body = await response.json();
      message = body.message || message;
    } catch {
      // Ignore JSON parse error
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
    body: JSON.stringify(plan),
  })).json();
}

export async function resetPlan() {
  return (await request('/api/plan/reset', { method: 'POST' })).json();
}

export async function getWordFile() {
  return (await request('/api/export/word')).blob();
}

export async function getRolesInfo() {
  return (await request('/api/roles')).json();
}
