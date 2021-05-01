const Video = document.getElementById('video');
const Timestamp = document.getElementById('timestamp');
const PlayButton = document.getElementById('play');
const StopButton = document.getElementById('stop');
const ProgressBar = document.getElementById('progress');

function play() {
  Video.play();
  PlayButton.querySelector('i').className = 'fa fa-pause fa-2x';
}

function pause() {
  Video.pause();
  PlayButton.querySelector('i').className = 'fa fa-play fa-2x';
}

function togglePlay() {
  if (Video.paused) {
    play();
  } else {
    pause();
  }
}

function handleStop() {
  Video.currentTime = 0;
  pause();
}

function onTimeUpdate() {
  const { currentTime, duration } = Video;
  const [min, sec] = getTime(currentTime);
  Timestamp.textContent = `${min}:${sec}`;
  ProgressBar.value = (currentTime / duration) * 100;
}

function onClickProgressBar() {
  Video.currentTime = (ProgressBar.value / 100) * Video.duration;
}

function getTime(time) {
  let minute = Math.floor(time / 60) + '';
  if (minute.length < 2) {
    minute = '0' + minute;
  }
  let second = Math.floor(time - minute) + '';
  if (second.length < 2) {
    second = '0' + second;
  }
  return [minute, second];
}

Video.addEventListener('click', togglePlay);
Video.addEventListener('timeupdate', onTimeUpdate);
Video.addEventListener('ended', handleStop);
PlayButton.addEventListener('click', togglePlay);
StopButton.addEventListener('click', handleStop);
ProgressBar.addEventListener('click', onClickProgressBar);
