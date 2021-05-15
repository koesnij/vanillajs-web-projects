import { isEmpty } from '../lib/utils.js';

export default class SingleMeal {
  constructor({ $target, initialState }) {
    this.$target = $target;
    this.state = {
      singleMeal: initialState,
    };

    this.render();
  }

  setState(nextState) {
    this.state = nextState;
    this.render();
  }

  render() {
    const meal = this.state.singleMeal;
    const ingredients = Object.keys(meal)
      .filter((key) => key.startsWith('strIngredient') && meal[key] !== '')
      .map((key, idx) => `${meal[key]} - ${meal[`strMeasure${idx + 1}`]}`);

    console.log(meal);
    console.log(ingredients);

    this.$target.innerHTML = isEmpty(meal)
      ? ''
      : `
        <div class="single-meal">
          <h1>${meal.strMeal}</h1>
          <img src="${meal.strMealThumb}" alt="${meal.strMeal}" >
          <div class="single-meal-info" >
            <p>${meal.strArea}</p>
            <p>${meal.strCategory}</p>
          </div>
          <div class="main">
            <p>${meal.strInstructions}</p>
            <h2>Ingredients</h2>
            <ul>
              ${ingredients
                .map(
                  (i) => `
                    <li>${i}</li>
                  `
                )
                .join('')}
            </ul>
          </div>
        </div>
      `;
  }
}
