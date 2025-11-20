/**
 * @description This is a reuseable helper function, reusable across all auth services api call
 */

export const handleApiError = (error) => {
  const errMsg =
    error?.response?.data?.error ||
    error?.response?.data?.message ||
    "Server not currently reachable, try again later";
  throw new Error(errMsg);
};
