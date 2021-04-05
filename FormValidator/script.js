const form = document.getElementById('form');
const username = document.getElementById('username');
const email = document.getElementById('email');
const password = document.getElementById('password');
const password2 = document.getElementById('password2');

const checkEmail = () => {
  const regex = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
  if (!regex.test(email.value)) {
    email.parentNode.classList.remove('success');
    email.parentNode.classList.add('error');
    email.parentNode.querySelector('small').innerText = 'invalid email';
    return;
  }

  email.parentNode.classList.remove('error');
  email.parentNode.classList.add('success');
  email.parentNode.querySelector('small').innerHTML = 'Email';
};

const checkRequired = (elements) => {
  elements.forEach((element) => {
    if (element.value === '') {
      element.parentNode.classList.remove('success');
      element.parentNode.classList.add('error');
      return;
    }

    element.parentNode.classList.remove('error');
    element.parentNode.classList.add('success');
  });
};

const checkLength = (element, min, max) => {
  if (element.value.length < min || element.value.length > max) {
    element.parentNode.classList.remove('success');
    element.parentNode.classList.add('error');
    element.parentNode.querySelector(
      'small'
    ).innerText = `should be at least ${min} characters`;
    return;
  }

  element.parentNode.classList.remove('error');
  element.parentNode.classList.add('success');
};

const checkPasswordsMatch = () => {
  if (password.parentNode.classList.contains('error')) {
    password2.parentNode.querySelector(
      'small'
    ).innerText = `'Password' field is required`;
    return;
  }

  if (password.value !== password2.value) {
    password2.parentNode.classList.remove('success');
    password2.parentNode.classList.add('error');
    password2.parentNode.querySelector(
      'small'
    ).innerText = `Passwords do not match`;
    return;
  }

  password2.parentNode.classList.remove('error');
  password2.parentNode.classList.add('success');
};

const onSubmit = (e) => {
  e.preventDefault();

  checkRequired([username, email, password, password2]);
  checkEmail();
  checkLength(username, 3, 20);
  checkLength(password, 8, 20);
  checkPasswordsMatch();

  let next;
  if ((next = form.querySelector('.error'))) {
    next.querySelector('input').focus();
    return;
  }

  console.log('submit');
};

if (form) {
  form.addEventListener('submit', onSubmit);
}
