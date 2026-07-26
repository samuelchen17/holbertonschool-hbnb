const API = {
  places: '/api/v1/places/',
  reviews: '/api/v1/reviews/',
  login: '/api/v1/auth/login',
};

async function handleResponse(response) {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      `${response.status}: ${
        data.msg ||
        data.message ||
        data.error ||
        'Request failed'
      }`
    );
  }

  return data;
}