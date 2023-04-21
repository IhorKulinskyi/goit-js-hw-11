import ImageApiService from './js/ImageApiService';
import NotificationApiService from './js/NotificationApiService';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import InfiniteScroll from 'infinite-scroll';

const refs = {
  searchForm: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
};

const notification = new NotificationApiService();

const imageApiService = new ImageApiService();

refs.searchForm.addEventListener('submit', onSearchBtnClick);

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

async function searchImages() {
  const res = await imageApiService.fetchImages();
  console.log(res.data);
  onSearch(res);
}

function onSearch(r) {
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
    const infScroll = new InfiniteScroll(refs.gallery, {
      path: function () {
        return `${imageApiService.BASE_URL}?key=${imageApiService.API_KEY}&image_type=photo&orientation=horizontal&safesearch=true&page=${imageApiService.page}&per_page=40&q=${imageApiService.searchQuery}`;
      },
      append: '.photo-card',
      history:'false',
    });
    infScroll.on('load', function (response) {
      const newImages = response.hits;
      imageApiService.addHits(newImages);
      const newMarkup = createGroupOfImagesMarkup(newImages);
      updateGallery(newMarkup);
      imageApiService.page += 1;
      new SimpleLightbox('.gallery a');
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

function createGroupOfImagesMarkup(images) {
  return images.map(img => createImageMarkup(img)).join('');
}

function updateGallery(markup) {
  refs.gallery.insertAdjacentHTML('beforeend', markup);
}

function clearGallery() {
  refs.gallery.innerHTML = '';
}
