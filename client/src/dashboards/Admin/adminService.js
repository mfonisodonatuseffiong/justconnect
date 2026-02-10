// src/dashboards/Admin/adminService.js
import authAxios from "../../api";

// Users
export const getUsersAdmin = async () => {
  const res = await authAxios.get("/api/v1/admin/users");
  return res.data;
};
export const deleteUser = async (id) => {
  await authAxios.delete(`/api/v1/admin/users/${id}`);
};

// Professionals
export const getProfessionalsAdmin = async () => {
  const res = await authAxios.get("/api/v1/admin/professionals");
  return res.data;
};
export const deleteProfessional = async (id) => {
  await authAxios.delete(`/api/v1/admin/professionals/${id}`);
};

// Services
export const getServicesAdmin = async () => {
  const res = await authAxios.get("/api/v1/admin/services");
  return res.data;
};
export const deleteService = async (id) => {
  await authAxios.delete(`/api/v1/admin/services/${id}`);
};

// Dashboard stats
export const getDashboardStats = async () => {
  const res = await authAxios.get("/api/v1/dashboard/");
  return res.data;
};
