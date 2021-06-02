class NewTransaction {
  constructor({ $target, onSubmit }) {
    this.$target = $target;
    this.onSubmit = onSubmit;

    this.init();
    this.render();
  }

  init() {
    this.$target.onsubmit = this.onSubmit;
  }

  setState(nextState) {
    this.state = nextState;
    this.render();
  }

  render() {}
}

export default NewTransaction;
