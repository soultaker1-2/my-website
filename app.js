document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const showSignup = document.getElementById('showSignup');
    const showLogin = document.getElementById('showLogin');

    // Redirect to the local portfolio page after successful login or signup
    const targetPage = 'portfolio.html';

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

