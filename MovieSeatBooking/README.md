# Movie Seat Booking

## 이벤트 버블링

처음 생각한 아이디어는 `seat`에 일일이 이벤트 리스너를 붙이지 말고 이벤트 버블링을 사용하는 것이었다. 즉 `container`에 이벤트 리스너를 붙여 `seat`을 클릭한 이벤트를 처리하는 것이다.<br />

이벤트 객체 `e`를 살펴보면 `path`라는 속성이 있는데, 이 속성은 이벤트가 확산하며 거쳐간 DOM 노드들을 배열로 나타낸다. `path[0]`을 통해 처음 이벤트가 발생한 노드를 가져올 수 있다.

```js
const onClickSeat = (e) => {
  const seat = e.path[0];
  if (!seat.classList.contains('seat')) {
    return;
  }
(...)
```

이렇게 가져온 `seat` 요소를 통해 위치를 가져와 저장하고, `classList`를 조작했다. <s>하지만 이렇게 하나의 이벤트 리스너로 퉁치려던게 오히려 코드 복잡도를 높인 것 같다.</s>&nbsp; **찾아보니 요소마다 이벤트 리스너를 붙이는 건 성능 저하를 가져올 수 있다고 한다. 이벤트 위임을 사용해서 구현하는게 정답인 듯!** [참고링크](https://velog.io/@dev-mish-mash/React%EC%97%90%EC%84%9C-%EC%9D%B4%EB%B2%A4%ED%8A%B8-%EC%9C%84%EC%9E%84%EC%9D%84-%ED%86%B5%ED%95%9C-%EC%9D%B4%EB%B2%A4%ED%8A%B8-%EB%A6%AC%EC%8A%A4%EB%84%88-%EC%B5%9C%EC%A0%81%ED%99%94) <br/>

솔루션에서는 `querySelectorAll`을 통해 모든 `seat`를 가져와 이벤트 리스너를 붙여준다. 이 방법이 더 직관적이긴 하다.

```js
const seats = document.querySelectorAll('.row .seat:not(.occupied)');
```

<br/><br/>

## string -> number 형변환

```js
const ticketPrice = +movieSelect.value;
```

단순히 `+`를 붙여주면 된다. Typescript 문법인 줄 알고있었는데 ..

<br/><br/>

## NodeList -> Array 변환

```js
// Array.from() 사용
Array.from(nodeList).map( ...  )

// 배열 구조분해 사용
[...nodeList].map( ... );
```

구조분해 하는 방법도 있다.

<br/><br/>

## Seat 인덱스 가져오기

```js
const seatsIndex = [...selectedSeats].map((seat) => [...seats].indexOf(seat));
```

NodeList를 구조분해해서 배열 메서드를 사용한 점이 인상적이다.

<br/><br/>

## populateUI()

솔루션은 데이터를 로컬스토리지로부터 가져와 채워주는 함수를 만들었다. 이렇게 기능으로 함수를 묶으니 더 직관적인듯?
