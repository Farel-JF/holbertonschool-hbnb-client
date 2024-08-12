// JavaScript for the place.html page
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
                    addReviewToPage(response);
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
    const response = await fetch(`http://127.0.0.1:5000/places/${placeId}`, {
        method: 'GET',
        headers: {
            'Authorization': token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json'
        }
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
}

async function submitReview(placeId, comment, rating) {
    const response = await fetch(`http://127.0.0.1:5000/places/${placeId}/reviews`, {
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

function getStars(rating) {
    const fullStar = '★';
    const emptyStar = '☆';
    return Array.from({ length: 5 }, (_, i) => i < rating ? fullStar : emptyStar).join('');
}

function addReviewToPage(response) {
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
}
