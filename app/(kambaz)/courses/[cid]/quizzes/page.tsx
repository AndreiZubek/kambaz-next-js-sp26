"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Dropdown,
  Form,
  ListGroup,
  ListGroupItem,
  Spinner,
} from "react-bootstrap";
import { FaPlus, FaSearch, FaTrash } from "react-icons/fa";
import { IoEllipsisVertical } from "react-icons/io5";
import { PiNotePencil } from "react-icons/pi";
import { BsGripVertical } from "react-icons/bs";
import {
  deleteQuiz as deleteQuizFromStore,
  setQuizzes,
  updateQuiz as updateQuizInStore,
} from "./reducer";
import * as client from "./client";
import { RootState } from "../../../store";
import { Quiz } from "./types";
import { IoMdArrowDropdown } from "react-icons/io";

const formatDate = (value: string) => {
  if (!value) return "N/A";
  const date = new Date(value);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const getAvailabilityLabel = (quiz: Quiz) => {
  const now = new Date();
  const availableDate = quiz.availableDate
    ? new Date(quiz.availableDate)
    : null;
  const untilDate = quiz.availableUntilDate
    ? new Date(quiz.availableUntilDate)
    : null;

  if (untilDate && now > untilDate) {
    return "Closed";
  }
  if (availableDate && now < availableDate) {
    return `Not available until ${formatDate(quiz.availableDate)}`;
  }
  return "Available";
};

export default function QuizzesPage() {
  const { cid } = useParams();
  const courseId = cid as string;
  const router = useRouter();
  const dispatch = useDispatch();
  const { quizzes } = useSelector((state: RootState) => state.quizzesReducer);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [scores, setScores] = useState<Record<string, string>>({});
  const currentUserRole = useSelector(
    (state: RootState) =>
      ((state.accountReducer.currentUser as { role?: string } | null)?.role ||
        "") as string,
  );
  const isFaculty = ["FACULTY", "ADMIN", "TA"].includes(currentUserRole);

  const loadQuizzes = useCallback(async () => {
    try {
      setLoading(true);
      const data = await client.fetchQuizzesForCourse(courseId);
      dispatch(setQuizzes(data));
      if (!isFaculty) {
        const entries = await Promise.all(
          data.map(async (quiz: Quiz) => {
            const attempt = await client.fetchLastAttempt(quiz._id);
            const score = attempt
              ? `${attempt.score}/${attempt.pointsPossible}`
              : "--";
            return [quiz._id, score] as const;
          }),
        );
        setScores(Object.fromEntries(entries));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [courseId, dispatch, isFaculty]);

  useEffect(() => {
    loadQuizzes();
  }, [loadQuizzes]);

  const displayed = useMemo(() => {
    const searchTerm = search.toLowerCase().trim();
    if (!searchTerm) return quizzes;
    return quizzes.filter(
      (quiz: Quiz) =>
        String(quiz.title || "")
          .toLowerCase()
          .includes(searchTerm) ||
        String(quiz.description || "")
          .toLowerCase()
          .includes(searchTerm),
    );
  }, [quizzes, search]);

  const createQuiz = async () => {
    try {
      const created = await client.createQuizForCourse(courseId, {
        title: "Unnamed Quiz",
        description: "",
        course: courseId,
      });
      router.push(`/courses/${courseId}/quizzes/${created._id}`);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteQuiz = async (quizId: string) => {
    try {
      await client.deleteQuiz(quizId);
      dispatch(deleteQuizFromStore(quizId));
    } catch (error) {
      console.error(error);
    }
  };

  const togglePublish = async (quiz: Quiz) => {
    try {
      const updated = await client.setQuizPublished(quiz._id, !quiz.published);
      dispatch(updateQuizInStore(updated));
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="p-3">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <div id="wd-quizzes" className="pe-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Form.Group className="position-relative">
          <Form.Control
            size="sm"
            className="ps-5"
            type="search"
            placeholder="Search for Quiz"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Form.Group>
        {isFaculty && (
          <Button variant="danger" onClick={createQuiz}>
            <FaPlus className="me-2" />
            Quiz
          </Button>
        )}
      </div>

      {displayed.length === 0 && (
        <div className="alert alert-light border">
          No quizzes yet. Click <strong>+ Quiz</strong> to create one.
        </div>
      )}

      {displayed.length > 0 && (
        <ListGroup className="rounded-0" id="wd-quiz-list">
          <ListGroupItem className="wd-module p-0 mb-4 fs-6 border-gray">
            <div className="wd-title p-3 ps-2 bg-secondary-subtle fw-bold">
              <IoMdArrowDropdown className="me-2 fs-5" /> Assignment Quizzes
            </div>
            <ListGroup className="wd-lessons rounded-0">
              {displayed.map((quiz: Quiz) => (
                <ListGroupItem
                  key={quiz._id}
                  className="wd-lesson p-3 ps-1 d-flex align-items-start"
                >
                  <PiNotePencil className="me-2 fs-4 text-success" />
                  <div className="grow px-2" style={{ minWidth: 0 }}>
                    <div className="d-flex align-items-center">
                      <button
                        className="btn btn-link p-0 text-start text-danger fw-semibold text-decoration-none"
                        onClick={() =>
                          router.push(
                            `/courses/${courseId}/quizzes/${quiz._id}`,
                          )
                        }
                      >
                        {quiz.title}
                      </button>
                    </div>
                    <small className="d-block text-muted">
                      {getAvailabilityLabel(quiz)}
                    </small>
                    <small className="text-muted">
                      Due {formatDate(quiz.dueDate)} | {quiz.points || 0} pts |{" "}
                      {(quiz.questions || []).length} Questions
                      {!isFaculty
                        ? ` | Score: ${scores[quiz._id] || "--"}`
                        : ""}
                    </small>
                  </div>

                  <div className="ms-auto d-flex align-items-center gap-2">
                    {isFaculty && (
                      <button
                        className="btn btn-link text-decoration-none p-0"
                        onClick={() => togglePublish(quiz)}
                        title={quiz.published ? "Unpublish" : "Publish"}
                      >
                        {quiz.published ? "✅" : "🚫"}
                      </button>
                    )}
                    {isFaculty && (
                      <Dropdown align="end">
                        <Dropdown.Toggle
                          bsPrefix="no-toggle"
                          variant="link"
                          className="p-0 text-dark"
                        >
                          <IoEllipsisVertical className="fs-5" />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item
                            onClick={() =>
                              router.push(
                                `/courses/${courseId}/quizzes/${quiz._id}`,
                              )
                            }
                          >
                            Edit
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => togglePublish(quiz)}>
                            {quiz.published ? "Unpublish" : "Publish"}
                          </Dropdown.Item>
                          <Dropdown.Item
                            className="text-danger"
                            onClick={() => deleteQuiz(quiz._id)}
                          >
                            <FaTrash className="me-2" />
                            Delete
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    )}
                  </div>
                </ListGroupItem>
              ))}
            </ListGroup>
          </ListGroupItem>
        </ListGroup>
      )}
    </div>
  );
}
