import Loader from "@/components/shared/Loader";
import { useUserContext } from "@/context/AuthContext";
import { useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

function AuthLayout() {
  const { isAuthenticated, isLoading } = useUserContext();
  const navigate = useNavigate();
  useEffect(() => {
    if (isLoading) return;
  }, [isLoading]);

  if (isLoading) return <Loader />;
  return (
    <>
      {isAuthenticated ? (
        <Navigate to="/" />
      ) : (
        <>
          <section className="flex flex-1 justify-center items-center flex-col">
            <Outlet />
          </section>
        </>
      )}
    </>
  );
}

export default AuthLayout;
