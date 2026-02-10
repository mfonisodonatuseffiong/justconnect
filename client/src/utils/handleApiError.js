/**
 * @description Reusable helper function for handling API errors
 *              - Logs full error details
 *              - Extracts a clean message
 *              - Throws a new Error with that message
 */

export const handleApiError = (error) => {
  console.error("🚨 handleApiError invoked with error:", error);

  const status = error?.response?.status;
  const data = error?.response?.data;
  const errMsg =
    data?.error ||
    data?.message ||
    error?.message ||
    "Server not currently reachable, try again later";

  console.error("📦 Extracted error details:", {
    status,
    data,
    finalMessage: errMsg,
  });

  throw new Error(errMsg);
};
