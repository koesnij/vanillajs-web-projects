import Meals from './Meals.js';
import SingleMeal from './SingleMeal.js';
import Form from './Form.js';
import { getMealById, getRandomMeal, searchMealsByName } from '../lib/api.js';

export default class App {
  constructor($app) {
    this.$loading = $app.querySelector('#loading');
    this.$resultHeading = $app.querySelector('#result-heading');
    this.$random = $app.querySelector('#random');

    this.state = {
      resultHeading: '',
      form: '',
      meals: [],
      singleMeal: {},
      loading: false,
    };

    this.form = new Form({
      $target: $app.querySelector('#submit'),
      initialState: this.state.form,
      onSubmit: async (e) => {
        e.preventDefault();
        this.setState({
          ...this.state,
          loading: true,
        });
        const meals = await searchMealsByName(this.state.form);
        this.setState({
          ...this.state,
          loading: false,
          resultHeading: this.state.form,
          meals,
          singleMeal: {},
        });
      },
      onChange: (e) => {
        this.setState({
          ...this.state,
          form: e.target.value,
        });
      },
    });

    this.meals = new Meals({
      $target: $app.querySelector('#meals'),
      initialState: this.state.meals,
      onClick: async (e) => {
        // Event Delegation
        const id = e.path
          .find((el) => el.className == 'meal-info')
          .getAttribute('data-mealid');

        this.setState({
          ...this.state,
          loading: true,
        });
        const singleMeal = await getMealById(id);
        this.setState({
          ...this.state,
          loading: false,
          singleMeal,
        });
      },
    });

    this.singleMeal = new SingleMeal({
      $target: $app.querySelector('#single-meal'),
      initialState: this.state.singleMeal,
    });

    this.init();
  }

  init() {
    this.$random.onclick = async () => {
      try {
        this.setState({
          ...this.state,
          loading: true,
        });
        const {
          meals: [singleMeal],
        } = await getRandomMeal();
        this.setState({
          ...this.state,
          loading: false,
          resultHeading: '',
          form: '',
          meals: [],
          singleMeal,
        });
      } catch (error) {
        console.log(error);
      }
    };
  }

  setState(nextState) {
    if (typeof nextState === 'function') {
      this.state = nextState(this.state);
    } else {
      this.state = nextState;
    }

    this.form.setState({
      ...this.form.state,
      value: this.state.form,
    });
    this.meals.setState({
      ...this.meals.state,
      meals: this.state.meals,
    });
    this.singleMeal.setState({
      ...this.singleMeal.state,
      singleMeal: this.state.singleMeal,
    });

    console.log(this.state);

    this.render();
  }

  render() {
    // Loading
    this.$loading.style.visibility = this.state.loading ? 'visible' : 'hidden';

    // Result Heading
    this.$resultHeading.innerHTML =
      this.state.resultHeading &&
      `<h2>Search results for '${this.state.resultHeading}':</h2>`;
  }
}
