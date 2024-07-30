document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const placeId = params.get('id');
    //ici je fais une liste de mes places avec les informations que je veux afficher , et les informations que
    //je veux afficher sont spécifiées dans le if(placeId) grace à la méthode find et aussi l'id de la place

    const places = [
        {
            id: 1,
            title: "Beautiful Beach House",
            host: "John Doe",
            price: "$150",
            location: "Los Angeles, United States",
            description: "A beautiful beach house with amazing views of the ocean. Perfect for a relaxing vacation.",
            amenities: "WiFi, Pool, Air Conditioning"
        },
        {
            id: 2,
            title: "Modern Apartment",
            host: "Alex Johnson",
            price: "$200",
            location: "New York, United States",
            description: "A sleek and stylish apartment in the heart of the city. Close to all major attractions and amenities.",
            amenities: "Gym, Rooftop Terrace, High-Speed Internet"
        },
        {
            id: 3,
            title: "Cozy Cabin",
            host: "Jane Smith",
            price: "$100",
            location: "Toronto, Canada",
            description: "A charming cabin in the woods, ideal for a quiet getaway. Enjoy the tranquility and nature.",
            amenities: "Fireplace, Kitchen, Free Parking"
        }
    ];

    if (placeId) {
        //Ici je fais une boucle pour parcourir les places et je spécifie les informations que je veux afficher
        const place = places.find(p => p.id == placeId);
        if (place) {
            //c'est ici que je spécifie les informations que je veux afficher
            document.getElementById('place-details').innerHTML = `
                <h1>${place.title}</h1>
                <section class="place-details">
                    <div class="place-info">
                        <p><strong>Host:</strong> ${place.host}</p>
                        <p><strong>Price per night:</strong> ${place.price}</p>
                        <p><strong>Location:</strong> ${place.location}</p>
                        <p><strong>Description:</strong> ${place.description}</p>
                        <p><strong>Amenities:</strong> ${place.amenities}</p>
                    </div>
                </section>
            `;
        } else {
            document.getElementById('place-details').innerHTML = 'Place not found.';
        }
    } else {
        document.getElementById('place-details').innerHTML = 'Place not found.';
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const placeId = getPlaceIdFromURL();
    const token = getCookie('token');

    // Check if the user is authenticated and fetch place details
    if (token) {
        fetchPlaceDetails(token, placeId);
    } else {
        document.getElementById('login-link').style.display = 'block';
        document.getElementById('add-review').style.display = 'none';
        fetchPlaceDetails(null, placeId);  // Fetch details even if user is not authenticated
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
    try {
        const response = await fetch(`https://api.example.com/places/${placeId}`, {
            method: 'GET',
            headers: {
                'Authorization': token ? `Bearer ${token}` : '',
                'Content-Type': 'application/json'
            }
        });
        if (response.ok) {
            const place = await response.json();
            displayPlaceDetails(place);
        } else {
            console.error('Failed to fetch place details:', response.statusText);
        }
    } catch (error) {
        console.error('Error fetching place details:', error);
    }
}

function displayPlaceDetails(place) {
    const placeDetails = document.getElementById('place-details');
    placeDetails.innerHTML = `
        <h1>${place.title}</h1>
        <section class="place-info">
            <p><strong>Host:</strong> ${place.host}</p>
            <p><strong>Price per night:</strong> ${place.price}</p>
            <p><strong>Location:</strong> ${place.location}</p>
            <p><strong>Description:</strong> ${place.description}</p>
            <p><strong>Amenities:</strong> ${place.amenities}</p>
            <div class="place-images">
                ${place.images.map(img => `<img src="${img}" alt="Place Image">`).join('')}
            </div>
        </section>
        <section id="add-review">
            <h2>Add a Review</h2>
            <form action="submit_review.html" method="post">
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
        </section>
    `;
    document.getElementById('login-link').style.display = token ? 'none' : 'block';
    document.getElementById('add-review').style.display = token ? 'block' : 'none';
}
