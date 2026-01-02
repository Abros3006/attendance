import { ConvexReactClient } from "convex/react";

// Use the environment variable for the Convex URL
const convexUrl = import.meta.env.VITE_CONVEX_URL;

if (!convexUrl) {
  throw new Error("VITE_CONVEX_URL environment variable is not set");
}

export const convex = new ConvexReactClient(convexUrl);

// Helper function to handle Convex errors
export function handleConvexError(error: any) {
  if (error instanceof Error) {
    return error.message;
  }
  return "An unexpected error occurred";
}

// Helper function to check if user is offline
export function isConvexOfflineError(error: any) {
  return error?.message?.includes("offline") || error?.code === "OFFLINE";
}