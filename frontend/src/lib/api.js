const ADMIN_TOKEN_KEY = "portfolio_admin_token";

function getAdminToken() {
  return localStorage.getItem(ADMIN_TOKEN_KEY) || "";
}

function setAdminToken(token) {
  if (!token) {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    return;
  }
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
}

async function request(path, options = {}) {
  const token = getAdminToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(path, {
    ...options,
    headers
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const message = payload?.error || "Request failed";
    throw new Error(message);
  }
  return payload;
}

export async function fetchContent() {
  const response = await request("/api/content", { method: "GET", headers: {} });
  return response.content;
}

export async function saveContent(content) {
  await request("/api/content", {
    method: "PUT",
    body: JSON.stringify({ content })
  });
}

export async function loginAdmin(passcode) {
  const response = await request("/api/admin/login", {
    method: "POST",
    body: JSON.stringify({ passcode })
  });
  setAdminToken(response.token);
}

export async function validateAdminSession() {
  await request("/api/admin/session", { method: "GET", headers: {} });
}

export async function logoutAdmin() {
  try {
    await request("/api/admin/logout", { method: "POST" });
  } catch {
    // Ignore, local logout is still enough for JWT-based flow.
  } finally {
    setAdminToken("");
  }
}

export async function changeAdminPasscode(currentPasscode, newPasscode) {
  await request("/api/admin/passcode", {
    method: "PATCH",
    body: JSON.stringify({ currentPasscode, newPasscode })
  });
}

