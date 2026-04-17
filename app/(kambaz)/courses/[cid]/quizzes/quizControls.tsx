"use client";

import { Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { FaSearch } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";

export default function QuizControls({
  search, setSearch, onAddQuiz, isFaculty,
}: {
  search: string; setSearch: (v: string) => void;
  onAddQuiz: () => void; isFaculty: boolean;
}) {
  return (
    <div id="wd-quiz-controls" className="text-nowrap position-relative">
      <Form.Group className="position-relative d-inline-block me-2" id="wd-search-quiz">
        <FaSearch className="position-absolute mt-3 ms-3 fs-5" />
        <Form.Control size="lg" className="ps-5 w-auto" type="search"
          placeholder="Search..." value={search}
          onChange={(e) => setSearch(e.target.value)} />
      </Form.Group>
      {isFaculty && (
        <Button variant="danger" size="lg" className="me-1 float-end"
          id="wd-add-quiz" onClick={onAddQuiz}>
          <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
          Quiz
        </Button>
      )}
    </div>
  );
}
