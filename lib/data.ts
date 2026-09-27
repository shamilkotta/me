export const DATA = {
  PPR_ORIGIN: `export async function Posts() {
  const posts = await listPosts();
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}`,
};
