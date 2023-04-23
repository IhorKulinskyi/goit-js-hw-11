export default function createGroupOfImagesMarkup(images) {
    return images.map(img => createImageMarkup(img)).join('');
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

  

  