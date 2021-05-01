# Custom Video Player

- Video Element와 Range Input Element를 다뤄보는 실습

## &lt;video&gt;

- MDN 문서만 보면서 하려고 [`HTMLVideoElement`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement), [`HTMLMediaElement`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement) 인터페이스 문서에서 속성, 이벤트 핸들러, 메서드 등을 찾아봤다.
- 근데 따로 [Video and Audio APIs 예제](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Client-side_web_APIs/Video_and_audio_APIs)를 제공하더라..

### video.paused (Read only)

현재 요소가 일시정지되었는지에 대한 값(Boolean)

### video.currentTime

현재 재생 시간(초)을 나타내는 값(소수). 값을 대입할 수 있다.

### video.duration (Read only)

미디어의 총 길이(초)를 나타내는 값(소수)

## input type="range"

- `min` - `max` 가 `0` - `100`으로 되어있으므로 ((현재 재생 시간) / (총 길이)) \* 100 해서 값을 넣어준다.

- `click` (혹은 `change`) 이벤트 발생시, 현재 값을 100으로 나누고 총 재생시간을 곱해 `video.currentTime`에 넣어준다.

## 재생/일시정지 아이콘 변경

- 나는 부모 요소에서 자식 요소를 선택해 `className`을 넣어줬고, 솔루션에서는 아이콘(`<i>`)의 부모 요소에서 `innerHTML`을 직접 넣어줬다.
