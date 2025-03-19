import Loader from "@/components/shared/Loader";
import UserCard from "@/components/shared/UserCard";
import { useUserContext } from "@/context/AuthContext";
import { useGetUser } from "@/lib/react-query/queriesAndMutations";

import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

const AllUsers = () => {
  const {
    data: users,
    isFetching: isFetchingUsers,
    isError: isErrorUsers,
    fetchNextPage,
    hasNextPage,
  } = useGetUser();
  const { user: currentUser, isAuthenticated } = useUserContext();
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) fetchNextPage();
  }, [inView]);
  return (
    <div className="flex flex-1">
      <div className="common-container ">
        <div className="max-w-5xl flex-start gap-3 justify-start w-full">
          <img
            src="/assets/icons/people.svg"
            width={36}
            height={36}
            alt="add"
            className="invert-white"
          />
          <h2 className="h3-bold md:h2-bold text-left w-full"> All Users</h2>
        </div>
        <div className="user-container">
          <div className="grid grid-cols-auto-fit justify-items-center w-full">
            {users &&
              users.pages.map((user) =>
                user?.documents.map((userCreator) => (
                  <UserCard
                    key={userCreator.$id}
                    user={userCreator}
                    currentUserId={currentUser?.id}
                  />
                ))
              )}
            {isErrorUsers && <p>no data found {isErrorUsers}</p>}

            {hasNextPage && (
              <div ref={ref}>
                <Loader />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllUsers;
