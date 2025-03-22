import { Link } from "react-router-dom";

import editIcon from "assets/icons/editIcon.svg";

type EditButtonProps = {
  userId: string;
};
const EditButtonProfile = ({ userId }: EditButtonProps) => {
  return (
    <Link
      to={`/update-profile/${userId}`}
      className="shad-button_dark_no_h  py-2 px-4  h-fit w-fit rounded-md"
      aria-label="Boton editar perfil"
    >
      <img src="/assets/icons/editIcon.svg" alt="logo" />
      <p className="subtle-semibold text-nowrap">Edit Profile</p>
    </Link>
  );
};

export default EditButtonProfile;
