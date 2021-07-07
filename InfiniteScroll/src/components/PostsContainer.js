import Component from '../lib/Component.js'

class PostsContainer extends Component {
  constructor($target, { initialState }) {
    super($target)

    this.state = {
      filter: initialState.filter,
      posts: initialState.posts,
      filteredPosts: initialState.posts,
    }

    this.render()
  }

  render() {
    const { filteredPosts: posts } = this.state

    this.$target.innerHTML = posts
      .map(
        ({ id, title, body }) => `
          <div class="post">
            <div class="number">${id}</div>
            <div class="post-info>
              <h2 class="post-title">${title}</h2>
              <p class="post-body">${body}</p>
            </div>
          </div>`
      )
      .join('')
  }
}

export default PostsContainer
