export default class Form {
  constructor({ $target, initialState, onSubmit, onChange }) {
    this.$target = $target;
    this.$input = $target.querySelector('input');
    this.$button = $target.querySelector('button');

    this.state = {
      value: initialState,
    };

    this.onSubmit = onSubmit;
    this.onChange = onChange;

    this.init();
    this.render();
  }

  init() {
    this.$target.onsubmit = this.onSubmit;
    this.$button.onclick = this.onSubmit;
    this.$input.oninput = this.onChange;
  }

  setState(nextState) {
    this.state = nextState;
    this.render();
  }

  render() {
    this.$input.value = this.state.value;
  }
}
