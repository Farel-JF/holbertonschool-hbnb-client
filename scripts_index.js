/*
  This is a SAMPLE FILE to get you started.
  Please, follow the project instructions to complete the tasks.
*/
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.details-button');

    buttons.forEach(button => {
        button.addEventListener('click', (event) => {
            const placeId = event.target.getAttribute('data-place-id');
            window.location.href = `place.html?id=${placeId}`;
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    checkAuthentication();
});

function checkAuthentication() {
    const token = getCookie('token');
    const loginLink = document.getElementById('login-link');

    if (!token) {
        loginLink.style.display = 'block';
    } else {
        loginLink.style.display = 'none';
        fetchPlaces(token);
    }
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

async function fetchPlaces(token) {
    try {
        const response = await fetch('https://your-api-url/places', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        displayPlaces(data);
        populateCountryFilter(data);
    } catch (error) {
        console.error('Error fetching places:', error);
    }
}

function displayPlaces(places) {
    const placesList = document.getElementById('places-list');
    placesList.innerHTML = ''; // Clear existing content

    places.forEach(place => {
        const placeCard = document.createElement('div');
        placeCard.className = 'place-card';
        placeCard.innerHTML = `
            <h3>${place.name}</h3>
            <p>Price per night: $${place.price}</p>
            <p>Location: ${place.location}</p>
            <button class="details-button" data-place-id="${place.id}">View Details</button>
        `;
        placesList.appendChild(placeCard);
    });

    // Attach event listeners for 'View Details' buttons
    document.querySelectorAll('.details-button').forEach(button => {
        button.addEventListener('click', () => {
            const placeId = button.getAttribute('data-place-id');
            window.location.href = `place.html?id=${placeId}`;
        });
    });
}

function populateCountryFilter(places) {
    const filter = document.getElementById('country-filter');
    const countries = [...new Set(places.map(place => place.location.split(', ')[1]))]; // Extract unique countries

    countries.forEach(country => {
        const option = document.createElement('option');
        option.value = country;
        option.textContent = country;
        filter.appendChild(option);
    });

    filter.addEventListener('change', (event) => {
        const selectedCountry = event.target.value;
        filterPlacesByCountry(selectedCountry);
    });
}

function filterPlacesByCountry(country) {
    const placeCards = document.querySelectorAll('.place-card');

    placeCards.forEach(card => {
        const location = card.querySelector('p').textContent.split(': ')[1];
        const cardCountry = location.split(', ')[1];
        if (country === 'all' || cardCountry === country) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}
