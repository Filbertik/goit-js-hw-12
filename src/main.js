import { fetchImages } from './js/pixabay-api';
import { renderGallery, clearGallery } from './js/render-functions';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('#search-form');
const art = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const loader = document.querySelector('.loader');

let query = '';
let page = 1;
const perPage = 40;
let lightbox = new SimpleLightbox('.gallery a');

form.addEventListener('submit', async e => {
  e.preventDefault();
  query = e.currentTarget.elements.searchQuery.value.trim();

  if (!query) {
    iziToast.error({
      title: 'Error',
      message: 'Type the request !',
      position: 'topRight',
    });
    return;
  }

  page = 1;
  clearGallery();
  loadMoreBtn.classList.add('hidden');
  loader.classList.remove('hidden');

  try {
    const data = await fetchImages(query, page, perPage);
    if (data.hits.length === 0) {
      iziToast.warning({
        title: '❌ Attention',
        message:
          'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
      });
      return;
    }

    renderGallery(data.hits);
    lightbox.refresh();
    if (data.totalHits > perPage) {
      loadMoreBtn.classList.remove('hidden');
    }
  } catch (error) {
    iziToast.error({
      title: '❌ Error',
      message: 'Can not load the images!',
      position: 'topRight',
    });
  } finally {
    loader.classList.add('hidden');
  }
});

loadMoreBtn.addEventListener('click', async () => {
  page += 1;
  loader.classList.remove('hidden');

  try {
    const data = await fetchImages(query, page, perPage);
    renderGallery(data.hits);
    lightbox.refresh();

    // Scrolling
    const { height: cardHeight } = document
      .querySelector('.gallery-item')
      .getBoundingClientRect();
    window.scrollBy({ top: cardHeight * 2, behavior: 'smooth' });

    if (page * perPage >= data.totalHits) {
      loadMoreBtn.classList.add('hidden');
      iziToast.info({
        title: 'Info',
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
    }
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: 'Something went wrong.',
      position: 'topRight',
    });
  } finally {
    loader.classList.add('hidden');
  }
});
