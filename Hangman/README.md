> 본문 : https://koesnij.vercel.app/til27-VanillaJS-hangman

# 과제 리뷰 👀

## setTimeout

같은 문자가 입력된 경우 하단에 알림창을 2초간 보여주고 숨겨야한다.

```jsx
const notifyDuplicateKey = () => {
  $notification_container.classList.add('show');
  setTimeout(() => {
    $notification_container.classList.remove('show');
  }, 2000);
};
```

- `show` 클래스를 추가하면 알림 창을 보여줄 수 있다.
- `setTimeout`을 사용해 `2000ms`가 지나고 `show` 클래스를 지워준다.

## SVG 스타일링

SVG도 다른 요소와 마찬가지로 `class`를 통해 스타일을 지정할 수 있다.

[class - SVG: Scalable Vector Graphics | MDN](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/class)

```css
.figure-container {
  fill: transparent;
  stroke: #fff;
  stroke-width: 4px;
  stroke-linecap: round;
}

.figure-part {
  display: none;
}
```

# 추가로 공부한 내용 🤩

## new Array()

새로운 `Array` 객체를 생성할 때 사용한다

### 주의할 점

이렇게 생성된 배열은 각 원소가 `empty`이다 ‼️

```jsx
const arr1 = new Array(3);
console.log(arr1); // [ <3 empty items> ]
```

`empty` 배열은 순회할 수 없다 : `forEach`, `map` ...

```jsx
arr1.forEach((a) => console.log(a)); //
arr1.map((a) => 'test'); // [ <3 empty items> ]
```

`null`이나 `undefined`와는 다르다

```jsx
const arr2 = new Array(3).fill(undefined);
console.log(arr2); // [ undefined, undefined, undefined ]
```

### Array.from({ length }) VS new Array(length)

[TIL22 | Brute-force : 소수 찾기](https://koesnij.vercel.app/til22-bruteforce-find-prime-number#888b4756bc0a4feb88656cc2a6e404cf)
