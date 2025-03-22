import { useUserContext } from "@/context/AuthContext";
import { Models } from "appwrite";
import { Link } from "react-router-dom";
import PostStats from "./PostStats";
import Loader from "./Loader";

type GridPostsProps = {
  posts: Models.Document[] | Models.Document | undefined;
  showUser?: boolean;
  showStats?: boolean;
};
/**
 * {post?.post || post.user} objeto provieve de Saved.tsx
 *
 * {post || post.creator} objeto provieve de Explore.tsx
 *
 */
const GridPostList = ({
  posts,
  showUser = true,
  showStats = false,
}: GridPostsProps) => {
  const { user, isLoading } = useUserContext();

  return (
    <>
      {!posts && <p>No posts found</p>}
      {posts?.map((post: Models.Document) => (
        <li key={post.$id} className="relative">
          <Link
            to={`/post/${post.post?.$id || post.$id}`}
            className="grid-post_link"
          >
            <img
              className="h-full w-full object-cover"
              src={post.imageUrl || post.post.imageUrl}
              alt="post image"
            />
          </Link>
          <div className="grid-post_user">
            {showUser && (
              <Link
                to={`/profile/${post.creator?.$id || post.user?.accountId}`}
                className="flex items-center justify-start gap-2 flex-1"
              >
                <img
                  className="h-8 w-8 rounded-full"
                  src={post.creator?.imageUrl || post.user?.imageUrl}
                  alt="user profile"
                />
                <p className="line-clamp-1">
                  {post.creator?.name || post.user?.name}
                </p>
              </Link>
            )}
            {showStats &&
              (isLoading ? (
                <Loader />
              ) : (
                <PostStats post={post?.post || post} userId={user.id} />
              ))}
          </div>
        </li>
      ))}
    </>
  );
};

export default GridPostList;
