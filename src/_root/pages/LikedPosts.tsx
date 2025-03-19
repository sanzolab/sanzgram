import GridPostList from "@/components/shared/GridPostList";
import { Models } from "appwrite";
import { Link } from "react-router-dom";

type LikedPostsProps = {
  likedPosts: Models.Document;
  username: string;
};
const LikedPosts = ({ likedPosts, username }: LikedPostsProps) => {
  const isLikedPostsEmpty = likedPosts.length === 0;
  return (
    <div className="w-full mt-12 relative">
      {isLikedPostsEmpty ? (
        <div className="flex items-center flex-col gap-4">
          <p className="italic">No Liked Post</p>
          <Link
            className="shad-button_primary group mt-2 py-2 px-4  h-fit w-fit rounded-md
                  "
            to={"/explore"}
          >
            <p className="subtle-semibold">Explore and Like your First Post</p>
          </Link>
        </div>
      ) : (
        <ul className="grid grid-cols-auto-fit">
          <GridPostList
            key={`liked-post-by-${username}}`}
            posts={likedPosts}
            showUser={true}
          />
        </ul>
      )}
    </div>
  );
};

export default LikedPosts;
