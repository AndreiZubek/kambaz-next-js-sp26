"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Button, Dropdown, ListGroup, ListGroupItem } from "react-bootstrap";
import { BsGripVertical, BsPlus } from "react-icons/bs";
import { IoEllipsisVertical } from "react-icons/io5";
import { IoMdArrowDropdown } from "react-icons/io";
import { PiNotePencil } from "react-icons/pi";
import { FaTrash } from "react-icons/fa6";
import LessonControlButtons from "../modules/LessonControlButtons";
import QuizControls from "./quizControls";
import {
  deleteQuiz as deleteQuizFromStore,
  setQuizzes,
  updateQuiz as updateQuizInStore,
} from "./reducer";
import * as quizClient from "./client";
import { RootState } from "../../../store";
import { Quiz } from "./types";
import GreenCheckmark from "../modules/GreenCheckmark";

const formatDate = (value: string) => {
  if (!value) return "N/A";
  const date = new Date(value);
  return date.toLocaleDateString("en-US", {
    timeZone: "America/New_York",
    month: "short",
    day: "numeric",
  });
};

const getAvailabilityLabel = (quiz: Quiz) => {
  const now = new Date();
  const avail = quiz.availableDate ? new Date(quiz.availableDate) : null;
  const until = quiz.availableUntilDate ? new Date(quiz.availableUntilDate) : null;
  if (until && now > until) return "Closed";
  if (avail && now < avail) return `Not available until ${formatDate(quiz.availableDate)}`;
  return "Available";
};

export default function QuizzesPage() {
  const { cid } = useParams() as { cid: string };
  const router = useRouter();
  const dispatch = useDispatch();
  const { quizzes } = useSelector((state: RootState) => state.quizzesReducer);
  const isFaculty = useSelector(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (state: any) =>
      state.accountReducer.currentUser?.role === "FACULTY" ||
      state.accountReducer.currentUser?.role === "ADMIN" ||
      state.accountReducer.currentUser?.role === "TA",
  );

  const [search, setSearch] = useState("");
  const [scores, setScores] = useState<Record<string, string>>({});
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const loadQuizzes = useCallback(async () => {
    try {
      const data = await quizClient.fetchQuizzesForCourse(cid);
      dispatch(setQuizzes(data));
      if (!isFaculty) {
        const entries = await Promise.all(
          data.map(async (q: Quiz) => {
            const attempt = await quizClient.fetchLastAttempt(q._id);
            return [q._id, attempt ? `${attempt.score}/${attempt.pointsPossible}` : "--"] as const;
          })
        );
        setScores(Object.fromEntries(entries));
      }
    } catch (e) { console.error(e); }
  }, [cid, dispatch, isFaculty]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { loadQuizzes(); }, [loadQuizzes]);

  const displayed = useMemo(() => {
    const term = search.toLowerCase().trim();
    const filtered = term
      ? quizzes.filter((q: Quiz) =>
          (q.title || "").toLowerCase().includes(term) ||
          (q.description || "").toLowerCase().includes(term))
      : [...quizzes];
    filtered.sort((a: Quiz, b: Quiz) => {
      const ad = a.availableDate ? new Date(a.availableDate).getTime() : 0;
      const bd = b.availableDate ? new Date(b.availableDate).getTime() : 0;
      return ad - bd;
    });
    return filtered;
  }, [quizzes, search]);

  const createQuiz = async () => {
    const created = await quizClient.createQuizForCourse(cid, {
      title: "Unnamed Quiz", description: "", course: cid,
    });
    router.push(`/courses/${cid}/quizzes/${created._id}/editor`);
  };

  const togglePublish = async (quiz: Quiz) => {
    const updated = await quizClient.setQuizPublished(quiz._id, !quiz.published);
    dispatch(updateQuizInStore(updated));
  };

  return (
    <div id="wd-quizzes">
      <QuizControls search={search} setSearch={setSearch}
        onAddQuiz={createQuiz} isFaculty={isFaculty} />
      <br /><br />

      {confirmDeleteId && (
        <div className="alert alert-danger d-flex justify-content-between align-items-center">
          <span>Are you sure you want to delete this quiz?</span>
          <div>
            <Button className="m-2" variant="danger" size="sm"
              onClick={async () => {
                await quizClient.deleteQuiz(confirmDeleteId);
                dispatch(deleteQuizFromStore(confirmDeleteId));
                setConfirmDeleteId(null);
              }}>Yes, Delete</Button>
            <Button variant="secondary" size="sm"
              onClick={() => setConfirmDeleteId(null)}>Cancel</Button>
          </div>
        </div>
      )}

      <ListGroup className="rounded-0" id="wd-quiz-list">
        <ListGroupItem className="wd-module p-0 mb-5 fs-5 border-gray">
          <div className="wd-title p-3 ps-2 bg-secondary-subtle">
            <BsGripVertical className="fs-3" />
            <IoMdArrowDropdown className="fs-3" /> QUIZZES{" "}
            <div className="float-end">
              <BsPlus className="fs-1" />
              <IoEllipsisVertical className="fs-4" />
            </div>
          </div>
          <ListGroup className="wd-lessons rounded-0">
            {displayed.map((quiz: Quiz) => (
              <ListGroupItem key={quiz._id}
                className="wd-lesson p-3 ps-1 d-flex align-items-center">
                <BsGripVertical className="me-2 fs-3" />
                <PiNotePencil className="me-2 fs-2 text-success" />{" "}
                <div className="grow px-3">
                  <div className="d-flex align-items-center mb-1"
                    style={{ cursor: "pointer" }}
                    onClick={() => router.push(`/courses/${cid}/quizzes/${quiz._id}`)}>
                    {quiz.title}
                  </div>
                  <small className={getAvailabilityLabel(quiz) === "Available" ? "text-success" : "text-danger"}>
                    {getAvailabilityLabel(quiz)}
                  </small>
                  <small className="text-muted">
                    {" | "}Due {formatDate(quiz.dueDate)} |{" "}
                    {quiz.points || 0} pts | {(quiz.questions || []).length} Questions
                    {!isFaculty && ` | Score: ${scores[quiz._id] || "--"}`}
                  </small>
                </div>
                <div className="ms-auto d-flex align-items-center gap-2">
                  {isFaculty && (
                    <>
                      <FaTrash className="text-danger fs-5"
                        style={{ cursor: "pointer" }}
                        onClick={() => setConfirmDeleteId(quiz._id)} />
                      <button className="btn btn-link p-0 text-decoration-none"
                        onClick={() => togglePublish(quiz)}
                        title={quiz.published ? "Unpublish" : "Publish"}>
                        {quiz.published ? <GreenCheckmark /> : "🚫"}
                      </button>
                      <Dropdown align="end">
                        <Dropdown.Toggle bsPrefix="no-toggle" variant="link" className="p-0 text-dark">
                          <IoEllipsisVertical className="fs-4" />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item onClick={() => router.push(`/courses/${cid}/quizzes/${quiz._id}`)}>
                            Edit
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => togglePublish(quiz)}>
                            {quiz.published ? "Unpublish" : "Publish"}
                          </Dropdown.Item>
                          <Dropdown.Item className="text-danger" onClick={() => setConfirmDeleteId(quiz._id)}>
                            <FaTrash className="me-2" />Delete
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </>
                  )}
                  {!isFaculty && <LessonControlButtons />}
                </div>
              </ListGroupItem>
            ))}
          </ListGroup>
        </ListGroupItem>
      </ListGroup>
    </div>
  );
}
