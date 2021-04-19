const API_KEY = '09b443908e8a2a6adedb05e7';
const API_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/`;

const fetcher = (url) => fetch(url).then((res) => res.json());
const ExchangeRate = () => {
  let _rates = {
    FROM: '',
  };

  return async (from) => {
    if (_rates['FROM'] !== from) {
      const { result, conversion_rates } = await fetcher(API_URL + from);
      if (result === 'error') {
        throw new Error();
      }
      _rates = {
        ...conversion_rates,
        FROM: from,
      };
    }
    return _rates;
  };
};

const CurrencyOne = document.getElementById('currency-one');
const CurrencyTwo = document.getElementById('currency-two');
const AmountOne = document.getElementById('amount-one');
const AmountTwo = document.getElementById('amount-two');
const SwapButton = document.getElementById('swap');
const RateText = document.getElementById('rate');

const getExchangeRate = ExchangeRate();

const swapAmount = async () => {
  const from = CurrencyOne.value;
  const to = CurrencyTwo.value;
  try {
    const rates = await getExchangeRate(from);
    const convertedValue = AmountOne.value * rates[to];
    RateText.textContent = `1 ${from} = ${convertedValue} ${to}`;
    AmountTwo.value = convertedValue;
  } catch (error) {
    console.log(error);
  }
};

SwapButton.addEventListener('click', swapAmount);
CurrencyOne.addEventListener('input', swapAmount);
CurrencyTwo.addEventListener('input', swapAmount);
AmountOne.addEventListener('input', swapAmount);
AmountTwo.addEventListener('input', swapAmount);

swapAmount();
