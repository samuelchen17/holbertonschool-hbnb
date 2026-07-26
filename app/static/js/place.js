async function setupPlaceDetailsPage() {
  const placeDetails = document.getElementById('place-details');

  if (!placeDetails) {
    return;
  }

  await fetchPlaceDetails();
  showReviewForm();
}

function getPlaceIdFromURL() {
  const params = new URLSearchParams(window.location.search);

  return params.get('id');
}

async function fetchPlaceDetails() {
  const placeId = getPlaceIdFromURL();

  if (!placeId) {
    console.error('No place ID provided');
    return;
  }

  try {
    const response = await fetch(`${API.places}${placeId}`, {
      headers: getAuthHeaders(),
    });

    const place = await handleResponse(response);

    displayPlaceDetails(place);
  } catch (error) {
    console.error(error.message);

    const container = document.getElementById('place-details');

    container.innerHTML = `
    <p>Unable to load place details.</p>
  `;
  }
}

function displayPlaceDetails(place) {
  const container = document.getElementById('place-details');

  container.innerHTML = `
    <section class="place-detail-information">

      <h1>${place.title}</h1>

      <section class="place-detail-card">

        <p>
          <strong>Host:</strong>
          ${place.owner.first_name} ${place.owner.last_name}
        </p>

        <p>
          <strong>Price per night:</strong>
          £${place.price}
        </p>

        <p>
          <strong>Description:</strong>
          ${place.description}
        </p>

        <div>
          <strong>Amenities:</strong>
          <ul>
            ${displayAmenities(place.amenities)}
          </ul>
        </div>

      </section>

    </section>


    <section class="place-reviews">

      <h2>Reviews</h2>

      <ul>
        ${displayReviews(place.reviews)}
      </ul>

    </section>
  `;
}

function displayAmenities(amenities) {
  if (!amenities || amenities.length === 0) {
    return '<li>No amenities listed</li>';
  }

  return amenities
    .map(
      (amenity) => `
        <li>${amenity.name}</li>
      `,
    )
    .join('');
}

function displayReviews(reviews) {
  if (!reviews || reviews.length === 0) {
    return '<li class="place-review-card">No reviews yet</li>';
  }

  return reviews
    .map(
      (review) => `
        <li class="place-review-card">

          <h3>User Review</h3>

          <p>${review.text}</p>

          <p>
            Rating:
            ${review.rating}/5
          </p>

        </li>
      `,
    )
    .join('');
}
