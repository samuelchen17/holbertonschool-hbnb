let places = [];


function setupPlacesPage() {
  const placesList = document.getElementById('places-list');

  if (!placesList) {
    return;
  }

  fetchPlaces();

  const priceFilter = document.getElementById('price-filter');

  if (priceFilter) {
    setupPriceFilter();
  }
}


async function fetchPlaces() {
  try {
    const response = await fetch(API.places, {
      headers: getAuthHeaders(),
    });

    places = await handleResponse(response);

    displayPlaces(places);

  } catch (error) {
    console.error(error.message);

    const container = document.getElementById('places-list');

    container.innerHTML = `
      <p>Unable to load places.</p>
    `;
  }
}


function displayPlaces(placesToDisplay) {
  const container = document.getElementById('places-list');

  container.innerHTML = '';

  if (placesToDisplay.length === 0) {
    container.innerHTML = `
      <p>No listings yet</p>
    `;
    return;
  }


  placesToDisplay.forEach((place) => {
    container.innerHTML += createPlaceCard(place);
  });
}


function createPlaceCard(place) {
  return `
    <div class="place-card">

      <h2>${place.title}</h2>

      <div>
        <span>Price per night:</span>
        <span>$${place.price}</span>
      </div>

      <a 
        href="/place?id=${place.id}" 
        class="details-button">
        View details
      </a>

    </div>
  `;
}


function setupPriceFilter() {
  const filter = document.getElementById('price-filter');

  if (!filter) {
    return;
  }


  const prices = ['All', 10, 50, 100];


  prices.forEach((price) => {
    const option = document.createElement('option');

    option.value = price;

    option.textContent =
      price === 'All'
        ? 'All'
        : `Up to $${price}`;

    filter.appendChild(option);
  });


  filter.addEventListener('change', (event) => {
    const maxPrice = event.target.value;


    if (maxPrice === 'All') {
      displayPlaces(places);
      return;
    }


    const filteredPlaces = places.filter((place) => {
      return place.price <= Number(maxPrice);
    });


    displayPlaces(filteredPlaces);
  });
}