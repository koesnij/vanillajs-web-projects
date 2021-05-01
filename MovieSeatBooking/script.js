'use strict';

const getItem = (key, parse = false) => {
  const value = localStorage.getItem(key);
  if (parse) {
    return JSON.parse(value) || [];
  }
  return value;
};

const setItem = (key, value, stringify = false) => {
  if (stringify) {
    localStorage.setItem(key, JSON.stringify(value));
  } else {
    localStorage.setItem(key, value);
  }
};

const getSeatPos = (seat) => {
  const rowNode = seat.parentNode;
  const container = rowNode.parentNode;

  let row = 0,
    col = 0;
  Array.from(container.childNodes).some((node) => {
    if (node.className === 'row') {
      row++;
    }
    return node === rowNode;
  });

  Array.from(rowNode.childNodes).some((node) => {
    if (node.classList && node.classList.contains('seat')) {
      col++;
    }
    return node === seat;
  });

  return { row, col };
};

const getSeatElementByPos = ({ row, col }) => {
  const rows = container.querySelectorAll('.row');
  return rows[row - 1].querySelectorAll('.seat')[col - 1];
};

const saveSeatIndex = ({ row, col }, remove = false) => {
  let array = getItem('seats', true);

  if (remove) {
    const pos = array.findIndex((e) => e.row === row && e.col === col);
    array.splice(pos, 1);
  } else {
    array = [...array, { row, col }];
  }
  setItem('seats', array, true);
};

const updateTotalPrice = () => {
  total.innerText = parseInt(count.innerText) * movie.value;
};

const onClickSeat = (e) => {
  const seat = e.path[0];
  if (!seat.classList.contains('seat')) {
    return;
  }
  if (seat.classList.contains('occupied')) {
    return;
  }

  const seatPos = getSeatPos(seat);
  if (seat.classList.toggle('selected')) {
    console.log(count.innerText);
    count.innerText = parseInt(count.innerText) + 1;
    saveSeatIndex(seatPos);
  } else {
    count.innerText = parseInt(count.innerText) - 1;
    saveSeatIndex(seatPos, true);
  }
  setItem('count', count.innerText);

  updateTotalPrice();
};

const onChangeMovie = () => {
  setItem('movie', movie.value);

  updateTotalPrice();
};

const container = document.querySelector('.container');
container.addEventListener('click', onClickSeat);

const movie = document.getElementById('movie');
movie.value = getItem('movie') || 10;
movie.addEventListener('change', onChangeMovie);

const count = document.getElementById('count');
count.innerText = getItem('count') || 0;

const total = document.getElementById('total');

const seats = getItem('seats', true);
seats.forEach((seat) => {
  const element = getSeatElementByPos(seat);
  element.classList.add('selected');
});

updateTotalPrice();

const clear = document.getElementById('clear');
clear.addEventListener('click', () => {
  localStorage.clear();
  location.reload();
});
