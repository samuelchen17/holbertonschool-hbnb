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

  const reviewForm = document.getElementById('review-form');

  if (reviewForm) {
    reviewForm.addEventListener('submit', submitReview);
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

function getPlaceIdFromURL() {
  const params = new URLSearchParams(window.location.search);

  return params.get('id');
}

async function fetchPlaceDetails() {
  try {
    const token = getCookie('token');

    const headers = {};

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const placeId = getPlaceIdFromURL();

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

    <section class='place-detail-information'>
    <h1>${place.title}</h1>

<section class="place-detail-card">

  <p>
    <strong>Host:</strong> 
    ${place.owner.first_name} ${place.owner.last_name}
  </p>

  <p>
    <strong>Price per night:</strong> 
    $${place.price}
  </p>

  <p>
    <strong>Description:</strong> 
    ${place.description}
  </p>

  <div>
    <strong>Amenities:</strong>
    <ul>
      ${place.amenities
        .map(
          (amenity) => `
            <li>${amenity.name}</li>
          `,
        )
        .join('')}
    </ul>
  </div>

</section>
       </section>

    <section class="place-reviews">
    <h2>Reviews</h2>

    <ul>
      ${
        place.reviews && place.reviews.length
          ? place.reviews
              .map(
                (review) => `
              <li class='place-review-card'>
                <h3>first name last name:</h3>
                <p>${review.text}</p>
                <p>Rating: ${review.rating}/5</p>
              </li>
            `,
              )
              .join('')
          : '<li class="place-review-card">No reviews yet</li>'
      }
    </ul>
    </section>
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

async function submitReview() {
  event.preventDefault();
  const token = getCookie('token');

  const placeId = getPlaceIdFromURL();

  if (!placeId) {
    console.error('No place ID provided');
    return;
  }

  const text = document.getElementById('review-text').value;

  const rating = document.getElementById('review-rating').value;

  const response = await fetch('/api/v1/reviews/', {
    method: 'POST',

    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify({
      text: text,
      rating: Number(rating),
      place_id: placeId,
    }),
  });

  if (response.ok) {
    alert('Review submitted successfully!');

    document.getElementById('review-form').reset();

    window.location.reload();
  } else {
    const error = await response.json();

    console.error(error);
    alert(`Error: ${JSON.stringify(error)}`);
  }
}

