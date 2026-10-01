const contactForm = document.getElementById('contactForm');
const successMessage = document.getElementById('successMessage');

if (contactForm && successMessage) {
    contactForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const submitButton = contactForm.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
        successMessage.hidden = true;
        successMessage.textContent = 'Sending your message...';
        successMessage.style.color = '#d8d8d8';
        successMessage.hidden = false;

        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: new FormData(contactForm),
                headers: { Accept: 'application/json' }
            });
            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || 'The message could not be sent.');
            }

            contactForm.reset();
            successMessage.textContent = 'Message sent successfully. I will get back to you soon.';
            successMessage.style.color = '#9fe0ad';
        } catch (error) {
            successMessage.textContent = 'Your message could not be sent. Check your connection and try again.';
            successMessage.style.color = '#d66666';
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Send Message';
        }
    });
}

const actionButton = document.getElementById('action-btn');
const welcomeMessage = document.getElementById('welcome-message');

if (actionButton && welcomeMessage) {
    actionButton.addEventListener('click', function () {
        const username = prompt('What is your name?');

        if (username) {
            welcomeMessage.textContent = 'Welcome back, ' + username + '! JavaScript just changed this text.';
            actionButton.textContent = 'Done!';
            actionButton.style.backgroundColor = '#4CAF50';
            actionButton.style.color = 'white';
        }
    });
}

document.querySelectorAll('[data-quiz]').forEach(function (quiz) {
    const checkButton = quiz.querySelector('.quiz-submit');
    const feedback = quiz.querySelector('.quiz-feedback');

    if (!checkButton || !feedback) return;

    checkButton.addEventListener('click', function () {
        const selectedAnswer = quiz.querySelector('input[type="radio"]:checked');
        feedback.classList.remove('is-correct', 'is-incorrect');

        if (!selectedAnswer) {
            feedback.textContent = 'Choose an answer first.';
            feedback.classList.add('is-incorrect');
            return;
        }

        if (selectedAnswer.value === quiz.dataset.answer) {
            feedback.textContent = quiz.dataset.correctMessage;
            feedback.classList.add('is-correct');
            return;
        }

        feedback.textContent = quiz.dataset.hint;
        feedback.classList.add('is-incorrect');
    });
});

const runPlayground = document.getElementById('runPlayground');
const playgroundFrame = document.getElementById('playgroundFrame');

if (runPlayground && playgroundFrame) {
    const playgroundHtml = document.getElementById('playgroundHtml');
    const playgroundCss = document.getElementById('playgroundCss');
    const playgroundJs = document.getElementById('playgroundJs');
    const playgroundStatus = document.getElementById('playgroundStatus');

    const updatePreview = () => {
        const previewDocument = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src data:; style-src 'unsafe-inline'; script-src 'unsafe-inline'; connect-src 'none'; form-action 'none'; base-uri 'none'">
<style>${playgroundCss.value}</style>
</head>
<body>${playgroundHtml.value}<script>${playgroundJs.value}<\/script></body>
</html>`;

        playgroundFrame.srcdoc = previewDocument;
        playgroundStatus.textContent = 'Preview updated. Code runs inside the isolated preview.';
    };

    runPlayground.addEventListener('click', updatePreview);
    updatePreview();
}

const themeToggle = document.getElementById('themeToggle');
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

const revealItems = document.querySelectorAll('section, .project-card');

if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0 });

    revealItems.forEach(function (item) {
        item.classList.add('reveal');
        revealObserver.observe(item);
    });
}

