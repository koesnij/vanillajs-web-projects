export const getRandomWord = () => {
  const words = [
    'sigh',
    'tense',
    'airplane',
    'ball',
    'pies',
    'juice',
    'warlike',
    'bad',
    'north',
    'dependent',
    'steer',
    'silver',
    'highfalutin',
    'superficial',
    'quince',
    'eight',
    'feeble',
    'admit',
    'drag',
    'loving',
  ]

  return words[Math.floor(Math.random() * words.length)]
}

export const getItem = (key) => JSON.parse(localStorage.getItem(key))
export const setItem = (key, value) => localStorage.setItem(key, JSON.stringify(value))
