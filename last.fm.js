function getTopArtists(
  username,
  period = "overall",
  limit = 50,
  page = 1,
  api_key
) {
  const baseUrl = "https://ws.audioscrobbler.com/2.0/";
  const method = "user.getTopArtists";
  const params = new URLSearchParams({
    method,
    user: username,
    period,
    limit,
    page,
    api_key,
    format: "json",
  });
  return fetch(`${baseUrl}?${params}`)
    .then((response) => response.json())
    .then((data) => data.topartists)
    .catch((error) => console.error(error));
}

export { getTopArtists };