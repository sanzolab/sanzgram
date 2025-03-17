import { sidebarLinks } from "@/constants";
import { useUserContext } from "@/context/AuthContext";
import { useSignOutAccount } from "@/lib/react-query/queriesAndMutations";
import { INavLink } from "@/types";
import { useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import Loader from "./Loader";

const LeftSideBar = () => {
  const { pathname } = useLocation();
  const { mutate: signOut, isSuccess } = useSignOutAccount();
  const navigate = useNavigate();
  const { user, isLoading, isAuthenticated } = useUserContext();

  useEffect(() => {
    if (isSuccess) navigate(0);
  }, [isSuccess]);
  const isProfileActive =
    pathname.includes("/profile") || pathname.includes("/update-profile");
  return (
    <nav className="leftsidebar">
      <div className="flex flex-col gap-11">
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/public/assets/images/sanzgramlogo3-01.svg"
            alt="logo"
            width={140}
            height={36}
          />
        </Link>
        <Link
          className={`flex gap-3 items-center ${
            isProfileActive && "link-active"
          }`}
          to={`/profile/${user.id}`}
        >
          <img
            className="h-14 w-14 rounded-full"
            src={
              user.imageUrl || "/public/assets/icons/profile-placeholder.svg"
            }
            alt="profile"
          />
          <div className="flex flex-col">
            <p className="body -bold">{user.name}</p>
            <p className="small-regular text-light-3">@{user.username}</p>
          </div>
        </Link>

        <ul className="flex flex-col gap-6">
          {sidebarLinks.map((link: INavLink) => {
            const isActive = pathname === link.route;
            return (
              <li
                key={link.label}
                className={`leftsidebar-link group ${
                  isActive && "bg-primary-500 link-active"
                }`}
              >
                <NavLink
                  className="flex gap-4 items-center p-4"
                  to={link.route}
                >
                  <img
                    src={link.imgURL}
                    alt={link.label}
                    className={`group-hover:invert-white ${
                      isActive && "invert-white"
                    }`}
                  />
                  {link.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>
      {isLoading ? (
        <Loader />
      ) : (
        <Button
          variant={"ghost"}
          className="flex gap-4 items-center shad-button_log group mt-8 mb-0 "
          onClick={() => (isAuthenticated ? signOut() : navigate("/sign-in"))}
        >
          <img
            className={`group-hover:opacity-70 group-hover:scale-x-[-1] invert brightness-0 transition ${
              !isAuthenticated && "scale-x-[-1] group-hover:scale-x-[1]"
            }`}
            src="/public/assets/icons/logout.svg"
            alt="logout"
          />
          <p className="base-medium group-hover:opacity-70">
            {" "}
            {isAuthenticated ? "Logout" : "Login"}
          </p>
        </Button>
      )}
    </nav>
  );
};

export default LeftSideBar;
