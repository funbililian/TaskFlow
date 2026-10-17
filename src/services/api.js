const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem("taskflow_token");

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong.");
  }

  return data;
};

export const registerUser = async (userData) => {
  const data = await request("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });

  if (data.token) {
    localStorage.setItem("taskflow_token", data.token);
  }

  return data;
};

export const loginUser = async (credentials) => {
  const data = await request("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });

  if (data.token) {
    localStorage.setItem("taskflow_token", data.token);
  }

  return data;
};

export const getCurrentUser = async () => {
  return request("/auth/getMe");
};

export const logoutUser = () => {
  localStorage.removeItem("taskflow_token");
};

export const getTasks = async () => {
  return request("/tasks");
};

export const saveTasks = async (tasks) => {
  return request("/tasks", {
    method: "PUT",
    body: JSON.stringify({ tasks }),
  });
};

export const updateProfile = async (profileData) => {
  return request("/auth/profile", {
    method: "PATCH",
    body: JSON.stringify(profileData),
  });
};
