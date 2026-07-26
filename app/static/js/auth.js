function getCookie(name) {
  const cookies = document.cookie.split('; ');

  const cookie = cookies.find((cookie) => cookie.startsWith(`${name}=`));

  return cookie ? cookie.split('=')[1] : null;
}

function getAuthHeaders() {
  const token = getCookie('token');

  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

function updateNavbar() {
  const loginButton = document.getElementById('login-button');
  const logoutButton = document.getElementById('logout-button');

  if (!loginButton || !logoutButton) {
    return;
  }

  const loggedIn = Boolean(getCookie('token'));

  loginButton.style.display = loggedIn ? 'none' : 'block';
  logoutButton.style.display = loggedIn ? 'block' : 'none';
}

function setupLogin() {
  const loginForm = document.getElementById('login-form');

  if (!loginForm) {
    return;
  }

  loginForm.addEventListener('submit', handleLogin);
}

async function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  try {
    await loginUser(email, password);

    window.location.href = '/';
  } catch (error) {
    alert(error.message);
  }
}

function setupLogout() {
  const logoutButton = document.getElementById('logout-button');

  if (!logoutButton) {
    return;
  }

  logoutButton.addEventListener('click', logoutUser);
}

async function loginUser(email, password) {
  const response = await fetch(API.login, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await handleResponse(response);

  document.cookie = `token=${data.access_token}; path=/`;
}

function logoutUser() {
  document.cookie = 'token=; Max-Age=0; path=/';

  window.location.href = '/';
}