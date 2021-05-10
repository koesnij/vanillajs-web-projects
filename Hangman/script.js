const $ = (id) => document.getElementById(id);

const $word = $('word');
const $popup_container = $('popup-container');
const $final_message = $('final-message');
const $notification_container = $('notification-container');
const $wrong_letters = $('wrong-letters');
const $play_button = $('play-button');

const figureParts = document.querySelectorAll('.figure-part');

let answer = [];
let wrongLetters = [];
let correctLetters = [];

const getRandomWord = () => {
  const words = ['application', 'programming', 'interface', 'wizard'];
  return words[Math.floor(Math.random() * words.length)];
};

const notifyDuplicateKey = () => {
  $notification_container.classList.add('show');
  setTimeout(() => {
    $notification_container.classList.remove('show');
  }, 2000);
};

const onCorrect = (key) => {
  if (correctLetters.includes(key)) {
    notifyDuplicateKey();
    return;
  }

  answer.forEach((l, idx) => {
    if (l === key) correctLetters[idx] = l;
  });
  updateCorrectLetters();

  if (correctLetters.every((l) => l !== '')) {
    onGameEnd(true);
  }
};

const onWrong = (key) => {
  if (wrongLetters.includes(key)) {
    notifyDuplicateKey();
    return;
  }

  figureParts[wrongLetters.length].style.display = 'block';
  wrongLetters.push(key);
  updateWrongLetters();

  if (wrongLetters.length === 6) {
    onGameEnd(false);
  }
};

const onKeyPress = ({ key }) => {
  if (key < 'a' || key > 'z') return;

  if (!answer.includes(key)) {
    onWrong(key);
  } else {
    onCorrect(key);
  }
};

const updateWrongLetters = () => {
  $wrong_letters.innerHTML =
    '<p>Wrong</p>' + wrongLetters.map((l) => `<span>${l}</span>`).join(',');
};

const updateCorrectLetters = () => {
  $word.innerHTML = '';
  correctLetters.forEach((l) => {
    const $letter = document.createElement('span');
    $letter.className = 'letter';
    $letter.textContent = l;
    $word.appendChild($letter);
  });
};

const init = () => {
  // Init Variables
  answer = [...getRandomWord()];
  wrongLetters = [];
  correctLetters = new Array(answer.length).fill('');

  updateCorrectLetters();

  // Add Event Listener
  document.addEventListener('keypress', onKeyPress);
};

const onGameEnd = (isWon) => {
  $final_message.textContent = isWon
    ? 'Congratulations! You won! 😃'
    : 'Unfortunately you lost. 😕';
  $popup_container.style.display = 'flex';
  document.removeEventListener('keypress', onKeyPress);
};

const resetGame = () => {
  init();

  // Clean UI
  updateWrongLetters();
  $popup_container.style.display = 'none';
  figureParts.forEach((part) => (part.style.display = ''));
};

// Add Event Listener
$play_button.addEventListener('click', resetGame);

init();
