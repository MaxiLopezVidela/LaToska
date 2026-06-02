// js/auth.js — Lógica de autenticación para La Toska
document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.auth-tab');
    const forms = document.querySelectorAll('.auth-form');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.dataset.tab;
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            forms.forEach(f => {
                f.classList.remove('active');
                if (f.id === target) f.classList.add('active');
            });
            hideError('login-error');
            hideError('register-error');
        });
    });

    document.querySelectorAll('.password-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
            const input = btn.parentElement.querySelector('input');
            const icon = btn.querySelector('i');
            if (input.type === 'password') {
                input.type = 'text';
                icon.setAttribute('data-lucide', 'eye-off');
            } else {
                input.type = 'password';
                icon.setAttribute('data-lucide', 'eye');
            }
            lucide.createIcons();
        });
    });

    function showError(id, msg) {
        const el = document.getElementById(id);
        el.querySelector('.error-text').textContent = msg;
        el.classList.add('visible');
    }

    function hideError(id) {
        const el = document.getElementById(id);
        if (el) el.classList.remove('visible');
    }

    const loginForm = document.getElementById('form-login');
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        hideError('login-error');
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;
        if (!email || !password) { showError('login-error', 'Completá todos los campos'); return; }
        const btn = loginForm.querySelector('.btn-login');
        btn.classList.add('loading');
        btn.disabled = true;
        try {
            const res = await fetch('api/auth_login.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (data.success) { window.location.href = 'main.html'; }
            else { showError('login-error', data.message); }
        } catch (err) {
            showError('login-error', 'Error de conexión. Verificá que XAMPP esté corriendo.');
        } finally {
            btn.classList.remove('loading');
            btn.disabled = false;
        }
    });

    const registerForm = document.getElementById('form-register');
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        hideError('register-error');
        const nombre = document.getElementById('register-nombre').value.trim();
        const email = document.getElementById('register-email').value.trim();
        const password = document.getElementById('register-password').value;
        const passwordConfirm = document.getElementById('register-password-confirm').value;
        if (!nombre || !email || !password || !passwordConfirm) { showError('register-error', 'Completá todos los campos'); return; }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) { showError('register-error', 'El email no tiene un formato válido'); return; }
        if (password.length < 6) { showError('register-error', 'La contraseña debe tener al menos 6 caracteres'); return; }
        if (password !== passwordConfirm) { showError('register-error', 'Las contraseñas no coinciden'); return; }
        const btn = registerForm.querySelector('.btn-login');
        btn.classList.add('loading');
        btn.disabled = true;
        try {
            const res = await fetch('api/auth_register.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre, email, password, password_confirm: passwordConfirm })
            });
            const data = await res.json();
            if (data.success) { window.location.href = 'main.html'; }
            else { showError('register-error', data.message); }
        } catch (err) {
            showError('register-error', 'Error de conexión. Verificá que XAMPP esté corriendo.');
        } finally {
            btn.classList.remove('loading');
            btn.disabled = false;
        }
    });

    window.handleGoogleCredential = async function(response) {
        try {
            const res = await fetch('api/auth_google.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ credential: response.credential })
            });
            const data = await res.json();
            if (data.success) { window.location.href = 'main.html'; }
            else { showError('login-error', data.message); }
        } catch (err) {
            showError('login-error', 'Error al autenticar con Google');
        }
    };

    // Inicializar Google Identity Services cuando el SDK se carga
    // ⚠️ IMPORTANTE: Reemplazá TU_GOOGLE_CLIENT_ID con tu Client ID real
    function initGoogleSignIn() {
        if (!window.google || !google.accounts || !google.accounts.id) {
            // SDK aún no cargó, reintentar en 500ms
            setTimeout(initGoogleSignIn, 500);
            return;
        }

        google.accounts.id.initialize({
            client_id: '230100074181-eng9q7bok79tnul2eluqqn177j3ajbde.apps.googleusercontent.com',
            callback: handleGoogleCredential,
            ux_mode: 'popup'
        });

        // Renderizar el botón real de Google en el contenedor oculto
        const hiddenContainer = document.getElementById('google-btn-hidden');
        if (hiddenContainer) {
            google.accounts.id.renderButton(hiddenContainer, {
                type: 'standard',
                size: 'large',
                width: 300
            });
        }
    }
    initGoogleSignIn();

    // Nuestros botones custom de Google disparan el botón real oculto
    document.querySelectorAll('.btn-google').forEach(btn => {
        btn.addEventListener('click', () => {
            const hiddenBtn = document.querySelector('#google-btn-hidden div[role="button"]');
            if (hiddenBtn) {
                hiddenBtn.click();
            } else if (window.google && google.accounts && google.accounts.id) {
                // Fallback: intentar con prompt
                google.accounts.id.prompt((notification) => {
                    if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                        showError('login-error', 'No se pudo abrir el login de Google. Intentá desbloquear popups o cookies de terceros.');
                    }
                });
            } else {
                showError('login-error', 'El SDK de Google no se cargó. Verificá tu conexión a internet.');
            }
        });
    });

    async function checkSession() {
        try {
            const res = await fetch('api/auth_session.php');
            const data = await res.json();
            if (data.logged_in) window.location.href = 'main.html';
        } catch (e) { /* show login */ }
    }
    checkSession();
});
