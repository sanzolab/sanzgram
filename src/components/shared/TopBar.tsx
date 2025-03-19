import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useSignOutAccount } from "@/lib/react-query/queriesAndMutations";
import { useEffect } from "react";
import { useUserContext } from "@/context/AuthContext";

const TopBar = () => {
  const { mutate: signOut, isSuccess } = useSignOutAccount();
  const navigate = useNavigate();
  const { user } = useUserContext();
  useEffect(() => {
    if (isSuccess) navigate(0);
  }, [isSuccess]);
  return (
    <section className="topbar">
      <div className="flex-between py-4 px-5">
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/assets/images/sanzgramlogo3-01.svg"
            alt="logo"
            height={32}
            width={115}
          />
        </Link>

        <div className="flex gap-4">
          <Button
            variant={"ghost"}
            className="shad-button_ghost"
            onClick={() => signOut()}
          >
            <img src="/assets/icons/logout.svg" alt="logout" />
          </Button>
          <Link className="flex-center gap-3" to={`/profile/${user.id}`}>
            <img
              className="h-8 w-8 rounded-full"
              src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
              alt=""
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TopBar;
