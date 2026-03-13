let isLoginMode = true;

function handleToggle() {
    isLoginMode = !isLoginMode;

    const title = document.getElementById('auth-title');
    const subtitle = document.getElementById('auth-subtitle');
    const btn = document.getElementById('submit-btn');
    const loginBox = document.getElementById('login-text');
    const registerBox = document.getElementById('register-text');

    if (isLoginMode) {
        title.innerText = "Vítej zpět";
        subtitle.innerText = "Zadej své údaje pro přístup k deníku";
        btn.innerText = "Přihlásit se";
        loginBox.style.display = "block";
        registerBox.style.display = "none";
    } else {
        title.innerText = "Nový účet";
        subtitle.innerText = "Začni svou cestu za lepším já";
        btn.innerText = "Vytvořit účet";
        loginBox.style.display = "none";
        registerBox.style.display = "block";
    }
}

document.getElementById('auth-form').addEventListener('submit', (e) => {
    e.preventDefault();
    alert(isLoginMode ? "Teď by proběhlo přihlášení!" : "Teď by proběhla registrace!");
});