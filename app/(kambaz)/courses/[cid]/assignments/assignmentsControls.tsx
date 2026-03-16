"use client";

import { Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { FaSearch } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
export default function AssignmentsControls() {
  const { cid } = useParams();
  const router = useRouter();
  const isFaculty = useSelector(
    (state: any) =>
      state.accountReducer.currentUser?.role === "FACULTY" ||
      state.accountReducer.currentUser?.role === "ADMIN" ||
      state.accountReducer.currentUser?.role === "TA",
  );
  return (
    <div id="wd-assignments-controls" className="text-nowrap position-relative">
      <Form.Group
        className="position-relative d-inline-block me-2"
        id="wd-search-assignment"
      >
        <FaSearch className="position-absolute mt-3 ms-3 fs-5" />
        <Form.Control
          size="lg"
          className="ps-5 w-auto"
          type="search"
          placeholder="Search..."
        />
      </Form.Group>
      <Button
        variant="danger"
        size="lg"
        className="me-1 float-end"
        id="wd-add-assignment"
        onClick={() => {
          if (isFaculty) {
            router.push(`/courses/${cid}/assignments/new`);
          }
        }}
      >
        <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
        Assignment
      </Button>
      <Button
        variant="secondary"
        size="lg"
        className="me-1 float-end"
        id="wd-add-assignment-group"
      >
        <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
        Group
      </Button>
    </div>
  );
}
