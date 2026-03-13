// Konfigurace Supabase
const SUPABASE_URL = "https://oesygfqnrykzkmxuggxr.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lc3lnZnFucnlremtteHVnZ3hyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzOTI4NDMsImV4cCI6MjA4ODk2ODg0M30.VCzB_jf3aeP89wQhwIXxROxF8cVzlNWtNPO8nI0im6M";

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

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

// Funkce pro registraci a přihlášení přes Supabase
document.getElementById('auth-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const btn = document.getElementById('submit-btn');

    btn.innerText = "Pracuji...";
    btn.disabled = true;

    if (isLoginMode) {
        // PŘIHLÁŠENÍ
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            alert("Chyba při přihlášení: " + error.message);
        } else {
            alert("Úspěšně přihlášeno! Vítej, " + data.user.email);
            // Sem později přidáme přesměrování do aplikace
        }
    } else {
        // REGISTRACE
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
        });

        if (error) {
            alert("Chyba při registraci: " + error.message);
        } else {
            alert("Registrace úspěšná! Zkontroluj svůj e-mail pro potvrzení.");
        }
    }

    btn.innerText = isLoginMode ? "Přihlásit se" : "Vytvořit účet";
    btn.disabled = false;
});
