/* ======================================================
   SAFE USER DATA
   Always return a consistent shape for the frontend
====================================================== */
module.safeUserPayload = (userRow) => {
  if (!userRow) return null;

  return {
    id: userRow.id,
    name: userRow.name,
    email: userRow.email,
    role: userRow.role,
    profile_picture: userRow.profile_picture || null,
    sex: userRow.sex || null,
    category: userRow.category || null,
    location: userRow.location || null,
    phone: userRow.phone || null,
    contact: userRow.contact || null,
    address: userRow.address || null, // ✅ Added
    updated_at: userRow.updated_at || null,
  };
};
