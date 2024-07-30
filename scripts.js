/*
  This is a SAMPLE FILE to get you started.
  Please, follow the project instructions to complete the tasks.
*/
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.querySelector('.login-form');

  if (loginForm) {
      loginForm.addEventListener('submit', async (event) => {
          event.preventDefault(); // Empêche l'envoi du formulaire par défaut

          // Récupère les valeurs du formulaire
          const email = document.getElementById('email@gmail.com').value;
          const password = document.getElementById('password').value;

          try {
              // Envoie les informations au serveur
              const response = await fetch('https://your-api-url/login', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({ email, password })
              });

              if (response.ok) {
                  const data = await response.json();
                  // Stocke le JWT token dans un cookie
                  document.cookie = `token=${data.access_token}; path=/`;
                  // Redirige vers la page principale
                  window.location.href = 'index.html';
              } else {
                  const error = await response.text();
                  alert('Échec de la connexion : ' + error);
              }
          } catch (error) {
              console.error('Erreur lors de la connexion:', error);
              alert('Une erreur est survenue lors de la connexion.');
          }
      });
  }
});
