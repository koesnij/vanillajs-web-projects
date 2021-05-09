const $ = (x) => document.getElementById(x);

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
  document.body.classList.toggle('show-nav');

  // TIL
  document.body.addEventListener('click', closeNavbar);
});

function closeNavbar(e) {
  if (
    document.body.classList.contains('show-nav') &&
    e.target !== $toggle &&
    !$toggle.contains(e.target) &&
    e.target !== $navBar &&
    !navbar.contains(e.target)
  ) {
    // TIL
    document.body.classList.toggle('show-nav');
    document.body.removeEventListener('click', closeNavbar);
  } else if (!document.body.classList.contains('show-nav')) {
    document.body.removeEventListener('click', closeNavbar);
  }
}
