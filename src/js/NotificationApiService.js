import { Notify } from 'notiflix';

export default class NotificationApiService {
  constructor() {
    this.failure =
      'Sorry, there are no images matching your search query. Please try again.';
    this.emptyInput = 'Search input is empty';
    this.endOfSearch =
      "We're sorry, but you've reached the end of search results.";
  }

  searchResult(amount) {
    Notify.info(`Hooray! We found ${amount} images.`);
  }

  showFailure() {
    Notify.failure(this.failure);
  }

  showEmptyInput() {
    Notify.info(this.emptyInput);
  }

  showEndOfSearch() {
    Notify.info(this.endOfSearch);
  }
}
