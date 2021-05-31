export default class Meals {
  constructor({ $target, initialState, onClick }) {
    this.$target = $target;
    this.state = {
      meals: initialState,
    };
    this.onClick = onClick;

    this.init();
    this.render();
  }

  init() {
    this.$target.onclick = this.onClick;
  }

  shouldComponentUpdate(nextState) {
    if (this.state.meals !== nextState.meals) return true;
    return false;
  }

  setState(nextState) {
    if (this.shouldComponentUpdate(nextState)) {
      this.state = nextState;
      this.render();
    }
    this.state = nextState;
  }

  render() {
    this.$target.innerHTML = this.state.meals
      .map((meal) => {
        const { idMeal, strMeal, strMealThumb } = meal;
        return `
          <div class="meal">
            <img src="${strMealThumb}" alt="${strMeal}">
            <div class="meal-info" data-mealid="${idMeal}">
              <h3>${strMeal}</h3>
            </div>
          </div>
        `;
      })
      .join('');

    console.log('Meals is rendered');
  }
}
