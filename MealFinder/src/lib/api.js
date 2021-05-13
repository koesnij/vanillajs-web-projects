export const API_URL = 'https://www.themealdb.com/api/json/v1/1/';

export const fetcher = async (URL) => {
  try {
    const response = await fetch(URL);
    if (!response.ok) throw new Error('서버 상태가 이상합니다!');

    return await response.json();
  } catch (error) {
    throw new Error(`무언가 잘못 되었습니다! ${error.message}`);
  }
};

export const searchMealsByName = async (name) =>
  fetcher(API_URL + `search.php?s=${name}`);

export const getMealById = async (id) =>
  fetcher(API_URL + `lookup.php?i=${id}`);

export const getRandomMeal = async (id) => fetcher(API_URL + 'random.php');
