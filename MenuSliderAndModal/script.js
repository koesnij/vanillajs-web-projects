const $ = (x) => document.getElementById(x);

const $body = document.querySelector('body');
const $open = $('open');
const $close = $('close');
const $modal = $('modal');
const $toggle = $('toggle');
const $navBar = $('navbar');

$open.addEventListener('click', () => {
  $modal.classList.add('show');
});
$close.addEventListener('click', () => {
  $modal.classList.remove('show');
});
$modal.addEventListener('click', (e) => {
  if (e.target === $modal) $modal.classList.remove('show');
});
$toggle.addEventListener('click', () => {
  if ($body.className.includes('show-nav')) {
    $body.className = '';
  } else {
    $body.className = 'show-nav';
  }
});
