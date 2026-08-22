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

