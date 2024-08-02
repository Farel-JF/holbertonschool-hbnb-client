document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('.login-form');

    const users = [
        { email: 'user1@example.com', password: 'password123' },
        { email: 'user2@example.com', password: 'mypassword' }
    ];

    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const user = users.find(user => user.email === email && user.password === password);

            if (user) {
                const token = btoa(`${email}:${password}`);
                document.cookie = `token=${token}; path=/`;
                window.location.href = 'index.html';
            } else {
                alert('Échec de la connexion : Email ou mot de passe incorrect.');
            }
        });
    }
});
