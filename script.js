const SUPABASE_URL = "https://vzotqrbtnytotzdxfgvc.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6b3RxcmJ0bnl0b3R6ZHhmZ3ZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5ODM0MDksImV4cCI6MjA2NDU1OTQwOX0.L0AAQ4JaPZ-C1x-ZA6TaigMjzuG45apv-gf7ApGydNY";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);





document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;
            const loginBtn = document.querySelector('.login-btn');
            
            // Validazione
            if (!username || !password) {
                alert('Inserisci username e password');
                return;
            }
            
            // Mostra loading
            const originalText = loginBtn.textContent;
            loginBtn.textContent = 'Accesso in corso...';
            loginBtn.disabled = true;
            
            try {
                // Chiamata alla funzione Supabase
                const { data, error } = await supabaseClient
                    .from('user_details')
                    .select('username, password')
                    .eq('username',username)
                    .eq('password',password)
                    .single();

                    console.log(username)
                    console.log(password)

                if (error || !data) {
                    alert('Username o password non corretti');
                    document.getElementById('password').value = '';
                    document.getElementById('username').focus();
                } else {
                    // Login riuscito
                    alert(`Benvenuto, ${data.name || data.username}!`);
                    
                    // Salva dati utente
                    localStorage.setItem('currentUser', JSON.stringify(data));
                    
                    // Reindirizza (cambia con la tua pagina)
                    window.location.href = '../index.html';
                }
                
            } catch (err) {
                console.error('Errore durante il login:', err);
                alert('Errore imprevisto durante il login');
            } finally {
                // Ripristina il bottone
                loginBtn.textContent = originalText;
                loginBtn.disabled = false;
            }
        });
    }
});





async function fetchUsers() {
    const { data, error } = await supabaseClient
    .from('user')
    .select('name, surname');

    if (error) {
    console.error("Errore Supabase:", error);
    document.getElementById('userList').value = 'Errore nel recupero dei dati: ' + error.message;
    } else {
    console.log("Dati ricevuti:", data);
    if (data.length === 0) {
        document.getElementById('userList').value = 'Nessun dato trovato.';
    } else {
        const names = data.map(u => u.name).join('\n');
        const surnames = data.map(u => u.surname).join('\n');
        document.getElementById('userList').value = names; surnames;
    }
    }
}

//fetchUsers();