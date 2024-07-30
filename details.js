/*
document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const placeId = params.get('id');

  if (placeId) {
      // Charger les détails du lieu en fonction de l'ID
      loadPlaceDetails(placeId);
  } else {
      document.getElementById('place-details').innerHTML = 'Place not found.';
  }
});*/

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const placeId = params.get('id');

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
      const place = places.find(p => p.id == placeId);
      if (place) {
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





function loadPlaceDetails(placeId) {
  // Remplacez ce code avec une récupération réelle des données si nécessaire
  // Pour l'exemple, on utilise des données statiques
  const placeDetails = {
      'beach-house': {
          name: 'Beautiful Beach House',
          host: 'John Doe',
          price: '$150',
          location: 'Los Angeles, United States',
          description: 'A beautiful beach house with amazing views of the ocean. Perfect for a relaxing vacation.',
          amenities: 'WiFi, Pool, Air Conditioning'
      },
      'cozy-cabin': {
          name: 'Cozy Cabin',
          host: 'Jane Smith',
          price: '$100',
          location: 'Toronto, Canada',
          description: 'A charming cabin in the woods, ideal for a quiet getaway. Enjoy the tranquility and nature.',
          amenities: 'Fireplace, Kitchen, Free Parking'
      },
      'modern-apartment': {
          name: 'Modern Apartment',
          host: 'Alex Johnson',
          price: '$200',
          location: 'New York, United States',
          description: 'A sleek and stylish apartment in the heart of the city. Close to all major attractions and amenities.',
          amenities: 'Gym, Rooftop Terrace, High-Speed Internet'
      }
  };

  const details = placeDetails[placeId];
  if (details) {
      const detailsHtml = `
          <h1>${details.name}</h1>
          <section class="place-details">
              <div class="place-info">
                  <p><strong>Host:</strong> ${details.host}</p>
                  <p><strong>Price per night:</strong> ${details.price}</p>
                  <p><strong>Location:</strong> ${details.location}</p>
                  <p><strong>Description:</strong> ${details.description}</p>
                  <p><strong>Amenities:</strong> ${details.amenities}</p>
              </div>
          </section>
      `;
      document.getElementById('place-details').innerHTML = detailsHtml;
  } else {
      document.getElementById('place-details').innerHTML = 'Place details not found.';
  }
}
