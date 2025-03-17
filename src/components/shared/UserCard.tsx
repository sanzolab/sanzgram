import { Models } from "appwrite";
import { Link } from "react-router-dom";

import FollowButton from "./Buttons/FollowButton";
import EditButtonProfile from "./Buttons/EditButtonProfile";

// import { ICreator } from '@/types'

type userCardProp = {
  // user: ICreator
  user: Models.Document;
  currentUserId?: string;
};
const UserCard = ({ user, currentUserId }: userCardProp) => {
  return (
    <div className="flex justify-center align-middle user-card w-full max-w-[193px] max-h-[193px] ">
      <div className="flex flex-col items-center gap-2">
        <Link to={`/profile/${user.$id}`}>
          <img
            src={
              user.imageUrl || "/public/assets/icons/profile-placeholder.svg"
            }
            alt={`Perfil ${user.username}`}
            className="rounded-full w-12 lg:h-12"
          />
        </Link>

        <div className="flex flex-col">
          <p className="small-semibold lg:body-bold text-light-1">
            {user.username}
          </p>
          <div className="flex-center gap-2 text-light-3">
            <p className="subtle-semibold lg:small-regular">{`@${user.username}`}</p>
          </div>
        </div>
        {currentUserId === user.$id ? (
          <EditButtonProfile userId={currentUserId} />
        ) : (
          <FollowButton user={user} />
        )}
      </div>
    </div>
  );
};

export default UserCard;
