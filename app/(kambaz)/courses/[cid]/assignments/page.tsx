"use client";
import AssignmentsControls from "./assignmentsControls";
import { Button, ListGroup, ListGroupItem } from "react-bootstrap";
import { BsGripVertical, BsPlus } from "react-icons/bs";
import LessonControlButtons from "../modules/LessonControlButtons";
import { IoEllipsisVertical } from "react-icons/io5";
import { IoMdArrowDropdown } from "react-icons/io";
import { PiNotePencil } from "react-icons/pi";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaTrash } from "react-icons/fa6";
import { deleteAssignment } from "./reducer";

export default function Assignments() {
  const { cid } = useParams();
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const options = { timeZone: "America/New_York" };
    const datePart = date.toLocaleDateString("en-US", {
      ...options,
      month: "short",
      day: "numeric",
    });
    const timePart = date.toLocaleTimeString("en-US", {
      ...options,
      hour: "numeric",
      minute: "2-digit",
    });

    return `${datePart} at ${timePart}`;
  };
  const router = useRouter();
  const dispatch = useDispatch();
  const { assignments } = useSelector((state: any) => state.assignmentsReducer);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const isFaculty = useSelector(
    (state: any) =>
      state.accountReducer.currentUser?.role === "FACULTY" ||
      state.accountReducer.currentUser?.role === "ADMIN" ||
      state.accountReducer.currentUser?.role === "TA",
  );

  return (
    <div id="wd-assignments">
      <AssignmentsControls />
      <br></br>
      <br></br>
      {confirmDeleteId && (
        <div className="alert alert-danger d-flex justify-content-between align-items-center">
          <span>Are you sure you want to delete this assignment?</span>
          <div>
            <Button
              className="m-2"
              variant="danger"
              size="sm"
              onClick={() => {
                dispatch(deleteAssignment(confirmDeleteId));
                setConfirmDeleteId(null);
              }}
            >
              Yes, Delete
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setConfirmDeleteId(null)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
      <ListGroup className="rounded-0" id="wd-assignment-list">
        <ListGroupItem className="wd-module p-0 mb-5 fs-5 border-gray">
          <div className="wd-title p-3 ps-2 bg-secondary-subtle">
            <BsGripVertical className="fs-3" />
            <IoMdArrowDropdown className="fs-3" /> ASSIGNMENTS{" "}
            <div className="float-end">
              <span className="border border-dark rounded-pill px-2 py-1">
                40% of Total
              </span>
              <BsPlus className="fs-1" />
              <IoEllipsisVertical className="fs-4" />
            </div>
          </div>
          <ListGroup className="wd-lessons rounded-0">
            {assignments
              .filter((assignment: any) => assignment.course === cid)
              .map((assignment: any) => (
                <ListGroupItem
                  key={assignment._id}
                  className="wd-lesson p-3 ps-1 d-flex align-items-center"
                >
                  <BsGripVertical className="me-2 fs-3" />
                  <PiNotePencil className="me-2 fs-2 text-success" />{" "}
                  <div className="grow px-3">
                    <div
                      className="d-flex align-items-center mb-1"
                      style={{ cursor: isFaculty ? "pointer" : "default" }}
                      onClick={() => {
                        if (isFaculty) {
                          router.push(
                            `/courses/${cid}/assignments/${assignment._id}`,
                          );
                        }
                      }}
                    >
                      {assignment.title}
                    </div>
                    <small className="text-danger">Multiple Modules</small>
                    <small className="text-muted">
                      {" | "}Not available until{" "}
                      {formatDate(assignment.availableDate)} |
                    </small>
                    <br></br>
                    <small className="text-muted">
                      Due {formatDate(assignment.dueDate)} | {assignment.points}
                      pts
                    </small>
                  </div>
                  <div className="ms-auto d-flex align-items-center gap-2">
                    <FaTrash
                      className="text-danger fs-5"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        if (isFaculty) {
                          setConfirmDeleteId(assignment._id);
                        }
                      }}
                    />
                    <LessonControlButtons />
                  </div>
                </ListGroupItem>
              ))}
          </ListGroup>
        </ListGroupItem>
      </ListGroup>
    </div>
  );
}
