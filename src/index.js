import './sass/main.scss';
import ApiServise from './js/api';
import LoadMoreBtn from './js/load-more-btn';
import listImg from './handlebars/listImg.hbs';
import 'basiclightbox/dist/basicLightbox.min.css';
import * as basicLightbox from 'basiclightbox';

const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more"]',
  hidden: true,
});

const apiServise = new ApiServise();

const refs = {
  formInput: document.querySelector('.search-form'),
  result: document.querySelector('.result'),
  error: document.querySelector('.error'),
};

refs.formInput.addEventListener('submit', getUsers);
loadMoreBtn.refs.button.addEventListener('click', getNextPage);

function fetchPic() {
  apiServise
    .fetchItems()
    .then(data => {
      renderItems(data);
      loadMoreBtn.enable();
    })
    .catch(err => {
      renderError(err);
      loadMoreBtn.hide();
    });
}

function getNextPage(e) {
  loadMoreBtn.disable();
  apiServise.incrementPage();

  fetchPic();
}

function getUsers(e) {
  e.preventDefault();
  apiServise.query = e.currentTarget.elements.query.value;
  if (!apiServise.query.trim()) {
    return alert('Please Enter Search Query');
  }
  apiServise.resetPage();

  refs.result.innerHTML = '';
  loadMoreBtn.show();
  fetchPic();
}

function renderItems(items) {
  const markup = listImg(items);
  refs.result.insertAdjacentHTML('beforeend', markup);
  refs.error.textContent = '';
}

function renderError(err) {
  refs.result.innerHTML = '';
  refs.error.textContent = err;
}

document.addEventListener('click', event => {
  if (event.target.tagName !== 'IMG') return;

  const instance = basicLightbox.create(`
    <img src='${event.target.dataset.big}' alt='${event.target.alt}' />
`);
  console.log(instance);
  instance.show();
});
