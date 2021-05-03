const API_URL = 'https://randomuser.me/api';
const fetcher = (url) => fetch(url).then((res) => res.json());

const AddUserBtn = document.getElementById('add-user');
const DoubleBtn = document.getElementById('double');
const ShowMillionairesBtn = document.getElementById('show-millionaires');
const SortBtn = document.getElementById('sort');
const CalculateWealthBtn = document.getElementById('calculate-wealth');
const Main = document.getElementById('main');

const initMain = () => {
  Main.innerHTML = '<h2><strong>Person</strong> Wealth</h2>';
};

const initEntireWealth = () => {
  const entire = document.getElementById('entire');
  if (entire) entire.remove();
};

const getRandomUser = async () => {
  const { results } = await fetcher(API_URL);
  const { name } = results[0];
  const wealth = Math.floor(Math.random() * 1000000);

  return [`${name.first} ${name.last}`, wealth];
};

const addUser = async () => {
  initEntireWealth();

  const [name, wealth] = await getRandomUser();

  const person = document.createElement('div');
  person.className = 'person';
  person.innerHTML = `<strong>${name}</strong>$${wealth}`;

  Main.appendChild(person);
};

const doubleMoney = () => {
  initEntireWealth();

  const people = document.querySelectorAll('.person');
  [...people].forEach((person) => {
    const [name, wealth] = person.innerHTML.split('$');
    person.innerHTML = [name, +wealth * 2].join('$');
  });
};

const showMillionaires = () => {
  const people = document.querySelectorAll('.person');
  initMain();
  [...people]
    .filter((person) => person.innerHTML.split('$')[1] >= 1000000)
    .forEach((person) => Main.appendChild(person));
};

const sort = () => {
  const people = document.querySelectorAll('.person');
  initMain();
  [...people]
    .sort((a, b) => +b.innerHTML.split('$')[1] - +a.innerHTML.split('$')[1])
    .forEach((person) => Main.appendChild(person));
};

const calculateWealth = () => {
  initEntireWealth();

  const people = document.querySelectorAll('.person');
  const sum =
    people.length > 1
      ? [...people]
          .map((person) => +person.innerHTML.split('$')[1])
          .reduce((a, b) => a + b)
      : 0;

  const entire = document.createElement('div');
  entire.id = 'entire';
  entire.innerHTML = `<h3>Total Wealth: <strong>$${sum}</strong>`;
  Main.appendChild(entire);
};

AddUserBtn.addEventListener('click', addUser);
DoubleBtn.addEventListener('click', doubleMoney);
ShowMillionairesBtn.addEventListener('click', showMillionaires);
SortBtn.addEventListener('click', sort);
CalculateWealthBtn.addEventListener('click', calculateWealth);
