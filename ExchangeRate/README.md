# Exchange Rate

## 코드리뷰

### 재사용하기 쉬운 fetcher

이렇게 만들어놓고 사용하니 편리하다.

```js
const fetcher = (url) => fetch(url).then((res) => res.json());
```

### API 사용

https://api.exchangerate-api.com 에서 발급받은 `KEY`와 `URL`을 따로 상수로 선언해 사용한다.

```js
const API_KEY = 'APIKEY_APIKEY_APIKEY_APIKEY_APIKEY_APIKEY';
const API_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/`;

    (...)

const { result, conversion_rates } = await fetcher(API_URL + from);
```

### 클로저를 사용하여 기존 환율 캐싱하기

환율 정보를 불러오는 것은 API를 통한 네트워크 요청이기 때문에, 호출할 때마다 지연이 발생한다.

API에게 예를 들어 원화(KRW)에 대한 환율을 요청하면, 원화에서 다른 모든 화폐로의 환전 비율을 알려준다. 즉, 원화 환율 요청에 대한 응답에는 '원화 -> 달러(USD)로의 환전 비율'도 있고 '원화 -> 엔화(JPY)로의 비율'도 있다. 이때 원화를 '출발 화폐'라고 한다면, 출발 화폐가 바뀌지 않는 한 다른 화폐로의 환전을 위해 새로 환율을 받아올 필요가 없는 것이다.

또한 금액을 변경하면 바로바로 환전 금액을 알려줘야 하는데, 금액이 변경될 때마다 API 요청을 보낸다면 지연이 발생하게 될 것이다. 이러한 점에서 환율 정보를 캐싱할 필요를 느꼈다.

처음 불러온 환율 정보를 다음과 같이 클로저를 사용해서 저장하려고 한다.

```js
const getExchangeRate = (() => {
  let _rates = {
    FROM: '',
  };

  return async (from) => {
    if (_rates['FROM'] !== from) {
      const { result, conversion_rates } = await fetcher(API_URL + from);
      if (result === 'error') {
        throw new Error();
      }
      _rates = {
        ...conversion_rates,
        FROM: from,
      };
    }
    return _rates;
  };
})();
```

- 이때 즉시 실행 함수가 반환한 함수는 자신이 생성됐을 때의 렉시컬 환경(Lexical environment)에 속한 변수 `_rates`를 기억하는 클로저다. 이때 환율 정보를 저장하는 클로저 말고는 외부에서 `_rates`에 접근할 방법이 없다.
- `_rates`에는 출발 화페를 `FROM`이라는 key에 저장하고, API 요청이 발생했을 때 `FROM`과 같은 요청이라면 요청을 생략하고 기존의 `_rates`를 반환하도록 했다.
- 만약 `FROM`과 다른 요청이라면 `FROM`을 업데이트하고 새로운 환율 정보를 저장하도록 했다.

<br>

## 고칠 점

명세를 잘못 파악해서 `swap`이 출발화폐 <-> 도착화폐 교체를 의미하는지 놓쳤다. 이 부분은 다음과 같이 구현할 수 있다.

```js
[currencyOne.value, currencyTwo.value] = [currencyTwo.value, currencyOne.value];
```
