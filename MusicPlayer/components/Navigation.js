class Navigation {
  constructor({
    $target,
    initialState,
    onClickPrev,
    onClickPlay,
    onClickNext,
  }) {
    this.state = initialState

    // Get DOM
    this.$target = $target
    this.$prevButton = $target.querySelector('#prev')
    this.$playButton = $target.querySelector('#play')
    this.$nextButton = $target.querySelector('#next')

    // Add EventListener
    this.$prevButton.addEventListener('click', onClickPrev)
    this.$playButton.addEventListener('click', onClickPlay)
    this.$nextButton.addEventListener('click', onClickNext)

    // Render
    this.render()
  }

  setState(nextState) {
    this.state = nextState
    this.render()
  }

  render() {
    this.$playButton.innerHTML = `
        <i class="fas fa-${this.state.playing ? 'pause' : 'play'}"></i>
    `
  }
}

export default Navigation
