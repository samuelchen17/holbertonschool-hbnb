function setupReviewForm() {
  const reviewForm = document.getElementById('review-form');

  if (!reviewForm) {
    return;
  }

  reviewForm.addEventListener('submit', submitReview);
}

function showReviewForm() {
  const reviewForm = document.getElementById('review-form');
  const loginMessage = document.getElementById('login-message');

  if (!reviewForm) {
    return;
  }

  const isLoggedIn = Boolean(getCookie('token'));

  reviewForm.style.display = isLoggedIn ? 'block' : 'none';

  if (loginMessage) {
    loginMessage.style.display = isLoggedIn ? 'none' : 'block';
  }
}

async function submitReview(event) {
  event.preventDefault();

  const placeId = getPlaceIdFromURL();

  if (!placeId) {
    console.error('No place ID provided');
    return;
  }

  const reviewData = {
    text: document.getElementById('review-text').value,
    rating: Number(document.getElementById('review-rating').value),
    place_id: placeId,
  };

  try {
    const response = await fetch(API.reviews, {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },

      body: JSON.stringify(reviewData),
    });

    await handleResponse(response);

    alert('Review submitted successfully!');

    document.getElementById('review-form').reset();

    window.location.reload();
  } catch (error) {
    console.error(error.message);

    alert(`Error: ${error.message}`);
  }
}
