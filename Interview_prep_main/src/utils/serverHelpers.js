import { backendUrl } from "./config";

// Utility to get token from cookies
const getToken = () => {
  return document.cookie.replace(
    /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
    "$1"
  );
};

// Unauthenticated POST
export const makeUnauthenticatedPOSTRequest = async (route, body) => {
  try {
    const response = await fetch(`${backendUrl}${route}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const result = await response.json();
    return result;
  } catch (err) {
    console.error("Unauthenticated POST failed:", err);
    throw err;
  }
};

// Authenticated GET
export const makeAuthenticatedGETRequest = async (route) => {
  try {
    const token = getToken();
    const response = await fetch(`${backendUrl}${route}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();
    return result;
  } catch (err) {
    console.error("Authenticated GET failed:", err);
    throw err;
  }
};

// Authenticated POST
export const makeAuthenticatedPOSTRequest = async (route, body) => {
  try {
    const token = getToken();
    const response = await fetch(`${backendUrl}${route}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const result = await response.json();
    return result;
  } catch (err) {
    console.error("Authenticated POST failed:", err);
    throw err;
  }
};

// Save answer (simple version)
export const saveAnswerToDatabase = async (data) => {
  try {
    const response = await fetch(`${backendUrl}/api/save/answer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Failed to save answer to DB:", error);
    throw error;
  }
};

// Save answer with fallback to localStorage
export const saveAnswerToDatabaseWithFallback = async (data) => {
  try {
    const token = getToken();

    const response = await fetch(`${backendUrl}/ans/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to save answer");
    }

    return result;
  } catch (error) {
    console.warn("Saving to localStorage due to error:", error.message);

    const offlineAnswers = JSON.parse(localStorage.getItem("offlineAnswers") || "[]");
    offlineAnswers.push(data);
    localStorage.setItem("offlineAnswers", JSON.stringify(offlineAnswers));

    return {
      success: false,
      message: "Saved locally. Will retry later.",
    };
  }
};

// Fetch user progress (for stats page)
export const fetchUserProgress = async () => {
  return await makeAuthenticatedGETRequest("/api/user/progress");
};
