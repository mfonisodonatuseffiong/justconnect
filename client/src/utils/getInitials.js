/**
 * @description This is a quick helper function that gets the initials of the user
 * @usage For avatar
 */

export const getInitials = (name) => {
  if (!name) return "";

  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0].toUpperCase() || "";
  const last = parts.length > 1 ? parts[parts.length - 1][0].toUpperCase() : "";

  return first + last;
};
