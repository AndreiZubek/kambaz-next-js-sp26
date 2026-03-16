import { IoEllipsisVertical } from "react-icons/io5";
import { FaTrash } from "react-icons/fa";
import GreenCheckmark from "./GreenCheckmark";
import { BsPlus } from "react-icons/bs";
import { FaPencil } from "react-icons/fa6";
import { useSelector } from "react-redux";
export default function ModuleControlButtons({
  moduleId,
  deleteModule,
  editModule,
}: {
  moduleId: string;
  deleteModule: (moduleId: string) => void;
  editModule: (moduleId: string) => void;
}) {
  const isFaculty = useSelector(
    (state: any) =>
      state.accountReducer.currentUser?.role === "FACULTY" ||
      state.accountReducer.currentUser?.role === "ADMIN" ||
      state.accountReducer.currentUser?.role === "TA",
  );
  return (
    <div className="float-end">
      <FaPencil
        onClick={() => {
          if (isFaculty) {
            editModule(moduleId);
          }
        }}
        className="text-primary me-3"
      />
      <FaTrash
        className="text-danger me-2 mb-1"
        onClick={() => {
          if (isFaculty) {
            deleteModule(moduleId);
          }
        }}
      />
      <GreenCheckmark />
      <BsPlus className="fs-1" />
      <IoEllipsisVertical className="fs-4" />
    </div>
  );
}
