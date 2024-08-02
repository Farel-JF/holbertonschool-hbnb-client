document.addEventListener('DOMContentLoaded', async () => {
  const placeId = getPlaceIdFromURL();
  const token = getCookie('token');

  if (!placeId) {
      document.getElementById('place-details').innerHTML = 'No place ID provided.';
      return;
  }

  try {
      const place = await fetchPlaceDetails(token, placeId);
      if (place) {
          displayPlaceDetails(place);
      } else {
          document.getElementById('place-details').innerHTML = 'Place not found.';
      }
  } catch (error) {
      console.error('Error fetching place details:', error);
      document.getElementById('place-details').innerHTML = 'An error occurred while fetching place details.';
  }

  if (token) {
      document.getElementById('login-link').style.display = 'none';
      document.getElementById('add-review').style.display = 'block';

      document.getElementById('review-form')?.addEventListener('submit', async (event) => {
          event.preventDefault();
          const reviewText = document.getElementById('review-text').value;
          const ratingValue = document.getElementById('rating').value;

          try {
              const response = await submitReview(placeId, reviewText, ratingValue);
              if (response.success) {
                  alert('Review submitted successfully!');
                  const newReviewHtml = `
                      <div class="review-card">
                          <p><strong>${response.user_name || 'Anonymous'}:</strong></p>
                          <p>${response.comment || 'No comment'}</p>
                          <p><strong>Rating:</strong> ${getStars(response.rating)}</p>
                      </div>
                  `;
                  document.querySelector('.reviews').innerHTML = `
                      <h2>Reviews</h2>
                      ${newReviewHtml}
                      ${document.querySelector('.reviews').innerHTML}
                  `;
                  document.getElementById('review-form').reset();
              } else {
                  alert('Failed to submit review.');
              }
          } catch (error) {
              console.error('Error submitting review:', error);
              alert('Failed to submit review.');
          }
      });
  } else {
      document.getElementById('login-link').style.display = 'block';
      document.getElementById('add-review').style.display = 'none';
  }
});

function getPlaceIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

async function fetchPlaceDetails(token, placeId) {
  const response = await fetch(`https://api.example.com/places/${placeId}`, {
      method: 'GET',
      headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
      }
  });
  if (!response.ok) throw new Error('Network response was not ok');
  return response.json();
}

function displayPlaceDetails(place) {
  const reviewsHtml = (place.reviews && place.reviews.length)
      ? place.reviews.map(review => `
          <div class="review-card">
              <p><strong>${review.user_name || 'Anonymous'}:</strong></p>
              <p>${review.comment || 'No comment'}</p>
              <p><strong>Rating:</strong> ${getStars(review.rating)}</p>
          </div>
      `).join('')
      : '<p>No reviews yet.</p>';

  document.getElementById('place-details').innerHTML = `
      <h1>${place.title || 'No title'}</h1>
      <section class="place-info">
          <p><strong>Host:</strong> ${place.host || 'Unknown'}</p>
          <p><strong>Price per night:</strong> ${place.price || 'N/A'}</p>
          <p><strong>Location:</strong> ${place.location || 'Unknown'}</p>
          <p><strong>Description:</strong> ${place.description || 'No description'}</p>
          <p><strong>Amenities:</strong> ${place.amenities || 'None'}</p>
          <div class="place-images">
              ${place.images ? place.images.map(img => `<img src="${img}" alt="Place Image">`).join('') : ''}
          </div>
      </section>
      <section class="reviews">
          ${reviewsHtml}
      </section>
  `;

  if (getCookie('token')) {
      document.getElementById('add-review').innerHTML = `
          <h2>Add a Review</h2>
          <form id="review-form">
              <label for="review-text">Your Review:</label>
              <textarea id="review-text" name="review-text" rows="4" required></textarea>
              <label for="rating">Rating:</label>
              <select id="rating" name="rating" required>
                  <option value="1">1 Star</option>
                  <option value="2">2 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="5">5 Stars</option>
              </select>
              <button type="submit" class="submit-review-button">Submit Review</button>
          </form>
      `;
  }
}

async function submitReview(placeId, comment, rating) {
  const response = await fetch(`https://api.example.com/places/${placeId}/reviews`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getCookie('token')}`
      },
      body: JSON.stringify({ comment, rating })
  });
  if (!response.ok) throw new Error('Network response was not ok');
  return response.json();
}

function getStars(rating) {
  if (!rating) return 'No rating';
  const fullStar = '★';
  const emptyStar = '☆';
  return Array.from({ length: 5 }, (_, i) => i < rating ? fullStar : emptyStar).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');

  // Récupère le token stocké dans les cookies
  const token = getCookie('token');

  if (loginForm) {
      loginForm.addEventListener('submit', async (event) => {
          event.preventDefault();
          const email = document.getElementById('email').value;
          const password = document.getElementById('password').value;

          // Envoie la requête de login
          const response = await fetch('http://127.0.0.1:5000/login', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({ email, password })
          });

          if (response.ok) {
              const data = await response.json();
              // Stocke le token dans les cookies
              document.cookie = `token=${data.access_token}; path=/`;
              window.location.href = 'index.html';
          } else {
              document.getElementById('error-message').innerText = 'Login failed: An error has occurred';
          }
      });
  }

  // Vérifie si l'utilisateur est authentifié
  function checkAuthentication() {
      const token = getCookie('token');
      const loginLink = document.getElementById('login-link');
      if (token) {
          loginLink.style.display = 'none';
      }
  }
  checkAuthentication();

  // Fonction pour récupérer les cookies
  function getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
  }

// All places part //
  if (document.getElementById('places-list')) {
      let places = []

      // Récupère les lieux avec le token dans l'en-tête Authorization
      async function fetchPlaces(token) {
          const response = await fetch('http://127.0.0.1:5000/places', {
              method: 'GET',
              headers: {
                  'Authorization': `Bearer ${token}`
              }
          });

          if (response.ok) {
              places = await response.json();
              displayPlaces(places);
          }
      }

      fetchPlaces();

      // Affiche les lieux récupérés
      function displayPlaces(places) {
          const placesList = document.getElementById('places-list');
          placesList.innerHTML = '';

          places.forEach(place => {
              const placeCard = document.createElement('div');
              placeCard.className = 'place-card';
              placeCard.innerHTML = `
              <h2>${place.description}</h2>
              <p>Price per night: $ ${place.price_per_night}</p>
              <p>Location: ${place.city_name}, ${place.country_name}</p>
              <button id="details-button" data-place-id="${place.id}">View details</button>
              `;
              placesList.appendChild(placeCard);
          });
          goToPlaceDetails();
      }

      // Ajoute les événements pour naviguer vers les détails d'un lieu
      function goToPlaceDetails() {
          const buttons = document.querySelectorAll('#details-button');
          buttons.forEach(button => {
              button.addEventListener('click', () => {
                  const targetId = button.getAttribute('data-place-id');
                  window.location.href = `place.html?id=${targetId}`;
              });
          });
      }

      // Filtre les lieux par pays
      function filterPlacesByCountry(country) {
          if (country === "all") {
              displayPlaces(places);
          } else {
              const filteredPlaces = places.filter(place => place.country_name === country);
              displayPlaces(filteredPlaces);
          }
      }

      document.getElementById('country-filter').addEventListener('change', (event) => {
          filterPlacesByCountry(event.target.value);
      });
  }

  function getIdFromUrl() {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get('id');
  }

  // Charge le formulaire d'ajout de revue
  async function loadAddReview() {
      const response = await fetch('add_review.html');
      const html = await response.text();
      document.getElementById('add-review').innerHTML = html;
      const reviewForm = document.getElementById('review-form');
      createReview(reviewForm);
  }

  // Partie pour afficher les détails d'un lieu
  if (document.getElementById('place-details')) {
      const placeId = getIdFromUrl();
      if (placeId) {
          fetchPlaceDetails(placeId);
          loadAddReview();
      }
      if (!token) {
          document.getElementById('add-review').style.display = 'none';
      }
  }

  // Récupère les détails d'un lieu avec le token dans l'en-tête Authorization
  async function fetchPlaceDetails(placeId) {
      const response = await fetch(`http://127.0.0.1:5000/places/${placeId}`, {
          method: 'GET',
          headers: {
              'Authorization': `Bearer ${token}`
          }
      });

      if (response.ok) {
          const place = await response.json();
          displayPlaceDetails(place);
          displayReviews(place);
      }
  }

  // Affiche les détails d'un lieu
  function displayPlaceDetails(place) {
      const placeDetails = document.getElementById('place-details');
      placeDetails.innerHTML = `
          <h2 class="title">${place.description}</h2>
          <div class="place-detail-card">
          <ul>
          <ul><strong>Host:</strong> ${place.host_name}</ul>
          <ul><strong>Price per night:</strong> $${place.price_per_night}</ul>
          <ul><strong>Location:</strong> ${place.city_name}, ${place.country_name}</ul>
          <ul><strong>Description:</strong> ${place.description}</ul>
          <ul><strong>Amenities:</strong> ${place.amenities}</ul>
          </ul>
          </div>
      `;
  }

  // Affiche les revues d'un lieu
  function displayReviews(place) {
      const reviewSection = document.getElementById('reviews');
      const displayReviews = document.getElementById('review-card');
      displayReviews.innerHTML = '';

      if (place.reviews.length > 0) {
          // Ajouter le titre uniquement s'il y a des avis
          const reviewTitle = document.createElement('h2');
          reviewTitle.textContent = 'Reviews';
          reviewSection.insertBefore(reviewTitle, displayReviews);

          let reviewsHtml = '';
          place.reviews.forEach(review => {
              reviewsHtml += `
              <div class="review-card">
                  <p><strong>${review.user_name}</strong></p>
                  <p>${review.comment}</p>
                  <p>Rating: ${getStars(review.rating)}</p>
              </div>
              `;
          });
          displayReviews.innerHTML = reviewsHtml;
      }
  }

  function getStars(rating) {
      const fullStar = '★';
      const emptyStar = '☆';
      let stars = '';

      for (let i = 1; i <= 5; i++) {
          stars += i <= rating ? fullStar : emptyStar;
      }

      return stars;
  }

  // Crée une nouvelle revue avec le token dans l'en-tête Authorization
  function createReview(reviewForm) {
      if (reviewForm) {
          const placeId = getIdFromUrl();
          if (placeId) {
              reviewForm.addEventListener('submit', async (event) => {
                  event.preventDefault();
                  const reviewText = document.getElementById('review-text').value;
                  const ratingValue = document.getElementById('review-rating').value;

                  const response = await fetch(`http://127.0.0.1:5000/places/${placeId}/reviews`, {
                      method: 'POST',
                      headers: {
                          'Content-Type': 'application/json',
                          'Authorization': `Bearer ${token}`
                      },
                      body: JSON.stringify({ review: reviewText, rating: ratingValue, place_id: placeId })
                  });

                  if (response.ok) {
                      alert('Review submitted successfully!');
                      reviewForm.reset();
                      fetchPlaceDetails(placeId);
                  } else {
                      alert('Failed to submit review');
                  }
              });
          }
      }
  }
});
