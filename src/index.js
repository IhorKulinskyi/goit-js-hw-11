import ImageApiService from './js/ImageApiService';
import NotificationApiService from './js/NotificationApiService';
import createGroupOfImagesMarkup from './js/createMarkup';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import './js/btn-up';

const refs = {
  searchForm: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  spinner: document.querySelector('.spinner'),
};

const notification = new NotificationApiService();

const imageApiService = new ImageApiService();

refs.searchForm.addEventListener('submit', onSearchBtnClick);

let gallery = new SimpleLightbox('.gallery a');

const infiniteObserver = new IntersectionObserver(
  ([entry], observer) => {
    if (entry.isIntersecting) {
      observer.unobserve(entry.target);
      // to show spinner
      setTimeout(onLoadMoreImages, 1000);
      // onLoadMoreImages();
    }
  },
  {
    threshold: 0.8,
  }
);

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

async function onLoadMoreImages() {
  const res = await imageApiService.fetchImages();
  onLoadMore(res);
}

async function searchImages() {
  const res = await imageApiService.fetchImages();
  refs.spinner.classList.remove('visually-hidden');
  onSearch(res);
}

function onSearch(r) {
  imageApiService.resetHits();
  const images = r.data.hits;
  imageApiService.addHits(images);
  if (images.length === 0) {
    refs.spinner.classList.add('visually-hidden');
    notification.showFailure();
  } else {
    notification.searchResult(r.data.totalHits);
    const markup = createGroupOfImagesMarkup(images);
    updateGallery(markup);
    gallery.refresh();
    refs.spinner.classList.add('visually-hidden');
    if (images.length !== r.data.totalHits) {
      const lastCard = document.querySelector('.photo-card:last-child');
      infiniteObserver.observe(lastCard);
      refs.spinner.classList.remove('visually-hidden');
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
  gallery.refresh();

  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
  const lastCard = document.querySelector('.photo-card:last-child');
  infiniteObserver.observe(lastCard);

  if (filteredHits.length === r.data.totalHits) {
    notification.showEndOfSearch();
    refs.spinner.classList.add('visually-hidden');
    infiniteObserver.unobserve(lastCard);
  }
}

function updateGallery(markup) {
  refs.gallery.insertAdjacentHTML('beforeend', markup);
}

function clearGallery() {
  refs.gallery.innerHTML = '';
}
