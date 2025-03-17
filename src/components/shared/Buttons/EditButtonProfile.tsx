import { Link } from "react-router-dom";

import editIcon from "/public/assets/icons/editIcon.svg";

type EditButtonProps = {
  userId: string;
};
const EditButtonProfile = ({ userId }: EditButtonProps) => {
  return (
    <Link
      to={`/update-profile/${userId}`}
      className="shad-button_dark_no_h h  group"
      aria-label="Boton editar perfil"
    >
      <image src={editIcon} alt="edit Icon" />
      <p className="subtle-semibold">Edit Profile</p>
    </Link>
  );
};

export default EditButtonProfile;
