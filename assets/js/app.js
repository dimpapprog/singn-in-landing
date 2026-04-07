(function () {
  const DEMO_USER = {
    email: 'demo@northstar.com',
    password: 'Demo123!',
    name: 'Alex'
  };

  const storageKey = 'northstar_demo_session';

  function getSession() {
    try {
      return JSON.parse(localStorage.getItem(storageKey));
    } catch (error) {
      return null;
    }
  }

  function setSession(data) {
    localStorage.setItem(storageKey, JSON.stringify(data));
  }

  function clearSession() {
    localStorage.removeItem(storageKey);
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function setError(name, message) {
    const field = document.querySelector(`[data-error-for="${name}"]`);
    if (field) field.textContent = message || '';
  }

  function clearErrors(form) {
    form.querySelectorAll('.error-text').forEach((el) => (el.textContent = ''));
  }

  function setMessage(element, message, isSuccess) {
    if (!element) return;
    element.textContent = message || '';
    element.classList.remove('success-text', 'error-message');
    if (message) {
      element.classList.add(isSuccess ? 'success-text' : 'error-message');
    }
  }

  function protectDashboard() {
    const onDashboard = window.location.pathname.includes('dashboard.html');
    if (onDashboard && !getSession()) {
      window.location.href = 'index.html';
    }
  }

  function redirectIfAuthenticated() {
    const onLogin = window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/client-login-refresh/');
    if (onLogin && getSession()) {
      window.location.href = 'dashboard.html';
    }
  }

  function initLoginForm() {
    const form = document.getElementById('loginForm');
    if (!form) return;

    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const rememberMe = document.getElementById('rememberMe');
    const loginMessage = document.getElementById('loginMessage');
    const togglePassword = document.getElementById('togglePassword');

    if (togglePassword && passwordInput) {
      togglePassword.addEventListener('click', function () {
        const isPassword = passwordInput.getAttribute('type') === 'password';
        passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
        togglePassword.textContent = isPassword ? 'Hide' : 'Show';
      });
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      clearErrors(form);
      setMessage(loginMessage, '');

      const email = emailInput.value.trim();
      const password = passwordInput.value.trim();
      let valid = true;

      if (!email) {
        setError('email', 'Email is required.');
        valid = false;
      } else if (!isValidEmail(email)) {
        setError('email', 'Please enter a valid email address.');
        valid = false;
      }

      if (!password) {
        setError('password', 'Password is required.');
        valid = false;
      }

      if (!valid) return;

      if (email === DEMO_USER.email && password === DEMO_USER.password) {
        setSession({ email: DEMO_USER.email, name: DEMO_USER.name, remember: !!rememberMe.checked });
        setMessage(loginMessage, 'Signing you in...', true);
        setTimeout(function () {
          window.location.href = 'dashboard.html';
        }, 650);
      } else {
        setMessage(loginMessage, 'Invalid demo credentials. Use the demo email and password shown above.', false);
      }
    });
  }

  function initForgotForm() {
    const form = document.getElementById('forgotForm');
    if (!form) return;
    const input = document.getElementById('resetEmail');
    const message = document.getElementById('forgotMessage');

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      clearErrors(form);
      setMessage(message, '');

      const email = input.value.trim();
      if (!email) {
        setError('resetEmail', 'Email is required.');
        return;
      }
      if (!isValidEmail(email)) {
        setError('resetEmail', 'Please enter a valid email address.');
        return;
      }

      setMessage(message, 'A password reset link has been simulated successfully.', true);
      form.reset();
    });
  }

  function initDashboard() {
    const logoutButton = document.getElementById('logoutButton');
    const userDisplayName = document.getElementById('userDisplayName');
    const session = getSession();

    if (userDisplayName && session && session.name) {
      userDisplayName.textContent = session.name;
    }

    if (logoutButton) {
      logoutButton.addEventListener('click', function () {
        clearSession();
        window.location.href = 'index.html';
      });
    }
  }

  protectDashboard();
  redirectIfAuthenticated();
  initLoginForm();
  initForgotForm();
  initDashboard();
})();
