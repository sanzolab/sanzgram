import GridPostList from "@/components/shared/GridPostList";
import { Models } from "appwrite";
import { Link } from "react-router-dom";

type PostsProps = {
  posts: Models.Document;
  username: string;
  isCurrentUser: boolean;
};
const Posts = ({ posts, username, isCurrentUser }: PostsProps) => {
  const isPostsEmpty = posts?.length === 0;

  return (
    <div className="w-full mt-12">
      {isPostsEmpty ? (
        <div className="flex items-center flex-col gap-4">
          <p className="italic">No Posts Created</p>
          {isCurrentUser && (
            <Link
              className="shad-button_primary group mt-2 py-2 px-4  h-fit w-fit rounded-md
            "
              to={"/create-post"}
            >
              <p className="subtle-semibold">Create your First Post</p>
            </Link>
          )}
        </div>
      ) : (
        <ul className="grid grid-cols-auto-fit">
          <GridPostList
            key={`post-by-${username}}`}
            posts={posts}
            showUser={false}
          />
        </ul>
      )}
    </div>
  );
};

export default Posts;
