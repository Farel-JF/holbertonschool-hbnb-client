document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');

    // Check if the user is authenticated and fetch place details if necessary
    const token = checkAuthentication();

    if (window.location.pathname.includes('place.html')) {
        const placeId = getPlaceIdFromURL();
        if (token) {
            fetchPlaceDetails(token, placeId);
        } else {
            alert("You need to log in to view place details.");
            window.location.href = 'login.html';
        }

        // Handle review form submission
        const reviewForm = document.getElementById('review-form');
        if (reviewForm) {
            reviewForm.addEventListener('submit', async (event) => {
                event.preventDefault(); // Prevent default form submission

                const reviewText = document.getElementById('review-text').value.trim();
                const rating = document.getElementById('rating').value;

                if (!reviewText) {
                    alert('Please enter a review.');
                    return;
                }

                // Submit the review
                await submitReview(token, placeId, reviewText, rating);
            });
        }
    }
});

// Function to get the value of a cookie by name
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

// Check authentication status and show/hide elements accordingly
function checkAuthentication() {
    const token = getCookie('token');
    const loginButton = document.querySelector('.login-button');
    const addReviewSection = document.getElementById('add-review');

    if (!token) {
        loginButton.style.display = 'block';
        if (addReviewSection) addReviewSection.style.display = 'none';
    } else {
        loginButton.style.display = 'none';
        if (addReviewSection) addReviewSection.style.display = 'block';
    }

    return token; // Return the token for further use
}

// Get place ID from URL
function getPlaceIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// Fetch place details from the API
async function fetchPlaceDetails(token, placeId) {
    try {
        const response = await fetch(`http://127.0.0.1:5000/places/${placeId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const place = await response.json();
            displayPlaceDetails(place);
            displayReviews(place.reviews);
        } else {
            console.error('Failed to fetch place details:', response.statusText);
        }
    } catch (error) {
        console.error('Error fetching place details:', error);
    }
}

// Display place details
function displayPlaceDetails(place) {
    const placeDetailsSection = document.getElementById('place-details');
    if (!placeDetailsSection) {
        console.error("No element with ID 'place-details' found.");
        return;
    }

    placeDetailsSection.innerHTML = `
        <h1>${place.description}</h1>
        <div class="place-info">
            <p><strong>Host:</strong> ${place.host_name}</p>
            <p><strong>Price per night:</strong> $${place.price_per_night}</p>
            <p><strong>Location:</strong> ${place.city_name}, ${place.country_name}</p>
            <p><strong>Description:</strong> ${place.description}</p>
            <p><strong>Amenities:</strong> ${place.amenities.join(', ')}</p>
        </div>
    `;
}

// Display reviews for the place
function displayReviews(reviews) {
    const reviewsList = document.getElementById('reviews-list');
    if (!reviewsList) {
        console.error("No element with ID 'reviews-list' found.");
        return;
    }

    reviewsList.innerHTML = ''; // Clear existing reviews

    reviews.forEach(review => {
        const reviewElement = document.createElement('div');
        reviewElement.className = 'review-card';
        reviewElement.innerHTML = `
            <p><strong>${review.user_name}:</strong></p>
            <p>${review.comment}</p>
            <p><strong>Rating:</strong> ${'★'.repeat(review.rating)}</p>
        `;
        reviewsList.appendChild(reviewElement);
    });
}

// Submit review for the place
async function submitReview(token, placeId, reviewText, rating) {
    try {
        const response = await fetch(`http://127.0.0.1:5000/places/${placeId}/reviews`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ comment: reviewText, rating: parseInt(rating, 10) })
        });

        if (response.ok) {
            const newReview = await response.json();
            displayReviews([newReview]); // Append the new review to the list
            document.getElementById('review-text').value = ''; // Clear the review form
            document.getElementById('rating').value = ''; // Reset the rating
            alert('Review submitted successfully!');
        } else {
            const errorData = await response.json();
            console.error('Failed to submit review:', errorData.message || response.statusText);
            alert(`Failed to submit review: ${errorData.message || response.statusText}`);
        }
    } catch (error) {
        console.error('Error submitting review:', error);
        alert('An error occurred. Please try again.');
    }
}
