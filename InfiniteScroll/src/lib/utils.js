export const filter = (posts, target) =>
  posts.filter(({ title, body }) => title.includes(target) || body.includes(target))
