let token = localStorage.getItem('token');

function toggleForms() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    loginForm.style.display = loginForm.style.display === 'none' ? 'block' : 'none';
    registerForm.style.display = registerForm.style.display === 'none' ? 'block' : 'none';
}

async function login() {
    const emailOrUsername = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch('/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ emailOrUsername, password })
        });

        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', data.user.username);
            token = data.token;
            showTaskManager();
        } else {
            alert(data.error);
        }
    } catch (error) {
        alert('Login failed');
    }
}

async function register() {
    const username = document.getElementById('regUsername').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;

    try {
        const response = await fetch('/api/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', data.user.username);
            token = data.token;
            showTaskManager();
        } else {
            alert(data.error);
        }
    } catch (error) {
        alert('Registration failed');
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    token = null;
    showAuthForms();
}

function showTaskManager() {
    document.getElementById('authForms').style.display = 'none';
    document.getElementById('taskManager').style.display = 'block';
    document.getElementById('userInfo').style.display = 'flex';
    document.getElementById('username').textContent = localStorage.getItem('username');
    loadTasks();
}

function showAuthForms() {
    document.getElementById('authForms').style.display = 'block';
    document.getElementById('taskManager').style.display = 'none';
    document.getElementById('userInfo').style.display = 'none';
}

async function verifyToken() {
    const token = localStorage.getItem('token');
    if (!token) {
        return false;
    }

    try {
        const response = await fetch('/api/users/profile', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            return false;
        }
        
        return true;
    } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        return false;
    }
}

async function checkAuthStatus() {
    const isValid = await verifyToken();
    if (isValid) {
        showTaskManager();
    } else {
        showAuthForms();
    }
}

checkAuthStatus();
