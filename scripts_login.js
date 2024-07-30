document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('.login-form');

    // création d'un tableau d'utilisateurs fictifs
    const users = [
        {
            email: 'user1@example.com',
            password: 'password123'
        },
        {
            email: 'user2@example.com',
            password: 'mypassword'
        }
    ];

    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Empêche l'envoi du formulaire par défaut

            // Récupère les valeurs du formulaire
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            // Vérifie les informations d'identification
            const user = users.find(user => user.email === email && user.password === password);

            if (user) {
                // Simule la génération d'un token
                const token = btoa(`${email}:${password}`);
                // Stocke le token dans un cookie
                document.cookie = `token=${token}; path=/`;
                // Redirige vers la page principale
                window.location.href = 'index.html';
            } else {
                alert('Échec de la connexion : Email ou mot de passe incorrect.');
            }
        });
    }
});
