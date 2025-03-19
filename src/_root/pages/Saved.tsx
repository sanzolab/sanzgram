import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import { useUserContext } from "@/context/AuthContext";
import { useGetSavedPost } from "@/lib/react-query/queriesAndMutations";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router-dom";

/**
 * Renders the Saved component, which displays a list of saved posts for the current user.
 *
 * @return {JSX.Element} The rendered Saved component.
 */
const Saved = () => {
  const navigate = useNavigate();
  const { ref, inView } = useInView();
  const { user, isLoading: isUserLoading, isAuthenticated } = useUserContext();
  const userId = user?.id;

  const [loadingInitial, setLoadingInitial] = useState(true);
  const savedPostQuery = useGetSavedPost(userId);

  useEffect(() => {
    if (isUserLoading === null || isAuthenticated === null) {
      // Esperar a que isUserLoading e isAuthenticated tengan un valor válido
      return;
    }

    // Cuando ambos estados están definidos, podemos actualizar el estado de carga inicial
    setLoadingInitial(false);

    // Si el usuario no está autenticado y no está cargando, redirigir a '/'
    if (!isAuthenticated && !isUserLoading) {
      navigate("/");
    }
  }, [isUserLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (inView && savedPostQuery?.hasNextPage) {
      savedPostQuery.fetchNextPage();
    }
  }, [inView, savedPostQuery]);

  if (loadingInitial || !savedPostQuery.data) {
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );
  }

  const notShowPost = savedPostQuery.data.pages.every(
    (page) => page?.documents.length === 0
  );

  return (
    <div className="flex flex-1">
      <div className="saved-container">
        <div className="max-w-5xl flex-start gap-4 justify-start w-full">
          <img
            src="/assets/icons/save.svg"
            width={36}
            height={36}
            alt="add"
            className="invert-white"
          />
          <h2 className="h3-bold md:h2-bold text-left w-full">Saved Post</h2>
        </div>
        <div className="flex justify-end w-full max-w-5xl mb-7">
          <div className="flex-center gap-3 bg-dark-3 rounded-xl px-4 py-2 cursor-pointer">
            <p className="small-medium md:base-medium text-light-2">All</p>
            <img
              src="/assets/icons/filter.svg"
              alt="filter"
              width={20}
              height={20}
            />
          </div>
        </div>
        <div className="grid gap-9 w-full max-w-5xl">
          <ul className="grid grid-cols-auto-fit-medium">
            {isAuthenticated ? (
              notShowPost ? (
                <p className="text-light-4 mt-10 text-center w-full">
                  No saved posts
                </p>
              ) : (
                savedPostQuery.data.pages.map((page, index) => (
                  <GridPostList
                    key={`page-saved-${index}`}
                    posts={page?.documents}
                  />
                ))
              )
            ) : (
              <p className="text-light-4 mt-10 text-center w-full">
                Not authenticated
              </p>
            )}
          </ul>
        </div>
        {savedPostQuery.hasNextPage && (
          <div ref={ref} className="mt-10">
            <Loader />
          </div>
        )}
      </div>
    </div>
  );
};

export default Saved;
