export function setupLoginForm(formSelector) {
    const loginForm = document.querySelector(formSelector);
    if (!loginForm) return;
  
    const submitBtn = loginForm.querySelector('button');
    if (!submitBtn) return;
  
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
  
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;
  
      // Simulate a request — replace with actual API logic
      setTimeout(() => {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
  
        // Feedback (you can replace this with custom toast or UI)
        alert("Login successful!");
      }, 2000);
    });
  }
  