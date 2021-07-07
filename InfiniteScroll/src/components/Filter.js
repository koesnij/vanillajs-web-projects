import Component from '../lib/Component.js'

class Filter extends Component {
  constructor($target, { initialState, onChange }) {
    super($target)

    this.state = {
      value: initialState.filter,
    }

    $target.addEventListener('input', onChange)
  }
}

export default Filter
