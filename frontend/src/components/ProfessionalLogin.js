const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
  
    try {
      const response = await fetch("http://localhost:5000/api/auth/professional-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(professionalData),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Backend Error Response:", errorText);
        throw new Error("Login failed: " + errorText);
      }
  
      const result = await response.json();
      console.log("Professional Login Response:", result);
  
      if (!result.token || result.role !== "professional") {
        throw new Error("Invalid server response: Missing token or incorrect role.");
      }
  
      // Store authentication in local storage
      localStorage.setItem("token", result.token);
      localStorage.setItem("role", result.role);
      localStorage.setItem("name", result.name); 
  
      alert("Login successful!");
  
      // **Force reload to immediately switch to Professional Dashboard**
      window.location.href = "/professional-dashboard";
  
    } catch (error) {
      console.error("Login Error:", error.message);
      setError(error.message);
    }
  };
  