import NewTransaction from './NewTransaction.js';
import History from './History.js';
import ExpenseContainer from './ExpenseContainer.js';

class App {
  constructor($app) {
    this.state = {
      // ExpenseContainer
      income: 0,
      expense: 0,

      // History
      history: [],
    };

    this.history = new History({
      $target: $app.querySelector('#list'),
      initialState: { history: this.state.history },
      onDelete: (e) => {
        if (e.target.className == 'delete-btn') {
          const { id } = e.target.dataset;
          const { amount } = this.state.history.find((e) => e.id == id);

          if (amount < 0) {
            this.setState({
              ...this.state,
              history: this.state.history.filter((e) => e.id != id),
              expense: this.state.expense + amount,
            });
          } else {
            this.setState({
              ...this.state,
              history: this.state.history.filter((e) => e.id != id),
              income: this.state.income - amount,
            });
          }
        }
      },
    });

    this.newTransaction = new NewTransaction({
      $target: $app.querySelector('#form'),
      onSubmit: (e) => {
        e.preventDefault();

        const [text, amount] = e.srcElement;
        const id = new Date().getTime();
        if (amount.value.startsWith('-')) {
          this.setState({
            ...this.state,
            history: [
              ...this.state.history,
              { id, text: text.value, amount: +amount.value },
            ],
            expense: this.state.expense + -amount.value,
          });
        } else {
          this.setState({
            ...this.state,
            history: [
              ...this.state.history,
              { id, text: text.value, amount: +amount.value },
            ],
            income: this.state.income + +amount.value,
          });
        }

        text.value = amount.value = '';
      },
    });

    this.expenseContainer = new ExpenseContainer({
      $balance: document.querySelector('#balance'),
      $income: document.querySelector('#money-plus'),
      $expense: document.querySelector('#money-minus'),
      initialState: { income: this.state.income, expense: this.state.expense },
    });

    this.init();
  }

  init() {
    const loadedState = JSON.parse(localStorage.getItem('data'));
    this.setState(loadedState);
  }

  setState(nextState) {
    this.state = nextState;

    this.history.setState({
      ...this.history.state,
      history: this.state.history,
    });

    this.expenseContainer.setState({
      ...this.expenseContainer.state,
      income: this.state.income,
      expense: this.state.expense,
    });

    localStorage.setItem('data', JSON.stringify(this.state));
  }

  render() {}
}

export default App;
