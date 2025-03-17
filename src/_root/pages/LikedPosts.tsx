import GridPostList from "@/components/shared/GridPostList";
import { Models } from "appwrite";

type LikedPostsProps = {
  likedPosts: Models.Document;
  username: string;
};
const LikedPosts = ({ likedPosts, username }: LikedPostsProps) => {
  return (
    <div className="w-full mt-12 relative">
      <ul className="grid grid-cols-auto-fit">
        <GridPostList
          key={`liked-post-by-${username}}`}
          posts={likedPosts}
          showUser={true}
        />
      </ul>
    </div>
  );
};

export default LikedPosts;
