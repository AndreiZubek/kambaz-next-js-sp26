"use client";
import Link from "next/link";
import AssignmentsControls from "./assignmentsControls";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import { BsGripVertical, BsPlus } from "react-icons/bs";
import LessonControlButtons from "../modules/LessonControlButtons";
import { IoEllipsisVertical } from "react-icons/io5";
import { IoMdArrowDropdown } from "react-icons/io";
import { PiNotePencil } from "react-icons/pi";
import { useParams } from "next/navigation";
import * as db from "../../../database";

export default function Assignments() {
  const { cid } = useParams();
  const assignments = db.assignments;
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const datePart = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    const timePart = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
    return `${datePart} at ${timePart}`;
  };

  return (
    <div id="wd-assignments">
      <AssignmentsControls />
      <br></br>
      <br></br>
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
                    <div className="d-flex align-items-center mb-1">
                      <Link
                        href={`/courses/${cid}/assignments/${assignment._id}`}
                        className="wd-assignment-link text-reset text-decoration-none fs-4"
                      >
                        {assignment.title}
                      </Link>{" "}
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
                  <div className="ms-auto">
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

{
  /* <ListGroupItem className="wd-lesson p-3 ps-1 d-flex align-items-center">
              <BsGripVertical className="me-2 fs-3" />
              <PiNotePencil className="me-2 fs-2 text-success" />{" "}
              <div className="grow px-3">
                <div className="d-flex align-items-center mb-1">
                  <Link
                    href="/courses/1234/assignments/123"
                    className="wd-assignment-link text-reset text-decoration-none fs-4"
                  >
                    A1
                  </Link>{" "}
                </div>
                <small className="text-danger">Multiple Modules</small>
                <small className="text-muted">
                  {" | "}Not available until May 13 at 12:00am |
                </small>
                <br></br>
                <small className="text-muted">
                  Due May 20 at 11:59pm | 100pts
                </small>
              </div>
              <div className="ms-auto">
                <LessonControlButtons />
              </div>
            </ListGroupItem>
            <ListGroupItem className="wd-lesson p-3 ps-1 d-flex align-items-center">
              <BsGripVertical className="me-2 fs-3" />
              <PiNotePencil className="me-2 fs-2 text-success" />{" "}
              <div className="grow px-3">
                <div className="d-flex align-items-center mb-1">
                  <Link
                    href="/courses/1234/assignments/123"
                    className="wd-assignment-link text-reset text-decoration-none fs-4"
                  >
                    A2
                  </Link>{" "}
                </div>
                <small className="text-danger">Multiple Modules</small>
                <small className="text-muted">
                  {" | "}Not available until June 13 at 12:00am |
                </small>
                <br></br>
                <small className="text-muted">
                  Due June 20 at 11:59pm | 100pts
                </small>
              </div>
              <div className="ms-auto">
                <LessonControlButtons />
              </div>
            </ListGroupItem>
            <ListGroupItem className="wd-lesson p-3 ps-1 d-flex align-items-center">
              <BsGripVertical className="me-2 fs-3" />
              <PiNotePencil className="me-2 fs-2 text-success" />{" "}
              <div className="grow px-3">
                <div className="d-flex align-items-center mb-1">
                  <Link
                    href="/courses/1234/assignments/123"
                    className="wd-assignment-link text-reset text-decoration-none fs-4"
                  >
                    A3
                  </Link>{" "}
                </div>
                <small className="text-danger">Multiple Modules</small>
                <small className="text-muted">
                  {" | "}Not available until July 23 at 12:00am |
                </small>
                <br></br>
                <small className="text-muted">
                  Due August 20 at 11:59pm | 100pts
                </small>
              </div>
              <div className="ms-auto">
                <LessonControlButtons />
              </div>
            </ListGroupItem> */
}
