/**
 * @description Custom hook for authentication state management using Zustand.
 * This hook provides access to the authentication store defined in authStore.js.
 * It allows components to easily access and manipulate authentication state.
 * 
 */

import { useAuthStore } from "../store/authStore";
import { loginSchema, registerSchema } from "../validation/authValidation";
import { loginService, registerService } from "../service/authService";

export const useAuthHook = () => {
    const { setUser, error, setError } = useAuthStore();

    // handle login
    const LoginHook = async (formData) => {
        // validate formData and perform login logic here
        const { error: validationError } = loginSchema.validate(formData);
        if (validationError) {
            const msg = validationError.details[0].message;
            setError(msg);
            throw new Error(msg);
        }
        // call the login service
        setError(null); // Clear previous errors
        try {
            const response = await loginService(formData);
            setUser(response.user);
            setError(null); 
            return response.user;

        } catch (error) {
            console.error("Error in login hook", error.message);
            setError(error.message);
            throw error;
        }

    };

    // registration logic
    const RegisterHook = async (formData) => {
        // validate form data
        const { error: validationError } = registerSchema.validate(formData)
        if (validationError) {
            const errorMsg = validationError.details[0].message
            setError(errorMsg);
            throw new Error(errorMsg);
        }
        // if form is valid, send it to backend
        setError(null); // Clear previous errors
        const { name, email, role, password } = formData;
        const payload = { name, email, role, password };
        try {
            const response = await registerService(payload);
            return response?.message || "Account created successfully"
            
        } catch (error) {
            setError(error.message)
            console.error("Error in register hook", error.message);
            throw error;
        }

    }


    return { error, LoginHook, RegisterHook  };
}