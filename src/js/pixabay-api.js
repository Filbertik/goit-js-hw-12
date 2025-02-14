import axios from 'axios';

const API_KEY = '48709944-704d63a27b5727393d509020c';
const BASE_URL = 'https://pixabay.com/api/';

export async function fetchImages(query, page, perPage) {
  const url = `${BASE_URL}?key=${API_KEY}&q=${encodeURIComponent(
    query
  )}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`;
  const response = await axios.get(url);
  return response.data;
}
