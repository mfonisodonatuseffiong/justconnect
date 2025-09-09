/**
 * @description: Authentication service to fetch auth from backend
 */

import authAxios from "../utils/authAxios";

export const loginService = async (payload) => {
    try {
        // fetch the response from backend and return the data
        const response = await authAxios.post("/login", payload);
        return response.data;  
    } catch (error) {
        console.error("Error in Login service", error.message);
        const errMsg = error?.response?.data?.error || error?.response?.data?.message || "Server not currently reachable try later";
        throw new Error(errMsg);
    }
}

