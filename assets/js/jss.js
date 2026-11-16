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

const dateTimeCalendar = document.querySelector('[data-date-time-calendar]');

if (dateTimeCalendar) {
    const clockTime = dateTimeCalendar.querySelector('[data-clock-time]');
    const clockDate = dateTimeCalendar.querySelector('[data-clock-date]');
    const clockZone = dateTimeCalendar.querySelector('[data-clock-zone]');
    const monthLabel = dateTimeCalendar.querySelector('[data-calendar-month]');
    const daysContainer = dateTimeCalendar.querySelector('[data-calendar-days]');
    const selectedDateLabel = dateTimeCalendar.querySelector('[data-calendar-selected-date]');
    const timeFormatter = new Intl.DateTimeFormat(undefined, {
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit'
    });
    const dateFormatter = new Intl.DateTimeFormat(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    const monthFormatter = new Intl.DateTimeFormat(undefined, {
        month: 'long',
        year: 'numeric'
    });
    const zoneFormatter = new Intl.DateTimeFormat(undefined, {
        timeZoneName: 'short'
    });
    const today = new Date();
    let displayedMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    let selectedDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const dateKey = function (date) {
        return date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' +
            String(date.getDate()).padStart(2, '0');
    };

    const updateClock = function () {
        const now = new Date();
        clockTime.textContent = timeFormatter.format(now);
        clockTime.dateTime = now.toISOString();
        clockDate.textContent = dateFormatter.format(now);
        const zonePart = zoneFormatter.formatToParts(now).find(function (part) {
            return part.type === 'timeZoneName';
        });
        clockZone.textContent = zonePart ? zonePart.value : 'Local time';
    };

    const renderCalendar = function () {
        const year = displayedMonth.getFullYear();
        const month = displayedMonth.getMonth();
        const firstWeekday = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const rowCount = Math.ceil((firstWeekday + daysInMonth) / 7);
        const fragment = document.createDocumentFragment();
        const currentDate = new Date();

        monthLabel.textContent = monthFormatter.format(displayedMonth);
        for (let week = 0; week < rowCount; week += 1) {
            const row = document.createElement('tr');
            for (let weekday = 0; weekday < 7; weekday += 1) {
                const day = week * 7 + weekday - firstWeekday + 1;
                const cell = document.createElement('td');
                if (day > 0 && day <= daysInMonth) {
                    const date = new Date(year, month, day);
                    const button = document.createElement('button');
                    button.type = 'button';
                    button.textContent = String(day);
                    button.setAttribute('aria-label', dateFormatter.format(date));
                    button.setAttribute('aria-pressed', String(dateKey(date) === dateKey(selectedDate)));
                    button.classList.toggle('is-today', dateKey(date) === dateKey(currentDate));
                    button.addEventListener('click', function () {
                        selectedDate = date;
                        renderCalendar();
                        daysContainer.querySelector('[aria-pressed="true"]').focus();
                    });
                    cell.appendChild(button);
                }
                row.appendChild(cell);
            }
            fragment.appendChild(row);
        }

        daysContainer.replaceChildren(fragment);
        selectedDateLabel.textContent = 'Selected: ' + dateFormatter.format(selectedDate);
    };

    dateTimeCalendar.querySelector('[data-calendar-previous]').addEventListener('click', function () {
        displayedMonth = new Date(displayedMonth.getFullYear(), displayedMonth.getMonth() - 1, 1);
        renderCalendar();
    });
    dateTimeCalendar.querySelector('[data-calendar-next]').addEventListener('click', function () {
        displayedMonth = new Date(displayedMonth.getFullYear(), displayedMonth.getMonth() + 1, 1);
        renderCalendar();
    });
    dateTimeCalendar.querySelector('[data-calendar-today]').addEventListener('click', function () {
        const now = new Date();
        selectedDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        displayedMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        renderCalendar();
    });

    updateClock();
    renderCalendar();
    window.setInterval(updateClock, 1000);
}

const codeQuest = document.querySelector('[data-code-quest]');

if (codeQuest) {
    const questQuestions = {
        html: [
            {
                prompt: 'Which element represents the main content of a page?',
                legend: 'Choose the semantic page element',
                choices: [['section', '<section>'], ['main', '<main>'], ['footer', '<footer>']],
                answer: 'main'
            },
            {
                prompt: 'Which heading element should usually be the page’s main title?',
                legend: 'Choose the top-level heading',
                choices: [['h6', '<h6>'], ['h1', '<h1>'], ['head', '<head>']],
                answer: 'h1'
            },
            {
                prompt: 'Which attribute supplies alternative text for an image?',
                legend: 'Choose the image attribute',
                choices: [['src', 'src'], ['href', 'href'], ['alt', 'alt']],
                answer: 'alt'
            },
            {
                prompt: 'Which element creates a link to another page?',
                legend: 'Choose the link element',
                choices: [['a', '<a>'], ['link', '<link>'], ['p', '<p>']],
                answer: 'a'
            },
            {
                prompt: 'Which element is best for a group of navigation links?',
                legend: 'Choose the navigation landmark',
                choices: [['nav', '<nav>'], ['aside', '<aside>'], ['strong', '<strong>']],
                answer: 'nav'
            }
        ],
        css: [
            {
                prompt: 'Which declaration changes an element’s text color to purple?',
                legend: 'Choose the correct declaration',
                choices: [['background', 'background: purple;'], ['font', 'font: purple;'], ['color', 'color: purple;']],
                answer: 'color'
            },
            {
                prompt: 'Which CSS property adds space inside an element’s border?',
                legend: 'Choose the spacing property',
                choices: [['margin', 'margin'], ['padding', 'padding'], ['gap', 'gap']],
                answer: 'padding'
            },
            {
                prompt: 'Which selector targets an element with id="banner"?',
                legend: 'Choose the ID selector',
                choices: [['.banner', '.banner'], ['#banner', '#banner'], ['banner', 'banner']],
                answer: '#banner'
            },
            {
                prompt: 'Which declaration turns an element into a flex container?',
                legend: 'Choose the layout declaration',
                choices: [['display: flex;', 'display: flex;'], ['position: flex;', 'position: flex;'], ['flex: display;', 'flex: display;']],
                answer: 'display: flex;'
            },
            {
                prompt: 'Which at-rule is commonly used to apply styles at a smaller screen width?',
                legend: 'Choose the responsive CSS rule',
                choices: [['@keyframes', '@keyframes'], ['@media', '@media'], ['@import', '@import']],
                answer: '@media'
            }
        ],
        javascript: [
            {
                prompt: 'Which line listens for a click on a button and runs startGame?',
                legend: 'Choose the event listener',
                choices: [['style', 'button.style.click = startGame;'], ['listener', "button.addEventListener('click', startGame);"], ['text', 'button.textContent = startGame;']],
                answer: 'listener'
            },
            {
                prompt: 'Which keyword declares a variable that can be reassigned?',
                legend: 'Choose the variable keyword',
                choices: [['const', 'const'], ['let', 'let'], ['static', 'static']],
                answer: 'let'
            },
            {
                prompt: 'What does document.querySelector(".card") return?',
                legend: 'Choose the best answer',
                choices: [['first', 'The first matching .card element'], ['all', 'Every .card element as an array'], ['new', 'A new card element']],
                answer: 'first'
            },
            {
                prompt: 'Which operator checks whether two values are equal without type conversion?',
                legend: 'Choose the strict equality operator',
                choices: [['=', '='], ['==', '=='], ['===', '===']],
                answer: '==='
            },
            {
                prompt: 'Which method converts a JSON string into a JavaScript value?',
                legend: 'Choose the JSON method',
                choices: [['stringify', 'stringify'], ['parse', 'parse'], ['convert', 'convert']],
                answer: 'parse'
            }
        ]
    };
    const questLevels = Array.from(codeQuest.querySelectorAll('[data-quest-level]'));
    const questProgress = codeQuest.querySelector('[data-quest-progress]');
    const questProgressLabel = codeQuest.querySelector('[data-quest-progress-label]');
    const questStorageNotice = codeQuest.querySelector('[data-quest-storage-notice]');
    const questFinale = codeQuest.querySelector('[data-quest-finale]');
    const questStorageKey = 'soul-code-quest-progress-v2';
    const validLevelIds = questLevels.map(function (level) {
        return level.dataset.questLevel;
    });
    const questionCounts = validLevelIds.map(function (levelId) {
        return questQuestions[levelId].length;
    });
    const totalQuestions = questionCounts.reduce(function (total, count) {
        return total + count;
    }, 0);
    const completedByLevel = Object.create(null);
    let storageAvailable = true;
    validLevelIds.forEach(function (levelId) {
        completedByLevel[levelId] = 0;
    });

    try {
        const savedProgress = JSON.parse(localStorage.getItem(questStorageKey) || '{}');
        if (savedProgress && typeof savedProgress === 'object' && !Array.isArray(savedProgress)) {
            let previousLevelsComplete = true;
            validLevelIds.forEach(function (levelId, index) {
                const savedCount = savedProgress[levelId];
                const questionCount = questionCounts[index];
                const validCount = Number.isInteger(savedCount) && savedCount >= 0
                    ? Math.min(savedCount, questionCount)
                    : 0;
                completedByLevel[levelId] = previousLevelsComplete ? validCount : 0;
                previousLevelsComplete = previousLevelsComplete && validCount === questionCount;
            });
        }
    } catch (error) {
        storageAvailable = false;
        questStorageNotice.textContent = 'Progress cannot be saved in this browser, but you can still play this visit.';
        questStorageNotice.hidden = false;
    }

    const completedQuestionCount = function () {
        return validLevelIds.reduce(function (total, levelId) {
            return total + (completedByLevel[levelId] || 0);
        }, 0);
    };

    const completedLevelCount = function () {
        return validLevelIds.filter(function (levelId, index) {
            return (completedByLevel[levelId] || 0) === questionCounts[index];
        }).length;
    };

    const saveQuestProgress = function () {
        if (!storageAvailable) return;
        try {
            localStorage.setItem(questStorageKey, JSON.stringify(completedByLevel));
        } catch (error) {
            storageAvailable = false;
            questStorageNotice.textContent = 'Progress will last for this visit only because browser storage is unavailable.';
            questStorageNotice.hidden = false;
        }
    };

    const renderQuestion = function (level, question, levelIndex, questionIndex) {
        const fieldset = level.querySelector('[data-quest-options]');
        const legend = fieldset.querySelector('[data-quest-legend]');
        const prompt = level.querySelector('[data-quest-prompt]');
        const questionProgress = level.querySelector('[data-quest-level-progress]');
        const feedback = level.querySelector('[data-quest-feedback]');
        const checkButton = level.querySelector('[data-quest-check]');
        const levelId = level.dataset.questLevel;
        const isUnlocked = levelIndex === completedLevelCount();
        const isComplete = (completedByLevel[levelId] || 0) >= questQuestions[levelId].length;

        prompt.textContent = question.prompt;
        legend.textContent = question.legend;
        questionProgress.textContent = 'Question ' + (questionIndex + 1) + ' of ' + questQuestions[levelId].length;
        fieldset.disabled = !isUnlocked || isComplete;
        checkButton.disabled = !isUnlocked || isComplete;
        fieldset.querySelectorAll('label').forEach(function (label) {
            label.remove();
        });

        question.choices.forEach(function (choice, choiceIndex) {
            const label = document.createElement('label');
            const input = document.createElement('input');
            const answerText = document.createElement('code');
            input.type = 'radio';
            input.name = 'quest-' + levelId + '-' + questionIndex;
            input.value = choice[0];
            input.id = input.name + '-' + choiceIndex;
            answerText.textContent = choice[1];
            label.htmlFor = input.id;
            label.append(input, answerText);
            fieldset.appendChild(label);
        });

        feedback.textContent = '';
        feedback.classList.remove('is-incorrect');
        checkButton.textContent = isComplete ? 'Level complete' : 'Check answer';
    };

    const renderQuest = function () {
        let badgesEarned = 0;

        questLevels.forEach(function (level, index) {
            const levelId = level.dataset.questLevel;
            const questions = questQuestions[levelId];
            const questionIndex = Math.min(completedByLevel[levelId] || 0, questions.length - 1);
            const isEarned = (completedByLevel[levelId] || 0) >= questions.length;
            const isUnlocked = index <= badgesEarned;
            const badge = level.querySelector('[data-quest-badge]');

            level.classList.toggle('is-locked', !isUnlocked);
            level.classList.toggle('is-complete', isEarned);
            renderQuestion(level, questions[questionIndex], index, questionIndex);
            level.querySelector('[data-quest-level-progress]').textContent = isEarned
                ? questions.length + ' of ' + questions.length + ' questions complete'
                : 'Question ' + ((completedByLevel[levelId] || 0) + 1) + ' of ' + questions.length;
            badge.hidden = !isEarned;

            if (isEarned) {
                level.querySelector('[data-quest-feedback]').textContent = 'Badge earned! Level complete.';
                badgesEarned += 1;
            }
        });

        if (questProgress) questProgress.value = completedQuestionCount();
        if (questProgressLabel) {
            questProgressLabel.textContent = completedQuestionCount() + ' of ' + totalQuestions + ' questions · ' +
                badgesEarned + ' of ' + questLevels.length + ' badges';
        }
        if (questFinale) questFinale.hidden = badgesEarned !== questLevels.length;
    };

    questLevels.forEach(function (level, index) {
        const checkButton = level.querySelector('[data-quest-check]');
        const options = level.querySelector('[data-quest-options]');
        const feedback = level.querySelector('[data-quest-feedback]');

        checkButton.addEventListener('click', function () {
            if (index !== completedLevelCount()) return;

            const selectedAnswer = options.querySelector('input[type="radio"]:checked');
            if (!selectedAnswer) {
                feedback.textContent = 'Choose an answer to continue.';
                feedback.classList.add('is-incorrect');
                return;
            }

            const questionIndex = completedByLevel[level.dataset.questLevel] || 0;
            const question = questQuestions[level.dataset.questLevel][questionIndex];
            if (selectedAnswer.value !== question.answer) {
                feedback.textContent = 'Not quite — try another answer.';
                feedback.classList.add('is-incorrect');
                return;
            }

            feedback.classList.remove('is-incorrect');
            completedByLevel[level.dataset.questLevel] += 1;
            saveQuestProgress();

            renderQuest();
            if (completedByLevel[level.dataset.questLevel] === questionCounts[index]) {
                feedback.textContent = index === questLevels.length - 1
                    ? 'Correct! Final badge earned — quest complete!'
                    : 'Correct! Badge earned. The next level is unlocked.';
            } else {
                feedback.textContent = 'Correct! Next question unlocked.';
            }
        });
    });

    renderQuest();
}

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

const installAppButton = document.getElementById('installAppButton');
const installAppStatus = document.getElementById('installAppStatus');

if (installAppButton && installAppStatus) {
    let installPromptEvent = null;
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true;

    if (isStandalone) {
        installAppButton.hidden = true;
    }

    window.addEventListener('beforeinstallprompt', function (event) {
        event.preventDefault();
        installPromptEvent = event;
    });

    installAppButton.addEventListener('click', async function () {
        if (!installPromptEvent) {
            installAppStatus.textContent = 'To install, open your browser menu and choose Install app or Add to Home Screen.';
            installAppStatus.hidden = false;
            return;
        }

        installPromptEvent.prompt();
        const choice = await installPromptEvent.userChoice;
        installPromptEvent = null;

        if (choice.outcome === 'accepted') {
            installAppStatus.textContent = 'Soul Program is being installed.';
        }
    });

    window.addEventListener('appinstalled', function () {
        installAppButton.hidden = true;
        installAppStatus.textContent = 'Soul Program has been installed.';
        installAppStatus.hidden = false;
    });
}

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js').catch(function (error) {
        console.error('Offline site caching could not be enabled.', error);
    });
}
