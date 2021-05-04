const API_URL = 'https://randomuser.me/api';
const fetcher = (url) => fetch(url).then((res) => res.json());

class Person {
  constructor({ $target, data }) {
    [this.name, this.wealth] = [data[0], +data[1]];
    this.element = document.createElement('div');
    this.element.className = 'person';

    this.doubleMoney = this.doubleMoney.bind(this);

    $target.appendChild(this.element);
    this.render();
  }

  doubleMoney() {
    this.wealth = this.wealth * 2;
    this.render();
  }

  render() {
    this.element.innerHTML = `<strong>${this.name}</strong> $${this.wealth}`;
  }
}

class MainList {
  constructor($target) {
    this.$target = $target;
    this.items = [];
    this.totalWealth = {
      element: document.createElement('div'),
      value: -1,
    };

    // 함수가 호출 시점의 this를 참고하므로 연결이 끊어지게 된다.
    // 이벤트 리스너의 this를 참조함.
    // 화살표함수를 사용해도 되지만...
    this.addUser = this.addUser.bind(this);
    this.doubleMoney = this.doubleMoney.bind(this);
    this.showMillionaires = this.showMillionaires.bind(this);
    this.sort = this.sort.bind(this);
    this.calculateWealth = this.calculateWealth.bind(this);

    this._init();
  }

  _init() {
    this.addUser();
    this.addUser();
    this.addUser();
  }

  async _getRandomUser() {
    const { results } = await fetcher(API_URL);
    const { name } = results[0];
    const wealth = Math.floor(Math.random() * 1000000);
    return [`${name.first} ${name.last}`, wealth];
  }

  async addUser() {
    const data = await this._getRandomUser();
    this.items.push(new Person({ $target: this.$target, data }));
    this.totalWealth.element.remove();
  }

  doubleMoney() {
    this.items.forEach((item) => item.doubleMoney());
    this.totalWealth.element.remove();
  }

  showMillionaires() {
    this.items = this.items.filter((item) => item.wealth >= 1000000);
    this.totalWealth.value = -1;
    this.render();
  }

  sort() {
    this.items.sort((a, b) => b.wealth - a.wealth);
    this.totalWealth.value = -1;
    this.render();
  }

  calculateWealth() {
    this.totalWealth = {
      ...this.totalWealth,
      value: this.items.map((item) => item.wealth).reduce((a, b) => a + b),
    };
    this.render();
  }

  render() {
    this.$target.innerHTML = '<h2><strong>Person</strong> Wealth</h2>';
    this.items.forEach((item) => this.$target.appendChild(item.element));
    if (this.totalWealth.value !== -1) {
      this.totalWealth.element.innerHTML = `<h3>Total Wealth: <strong>$${this.totalWealth.value}</strong>`;
      this.$target.appendChild(this.totalWealth.element);
    }
  }
}

const main = new MainList(document.getElementById('main'));

document.addEventListener('click', (e) => {
  switch (e.target.id) {
    case 'add-user':
      main.addUser();
      break;
    case 'double':
      main.doubleMoney();
      break;
    case 'show-millionaires':
      main.showMillionaires();
      break;
    case 'sort':
      main.sort();
      break;
    case 'calculate-wealth':
      main.calculateWealth();
      break;
    default:
  }
});
