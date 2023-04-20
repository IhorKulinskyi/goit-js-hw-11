import axios from 'axios';

export default async function fetchImages(query) {
  try {
    const BASE_URL = 'https://pixabay.com/api/';
    const API_KEY = '35277582-b50a1a83cc1a7d3dd10451290';
    const params = {
      q: query,
      key: API_KEY,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
    };
    return await axios.get(`${BASE_URL}`, { params });
  } catch (error) {
    console.log(error);
  }
}
