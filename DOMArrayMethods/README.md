> 본문 : https://koesnij.vercel.app/til21-VanillaJS-DOMArrayMethods-feat-ES6-class

<br><br>

# 과제 리뷰

배열 고차 함수(Higher-Order Function)와 DOM 조작을 다뤄보는 실습

## API_URL과 fetcher

코드 최상단에 정의해놓고 사용한다

```jsx
const API_URL = 'https://randomuser.me/api';
const fetcher = (url) => fetch(url).then((res) => res.json());
```

## Element 추가

[Document.createElement()](https://developer.mozilla.org/ko/docs/Web/API/Document/createElement)

`Add User` 버튼을 누르면 API로부터 랜덤 사용자를 받아와 리스트에 추가해주어야 한다. 이때 DOM을 이용하여 요소를 생성하고, `className`을 지정하고, 데이터를 넣어주었다.

```jsx
const [name, wealth] = await getRandomUser();

const person = document.createElement('div');
person.className = 'person';
person.innerHTML = `<strong>${name}</strong>$${wealth}`;

main.appendChild(person); // add
```

그 후 추가할 리스트에 `appendChild(element)`해주면 된다.

## 이벤트 위임 (Event Delegation)

이벤트 리스너를 `document`에서 관리하도록 했다.

```jsx
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
```

## ES6 class

이번에는 class 문법을 사용해서 구현해보았다.

### class MainList

리스트를 관리하는 클래스

```jsx
class MainList {
  constructor($target) {
    // 1
    this.$target = $target;
    this.items = [];
    this.totalWealth = {
      element: document.createElement('div'),
      value: -1,
    };

    // 2
    this.addUser = this.addUser.bind(this);
    this.doubleMoney = this.doubleMoney.bind(this);
    this.showMillionaires = this.showMillionaires.bind(this);
    this.sort = this.sort.bind(this);
    this.calculateWealth = this.calculateWealth.bind(this);

    // 3
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
    // 1
    const data = await this._getRandomUser();

    // 2
    this.items.push(new Person({ $target: this.$target, data }));

    // 3
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
    // 1
    this.$target.innerHTML = '<h2><strong>Person</strong> Wealth</h2>';

    // 2
    this.items.forEach((item) => this.$target.appendChild(item.element));
    if (this.totalWealth.value !== -1) {
      this.totalWealth.element.innerHTML = `<h3>Total Wealth: <strong>$${this.totalWealth.value}</strong>`;
      this.$target.appendChild(this.totalWealth.element);
    }
  }
}
```

**constructor**

```jsx
const main = new MainList(document.getElementById('main'));
```

1. 인자로 Element 객체를 전달받고, 클래스 필드를 초기화한다.
2. 메소드에 자기 자신을 바인딩해준다. 자바스크립트에서 함수를 호출할 때는 암묵적으로 `arguments` 객체 및 `this` 변수가 함수 내부로 전달된다. 바인딩하지 않으면 이벤트 리스너의 콜백이 호출될 때 `this`는 달라지므로 현재 객체와의 연결이 끊어지게 된다. — 화살표 함수를 사용하면 `this`가 항상 상위 스코프를 가리키므로 생성자에서 바인딩하지 않아도 된다. 이 부분은 class 문법을 정리하면서 다뤄보려고 한다.
   `_init`과 `_getRandomUser`은 `private`으로, 객체 내에서만 사용되므로 따로 바인딩하지 않았다.
3. 그 외 처음 실행할 함수를 호출해준다.

**addUser**

1. `_getRandomUser`를 통해 정보를 받아온다.
2. 받아온 정보를 통해 `Person` 객체를 생성하고, 필드 `items`에 넣어 관리한다.
3. `calculate-wealth` 요소와 겹치는 걸 방지하기 위해 `remove` 해준다.

**doubleMoney / showMillonaires / sort / calculateWealth**

- `forEach`, `filter`, `map`, `reduce` 등을 사용해서 필드 `items`를 업데이트한다.
- `doubleMoney`의 경우 `Person` 객체 자체적으로 다시 렌더링하므로 `this.render`를 호출하지 않는다.

**render**

1. 리스트를 초기화한다.
2. `items` 필드를 순회하며 `$target`에 노드에 다시 붙여준다.

### class Person

우측 리스트의 각 요소 row에 해당하는 클래스이다.

```jsx
class Person {
  constructor({ $target, data }) {
    // 1
    [this.name, this.wealth] = [data[0], +data[1]];
    this.element = document.createElement('div');
    this.element.className = 'person';

    // 2
    this.doubleMoney = this.doubleMoney.bind(this);

    // 3
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
```

**constructor**

1. 클래스 필드를 초기화한다. `$target`은 부모 Element(`#main`)를 참조한다. 연결될 노드를 생성하고, CSS className을 넣어준다.
2. 메소드에 자기 자신을 바인딩한다.
3. 렌더링한다. 부모 객체에 자기 노드를 붙이고, `this.render`를 호출한다.

**doubleMoney**

- 필드 `wealth`에 2를 곱해준다. 그리고 자체적으로 다시 렌더링한다.

**render**

- 자신의 `name`, `wealth`를 가져와 업데이트해준다.

# 배운 점 🤓

## formatMoney()

money 형식에 맞춰주는 함수

```jsx
function formatMoney(number) {
  return '$' + number.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}
```

## appendChild()

이미 추가되어 있는 요소를 `appendChild` 한다면? 복제되지 않는다. 즉,

```jsx
const parent = document.getElementById('parent');

const child = document.createElement('div');

parent.appendChild(child);
parent.appendChild(child);
```

이렇게 작성해도 `child`는 DOM 상에 하나만 존재한다.

⇒ 프로젝트 `sort` 기능에서 요소를 새로 생성하는게 아니므로 기존 리스트를 지울 필요 없다. 그냥 `appendChild`하면 중복되지 않고 정렬된 순서로 바뀌어서 들어간다.

[Node.appendChild()](https://developer.mozilla.org/ko/docs/Web/API/Node/appendChild)

_만약 주어진 노드가 이미 문서에 존재하는 노드를 참조하고 있다면 appendChild() 메소드는 노드를 현재 위치에서 새로운 위치로 이동시킵니다._

## res.json()

한번 `json()`한 res를 다시 `json()`하면 어떻게 될까? 🧐

[javascript fetch - Failed to execute 'json' on 'Response': body stream is locked](https://stackoverflow.com/questions/53511974/javascript-fetch-failed-to-execute-json-on-response-body-stream-is-locked)

`Response`의 메서드 `json`이나 `text`는 단 한 번만 호출할 수 있고, 사용하면 lock된다.

# 추가로 공부한 내용 🤩

## 고차 함수(Higher-Order Function)

[Higher order function | PoiemaWeb](https://poiemaweb.com/js-array-higher-order-function)

고차 함수란 함수를 인자로 전달받거나 함수를 결과로 반환하는 함수를 말한다. 고차 함수는 인자로 받은 함수를 필요한 시점에 호출하거나 클로저를 생성하여 반환한다. 자바스크립트에서 함수는 일급 객체이므로 값처럼 인자로 전달할 수 있으며 반환할 수도 있다. ⇒ 다음에 함수를 중심으로 공부해봐야겠다.

## Array.prototype.reduce()

[Array.prototype.reduce()](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce)

```jsx
arr.reduce(callback[, initialValue])
```

### callback

배열의 각 요소에 대해 실행할 함수

```jsx
(accumulator, currentValue, currentIndex?, array?) => {}; // ?은 optional
```

- `accumulator` : 콜백의 반환값을 누적한다. **콜백의 이전 반환값** 또는, 콜백의 첫 번째 호출이면서 `initialValue`를 제공한 경우에는 `initialValue`의 값이다.
- `currentValue` : 처리할 현재 요소
- `currentIndex` : 처리할 현재 요소의 인덱스. `initialValue`가 있을 경우 0, 아니면 1부터 시작한다.
- `array` : `reduce()`를 호출한 배열

### 예제

```jsx
   this.items = [
     { name: "a", wealth: 123 },
     { name: "b", wealth: 456 },
     { name: "c", wealth: 789 },
   ]

1  this.items.map((item) => item.wealth).reduce((a, b) => a + b) // O
2  this.items.reduce((a, b) => a + b.wealth) // X => "[object Object]123456789"
3  this.items.reduce((a, b) => a + b.wealth, 0) // O
```

1.  `map`을 실행하면 `wealth`로만 이루어진 number 배열이 반환되고, 그 배열에서 `reduce()`를 호출한다.
2.  객체 배열에서 바로 `reduce()`를 호출한다. 이때 에러는 안 나고 이상한 값이 들어가버리는데, `initialValue`를 지정하지 않았기 때문이다. `initialValue`가 없으면 배열의 첫 번째 요소를 사용하므로 객체 배열일 때는 반드시 설정해주어야 한다.
3.  2번 방법으로 할 때의 올바른 사용법이다.

## 왜 res.json()은 한 번만 사용할 수 있을까? 🧐

[Question - Why can I not read the stream again ? · Issue #196 · whatwg/fetch](https://github.com/whatwg/fetch/issues/196)

- Fetch와 Streams API는 효율적인 데이터 처리를 위해 설계되었고, `json()`을 호출하면 응답 객체의 데이터가 점진적으로 소비되므로 중간 객체의 버퍼링을 작게 유지할 수 있다.
- `Response` 객체를 다시 사용하려면 `clone()`을 통해 복제할 수 있다.

## 식별자에 달러($)를 붙이는 이유

[Why would a JavaScript variable start with a dollar sign?](https://stackoverflow.com/questions/205853/why-would-a-javascript-variable-start-with-a-dollar-sign/48558883)

요소를 참조하는 변수 식별자에 `$`(dollar sign)을 붙이는 걸 본 적 있어서 따라해봤다. 어떤 이유가 있거나 정해진 규칙인가 싶어 검색해봤는데 명확한 이유는 없는 것 같다. 특정 의미를 갖지는 않고 PHP나 Perl에서 온 습관이라는 게 주된 의견이다. 단, jQuery에서 쓰이는 `$` 처럼 다른 라이브러리 혹은 프레임워크에서는 특정 의미를 가질 수 있다.

[What's In a Name? Understanding $ and \_ in JavaScript](https://www.thoughtco.com/and-in-javascript-2037515)

이 링크는 찾던 내용이랑은 조금 다른데, `$`와 `_`의 관례에 대해 설명한다.

- `$` 식별자를 `document.getElementById()`의 바로가기 처럼 사용할 수 있다.
  `const $ = x => document.getElementById(x)`
- `_` 식별자는 주로 `private` 필드나 메소드 앞에 붙여준다. JavaScript 자체에 의해 구분되는 건 아니지만 프로그래머가 인식할 수 있도록 도와준다.
