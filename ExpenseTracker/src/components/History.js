class History {
  constructor({ $target, initialState, onDelete }) {
    this.$target = $target;
    this.state = {
      history: initialState.history,
    };
    this.onDelete = onDelete;

    this.init();
    this.render();
  }

  init() {
    this.$target.onclick = this.onDelete;
  }

  setState(nextState) {
    this.state = nextState;
    this.render();
  }

  render() {
    this.$target.innerHTML = this.state.history
      .map(
        (item) => `
        <li class="${item.amount < 0 ? 'minus' : 'plus'}">
          ${item.text}
          <span>${item.amount < 0 ? '' : '+'}${item.amount}.00</span>
          <button class="delete-btn" data-id="${item.id}">x</button>
        </li>
      `
      )
      .join('');
  }
}

export default History;
