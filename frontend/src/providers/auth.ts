import { AuthBindings } from "@refinedev/core";
import axios from "axios";

export const authProvider: AuthBindings = {
  // 🔹 LOGIN (connects to your FastAPI /auth/login endpoint)
  login: async ({ email, password }) => {
    try {
      const res = await axios.post("http://localhost:8000/auth/login", {
        username: email, // FastAPI expects 'username'
        password,
      });

      const { access_token } = res.data;
      localStorage.setItem("access_token", access_token);

      return {
        success: true,
        redirectTo: "/", // after login, redirect to dashboard
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: "Login failed",
          name: "Invalid credentials",
        },
      };
    }
  },

  // 🔹 SIGNUP (connects to your FastAPI /auth/signup endpoint)
  register: async ({ email, password , role }) => {
    try {
      const res = await axios.post("http://localhost:8000/auth/signup", {
        email: email,
        password: password,
        role: role,

      });

      const { access_token } = res.data;
      localStorage.setItem("access_token", access_token);

      return {
        success: true,
        redirectTo: "/",
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: "Signup failed",
          name: "User already exists?",
        },
      };
    }
  },

  // 🔹 LOGOUT
  logout: async () => {
    localStorage.removeItem("access_token");
    return { success: true, redirectTo: "/login" };
  },

  // 🔹 CHECK if user is authenticated
  check: async () => {
    const token = localStorage.getItem("access_token");
    if (token) {
      return { authenticated: true };
    }
    return {
      authenticated: false,
      redirectTo: "/login",
    };
  },

  // 🔹 Extract role from JWT for RBAC
  getPermissions: async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split(".")[1])); // decode JWT payload
      return payload.role; // "admin", "manager", etc.
    } catch {
      return null;
    }
  },

  // 🔹 Get logged in user identity
  getIdentity: async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return {
        id: payload.sub,
        role: payload.role,
      };
    } catch {
      return null;
    }
  },
   onError: async (error) => {
    console.error("Auth error:", error);

    if (error?.status === 401) {
      localStorage.removeItem("access_token");
      return {
        logout: true,
        redirectTo: "/login",
        error,
      };
    }

    return { error };
  },
};
