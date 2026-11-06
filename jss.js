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
            if (quiz.dataset.lessonId) {
                const completedLessons = (localStorage.getItem('soul-completed-lessons') || '')
                    .split(',')
                    .filter(Boolean);
                if (!completedLessons.includes(quiz.dataset.lessonId)) {
                    completedLessons.push(quiz.dataset.lessonId);
                    localStorage.setItem('soul-completed-lessons', completedLessons.join(','));
                }
                updateLearningProgress();
            }
            return;
        }

        feedback.textContent = quiz.dataset.hint;
        feedback.classList.add('is-incorrect');
    });
});

function updateLearningProgress() {
    const lessonIds = ['html', 'css', 'javascript'];
    const completedLessons = new Set(
        (localStorage.getItem('soul-completed-lessons') || '')
            .split(',')
            .filter(function (lessonId) {
                return lessonIds.includes(lessonId);
            })
    );

    document.querySelectorAll('[data-learning-progress]').forEach(function (progress) {
        const meter = progress.querySelector('[data-progress-meter]');
        const label = progress.querySelector('[data-progress-label]');
        if (!meter || !label) return;

        meter.value = completedLessons.size;
        label.textContent = completedLessons.size + ' of ' + lessonIds.length + ' lessons complete';
    });
}

updateLearningProgress();

const videoSearch = document.getElementById('videoSearch');
const videoCards = Array.from(document.querySelectorAll('.video-card[data-video-category]'));
const videoFilterButtons = Array.from(document.querySelectorAll('[data-video-filter]'));
const videoEmptyState = document.getElementById('videoEmptyState');
let activeVideoFilter = 'all';

if (videoSearch && videoCards.length) {
    const filterVideos = function () {
        const query = videoSearch.value.trim().toLowerCase();
        let visibleCount = 0;

        videoCards.forEach(function (card) {
            const matchesTopic = activeVideoFilter === 'all' || card.dataset.videoCategory === activeVideoFilter;
            const matchesSearch = !query || card.textContent.toLowerCase().includes(query);
            card.hidden = !matchesTopic || !matchesSearch;
            if (!card.hidden) visibleCount += 1;
        });

        if (videoEmptyState) videoEmptyState.hidden = visibleCount > 0;
    };

    videoSearch.addEventListener('input', filterVideos);
    videoFilterButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            activeVideoFilter = button.dataset.videoFilter;
            videoFilterButtons.forEach(function (filterButton) {
                filterButton.setAttribute('aria-pressed', String(filterButton === button));
            });
            filterVideos();
        });
    });
}

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
    const navBackdrop = document.createElement('button');
    navBackdrop.className = 'nav-backdrop';
    navBackdrop.type = 'button';
    navBackdrop.setAttribute('aria-label', 'Close navigation menu');
    navBackdrop.hidden = true;
    document.body.appendChild(navBackdrop);

    const setMenuOpen = function (isOpen) {
        navigation.classList.toggle('open', isOpen);
        navBackdrop.hidden = !isOpen;
        menuToggle.setAttribute('aria-expanded', String(isOpen));
        menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
        menuToggle.textContent = isOpen ? '×' : '☰';
        document.body.classList.toggle('navigation-open', isOpen);

        if (isOpen) {
            const firstLink = navigation.querySelector('a');
            if (firstLink && window.matchMedia('(max-width: 1000px)').matches) firstLink.focus();
        } else {
            menuToggle.focus();
        }
    };

    menuToggle.addEventListener('click', function () {
        setMenuOpen(!navigation.classList.contains('open'));
    });

    navBackdrop.addEventListener('click', function () {
        setMenuOpen(false);
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && navigation.classList.contains('open')) {
            setMenuOpen(false);
        }
    });

    navigation.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
            if (navigation.classList.contains('open')) setMenuOpen(false);
        });
    });

    window.addEventListener('resize', function () {
        if (!window.matchMedia('(max-width: 1000px)').matches && navigation.classList.contains('open')) {
            setMenuOpen(false);
        }
    });
}

if (themeToggle) {
    const savedTheme = localStorage.getItem('soul-theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        themeToggle.textContent = 'Dark';
        themeToggle.setAttribute('aria-label', 'Switch to dark theme');
    }

    const readingProgress = document.createElement('div');
    readingProgress.className = 'reading-progress';
    readingProgress.setAttribute('role', 'progressbar');
    readingProgress.setAttribute('aria-label', 'Page reading progress');
    readingProgress.setAttribute('aria-valuemin', '0');
    readingProgress.setAttribute('aria-valuemax', '100');
    const readingProgressFill = document.createElement('span');
    readingProgress.appendChild(readingProgressFill);
    document.body.appendChild(readingProgress);

    const backToTop = document.createElement('button');
    backToTop.className = 'back-to-top';
    backToTop.type = 'button';
    backToTop.setAttribute('aria-label', 'Back to top');
    backToTop.title = 'Back to top';
    backToTop.textContent = '↑';
    document.body.appendChild(backToTop);

    let scrollUpdatePending = false;
    const updateScrollControls = function () {
        if (scrollUpdatePending) return;
        scrollUpdatePending = true;
        window.requestAnimationFrame(function () {
            const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = scrollableHeight > 0
                ? Math.min(100, Math.round((window.scrollY / scrollableHeight) * 100))
                : 0;
            readingProgressFill.style.width = progress + '%';
            readingProgress.setAttribute('aria-valuenow', String(progress));
            backToTop.classList.toggle('is-visible', window.scrollY > 500);
            scrollUpdatePending = false;
        });
    };

    window.addEventListener('scroll', updateScrollControls, { passive: true });
    window.addEventListener('resize', updateScrollControls);
    updateScrollControls();

    backToTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

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
