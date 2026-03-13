// Konfigurace Supabase
const SUPABASE_URL = "https://oesygfqnrykzkmxuggxr.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lc3lnZnFucnlremtteHVnZ3hyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzOTI4NDMsImV4cCI6MjA4ODk2ODg0M30.VCzB_jf3aeP89wQhwIXxROxF8cVzlNWtNPO8nI0im6M";

// Inicializace klienta - používáme window.supabase, protože knihovnu načítáš v HTML přes CDN
const _sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let isLoginMode = true;

// Hlavní funkce pro přepínání (teď se jmenuje handleToggle, aby seděla na tvoje volání)
function handleToggle() {
    isLoginMode = !isLoginMode;

    // Musíme najít prvky podle ID, která máš v HTML
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

// Propojíme kliknutí na odkaz s funkcí handleToggle
// Toto zajistí, že i když v HTML zapomeneš na onclick, bude to fungovat
const link = document.getElementById('switch-link');
if (link) {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        handleToggle();
    });
}

// Funkce pro registraci a přihlášení přes Supabase
document.getElementById('auth-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const btn = document.getElementById('submit-btn');

    const originalBtnText = btn.innerText;
    btn.innerText = "Pracuji...";
    btn.disabled = true;

    if (isLoginMode) {
        // PŘIHLÁŠENÍ
        const { data, error } = await _sb.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            alert("Chyba při přihlášení: " + error.message);
            btn.innerText = originalBtnText;
            btn.disabled = false;
        } else {
            alert("Úspěšně přihlášeno!");
            showApp(); // Tato funkce přepne na deník cviků
        }
    } else {
        // REGISTRACE
        const { data, error } = await _sb.auth.signUp({
            email: email,
            password: password,
        });

        if (error) {
            alert("Chyba při registraci: " + error.message);
            btn.innerText = originalBtnText;
            btn.disabled = false;
        } else {
            alert("Registrace úspěšná! Můžeš se přihlásit.");
            handleToggle(); // Přepne zpět na login
            btn.innerText = "Přihlásit se";
            btn.disabled = false;
        }
    }
});

// Funkce pro přepnutí na aplikaci (schová login, ukáže deník)
function showApp() {
    document.getElementById('auth-section').classList.add('hidden');
    document.getElementById('app-section').classList.remove('hidden');
    loadData();
}

// Načtení cviků z tabulky
async function loadData() {
    const { data, error } = await _sb.from('workouts').select('*').order('created_at', {ascending: false});
    const list = document.getElementById('list');
    list.innerHTML = '<strong>Historie tréninků:</strong>';
    
    if (data) {
        data.forEach(i => {
            list.innerHTML += `<div class="workout-item"><b>${i.exercise}</b> <span>${i.weight}kg x ${i.reps}</span></div>`;
        });
    }
}

// Uložení nového cviku
const workoutForm = document.getElementById('workout-form');
if (workoutForm) {
    workoutForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const ex = document.getElementById('ex').value;
        const w = document.getElementById('w').value;
        const r = document.getElementById('r').value;

        const { error } = await _sb.from('workouts').insert([{ 
            exercise: ex, 
            weight: parseFloat(w), 
            reps: parseInt(r) 
        }]);

        if (error) {
            alert("Chyba při ukládání: " + error.message);
        } else {
            workoutForm.reset();
            loadData();
        }
    });
}
