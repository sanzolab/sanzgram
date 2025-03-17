import Loader from "@/components/shared/Loader";
import { PostCard } from "@/components/shared/PostCard";
import { useGetRecentPosts } from "@/lib/react-query/queriesAndMutations";

import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

function Home() {
  const { data: posts, fetchNextPage, hasNextPage } = useGetRecentPosts();
  const { ref, inView } = useInView();
  // const { pages } = posts
  // const { documents: postOk } = pages[0]
  // const posts = getDocumentsFromFirstPage(postsObj)
  // const notPost = posts.length === 0
  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);
  if (!posts) {
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );
  }
  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          {/* <h2 className="h3-bold md:h2-bold text-left w-full">Home Feed</h2> */}
          {posts ? (
            <ul className="flex flex-col flex-1 gap-9 w-full">
              {posts?.pages.map((postArray) =>
                postArray?.documents.map((post) => (
                  <li key={post.$id}>
                    <PostCard post={post} key={post.caption} />
                  </li>
                ))
              )}
            </ul>
          ) : (
            <p className="text-red">Not post found</p>
          )}

          {hasNextPage && (
            <div ref={ref} className="mt-10">
              <Loader />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
