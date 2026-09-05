document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const showSignup = document.getElementById('showSignup');
    const showLogin = document.getElementById('showLogin');

    // Target link for redirection after submit
    const targetPage = 'https://soultaker1-2.github.io/my-website/';

    // Toggle between Login and Signup forms
    if (showSignup && showLogin && loginForm && signupForm) {
        showSignup.addEventListener('click', (e) => {
            e.preventDefault();
            loginForm.classList.add('hidden');
            signupForm.classList.remove('hidden');
        });

        showLogin.addEventListener('click', (e) => {
            e.preventDefault();
            signupForm.classList.add('hidden');
            loginForm.classList.remove('hidden');
        });
    }

    // Redirect on Login submit
    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();
            window.location.href = targetPage;
        });
    }

    // Redirect on Signup submit
    if (signupForm) {
        signupForm.addEventListener('submit', (event) => {
            event.preventDefault();
            window.location.href = targetPage;
        });
    }
});
