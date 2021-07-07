import { getPosts } from '../lib/api.js'
import Component from '../lib/Component.js'
import { filter } from '../lib/utils.js'
import Filter from './Filter.js'
import Loader from './Loader.js'
import PostsContainer from './PostsContainer.js'

const LIMIT = 5

class App extends Component {
  constructor($target) {
    super($target)

    this.state = {
      loading: false,
      page: 1,
      filter: '',
      posts: [],
      filteredPosts: [],
    }

    this.filter = new Filter(document.querySelector('#filter'), {
      initialState: this.state,
      onChange: (e) => {
        const { value } = e.target
        this.setState({
          ...this.state,
          filter: value,
          filteredPosts: filter(this.state.posts, value),
        })
      },
    })

    this.postsContainer = new PostsContainer(document.querySelector('#posts-container'), {
      initialState: this.state,
    })

    this.loader = new Loader(document.querySelector('#loader'), {
      initialState: this.state,
      onIntersect: async ([entry]) => {
        if (!entry.isIntersecting) return

        try {
          this.setState({ ...this.state, loading: true, page: this.state.page + 1 })
          const data = await getPosts({ limit: LIMIT, page: this.state.page })
          this.setState({
            ...this.state,
            loading: false,
            posts: [...this.state.posts, ...data],
            filteredPosts: [...this.state.filteredPosts, ...data],
          })
        } catch (e) {
          console.error(e)
          this.setState({ ...this.state, loading: false })
        }
      },
    })

    this.init()
  }

  async init() {
    try {
      this.setState({ ...this.state, loading: true })
      const data = await getPosts({ limit: LIMIT, page: 1 })
      this.setState({ ...this.state, loading: false, posts: data, filteredPosts: data })
    } catch (e) {
      console.error(e)
    }
  }

  setState(nextState) {
    super.setState(nextState)

    this.filter.setState(nextState)
    this.postsContainer.setState(nextState)
    this.loader.setState(nextState)
  }
}

export default App
