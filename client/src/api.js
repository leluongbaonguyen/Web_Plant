const JSON_HEADERS = { 'Content-Type': 'application/json' };
let activeRole = localStorage.getItem('chrono_user_role') || 'admin';
let stealthToken = localStorage.getItem('chrono_stealth_token') || '';

export function setApiRole(role) {
  activeRole = role;
  localStorage.setItem('chrono_user_role', role);
}

export function getApiRole() {
  return activeRole;
}

export function setStealthToken(token) {
  stealthToken = token;
  if (token) localStorage.setItem('chrono_stealth_token', token);
  else localStorage.removeItem('chrono_stealth_token');
}

export function getStealthToken() {
  return stealthToken;
}

async function request(url, options = {}) {
  const headers = {
    ...JSON_HEADERS,
    'x-user-role': activeRole,
    'x-stealth-token': stealthToken,
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

// Super Admin & Stealth Portal APIs
export async function loginStealthAdmin(passcode) {
  const res = await request('/api/admin/auth', {
    method: 'POST',
    body: JSON.stringify({ passcode }),
  });
  const data = await res.json();
  if (data.token) setStealthToken(data.token);
  return data;
}

export async function getTelemetryInfo() {
  return (await request('/api/admin/telemetry')).json();
}

export async function triggerSystemUpgrade(targetVersion) {
  return (await request('/api/admin/upgrade', {
    method: 'POST',
    body: JSON.stringify({ targetVersion }),
  })).json();
}

export async function toggleMaintenanceMode(enabled) {
  return (await request('/api/admin/maintenance', {
    method: 'POST',
    body: JSON.stringify({ enabled }),
  })).json();
}

// Agent Management & Auth APIs
export async function loginAgent(username, password) {
  const res = await request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
  return res.json();
}

export async function getAgentsList() {
  return (await request('/api/admin/agents')).json();
}

export async function createAgent(agentData) {
  return (await request('/api/admin/agents', {
    method: 'POST',
    body: JSON.stringify(agentData),
  })).json();
}

export async function updateAgent(id, agentData) {
  return (await request(`/api/admin/agents/${id}`, {
    method: 'PUT',
    body: JSON.stringify(agentData),
  })).json();
}

export async function deleteAgent(id) {
  return (await request(`/api/admin/agents/${id}`, {
    method: 'DELETE',
  })).json();
}

// Kangaroo DB APIs
export async function getKangarooStatus() {
  return (await request('/api/kangaroo/status')).json();
}

export async function forceKangarooSync() {
  return (await request('/api/kangaroo/sync', { method: 'POST' })).json();
}
