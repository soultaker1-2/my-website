# Soul Program website

A static portfolio and learning website. It uses HTML for pages and content, CSS for presentation, and JavaScript for page interactions. There is no build step or package installation.

## Project layout

```text
website/
├── index.html                 # Default homepage used by GitHub Pages
├── portfolio.html             # Portfolio page
├── educatio.html               # Lessons, quizzes, and code playground
├── video.html                  # Video library
├── contact.html                # Contact form
├── game.html                   # Star Dodge arcade page
├── service-worker.js           # Caches the site and game for offline use
├── README.md                   # This guide
└── assets/
    ├── css/
    │   ├── style1.css          # Base site styles and layout
    │   ├── style-modern.css    # Modern theme and responsive refinements
    │   ├── game.css            # Star Dodge styles
    │   └── archive/
    │       ├── style1.fixed.css # Older stylesheet; not currently linked
    │       └── video.css        # Empty old stylesheet; not currently linked
    ├── js/
    │   ├── jss.js              # Shared site interactions
    │   └── game.js             # Star Dodge game logic
    └── images/
        ├── logo.png
        ├── taker.jpg
        ├── edu.jpg
        └── diagrams/
            ├── html-structure.svg
            ├── css-rule.svg
            └── javascript-flow.svg
```

The HTML pages and service worker stay at the project root so their links work with GitHub Pages. CSS, JavaScript, and image files are grouped under `assets/`.

## What each page does

- **`index.html`** is the default landing page. GitHub Pages looks for this file when someone opens the website.
- **`portfolio.html`** presents the portfolio and learning paths. It shares much of its content with the homepage.
- **`educatio.html`** contains HTML, CSS, and JavaScript lessons, quizzes, progress tracking, and the coding playground.
- **`video.html`** displays tutorial videos and lets visitors search and filter the video cards.
- **`contact.html`** contains the contact form. Sending a message uses the external Web3Forms service, so submitting it requires an internet connection.
- **`game.html`** is the standalone Star Dodge arcade page. Its game itself does not need a connection after the page and assets have been cached.

Each HTML page links to its stylesheets with `<link>` and loads JavaScript with `<script>`. Links such as `assets/css/style1.css?v=4` point to files relative to the project root. The `?v=...` suffix is a cache-busting version: change it when you need browsers to fetch a changed stylesheet or script instead of reusing an old copy.

## What the stylesheets do

- **`assets/css/style1.css`** supplies the shared base styles, including the general page layout, typography, and components.
- **`assets/css/style-modern.css`** is loaded after the base file. It adds the site's dark/light theme colors, responsive navigation and layouts, modern cards, and refinements for lessons, videos, and forms. Because it loads second, its matching CSS rules can override the base styles.
- **`assets/css/game.css`** styles only the standalone game page.
- **`assets/css/archive/style1.fixed.css`** and **`assets/css/archive/video.css`** are kept for reference, but no current page loads them. The `video.css` file is empty.

## What the JavaScript does

### `assets/js/jss.js` — shared website behavior

This script is included by the main site pages. It checks for the relevant page elements before attaching page-specific behavior, so a feature only runs on a page that contains it.

- Handles contact form submission with `fetch`, updates the status message, and displays success or failure.
- Powers the small welcome-message demo when its example button is present.
- Checks lesson quiz answers, displays hints or success messages, and saves completed lessons in `localStorage`.
- Updates the lesson progress meter from the saved completed lesson IDs.
- Filters video cards using the search field and topic buttons.
- Runs the education-page code playground by putting the visitor's HTML, CSS, and JavaScript into a sandboxed iframe.
- Opens and closes the mobile navigation menu and supports closing it with Escape.
- Restores and changes the saved light/dark theme.
- Adds the reading progress indicator, back-to-top button, and section reveal effects.
- Registers `service-worker.js` so the browser can cache the website.

`localStorage` saves small preferences and scores in that visitor's browser; it does not send them to the website owner or synchronize between devices.

### `assets/js/game.js` — Star Dodge

The game script draws the starfield, ship, and meteors on an HTML `<canvas>`. It moves the ship between three lanes, creates meteors over time, checks for collisions, and updates the score. Keyboard controls are Left/Right or A/D; the on-page arrow buttons work on touchscreens too. P pauses and resumes. The best score is stored in the browser's `localStorage`.

### `service-worker.js` — offline cache

The browser installs this worker after visiting the site over a supported web origin. During installation it caches the core pages and local assets. On a later visit without a connection, it can return those cached files, including the game. When the worker version changes, it removes an older cache with the same project prefix.

Offline support needs the website to be served through HTTPS (GitHub Pages provides HTTPS) or `localhost`; opening an HTML file directly with a `file://` address does not enable service workers. The visitor must open the site online at least once so the files can be cached. External services such as video hosting, web chat, icons loaded from a CDN, and the contact form still need internet access.

## Open and preview in VS Code

1. In VS Code, choose **File → Open Folder...** and select the `website` folder (the folder containing `index.html` and `service-worker.js`).
2. Use the Explorer panel to browse the pages at the top level and expand `assets` to find the CSS, JavaScript, and images.
3. To preview, serve the folder with VS Code's Live Server extension or publish it to GitHub Pages. Open the served site URL, not the HTML file directly, when testing offline caching.
4. After changing a file, save it and refresh the browser. If a browser keeps an old CSS or JavaScript file, increment the matching `?v=` number in the HTML.

There are no dependencies to install or build commands to run.

## Security notes

The site is static: it has no server-side login, database, or private credentials. This reduces the amount of application attack surface, but no website can be guaranteed impossible to hack. Protect the GitHub account and repository that publish the site as carefully as the site itself.

- The main pages set a baseline Content Security Policy that blocks plugin/object content, prevents injected `<base>` URLs, limits form destinations to this site and Web3Forms, and upgrades insecure resource requests. They also use a strict cross-origin referrer policy.
- The standalone game has a stricter policy that permits its scripts, styles, and connections only from this site. Its policy is intentionally separate because the main pages load trusted third-party services.
- Links that open WhatsApp or LinkedIn in a new tab use `rel="noopener noreferrer"` so the opened site cannot control the original tab.
- The education playground intentionally runs visitor-written code in a sandboxed iframe. Do not remove its `sandbox` attribute or add `allow-same-origin`.
- GitHub Pages does not let this project configure every HTTP response header. The HTML policies are useful safeguards, but they cannot replace server headers such as HSTS or `X-Frame-Options`, and they cannot protect a compromised GitHub account, a compromised third-party service, or a change deliberately published to the repository.
- Keep GitHub two-factor authentication enabled, do not add passwords or private API keys to this public repository, review changes before publishing, and only include third-party scripts that the site needs. The Web3Forms access key in the contact page is a public form identifier, not a private server key.

To confirm which version is live, check the GitHub Pages deployment in the repository's **Actions** tab after pushing changes.
