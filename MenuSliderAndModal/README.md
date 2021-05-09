> 본문 : https://koesnij.vercel.app/

<br><br>

# 과제 리뷰

좌측 메뉴 슬라이더와 모달 창을 다뤄보는 실습. 이전 과제들보다 CSS 부분이 중요했다.

익숙하지 않은 `transform`과 `transition`을 이번 기회에 사용해 볼 수 있었다.

## 좌측 메뉴 슬라이더

### CSS

```css
body {
  transition: transform 0.3s ease;
}

body.show-nav {
  transform: translateX(200px);
}

nav {
  background-color: var(--primary-color);
  border-right: 2px solid rgba(200, 200, 200, 0.1);
  color: #fff;
  position: fixed;
  top: 0;
  left: 0;
  width: 200px;
  height: 100%;
  z-index: 100;
  transform: translateX(-100%);
}
```

1. 좌측 메뉴 영역(`nav`)를 `fixed`로 지정하고, `transform: translateX(-100%)`으로 숨겨놓는다.
2. `body`에 `show-nav` 클래스가 추가되면 `body` 영역 자체를 메뉴 너비(`200px`) 만큼 이동시킨다.
   `body`에 `transition` 속성을 정의하여 부드럽게 이동시킬 수 있다.

### JS

```jsx
$toggle.addEventListener('click', () => {
  if ($body.className.includes('show-nav')) {
    $body.className = '';
  } else {
    $body.className = 'show-nav';
  }
});
```

- `toggle` 버튼을 클릭하면 `body`에 `show-nav` 클래스가 있는지 검사해서 지우거나 추가한다.

## 모달 (Modal)

### CSS

```css
.modal-container {
  background-color: rgba(0, 0, 0, 0.6);
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.modal-container.show {
  display: block;
}

.modal {
  (...)animation: modalopen;
  animation-duration: var(--modal-duration);
}

@keyframes modalopen {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
```

1. 모달 배경이 차지하는 영역을 `modal-container`라고 하고, 뷰포트에 꽉차게 한다. 기본 값은 `display: none`
2. 모달이 활성화되면 `modal-container`에 `show` 클래스를 붙여준다.
3. 모달이 활성화될 때 `modalopen` 애니메이션을 사용한다. 1초에 걸쳐 투명도를 변화(0 → 1)시킨다.

### JS

```jsx
$open.addEventListener('click', () => {
  $modal.classList.add('show');
});
$close.addEventListener('click', () => {
  $modal.classList.remove('show');
});
$modal.addEventListener('click', (e) => {
  if (e.target === $modal) $modal.classList.remove('show');
});
```

- `open`을 클릭하면 `modal-container`에 `show` 클래스를 붙여준다. `close` 버튼을 클릭하면 `show` 클래스를 지운다.
- 모달 창 배경 영역(어두운 부분)을 클릭하면 마찬가지로 `show` 클래스를 지운다.

# 배운 점 🤓

## Element.classList.toggle

```jsx
// 1
$toggle.addEventListener('click', () => {
  if ($body.className.includes('show-nav')) {
    $body.className = '';
  } else {
    $body.className = 'show-nav';
  }
});

// 2
$toggle.addEventListener('click', () => {
  document.body.classList.toggle('show-nav');
});
```

- 특정 요소에 인자에 해당하는 클래스가 존재한다면 제거하고, 존재하지 않으면 클래스를 추가할 수 있다.
- 1번과 2번 코드는 동일하게 동작한다.

## Document.body

```jsx
// 1
const $body = document.querySelector('body');
$body.classList.toggle('show-nav');

// 2
document.body.classList.toggle('show-nav');
```

- `<body>`에는 2번 처럼 바로 접근할 수 있다. 동일하게 동작한다.

## removeEventListener

솔루션에서는 좌측 슬라이더 메뉴가 열린 후에, 토글버튼 뿐만 아니라 `body` 영역 아무 부분이나 클릭했을 때 다시 닫히도록 구현하였다.

```jsx
function closeNavbar(e) {
  if (
    document.body.classList.contains('show-nav') &&
    e.target !== toggle &&
    !toggle.contains(e.target) &&
    e.target !== navbar &&
    !navbar.contains(e.target)
  ) {
    document.body.classList.toggle('show-nav');
    document.body.removeEventListener('click', closeNavbar);
  } else if (!document.body.classList.contains('show-nav')) {
    document.body.removeEventListener('click', closeNavbar);
  }
}

toggle.addEventListener('click', () => {
  document.body.classList.toggle('show-nav');
  document.body.addEventListener('click', closeNavbar);
});
```

- 토글 버튼을 클릭하면 `body` 영역에 `click` 이벤트 리스너를 달아준다. 만약 메뉴 슬라이더 영역이 닫혔다면 `removeEventListener`를 통해 이벤트 리스너를 지운다.

## 애니메이션

`@keyframes` 을 사용해 애니메이션 과정의 중간 절차를 제어하도록 한다.

[@keyframes - CSS: Cascading Style Sheets | MDN](https://developer.mozilla.org/ko/docs/Web/CSS/@keyframes)

```css
.modal {
  (...)animation: modalopen;
  animation-duration: 1s;
}

@keyframes modalopen {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
```

- 위 CSS 코드는 1초 동안 `modalopen`에 설정된 키프레임을 따라간다.
