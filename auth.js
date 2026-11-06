(function () {
    const accountForm = document.getElementById('accountForm');
    if (!accountForm) return;

    const supabaseUrl = 'https://oybsxoeejeuvhjhhxnno.supabase.co';
    const supabasePublishableKey = 'sb_publishable_p-qGVFV_YxrOO_hKXL8Tnw_me5yEvE2';
    const message = document.getElementById('accountMessage');
    const title = document.getElementById('accountTitle');
    const description = document.getElementById('accountDescription');
    const passwordInput = document.getElementById('accountPassword');
    const signInTab = document.getElementById('signInTab');
    const signUpTab = document.getElementById('signUpTab');
    const submitButton = document.getElementById('accountSubmit');
    const recoveryForm = document.getElementById('recoveryForm');
    const forgotPassword = document.getElementById('forgotPassword');
    const signedInPanel = document.getElementById('signedInPanel');
    const signedInEmail = document.getElementById('signedInEmail');
    const signOutButton = document.getElementById('signOutButton');
    const supabaseLibrary = window.supabase;
    let accountMode = 'signin';

    const showMessage = function (text, isError) {
        message.textContent = text;
        message.classList.toggle('is-error', Boolean(isError));
        message.classList.toggle('is-success', !isError && Boolean(text));
    };

    if (!supabaseLibrary || typeof supabaseLibrary.createClient !== 'function') {
        showMessage('The account service did not load. Check your connection and reload the page.', true);
        accountForm.hidden = true;
        return;
    }

    const redirectUrl = window.location.origin + window.location.pathname;
    const client = supabaseLibrary.createClient(supabaseUrl, supabasePublishableKey, {
        auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true
        }
    });

    const setMode = function (mode) {
        accountMode = mode;
        const signingUp = mode === 'signup';
        title.textContent = signingUp ? 'Create your account' : 'Welcome back';
        description.textContent = signingUp
            ? 'Create an account with your email and a password of at least 8 characters.'
            : 'Sign in to your Soul Program account.';
        submitButton.textContent = signingUp ? 'Create account' : 'Sign in';
        passwordInput.autocomplete = signingUp ? 'new-password' : 'current-password';
        signInTab.classList.toggle('is-active', !signingUp);
        signUpTab.classList.toggle('is-active', signingUp);
        signInTab.setAttribute('aria-pressed', String(!signingUp));
        signUpTab.setAttribute('aria-pressed', String(signingUp));
        forgotPassword.hidden = signingUp;
        showMessage('', false);
    };

    const setSignedIn = function (user) {
        const isSignedIn = Boolean(user);
        accountForm.hidden = isSignedIn;
        signInTab.hidden = isSignedIn;
        signUpTab.hidden = isSignedIn;
        forgotPassword.hidden = isSignedIn || accountMode === 'signup';
        signedInPanel.hidden = !isSignedIn;
        if (isSignedIn) {
            title.textContent = 'You’re signed in';
            description.textContent = 'Your Soul Program account is ready.';
            signedInEmail.textContent = user.email || 'your account';
        } else {
            title.textContent = accountMode === 'signup' ? 'Create your account' : 'Welcome back';
        }
    };

    signInTab.addEventListener('click', function () {
        setMode('signin');
    });

    signUpTab.addEventListener('click', function () {
        setMode('signup');
    });

    accountForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        const formData = new FormData(accountForm);
        const email = String(formData.get('email')).trim();
        const password = String(formData.get('password'));
        submitButton.disabled = true;
        showMessage(accountMode === 'signup' ? 'Creating your account…' : 'Signing you in…', false);

        try {
            if (accountMode === 'signup') {
                const { data, error } = await client.auth.signUp({
                    email: email,
                    password: password,
                    options: { emailRedirectTo: redirectUrl }
                });
                if (error) throw error;

                if (data.session) {
                    showMessage('Your account is ready.', false);
                } else {
                    showMessage('Check your email to confirm your account, then return here to sign in.', false);
                }
            } else {
                const { error } = await client.auth.signInWithPassword({
                    email: email,
                    password: password
                });
                if (error) throw error;
            }
        } catch (error) {
            showMessage(error.message || 'We could not complete that request. Please try again.', true);
        } finally {
            submitButton.disabled = false;
        }
    });

    forgotPassword.addEventListener('click', async function () {
        const email = document.getElementById('accountEmail').value.trim();
        if (!email) {
            showMessage('Enter your email address first, then choose Forgot your password.', true);
            document.getElementById('accountEmail').focus();
            return;
        }

        forgotPassword.disabled = true;
        showMessage('Sending password reset email…', false);
        try {
            const { error } = await client.auth.resetPasswordForEmail(email, {
                redirectTo: redirectUrl + '?mode=recovery'
            });
            if (error) throw error;
            showMessage('If an account exists for that email, a password reset link is on its way.', false);
        } catch (error) {
            showMessage(error.message || 'We could not send a reset email. Please try again.', true);
        } finally {
            forgotPassword.disabled = false;
        }
    });

    recoveryForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        const newPassword = String(new FormData(recoveryForm).get('password'));
        const button = recoveryForm.querySelector('button[type="submit"]');
        button.disabled = true;
        showMessage('Updating your password…', false);
        try {
            const { error } = await client.auth.updateUser({ password: newPassword });
            if (error) throw error;
            recoveryForm.hidden = true;
            accountForm.hidden = false;
            setMode('signin');
            showMessage('Password updated. You can now sign in with your new password.', false);
            window.history.replaceState({}, document.title, redirectUrl);
        } catch (error) {
            showMessage(error.message || 'We could not update your password. Open the latest reset link and try again.', true);
        } finally {
            button.disabled = false;
        }
    });

    signOutButton.addEventListener('click', async function () {
        signOutButton.disabled = true;
        try {
            const { error } = await client.auth.signOut();
            if (error) throw error;
            showMessage('You have signed out.', false);
        } catch (error) {
            showMessage(error.message || 'We could not sign you out. Please try again.', true);
        } finally {
            signOutButton.disabled = false;
        }
    });

    client.auth.onAuthStateChange(function (_event, session) {
        setSignedIn(session && session.user);
    });

    client.auth.getSession().then(function (result) {
        if (result.error) {
            showMessage(result.error.message, true);
            return;
        }
        setSignedIn(result.data.session && result.data.session.user);
    }).catch(function (error) {
        showMessage(error.message || 'Could not check your account session.', true);
    });

    if (new URLSearchParams(window.location.search).get('mode') === 'recovery') {
        title.textContent = 'Choose a new password';
        description.textContent = 'Enter a new password for your account.';
        accountForm.hidden = true;
        signInTab.hidden = true;
        signUpTab.hidden = true;
        forgotPassword.hidden = true;
        recoveryForm.hidden = false;
    }
})();
