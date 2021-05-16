> 본문 : https://koesnij.vercel.app/til27-VanillaJS--use-vanilla-js-like-react

<br><br>

# 프로젝트 명세

다음 링크의 동작을 모두 지원하면 된다: [https://vanillawebprojects.com/projects/meal-finder/](https://vanillawebprojects.com/projects/meal-finder/)

![](https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2Fb93089a2-1ef3-402a-bf07-395b42edd9bf%2Fezgif-3-1c876a008cd9.gif?table=block&id=5ea32aed-75f9-48a9-aff9-be33f0e1d00b&cache=v2)

- Connect to API and get meals
- Display meals in DOM with image
- Click on meal and see the details
- Click on generate button and fetch & display a random meal

**1. 음식 이름 입력 후, API를 사용해 `meals`를 가져와 출력해준다. 예시는 다음과 같다.**

```jsx
GET https://www.themealdb.com/api/json/v1/1/search.php?s=name
```

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/a571270d-301e-4c7a-9938-b7124d5dae76/_2021-05-13__4.54.20.png](https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2Fa571270d-301e-4c7a-9938-b7124d5dae76%2F_2021-05-13__4.54.20.png?table=block&id=30228347-d2f5-4f75-a16c-3bcb546986e2&cache=v2)

- 스타일은 `meal` 클래스로 지정되어있다.
- 자식으로 `img`, `div class="meal-info"`, `h3` 태그 등을 위처럼 추가해줘야 한다.

**2. `meals`에서 어떤 `meal`을 누르면 상세 페이지를 띄워준다.**

```jsx
GET https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}
```

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/e34ef3df-e9e8-456d-a66b-73f332516ffd/_2021-05-15__7.31.18.png](https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2Fe34ef3df-e9e8-456d-a66b-73f332516ffd%2F_2021-05-15__7.31.18.png?table=block&id=c026dfc0-38b2-4de5-99c9-db473ff1f253&cache=v2)

- 위 요소의 구조를 그대로 유지하면 된다.

**3. 랜덤 버튼을 누르면 2번처럼 상세 페이지를 띄워준다.**

```jsx
GET https://www.themealdb.com/api/json/v1/1/random.php
```

단, 기존 리스트는 보이면 안된다.

<br><br>

# 구현하기 🤓

## 프로젝트 폴더 구조

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/d0a66835-837d-4c42-a8f7-4bd8d8b066bc/_2021-05-15__9.05.36.png](https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2Fd0a66835-837d-4c42-a8f7-4bd8d8b066bc%2F_2021-05-15__9.05.36.png?table=block&id=bb04f2af-bf86-4934-98ff-70e82fc3773d&cache=v2)

프로젝트 폴더 구조

## 자바스크립트 모듈

컴포넌트 단위로 파일을 나눠서 구현하려면 웹팩과 같은 번들러를 사용하거나, 네이티브 모듈을 사용해야 한다.

[모듈 소개](https://ko.javascript.info/modules-intro)

샘플 `index.html`의 `script`를 다음과 같이 수정한다.

```jsx
<script src="src/index.js" type="module"></script>
```

- 자바스크립트 모듈은 **비동기로 지연 실행**되므로, `async`나 `defer` 없이 `head` 태그에 넣어도 문제 없다!
- 주의할 점은, 다른 모듈 import시 확장자(.js)를 꼭 적어야한다는 것이다.

## 컴포넌트 형태로 추상화

가급적 리액트와 유사하게 컴포넌트 형태로 추상화하여 구현하려고 했다. 이는 DOM 접근 부분을 최소화하고, 명령형 프로그래밍 방식보다는 선언적인 프로그래밍 방식으로 접근하는 것을 말한다.

예를 들어 Meal 데이터를 화면에 그리는 것을 명령형 프로그래밍 방식으로 하면 다음과 같다:

```jsx
function renderMeals(meals) {
  const $target = document.querySelector("#meals");
  meals.forEach(meal => {
    const $meal = document.createElement("div");
    (...)
    $target.appendChild($meal);
  });
}
```

이 코드도 크게 문제되지는 않지만, DOM에 접근하고 업데이트 하는 시점에 대한 명확한 기준점이 없어, 코드가 거대해지고 UI 업데이트가 많아지면 **어떤 지점에서 어느 시점에 DOM을 업데이트하는지** 추적하기 힘들어진다.

‘상태’를 기준으로 DOM을 업데이트하도록 바꿔서 이 문제를 해결해보자. 다음은 Meal 데이터를 **어떠한 상태를 기준으로 렌더링**하도록 하는 코드이다:

```jsx
// src/components/Meals.js

export default class Meals {
  constructor({ $target, initialState }) {
    this.$target = $target;
    this.state = {
      meals: initialState,
    };

    this.render();
  }

  setState(nextState) {
    this.state = nextState;
    this.render();
  }

  render() {
    this.$target.innerHTML = this.state.meals
      .map((meal) => {
        const { idMeal, strMeal, strMealThumb } = meal;
        return `
          <div class="meal">
            <img src="${strMealThumb}" alt="${strMeal}">
            <div class="meal-info" data-mealid="${idMeal}">
              <h3>${strMeal}</h3>
            </div>
          </div>
        `;
      })
      .join('');
  }
}
```

- `constructor` : `new` 키워드를 통해 해당 컴포넌트가 생성되는 시점에 실행된다. 해당 컴포넌트가 표현될 `$target`과 초기 상태를 파라미터로 받고, `render` 메서드를 호출한다.
- `render` : 해당 컴포넌트의 `state`를 기준으로 `$target`에 렌더링한다. 자신의 `state`만 기준으로 하므로 **별도의 파라미터를 받지 않아야 한다.** `innerHTML`에 넣는 템플릿문자열은 JSX를 사용하는 것과 조금 유사해 보인다.
- `setState` : 해당 컴포넌트의 `state`를 갱신한다. 갱신한 후 `render` 메서드를 부르면 업데이트된 상태를 화면에 반영할 수 있다.

이렇게 작성하면 실제 DOM을 직접 제어하는 부분을 '컴포넌트가 인스턴스화되는 시점', '`render`가 실행되는 시점' 으로 제한할 수 있다.

이렇게 만든 `Meals` 컴포넌트는 아래와 같이 사용할 수 있다:

```jsx
const $target = document.querySelector('#meals');
const initialState = { meals: [] };

const meals = new Meals({
  $target,
  initialState,
}

meals.setState({
  ...meals.state,
  meals: [ ... ],
});
```

- 리액트와 유사해보인다!

위와 같은 방식으로 `Meal` 상세 페이지는 다음과 같이 정의할 수 있다:

```jsx
// src/components/SingleMeal.js

export default class SingleMeal {
  constructor({ $target, initialState }) {
    this.$target = $target;
    this.state = {
      singleMeal: initialState,
    };

    this.render();
  }

  setState(nextState) {
    this.state = nextState;
    this.render();
  }

  render() {
    const meal = this.state.singleMeal;
    const ingredients = Object.keys(meal)
      .filter((key) => key.startsWith('strIngredient') && meal[key] !== '')
      .map((key, idx) => `${meal[key]} - ${meal[`strMeasure${idx + 1}`]}`);

    this.$target.innerHTML = `
        <div class="single-meal">
          <h1>${meal.strMeal}</h1>
          <img src="${meal.strMealThumb}" alt="${meal.strMeal}" >
          <div class="single-meal-info" >
            <p>${meal.strArea}</p>
            <p>${meal.strCategory}</p>
          </div>
          <div class="main">
            <p>${meal.strInstructions}</p>
            <h2>Ingredients</h2>
            <ul>
              ${ingredients
                .map(
                  (i) => `
                    <li>${i}</li>
                  `
                )
                .join('')}
            </ul>
          </div>
        </div>
      `;
  }
}
```

- `render` 메서드의 line 2는 특정 재료와 계량치를 매치시키는 작업이다.

마찬가지로 검색 창을 담당하는 검색 `Form`을 다음과 같이 정의한다:

```jsx
// src/components/Form.js

export default class Form {
  constructor({ $target, initialState }) {
    this.$target = $target;
    this.$input = $target.querySelector('input');
    this.$button = $target.querySelector('button');

    this.state = {
      value: initialState,
    };

    this.render();
  }

  setState(nextState) {
    this.state = nextState;
    this.render();
  }

  render() {
    this.$input.value = this.state.value;
  }
}
```

- `state`는 현재 `input`에 입력된 값을 갖는다. 리액트에서 `state`로 `input` 관리하는 걸 구현해보았다.

## 컴포넌트간 의존도 줄이기

요구사항 중에 UI 인터랙션에 따라서 state를 변경해야하는 부분이 요구사항에 있는데 대략 아래와 같다.

- Form에 검색어를 입력하면 Meal 리스트를 보여주기
- Meal 리스트 중 하나를 누르면 하단에 SingleMeal 상세 페이지 보여주기
- 랜덤 버튼을 누르면 기존 Meal 리스트를 지우고, SingleMeal 상세페이지 보여주기

결국 Meals나 Form 등 어떤 컴포넌트에서 일어나는 인터랙션은 다른 컴포넌트에도 영향을 주어야 한다.

Meals를 예로 들면, 만약 Meals 내에서 SingleMeal을 직접 다루거나 업데이트하도록 코드를 작성하면 Meals 컴포넌트를 독립적으로 사용할 수 없게 된다. SingleMeal에 의존성이 생기기 때문이다.

이런 경우 일반적으로 두 컴포넌트를 조율하는 상위의 컴포넌트를 만들고, 콜백 함수를 통해 느슨하게 결합한다. Meals에서 파라미터로 `onClick` 이벤트 핸들러를 받아서 붙여준다:

```jsx
// src/components/Meals.js

export default class Meals {
  constructor({ $target, initialState, onClick }) {
    this.$target = $target;
    this.state = {
      meals: initialState,
    };
    this.onClick = onClick;

    this.init();
    this.render();
  }

  init() {
    this.$target.onclick = this.onClick;
  }

  setState(nextState) {
    this.state = nextState;
    this.render();
  }

  render() {
    (...)
  }
}
```

- 이때 `onClick` 이벤트 핸들러는 각 요소에 붙이지 않고 이벤트 위임을 사용하도록 한다. 따라서 부모 요소인 `$target`에 붙여준다.

이제 Meals를 상위에서 조율하기 위한 `App` 컴포넌트를 작성한다:

```jsx
// src/components/App.js

import Meals from './Meals.js';
import SingleMeal from './SingleMeal.js';
import Form from './Form.js';

export default class App {
  constructor($app) {
    this.state = {
      meals: [],
      singleMeal: {},
    };

    (...)

    this.meals = new Meals({
      $target: $app.querySelector('#meals'),
      initialState: this.state.meals,
      onClick: async (e) => {
        // Event Delegation
        const id = e.path
          .find((el) => el.className == 'meal-info')
          .getAttribute('data-mealid');

        const singleMeal = FETCHDATA(); // api

        this.setState({
          ...this.state,
          singleMeal,
        });
      },
    });

    this.singleMeal = new SingleMeal({
      $target: $app.querySelector('#single-meal'),
      initialState: this.state.singleMeal,
    });
  }

  setState(nextState) {
    this.state = nextState;

    this.meals.setState({
      ...this.meals.state,
      meals: this.state.meals,
    });
    this.singleMeal.setState({
      ...this.singleMeal.state,
      singleMeal: this.state.singleMeal,
    });
  }
}
```

- `onClick` 이벤트 핸들러를 `App`에서 정의해서 파라미터로 넘겨주면, Meals 내에선 클릭시 어떤 로직이 일어날 지 알 필요가 없어진다. 이제 state를 `App`에서 관리할 수 있고, SingleMeal 관련 처리가 가능해진다.
- `App`에서 `state`를 변경하면 하위 컴포넌트의 `state`에도 반영해준다.
- 이렇게 하면 `App`이 두 컴포넌트(Meals, SingleMeal)를 조율하는 형태가 되며, 각각 독립적으로 동작하고 또 다른 곳에 쉽게 재활용할 수 있는 구조가 된다.
- Form 컴포넌트도 동일하게 이벤트 핸들러를 넘겨받는 형태로 수정한다.

`App` 컴포넌트는 `index.js`를 통해 아래처럼 생성하여 사용한다:

```jsx
// src/index.js

import App from './components/App.js';
new App(document.querySelector('.container'));
```

## 데이터 가져오기

컴포넌트 구조를 잡았으니 실제로 데이터를 불러오는 처리를 해보자.

API는 총 3가지가 있다.

```jsx
const API_URL = 'https://www.themealdb.com/api/json/v1/1/';
```

- 검색어 `name`에 해당하는 meals 모두 가져오기 `API_URL/search.php?s=${name}`
- 랜덤 meal 가져오기 `API_URL/random.php`
- `id`를 이용해 meal 하나 가져오기 `API_URL/lookup.php?i=${id}`

`fetch` Web API를 사용하며, API 호출 부분을 다음과 같이 모듈로 분리했다.

```jsx
// src/lib/api.js

export const API_URL = 'https://www.themealdb.com/api/json/v1/1/';

export const fetcher = async (URL) => {
  try {
    const response = await fetch(URL);
    if (!response.ok) throw new Error('서버 상태가 이상합니다!');

    return await response.json();
  } catch (error) {
    throw new Error(`무언가 잘못 되었습니다! ${error.message}`);
  }
};

export const searchMealsByName = async (name) =>
  fetcher(API_URL + `search.php?s=${name}`);

export const getMealById = async (id) =>
  fetcher(API_URL + `lookup.php?i=${id}`);

export const getRandomMeal = async (id) => fetcher(API_URL + 'random.php');
```

- `fetch`로 부터 반환되는 Promise 객체는 HTTP 에러 상태를 reject 하지 않기 때문에, 요청 중 에러가 발생해도 `catch`로 넘어가지 않는다. 따라서 `!response.ok`를 체크해야 한다. [MDN Fetch API](https://developer.mozilla.org/ko/docs/Web/API/Fetch_API)
- 컴포넌트에서는 `searchMealsByName`, `getMealById` 등 별도 유틸리티 함수로 사용하면 된다.

## App에서 데이터를 불러오기

```jsx
// src/components/App.js

import Meals from './Meals.js';
import SingleMeal from './SingleMeal.js';
import Form from './Form.js';
import { getMealById, getRandomMeal, searchMealsByName } from '../lib/api.js';

export default class App {
  constructor($app) {
    this.$resultHeading = $app.querySelector('#result-heading');
    this.$random = $app.querySelector('#random');

    this.state = {
      resultHeading: '',
      form: '',
      meals: [],
      singleMeal: {},
    };

    this.form = new Form({
      $target: $app.querySelector('#submit'),
      initialState: this.state.form,
      onSubmit: async (e) => {
        e.preventDefault();
        const { meals } = await searchMealsByName(this.state.form);
        this.setState({
          ...this.state,
          resultHeading: this.state.form,
          meals,
          singleMeal: {},
        });
      },
      onChange: (e) => {
        this.setState({
          ...this.state,
          form: e.target.value,
        });
      },
    });

    this.meals = new Meals({
      $target: $app.querySelector('#meals'),
      initialState: this.state.meals,
      onClick: async (e) => {
        const id = e.path
          .find((el) => el.className == 'meal-info')
          .getAttribute('data-mealid');

        const {
          meals: [singleMeal],
        } = await getMealById(id);
        this.setState({
          ...this.state,
          singleMeal,
        });
      },
    });

    this.singleMeal = new SingleMeal({
      $target: $app.querySelector('#single-meal'),
      initialState: this.state.singleMeal,
    });

    this.init();
  }

  init() {
    this.$random.onclick = async () => {
      try {
        const {
          meals: [singleMeal],
        } = await getRandomMeal();
        this.setState({
          ...this.state,
          form: '',
          meals: [],
          singleMeal,
        });
      } catch (error) {
        console.log(error);
      }
    };
  }

  setState(nextState) {
    this.state = nextState;

    this.form.setState({
      ...this.form.state,
      value: this.state.form,
    });
    this.meals.setState({
      ...this.meals.state,
      meals: this.state.meals,
    });
    this.singleMeal.setState({
      ...this.singleMeal.state,
      singleMeal: this.state.singleMeal,
    });

    this.render();
  }

  render() {
    this.$resultHeading.innerHTML =
      this.state.resultHeading &&
      `<h2>Search results for '${this.state.resultHeading}':</h2>`;
  }
}
```

- 랜덤 버튼과 Result Heading은 별도로 컴포넌트를 만들지 않고 App에서 관리하게 했다.
- 랜덤 버튼 클릭시, Meal 클릭시, 검색시 데이터를 `fetch` 한다. 이벤트 발생시 데이터를 `fetch` 해야 하므로, 이벤트 핸들러에서 처리한다. 가져온 데이터는 `setState` 메서드를 통해 `this.state`에 저장하고, 하위 컴포넌트의 `state`에도 전달해준다.

전체 소스 코드 : [https://github.com/koesnij/vanillajs-web-projects/tree/master/MealFinder](https://github.com/koesnij/vanillajs-web-projects/tree/master/MealFinder)

<br><br>

# 추가로 정리한 내용 🧐

## 이벤트위임

`meal` 클릭 이벤트를 부모 요소에서 관리하는데, 하나 문제는 `meal`이 여러 요소가 중첩된 형태라 클릭 이벤트가 발생한 요소가 달라질 수 있었다. 즉 `e.target`을 사용할 수 없다.

대신 이벤트 객체의 `path`를 검사하여, 그 `path` 중 `meal-info`를 가진 요소를 `find` 통해 가져올 수 있다.

```jsx
const id = path
  .find((el) => el.className === 'meal-info')
  .getAttribute('data-mealid');
```

## dataset

dataset을 통해 `data-` 로 시작하는 attribute를 꺼내올 수 있다.

```jsx
const { mealid: id } = e.target.dataset;
```

<br><br>

# 추가 기능 구현하기 🤩

## 캐싱

```jsx
// src/lib/api.js

const _cache = {
  meals: {},
  singleMeal: {},
};

(...)

export const searchMealsByName = async (name) => {
  if (!_cache.meals[name]) {
    const { meals } = await fetcher(API_URL + `search.php?s=${name}`);
    _cache.meals[name] = meals || [];
  }

  return _cache.meals[name];
};

export const getMealById = async (id) => {
  if (!_cache.singleMeal[id]) {
    const {
      meals: [singleMeal],
    } = await fetcher(API_URL + `lookup.php?i=${id}`);
    _cache.singleMeal[id] = singleMeal;
  }

  return _cache.singleMeal[id];
};
```

- 한번 불러온 데이터는 api.js 모듈에서 변수 `_cache`에 저장한다.
- 다시 같은 데이터를 요청하면 네트워크 요청을 건너뛰고 캐시된 데이터를 불러온다.

## 로딩 표시하기

API 요청 간에 로딩을 표시해보자. 로딩 애니메이션 SVG는 [여기](https://codepen.io/nikhil8krishnan/pen/rVoXJa)에서 가져왔다.

다음은 HTML, CSS를 적용한 모습이다.

```jsx
// index.html
<div class="container">
  <div id="loading" class="loading">
    <svg ...>
      (...)
    </svg>
  </div>
</div>

// src/css/style.css
.loading {
  position: fixed;
  top: 0;
  right: 0;
  visibility: hidden;
}

.loading svg {
  width: 100px;
  height: 100px;
  display: inline-block;
}
```

로딩 상태는 App.js에서 관리한다.

```jsx
// src/components/App.js

export default class App {
  constructor($app) {
    // 1
    this.$loading = $app.querySelector('#loading');

    this.state = {

      (...)

      loading: false,
    };

    (...)

    this.meals = new Meals({
      // 2
      onClick: async (e) => {
        const id = e.path
          .find((el) => el.className == 'meal-info')
          .getAttribute('data-mealid');

        this.setState({
          ...this.state,
          loading: true,
        });

        const singleMeal = await getMealById(id);

        this.setState({
          ...this.state,
          loading: false,
          singleMeal,
        });
      },

      (...)
    });
  }

  render() {
    // 3
    this.$loading.style.visibility = this.state.loading ? 'visible' : 'hidden';

    (...)
  }
}
```

1. 생성자에서 `loading` 요소를 가져온다. `state`는 `false`로 초기화한다.
2. API 요청이 있는 함수에서 비동기 실행 사이에 `loading` 상태를 바꿔준다.
3. 렌더링 함수에서 `state`를 기준으로 `visibility`를 수정해준다.

## 렌더링 최적화

다음은 App.js의 `setState` 메서드인데, 한 컴포넌트의 `state`만 바뀌어도 모든 컴포넌트를 다시 렌더링한다.

```jsx
// src/components/App.js

setState(nextState) {
  if (typeof nextState === 'function') {
    this.state = nextState(this.state);
  } else {
    this.state = nextState;
  }
  this.form.setState({
    ...this.form.state,
    value: this.state.form,
  });
  this.meals.setState({
    ...this.meals.state,
    meals: this.state.meals,
  });
  this.singleMeal.setState({
    ...this.singleMeal.state,
    singleMeal: this.state.singleMeal,
  });

  this.render();
}
```

리액트의 `shouldComponentUpdate`와 유사하게 구현해보았다.

```jsx
// src/components/Meals.js

shouldComponentUpdate(nextState) {
  if (this.state.meals !== nextState.meals) return true;
  return false;
}

setState(nextState) {
  if (this.shouldComponentUpdate(nextState)) {
    this.state = nextState;
    this.render();
  }
  this.state = nextState;
}
```

- `shouldComponentUpdate`에서 `state`를 검사하여 변화가 없으면 `false`를 리턴한다.

<br><br>

# 느낀점

간단한 문제를 컴포넌트 형태로 분리하고, 애플리케이션의 상태를 추상화하고, 그 상태를 기반으로 렌더링하는 코드를 작성해보았다. 최근 많이 사용되는 React와 유사한 방식을 Vanilla JS를 통해 구현해보면서 리액트에 대한 이해를 키울 수 있었던 기회였다.

<br><br>

## Reference

['2021 Dev-Matching: 웹 프론트엔드 개발자(상반기)' 기출 문제 해설](https://prgms.tistory.com/53)

[모듈 소개](https://ko.javascript.info/modules-intro)
