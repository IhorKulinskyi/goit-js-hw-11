import ImageApiService from './js/ImageApiService';
import NotificationApiService from './js/NotificationApiService';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  searchForm: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

const notification = new NotificationApiService();

const imageApiService = new ImageApiService();

refs.searchForm.addEventListener('submit', onSearchBtnClick);
refs.loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);

function onSearchBtnClick(e) {
  e.preventDefault();
  imageApiService.query = e.target.elements.searchQuery.value.trim();
  imageApiService.resetPageCounter();
  if (imageApiService.query === '') {
    notification.showEmptyInput();
    return;
  } else {
    clearGallery();
    searchImages();
  }
}

async function onLoadMoreBtnClick() {
  const res = await imageApiService.fetchImages();
  onLoadMore(res);
}

async function searchImages() {
  const res = await imageApiService.fetchImages();
  onSearch(res);
}

function onSearch(r) {
  refs.loadMoreBtn.classList.add('visually-hidden');
  imageApiService.resetHits();
  const images = r.data.hits;
  imageApiService.addHits(images);
  if (images.length === 0) {
    notification.showFailure();
  } else {
    notification.searchResult(r.data.totalHits);
    const markup = createGroupOfImagesMarkup(images);
    updateGallery(markup);
    new SimpleLightbox('.gallery a');
    if (images.length !== r.data.totalHits) {
      refs.loadMoreBtn.classList.remove('visually-hidden');
    }
  }
}

function onLoadMore(r) {
  const images = r.data.hits;
  const totalHits = imageApiService.totalHits;
  imageApiService.addHits(images);
  const filteredHits = imageApiService.filterHits(totalHits);
  const markup = createGroupOfImagesMarkup(images);
  updateGallery(markup);
  let gallery = new SimpleLightbox('.gallery a');
  gallery.refresh();

  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });

  if (filteredHits.length === r.data.totalHits) {
    notification.showEndOfSearch();
    refs.loadMoreBtn.classList.add('visually-hidden');
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

function createGroupOfImagesMarkup(images) {
  return images.map(img => createImageMarkup(img)).join('');
}

function updateGallery(markup) {
  refs.gallery.insertAdjacentHTML('beforeend', markup);
}

function clearGallery() {
  refs.gallery.innerHTML = '';
}
