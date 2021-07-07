class Component {
  constructor($target) {
    this.$target = $target
    this.state = {}
  }

  setState(nextState) {
    this.state = nextState
    this.render()
  }

  render() {}
}

export default Component
