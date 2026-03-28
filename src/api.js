const API_BASE = "https://salesos-ft6b.onrender.com";

export const researchAPI = (data) =>
  fetch(`${API_BASE}/api/research`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

export const outreachAPI = (data) =>
  fetch(`${API_BASE}/api/outreach`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

export const riskAPI = (data) =>
  fetch(`${API_BASE}/api/risk`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

export const recoveryAPI = (data) =>
  fetch(`${API_BASE}/api/recovery`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

export const competitiveAPI = (data) =>
  fetch(`${API_BASE}/api/competitive`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

export const forecastAPI = (data) =>
  fetch(`${API_BASE}/api/forecast`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });