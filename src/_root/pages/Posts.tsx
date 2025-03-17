import GridPostList from "@/components/shared/GridPostList";
import { Models } from "appwrite";

type PostsProps = {
  posts: Models.Document;
  username: string;
};
const Posts = ({ posts, username }: PostsProps) => {
  return (
    <div className="w-full mt-12">
      <ul className="grid grid-cols-auto-fit">
        <GridPostList
          key={`post-by-${username}}`}
          posts={posts}
          showUser={false}
        />
      </ul>
    </div>
  );
};

export default Posts;
