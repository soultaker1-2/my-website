document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    // Replace this link with your actual full website address
    const targetPage = 'https://soultaker1-2.github.io/my-website/';

    // Handle Login Form Submission
    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Prevents page reload
            window.location.href = targetPage; // Redirects to your page/link
        });
    }

    // Handle Signup Form Submission (if applicable)
    if (signupForm) {
        signupForm.addEventListener('submit', (event) => {
            event.preventDefault();
            window.location.href = targetPage;
        });
    }
});
