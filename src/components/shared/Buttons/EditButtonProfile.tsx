import DinamicEditIcon from "/public/assets/icons/dinamicEditIcon";
import { Link } from "react-router-dom";

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
      {" "}
      {<DinamicEditIcon color="#FFB620" height={16} width={16} />}
      {/* <img src='/public/assets/icons/edit.svg' alt="Edit icon" className='fill-slate-300' height={16} width={16} /> */}
      <p className="subtle-semibold">Edit Profile</p>
    </Link>
  );
};

export default EditButtonProfile;
