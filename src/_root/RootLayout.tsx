import BottomBar from "@/components/shared/BottomBar";
import LeftSideBar from "@/components/shared/LeftSideBar";
import TopBar from "@/components/shared/TopBar";
import TopCreators from "@/_root/pages/TopCreators";

import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useUserContext } from "@/context/AuthContext";
import { Loader } from "lucide-react";

function RootLayout() {
  const { pathname } = useLocation();
  const { isAuthenticated } = useUserContext();
  const navigate = useNavigate();
  console.log(isAuthenticated);
  if (!isAuthenticated) {
    navigate("/sign-in");
  }
  return (
    <div className="w-full md:flex md:flex-row flex flex-col">
      <TopBar />
      <LeftSideBar />

      <section className="flex flex-grow flex-2">
        <Outlet />
      </section>
      {pathname === "/" && <TopCreators />}
      {/* {pathname !== '/all-users' && <TopCreators />} */}

      <BottomBar />
    </div>
  );
}

export default RootLayout;
