import { ConvexReactClient } from "convex/react";

// Use the environment variable for the Convex URL
const convexUrl = import.meta.env.VITE_CONVEX_URL;

if (!convexUrl) {
  console.warn("VITE_CONVEX_URL environment variable is not set. Some features may not work properly.");
}

export const convex = convexUrl ? new ConvexReactClient(convexUrl) : null;

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

// Helper function to check if Convex is available
export function isConvexAvailable() {
  return convex !== null;
}