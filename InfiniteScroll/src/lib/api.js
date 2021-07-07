const API_URL = `https://jsonplaceholder.typicode.com`

export const fetcher = async (URL) => {
  try {
    const response = await fetch(URL)
    if (!response.ok) throw new Error('서버 상태가 이상합니다!')
    return await response.json()
  } catch (error) {
    throw new Error(`무언가 잘못 되었습니다! ${error.message}`)
  }
}

export const getPosts = ({ limit, page }) =>
  fetcher(API_URL + `/posts?_limit=${limit}&_page=${page}`)
