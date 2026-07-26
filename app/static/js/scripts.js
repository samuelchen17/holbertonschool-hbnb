let places = [];

document.addEventListener('DOMContentLoaded', () => {
  updateNavbar();

  const loginForm = document.getElementById('login-form');

  if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;

      try {
        await loginUser(email, password);
      } catch (error) {
        alert(error.message);
      }
    });
  }

  const logoutButton = document.getElementById('logout-button');

  if (logoutButton) {
    logoutButton.addEventListener('click', () => {
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';

      window.location.href = '/';
    });
  }

  const priceFilter = document.getElementById('price-filter');

  if (priceFilter) {
    setupPriceFilter();
  }

  const placesList = document.getElementById('places-list');

  if (placesList) {
    fetchPlaces();
  }

  const placeDetails = document.getElementById('place-details');

  if (placeDetails) {
    fetchPlaceDetails();
    showReviewForm();
  }
});

async function loginUser(email, password) {
  const res = await fetch('/api/v1/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (res.ok) {
    document.cookie = `token=${data.access_token}; path=/`;
    window.location.href = '/';
  } else {
    alert('Login failed: Invalid credentials');
  }
}

function getCookie(name) {
  const cookies = document.cookie.split('; ');

  const cookie = cookies.find((cookie) => cookie.startsWith(`${name}=`));

  return cookie ? cookie.split('=')[1] : null;
}

function updateNavbar() {
  const token = getCookie('token');

  const loginButton = document.getElementById('login-button');
  const logoutButton = document.getElementById('logout-button');

  if (!loginButton || !logoutButton) {
    return;
  }

  if (token) {
    loginButton.style.display = 'none';
    logoutButton.style.display = 'block';
  } else {
    loginButton.style.display = 'block';
    logoutButton.style.display = 'none';
  }
}

async function fetchPlaces() {
  const token = getCookie('token');

  const headers = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch('/api/v1/places/', {
    headers,
  });

  places = await response.json();

  displayPlaces(places);
}

function displayPlaces(places) {
  const container = document.getElementById('places-list');

  container.innerHTML = '';

  if (places.length === 0) {
    container.innerHTML = '<p>No listings yet</p>';
    return;
  }

  places.forEach((place) => {
    container.innerHTML += `
          <div class="place-card">
            <h2>${place.title}</h2>

            <div>
              <span>Price per night:</span>
              <span>$${place.price}</span>
            </div>

            <a href="/place?id=${place.id}" class="details-button"> View details </a>
          </div>
        `;
  });
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

    option.textContent = price === 'All' ? 'All' : `Up to $${price}`;

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

async function fetchPlaceDetails() {
  try {
    const token = getCookie('token');

    const headers = {};

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const params = new URLSearchParams(window.location.search);

    const placeId = params.get('id');

    if (!placeId) {
      console.error('No place ID provided');
      return;
    }

    const response = await fetch(`/api/v1/places/${placeId}`, {
      headers,
    });

    if (!response.ok) {
      throw new Error('Failed to fetch place');
    }

    const place = await response.json();

    displayPlaceDetails(place);
  } catch (error) {
    console.error(error);
  }
}

function displayPlaceDetails(place) {
  const container = document.getElementById('place-details');

  container.innerHTML = `
    <h1>${place.title}</h1>

    <p>${place.description}</p>

    <h3>Price per night:</h3>
    <p>
      $${place.price}
    </p>

    <h3>Location:</h3>
    <p>  
      ${place.latitude}, ${place.longitude}
    </p>

    <h3>Amenities:</h3>
    <ul>
      ${place.amenities
        .map(
          (amenity) => `
          <li>${amenity.name}</li>
        `,
        )
        .join('')}
    </ul>

    <h3>Reviews</h3>

    <ul>
      ${
        place.reviews && place.reviews.length
          ? place.reviews
              .map(
                (review) => `
              <li>
                <p>${review.text}</p>
                <p>Rating: ${review.rating}/5</p>
              </li>
            `,
              )
              .join('')
          : '<li>No reviews yet</li>'
      }
    </ul>
  `;
}

function showReviewForm() {
  const reviewForm = document.getElementById('review-form');
  const loginMessage = document.getElementById('login-message');

  if (!reviewForm) {
    return;
  }

  const token = getCookie('token');

  if (token) {
    reviewForm.style.display = 'block';

    if (loginMessage) {
      loginMessage.style.display = 'none';
    }

  } else {
    reviewForm.style.display = 'none';

    if (loginMessage) {
      loginMessage.style.display = 'block';
    }
  }
}