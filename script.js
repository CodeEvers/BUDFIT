const SUPABASE_URL = "https://oesygfqnrykzkmxuggxr.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lc3lnZnFucnlremtteHVnZ3hyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzOTI4NDMsImV4cCI6MjA4ODk2ODg0M30.VCzB_jf3aeP89wQhwIXxROxF8cVzlNWtNPO8nI0im6M";

const _sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let isLoginMode = true;

// Funkce pro přepínání režimu (Login/Registrace)
function handleToggle() {
    isLoginMode = !isLoginMode;
    
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

// Připojení kliknutí na "Zaregistruj se"
document.getElementById('switch-link').addEventListener('click', (e) => {
    e.preventDefault();
    handleToggle();
});

// Auth proces
document.getElementById('auth-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const btn = document.getElementById('submit-btn');

    btn.disabled = true;
    btn.innerText = "Pracuji...";

    if (isLoginMode) {
        const { data, error } = await _sb.auth.signInWithPassword({ email, password });
        if (error) {
            alert("Chyba: " + error.message);
            btn.disabled = false;
            btn.innerText = "Přihlásit se";
        } else {
            showApp();
        }
    } else {
        const { error } = await _sb.auth.signUp({ email, password });
        if (error) {
            alert("Chyba: " + error.message);
            btn.disabled = false;
            btn.innerText = "Vytvořit účet";
        } else {
            alert("Registrace úspěšná! Můžeš se přihlásit.");
            handleToggle();
            btn.disabled = false;
        }
    }
});

function showApp() {
    document.getElementById('auth-section').classList.add('hidden');
    document.getElementById('app-section').classList.remove('hidden');
    loadData();
}

async function loadData() {
    const { data } = await _sb.from('workouts').select('*').order('created_at', {ascending: false});
    const list = document.getElementById('list');
    list.innerHTML = '<strong>Historie:</strong>';
    if (data) {
        data.forEach(i => {
            list.innerHTML += `<div class="workout-item"><span>${i.exercise}</span> <b>${i.weight}kg x ${i.reps}</b></div>`;
        });
    }
}

document.getElementById('workout-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const exercise = document.getElementById('ex').value;
    const weight = document.getElementById('w').value;
    const reps = document.getElementById('r').value;

    const { error } = await _sb.from('workouts').insert([{ 
        exercise, 
        weight: parseFloat(weight), 
        reps: parseInt(reps) 
    }]);

    if (error) {
        alert("Chyba při ukládání: " + error.message);
    } else {
        document.getElementById('workout-form').reset();
        loadData();
    }
});
