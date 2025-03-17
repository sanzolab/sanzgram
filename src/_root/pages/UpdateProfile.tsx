import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useUserContext } from "@/context/AuthContext";
import UserForm from "@/components/forms/UserForm";
import Loader from "@/components/shared/Loader";

const UpdateProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const {
    user,
    isLoading: isUserLoading,
    isAuthenticated: isUserAuthenticated,
  } = useUserContext();

  const [loadingInitial, setLoadingInitial] = useState(true);

  useEffect(() => {
    if (isUserLoading === null || isUserAuthenticated === null) {
      return;
    }

    // Cuando ambos estados están definidos, podemos actualizar el estado de carga inicial
    setLoadingInitial(false);

    // Si el usuario no está autenticado y no está cargando, redirigir a '/'
    if (!isUserAuthenticated && !isUserLoading) {
      navigate("/");
    }
  }, [isUserLoading, isUserAuthenticated, navigate]);

  if (loadingInitial) {
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );
  }
  if (user.id !== id) {
    return <div>You don't have permission to update this user</div>;
  }
  return (
    <>
      <div className="flex flex-1">
        <div className="common-container ">
          <div className="max-w-5xl flex-start gap-3 justify-start w-full">
            <img
              src="/public/assets/icons/edit.svg"
              width={36}
              height={36}
              alt="add"
              className="invert-white"
            />
            <h2 className="h3-bold md:h2-bold text-left w-full"> Edit User</h2>
          </div>
          {isUserAuthenticated ? (
            <UserForm user={user} />
          ) : (
            <p className="text-light-4 mt-10 text-center w-full">
              Not authenticated
            </p>
          )}
        </div>
      </div>

      <div className="min-w-[400px] min-h-screen overflow-y-auto max-h-44 hidden xl:flex  border-l-dark-4 xl:flex-col border-l-2 xl:align-center gap-10 py-10 px-6"></div>
    </>
  );
};

export default UpdateProfile;
