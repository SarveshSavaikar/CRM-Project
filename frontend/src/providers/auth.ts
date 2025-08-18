// import { AuthBindings } from "@refinedev/core";
// import axios from "axios";
// import { access } from "fs";

// export const authProvider: AuthBindings = {
//   // 🔹 LOGIN (connects to your FastAPI /auth/login endpoint)
//   login: async ({ email, password }) => {
//     const response = await axios.post("http://localhost:8000/auth/login", {
//         username: email, // FastAPI expects 'username'
//         password,
//       });

//         if (response.status) {
//             const data = await response.data["access_token"];
//             console.log("Successfull login :- ",response.data)
//             localStorage.setItem("access_token", data);
//             return { success: true, redirectTo: "/" ,  authenticated: true};
//         }

        
//         return {
//             success: false,
//             error: new Error("Invalid login"),
//         };
//   },

//   // 🔹 SIGNUP (connects to your FastAPI /auth/signup endpoint)
//   register: async ({ email, password , role }) => {
//     try {
//       const res = await axios.post("http://localhost:8000/auth/signup", {
//         email: email,
//         password: password,
//         role: role,

//       });

//       const { access_token } = res.data;
//       localStorage.setItem("access_token", access_token);

//       return {
//         success: true,
//         redirectTo: "/",
//       };
//     } catch (error) {
//       return {
//         success: false,
//         error: {
//           message: "Signup failed",
//           name: "User already exists?",
//         },
//       };
//     }
//   },

//   // 🔹 LOGOUT
//   logout: async () => {
//     localStorage.removeItem("access_token");
//     return { success: true, redirectTo: "/login" };
//   },

//   // 🔹 CHECK if user is authenticated
//   check: async () => {
//     const token = localStorage.getItem("access_token");
//     if (token) {
//       return { authenticated: true  };
//     }
//     return {
//       authenticated: false,
//       redirectTo: "/login",
//     };
//   },

//   // 🔹 Extract role from JWT for RBAC
//   getPermissions: async () => {
//     const token = localStorage.getItem("access_token");
//     if (!token) return null;

//     try {
//       const payload = JSON.parse(atob(token.split(".")[1])); // decode JWT payload
//       return payload.role; // "admin", "manager", etc.
//     } catch {
//       console.log("Error in finding the Permsios")
//       return null;
//     }
//   },

//   // 🔹 Get logged in user identity
//   getIdentity: async () => {
//     const token = localStorage.getItem("access_token");
//     if (!token) return null;

//     try {
//       const payload = JSON.parse(atob(token.split(".")[1]));
//       return {
//         id: payload.sub,
//         role: payload.role,
//       };
//     } catch {
//       console.log("error in finding the identity")
//       return null;
//     }
//   },
//    onError: async (error) => {
//     console.error("Auth error:", error);

//     if (error?.status === 401) {
//       localStorage.removeItem("access_token");
//       return {
//         logout: true,
//         redirectTo: "/login",
//         error,
//       };
//     }

//     return { error };
//   },
// };

import type { AuthProvider } from "@refinedev/core";

import type { User } from "@/graphql/schema.types";

import { API_URL, dataProvider } from "./data";

/**
 * For demo purposes and to make it easier to test the app, you can use the following credentials:
 */
export const authCredentials = {
  email: "michael.scott@dundermifflin.com",
  password: "demodemo",
};

export const authProvider: AuthProvider = {
  login: async ({ email }) => {
    try {
      const { data } = await dataProvider.custom({
        url: API_URL,
        method: "post",
        headers: {},
        meta: {
          variables: { email },
          rawQuery: `
                mutation Login($email: String!) {
                    login(loginInput: {
                      email: $email
                    }) {
                      accessToken,
                    }
                  }
                `,
        },
      });

      localStorage.setItem("access_token", data.login.accessToken);

      return {
        success: true,
        redirectTo: "/",
      };
    } catch (e) {
      const error = e as Error;

      return {
        success: false,
        error: {
          message: "message" in error ? error.message : "Login failed",
          name: "name" in error ? error.name : "Invalid email or password",
        },
      };
    }
  },
  logout: async () => {
    localStorage.removeItem("access_token");

    return {
      success: true,
      redirectTo: "/login",
    };
  },
  onError: async (error) => {
    if (error.statusCode === "UNAUTHENTICATED") {
      return {
        logout: true,
      };
    }

    return { error };
  },
  check: async () => {
    try {
      await dataProvider.custom({
        url: API_URL,
        method: "post",
        headers: {},
        meta: {
          rawQuery: `
                    query Me {
                        me {
                          name
                        }
                      }
                `,
        },
      });

      return {
        authenticated: true,
        redirectTo: "/",
      };
    } catch (error) {
      return {
        authenticated: false,
        redirectTo: "/login",
      };
    }
  },
  getIdentity: async () => {
    const accessToken = localStorage.getItem("access_token");

    try {
      const { data } = await dataProvider.custom<{ me: User }>({
        url: API_URL,
        method: "post",
        headers: accessToken
          ? {
              Authorization: `Bearer ${accessToken}`,
            }
          : {},
        meta: {
          rawQuery: `
                    query Me {
                        me {
                            id,
                            name,
                            email,
                            phone,
                            jobTitle,
                            timezone
                            avatarUrl
                        }
                      }
                `,
        },
      });

      return data.me;
    } catch (error) {
      return undefined;
    }
  },
};
