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
    this.state.history.forEach((item) => {
      const container = document.createElement('li');
      container.className = item.amount < 0 ? 'minus' : 'plus';
      container.textContent = item.text;

      const span = document.createElement('span');
      span.textContent = `${item.amount < 0 ? '' : '+'}${item.amount}.00`;
      container.appendChild(span);

      const button = document.createElement('button');
      button.className = 'delete-btn';
      button.textContent = 'X';
      button.dataset.id = item.id;
      container.appendChild(button);

      this.$target.appendChild(container);
    });
  }
}

export default History;
