export const API_URL = 'https://www.themealdb.com/api/json/v1/1/';

const _cache = {
  meals: {},
  singleMeal: {},
};

export const fetcher = async (URL) => {
  try {
    const response = await fetch(URL);
    if (!response.ok) throw new Error('서버 상태가 이상합니다!');
    return await response.json();
  } catch (error) {
    throw new Error(`무언가 잘못 되었습니다! ${error.message}`);
  }
};

export const searchMealsByName = async (name) => {
  if (!_cache.meals[name]) {
    const { meals } = await fetcher(API_URL + `search.php?s=${name}`);
    _cache.meals[name] = meals || [];
  }

  return _cache.meals[name];
};

export const getMealById = async (id) => {
  if (!_cache.singleMeal[id]) {
    const {
      meals: [singleMeal],
    } = await fetcher(API_URL + `lookup.php?i=${id}`);
    _cache.singleMeal[id] = singleMeal;
  }

  return _cache.singleMeal[id];
};

export const getRandomMeal = async (id) => fetcher(API_URL + 'random.php');
