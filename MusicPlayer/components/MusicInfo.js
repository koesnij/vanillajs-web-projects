class MusicInfo {
  constructor({ $target, initialState }) {
    this.state = initialState

    // Get DOM
    this.$target = $target
    this.$title = $target.querySelector('#title')
    this.$progress = $target.querySelector('#progress')

    // Render
    this.render()
  }

  setState(nextState) {
    this.state = nextState
    this.render()
  }

  render() {
    this.$progress.style.width = `${this.state.progress}%`
    this.$target.style.transform = this.state.playing ? `translateY(-100%)` : ''
    this.$target.style.opacity = this.state.playing ? '1' : '0'
    this.$title.textContent = this.state.musics[this.state.current]
  }
}

export default MusicInfo
