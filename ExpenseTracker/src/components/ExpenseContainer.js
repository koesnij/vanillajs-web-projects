class ExpenseContainer {
  constructor({ $balance, $income, $expense, initialState }) {
    this.$balance = $balance;
    this.$income = $income;
    this.$expense = $expense;
    this.state = {
      income: initialState.income,
      expense: initialState.expense,
    };

    this.render();
  }

  setState(nextState) {
    this.state = nextState;
    this.render();
  }

  render() {
    this.$income.textContent = `$${this.state.income}.00`;
    this.$expense.textContent = `$${this.state.expense}.00`;
    this.$balance.textContent = `$${this.state.income - this.state.expense}.00`;
  }
}

export default ExpenseContainer;
