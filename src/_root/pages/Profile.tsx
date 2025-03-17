import EditButtonProfile from "@/components/shared/Buttons/EditButtonProfile";
import FollowButton from "@/components/shared/Buttons/FollowButton";
import Loader from "@/components/shared/Loader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  useGetCurrentUser,
  useGetUserById,
} from "@/lib/react-query/queriesAndMutations";

import {
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import Posts from "./Posts";
import LikedPosts from "./LikedPosts";

const Profile = () => {
  //   const { user, isUserLoading, isAuthenticated } = useUserContext();
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { data: currentUser, isLoading: isCurrentUserLoading } =
    useGetCurrentUser();

  const { data: user, isLoading } = useGetUserById(id || "");

  const currentTab = location.pathname.includes("liked-posts")
    ? "liked"
    : "posts";

  if (isLoading || isCurrentUserLoading) return <Loader />;
  if (!user) return <div>User not found</div>;
  return (
    <div className="profile-container ">
      <div>
        <div className="flex gap-10 ">
          <div className={`flex gap-3  `}>
            <img
              className="h-32 w-32 rounded-full"
              src={
                user.imageUrl || "/public/assets/icons/profile-placeholder.svg"
              }
              alt="profile"
            />
            <div className="flex flex-col">
              <p className="body h1-bold">{user.name}</p>
              <p className="body-medium text-light-3">@{user.username}</p>
            </div>
          </div>
          {currentUser?.$id === id ? (
            <EditButtonProfile userId={id || ""} />
          ) : (
            <FollowButton user={user} />
          )}
        </div>

        <Tabs
          defaultValue={currentTab}
          className=" mt-12"
          onValueChange={(value) =>
            navigate(
              value === "liked"
                ? `/profile/${id}/liked-posts`
                : `/profile/${id}`
            )
          }
        >
          <TabsList className="grid  grid-cols-2 tab-list p-0 w-[400px]">
            <TabsTrigger
              className="bg-dark-2  border-2  rounded-r-none rounded-l-md border-[#101012] focus:border-2 active:border-2 focus:border-dark-3 active:border-dark-3 transition-colors duration-300 ease-in-out"
              value="posts"
            >
              Posts
            </TabsTrigger>
            {currentUser?.$id === id && (
              <TabsTrigger
                className="bg-dark-2 border-2 rounded-l-none rounded-r-md border-[#101012] focus:border-2 active:border-2 focus:border-dark-3 active:border-dark-3 transition-colors duration-300 ease-in-out"
                value="liked"
              >
                Liked Posts
              </TabsTrigger>
            )}
          </TabsList>
          <Routes>
            <Route
              index
              element={
                <TabsContent value="posts" className="w-full">
                  <Posts username={user.username} posts={user.posts} />
                </TabsContent>
              }
            />
            {currentUser?.$id === id && (
              <Route
                path="/liked-posts"
                element={
                  <TabsContent value="liked">
                    <LikedPosts
                      username={user.username}
                      likedPosts={user.liked}
                    />
                  </TabsContent>
                }
              />
            )}
          </Routes>

          <Outlet />
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
