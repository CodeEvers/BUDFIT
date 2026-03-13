// Konfigurace Supabase
const SUPABASE_URL = "https://oesygfqnrykzkmxuggxr.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lc3lnZnFucnlremtteHVnZ3hyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzOTI4NDMsImV4cCI6MjA4ODk2ODg0M30.VCzB_jf3aeP89wQhwIXxROxF8cVzlNWtNPO8nI0im6M";

// Inicializace klienta (přidáno window.supabase pro jistotu)
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let isLoginMode = true;

// Funkce pro přepínání mezi Přihlášením a Registrací
function handleToggle() {
    isLoginMode = !isLoginMode;

    // Musíme použít ID, která máš v HTML
    const title = document.getElementById('main-title');
    const subtitle = document.getElementById('main-subtitle');
    const btn = document.getElementById('submit-btn');
    const footerText = document.getElementById('footer-text');
    const switchLink = document.getElementById('switch-link');

    if (isLoginMode) {
        title.innerText = "Vítej zpět";
        subtitle.innerText = "Zadej své údaje pro přístup k deníku";
        btn.innerText = "Přihlásit se";
        footerText.innerText = "Nemáš účet?";
        switchLink.innerText = "Zaregistruj se";
    } else {
        title.innerText = "Nový účet";
        subtitle.innerText = "Začni svou cestu za lepším já";
        btn.innerText = "Vytvořit účet";
        footerText.innerText = "Už máš účet?";
        switchLink.innerText = "Přihlas se";
    }
}

// AKTIVACE KLIKÁNÍ: Tento řádek propojí text v HTML s funkcí handleToggle
document.getElementById('switch-link').addEventListener('click', handleToggle);

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
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            alert("Chyba při přihlášení: " + error.message);
        } else {
            alert("Úspěšně přihlášeno! Vítej, " + data.user.email);
            // Zde se později spustí funkce showApp() pro zobrazení deníku
        }
    } else {
        // REGISTRACE
        const { data, error } = await supabaseClient.auth.signUp({
            email: email,
            password: password,
        });

        if (error) {
            alert("Chyba při registraci: " + error.message);
        } else {
            alert("Registrace úspěšná! Zkontroluj svůj e-mail pro potvrzení (pokud ho máš v Supabase zapnutý).");
        }
    }

    btn.innerText = isLoginMode ? "Přihlásit se" : "Vytvořit účet";
    btn.disabled = false;
});
