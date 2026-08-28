const contactForm = document.getElementById('contactForm');
const successMessage = document.getElementById('successMessage');

if (contactForm && successMessage) {
    contactForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const submitButton = contactForm.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
        successMessage.hidden = true;

        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: new FormData(contactForm),
                headers: { Accept: 'application/json' }
            });
            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || 'Unable to send your message.');
            }

            contactForm.reset();
            successMessage.textContent = 'Message sent successfully. I will get back to you soon.';
            successMessage.style.color = 'green';
        } catch (error) {
            successMessage.textContent = error.message;
            successMessage.style.color = '#d66666';
        } finally {
            successMessage.hidden = false;
            submitButton.disabled = false;
            submitButton.textContent = 'Send Message';
        }
    });
}

const actionButton = document.getElementById('action-btn');
const welcomeMessage = document.getElementById('welcome-message');

// 2. Add an event listener to wait for a click on the button
if (actionButton && welcomeMessage) {
    actionButton.addEventListener('click', function() {
        // Ask the user for their name using a browser prompt
        let username = prompt("What is your name?");

        // Check if the user actually typed a name
        if (username) {
            // Change the text inside the <h3> element dynamically
            welcomeMessage.textContent = "Welcome back, " + username + "! JavaScript just changed this text.";
            actionButton.textContent = "Done!";
            actionButton.style.backgroundColor = "#4CAF50";
            actionButton.style.color = "white";
        }
    });
}

const themeToggle = document.getElementById('themeToggle');
const loginForm = document.getElementById('loginForm');
const loginMessage = document.getElementById('loginMessage');
const menuToggle = document.getElementById('menuToggle');
const navigation = document.querySelector('nav');

if (menuToggle && navigation) {
    menuToggle.addEventListener('click', function () {
        const isOpen = navigation.classList.toggle('open');
        menuToggle.setAttribute('aria-expanded', String(isOpen));
        menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
        menuToggle.textContent = isOpen ? '×' : '☰';
    });

    navigation.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
            navigation.classList.remove('open');
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.setAttribute('aria-label', 'Open navigation menu');
            menuToggle.textContent = '☰';
        });
    });
}

if (themeToggle) {
    const savedTheme = localStorage.getItem('soul-theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        themeToggle.textContent = 'Dark';
        themeToggle.setAttribute('aria-label', 'Switch to dark theme');
    }

    themeToggle.addEventListener('click', function () {
        const lightTheme = document.body.classList.toggle('light-theme');
        localStorage.setItem('soul-theme', lightTheme ? 'light' : 'dark');
        themeToggle.textContent = lightTheme ? 'Dark' : 'Light';
        themeToggle.setAttribute('aria-label', lightTheme ? 'Switch to dark theme' : 'Switch to light theme');
    });
}

if (loginForm && loginMessage) {
    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();
        loginMessage.textContent = 'This login form is ready for an authentication provider.';
    });
}

const revealItems = document.querySelectorAll('section, .project-card');

if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    revealItems.forEach(function (item) {
        item.classList.add('reveal');
        revealObserver.observe(item);
    });
}

