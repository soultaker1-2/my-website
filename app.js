document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    // Replace this URL with your actual website link
    const targetPage = 'https://soultaker1-2.github.io/my-website/';

    // Handle Login Form Submission
    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Prevents page reload
            window.location.href = targetPage; // Redirects to full website link
        });
    }

    // Handle Signup Form Submission
    if (signupForm) {
        signupForm.addEventListener('submit', (event) => {
            event.preventDefault();
            window.location.href = targetPage;
        });
    }
});
