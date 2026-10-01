document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const showSignup = document.getElementById('showSignup');
  const showLogin = document.getElementById('showLogin');
  const statusMessage = document.getElementById('statusMessage');

  // Redirect to the local home page after a successful login or signup
  const targetPage = 'portfolio.html';

  // Toggle between Login and Signup forms
  if (showSignup) {
    showSignup.addEventListener('click', () => {
      if (loginForm) loginForm.classList.add('hidden');
      if (signupForm) signupForm.classList.remove('hidden');
      if (statusMessage) statusMessage.textContent = '';
    });
  }

  if (showLogin) {
    showLogin.addEventListener('click', () => {
      if (signupForm) signupForm.classList.add('hidden');
      if (loginForm) loginForm.classList.remove('hidden');
      if (statusMessage) statusMessage.textContent = '';
    });
  }

  // Handle Login Submission
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail')?.value.trim();
      const password = document.getElementById('loginPassword')?.value.trim();

      if (email && password) {
        window.location.href = targetPage;
      } else if (statusMessage) {
        statusMessage.textContent = 'Please enter both email and password.';
      }
    });
  }

  // Handle Signup Submission
  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('signupEmail')?.value.trim();
      const password = document.getElementById('signupPassword')?.value.trim();

      if (email && password) {
        window.location.href = targetPage;
      } else if (statusMessage) {
        statusMessage.textContent = 'Please fill in all registration fields.';
      }
    });
  }
});