/**
 * 
 * @description This helper function helps to globalize response to frontend
 *              a conditional check tosee if user is professional to add its data or not
 * @returns user data and professional data 
 */
const safeUserPayload = (user) => {
  if (!user) return null;

  const response = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    profile_picture: user.profile_picture || null,
    phone: user.phone || null,
    sex: user.sex || null,
    address: user.address || null,
    location: user.location || null,
    is_verified: user.is_verified,
  };

  // ONLY attach professional if user is professional
  if (user.role === "professional" && user.category_id) {
    response.professional = {
      bio: user.bio || null,
      category_id: user.category_id || null,
      rating: user.rating || null,
      experience_years: user.experience_years || null,
      service_area: user.service_area || null,
      is_available: user.is_available ?? null,
    };
  }

  return response;
};

module.exports = {
  safeUserPayload,
};