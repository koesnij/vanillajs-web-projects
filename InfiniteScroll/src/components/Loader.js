import Component from '../lib/Component.js'

class Loader extends Component {
  constructor($target, { initialState, onIntersect }) {
    super($target)

    this.state = {
      loading: initialState.loading,
    }

    const observer = new IntersectionObserver(onIntersect, { threshold: 1.0 })
    observer.observe($target)

    this.render()
  }

  render() {
    this.$target.style.opacity = this.state.loading ? 1 : 0
  }
}

export default Loader
