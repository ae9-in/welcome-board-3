import { createMiddleware } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

// Client middleware to attach the local admin session token to requests
export const attachLocalAuth = createMiddleware({ type: "function" }).client(
  async ({ next }) => {
    let token = null;
    if (typeof window !== "undefined") {
      token = window.localStorage.getItem("mock_admin_session");
    }
    return next({
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  }
);

// Server middleware to authorize requests based on the local admin token
export const requireLocalAuth = createMiddleware({ type: "function" }).server(
  async ({ next }) => {
    const request = getRequest();
    if (!request?.headers) {
      throw new Error("Unauthorized: No request headers available");
    }

    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      throw new Error("Unauthorized: No authorization header provided");
    }

    if (!authHeader.startsWith("Bearer ")) {
      throw new Error("Unauthorized: Only Bearer tokens are supported");
    }

    const token = authHeader.replace("Bearer ", "");
    if (!token || token !== "mock.admin.token") {
      throw new Error("Unauthorized: Invalid session credentials");
    }

    return next({
      context: {
        userId: "local-admin-uuid",
      },
    });
  }
);
