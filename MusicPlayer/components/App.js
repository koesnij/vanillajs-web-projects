import MusicInfo from './MusicInfo.js'
import Navigation from './Navigation.js'

const musics = ['ukulele', 'hey', 'summer']

class App {
  constructor($app) {
    this.state = {
      playing: false,
      musics,
      current: 0,
      progress: 0,
    }

    // Get DOM
    this.$app = $app
    this.$audio = $app.querySelector('#audio')
    this.$coverImg = $app.querySelector('#cover')

    // Child Components
    this.navigation = new Navigation({
      $target: $app.querySelector('.navigation'),
      initialState: this.state,
      onClickPrev: () => {
        this.setState({
          ...this.state,
          progress: 0,
          current: (this.state.current - 1) % 3,
        })

        this.$audio.src = `music/${this.state.musics[this.state.current]}.mp3`
      },
      onClickPlay: () => {
        if (this.state.playing) {
          this.$audio.pause()
        } else {
          this.$audio.play()
        }

        this.setState({
          ...this.state,
          playing: !this.state.playing,
        })
      },
      onClickNext: () => {
        this.setState({
          ...this.state,
          progress: 0,
          current: (this.state.current + 1) % 3,
        })

        this.$audio.src = `music/${this.state.musics[this.state.current]}.mp3`
      },
    })

    this.musicInfo = new MusicInfo({
      $target: $app.querySelector('.music-info'),
      initialState: this.state,
      onClick: (e) => {
        this.setState(...this.state)
      },
    })

    // AddEventListener
    this.$audio.addEventListener('timeupdate', () => {
      const { currentTime, duration } = this.$audio
      this.setState({ ...this.state, progress: (currentTime * 100) / duration })
    })

    // Render
    this.render()
  }

  setState(nextState) {
    this.state = nextState

    this.navigation.setState(nextState)
    this.musicInfo.setState(nextState)

    this.render()
  }

  render() {
    this.$coverImg.src = `images/${this.state.musics[this.state.current]}.jpg`
  }
}

export default App
