import { IoEllipsisVertical } from "react-icons/io5";
import { BsPlus } from "react-icons/bs";

export default function QuizControlButtons() {
  return (
    <div className="float-end">
      <BsPlus className="fs-1"/>
      <IoEllipsisVertical className="fs-4" />
    </div>
  );
}