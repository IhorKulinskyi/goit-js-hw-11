import fetchImages from './js/fetchImages';
import { Notify } from 'notiflix';
// import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  searchForm: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
};

const FAILURE_MESSAGE =
  'Sorry, there are no images matching your search query. Please try again.';

refs.searchForm.addEventListener('submit', onSearchBtnClick);

function onSearchBtnClick(e) {
  e.preventDefault();
  clearGallery();
  const searchQuery = e.target.elements.searchQuery.value.trim();
  if (searchQuery === '') {
    Notify.info('Search input is empty');
    return;
  } else {
    fetchImages(searchQuery).then(function (r) {
      const images = r.data.hits;
      if (images.length === 0) {
        Notify.failure(FAILURE_MESSAGE);
      } else {
        const markup = images.map(img => createImageMarkup(img)).join('');
        updateGallery(markup);
      }
    });
  }
}

function createImageMarkup({
  webformatURL,
  largeImageURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) {
  return `<div class="photo-card">
  <a href="${largeImageURL}" class="gallery__link"><img class ="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
  <div class="info">
    <p class="info-item">
      <b>Likes: ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views: ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments: ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads: ${downloads}</b>
    </p>
  </div>
</div>`;
}

function updateGallery(markup) {
  refs.gallery.insertAdjacentHTML('beforeend', markup);
}

function clearGallery() {
  refs.gallery.innerHTML = '';
}
