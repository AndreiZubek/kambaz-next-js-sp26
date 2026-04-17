"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, Card, Spinner, Table } from "react-bootstrap";
import { FaCheck, FaTimes } from "react-icons/fa";
import * as client from "../client";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
import { Quiz, QuizAttempt } from "../types";

const formatDate = (value: string) => {
  if (!value) return "N/A";
  return new Date(value).toLocaleDateString("en-US", {
    timeZone: "America/New_York", month: "short", day: "numeric", year: "numeric",
  });
};

const TYPE_LABELS: Record<string, string> = {
  GRADED_QUIZ: "Graded Quiz", PRACTICE_QUIZ: "Practice Quiz",
  GRADED_SURVEY: "Graded Survey", UNGRADED_SURVEY: "Ungraded Survey",
};
const GROUP_LABELS: Record<string, string> = {
  QUIZZES: "Quizzes", EXAMS: "Exams", ASSIGNMENTS: "Assignments", PROJECT: "Project",
};

export default function QuizDetailsPage() {
  const { cid, qid } = useParams() as { cid: string; qid: string };
  const router = useRouter();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastAttempt, setLastAttempt] = useState<QuizAttempt | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const currentUser: any = useSelector((state: RootState) => state.accountReducer.currentUser);
  const isFaculty = ["FACULTY", "ADMIN", "TA"].includes(currentUser?.role || "");

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await client.fetchQuizById(qid);
      setQuiz(data);
      if (!isFaculty) {
        const att = await client.fetchLastAttempt(qid);
        setLastAttempt(att);
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [qid, isFaculty]);

  useEffect(() => { load(); }, [load]);

  const togglePublish = async () => {
    if (!quiz) return;
    const updated = await client.setQuizPublished(qid, !quiz.published);
    setQuiz(updated);
  };

  if (loading || !quiz) return <Spinner animation="border" />;

  const totalPts = (quiz.questions || []).reduce((s, q) => s + Number(q.points || 0), 0);

  if (!isFaculty) {
    const maxAttempts = quiz.multipleAttempts ? Number(quiz.howManyAttempts || 1) : 1;
    const usedAttempts = lastAttempt ? lastAttempt.attemptNumber : 0;
    const canRetake = usedAttempts < maxAttempts;

    return (
      <div className="pe-3">
        <h4>{quiz.title}</h4>
        {quiz.description && <p className="text-muted">{quiz.description}</p>}
        <p>{totalPts} pts | {(quiz.questions || []).length} Questions</p>

        {lastAttempt && (
          <Card className="mb-3">
            <Card.Body>
              <h5>Last Attempt (#{lastAttempt.attemptNumber}) — Score: {lastAttempt.score}/{lastAttempt.pointsPossible}</h5>
              <small className="text-muted">
                Submitted: {new Date(lastAttempt.submittedAt).toLocaleString()}
              </small>
              <hr />
              {(lastAttempt.questionResults || []).map((qr, i) => {
                const question = (quiz.questions || []).find((q) => q._id === qr.questionId);
                if (!question) return null;

                const studentAnswer = (lastAttempt.answers || []).find(
                  (a) => a.questionId === qr.questionId
                );

                return (
                  <div key={qr.questionId}
                    className={`mb-3 p-3 border rounded ${qr.correct ? "border-success bg-success bg-opacity-10" : "border-danger bg-danger bg-opacity-10"}`}>
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <strong>
                        {qr.correct
                          ? <FaCheck className="text-success me-2" />
                          : <FaTimes className="text-danger me-2" />}
                        Question {i + 1}: {question.title}
                      </strong>
                      <span className={qr.correct ? "text-success" : "text-danger"}>
                        {qr.pointsEarned}/{qr.pointsPossible} pts
                      </span>
                    </div>
                    <p className="mb-2">{question.question}</p>

                    {question.type === "MULTIPLE_CHOICE" && (
                      <div>
                        {(question.choices || []).map((choice) => {
                          const picked = studentAnswer?.value === choice._id;
                          return (
                            <div key={choice._id} className={`ms-3 ${picked ? "fw-bold" : ""}`}>
                              {picked ? "→ " : "  "}
                              {choice.text}
                              {picked && !qr.correct && <span className="text-danger ms-2">(your answer)</span>}
                              {picked && qr.correct && <span className="text-success ms-2">(your answer ✓)</span>}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {question.type === "TRUE_FALSE" && (
                      <div className="ms-3">
                        Your answer: <strong>{String(studentAnswer?.value)}</strong>
                        {!qr.correct && <span className="text-danger ms-2">(incorrect)</span>}
                        {qr.correct && <span className="text-success ms-2">(correct ✓)</span>}
                      </div>
                    )}

                    {question.type === "FILL_BLANK" && (
                      <div className="ms-3">
                        Your answer: <strong>&quot;{String(studentAnswer?.value || "")}&quot;</strong>
                        {!qr.correct && <span className="text-danger ms-2">(incorrect)</span>}
                        {qr.correct && <span className="text-success ms-2">(correct ✓)</span>}
                      </div>
                    )}
                  </div>
                );
              })}
            </Card.Body>
          </Card>
        )}

        <div className="d-flex gap-2">
          {canRetake ? (
            <Button variant="danger"
              onClick={() => router.push(`/courses/${cid}/quizzes/${qid}/take`)}>
              {lastAttempt ? "Retake Quiz" : "Start Quiz"}
            </Button>
          ) : (
            <Button variant="secondary" disabled>
              No attempts remaining ({usedAttempts}/{maxAttempts})
            </Button>
          )}
          <Button variant="secondary"
            onClick={() => router.push(`/courses/${cid}/quizzes`)}>
            Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="pe-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Button variant="outline-secondary" size="sm" onClick={togglePublish}>
          {quiz.published ? "Unpublish" : "Publish"}
        </Button>
        <div className="d-flex gap-2">
          <Button variant="outline-secondary" size="sm"
            onClick={() => router.push(`/courses/${cid}/quizzes/${qid}/take?preview=true`)}>
            Preview
          </Button>
          <Button variant="outline-secondary" size="sm"
            onClick={() => router.push(`/courses/${cid}/quizzes/${qid}/editor`)}>
            Edit
          </Button>
        </div>
      </div>
      <hr />
      <h4>{quiz.title}</h4>

      <Table borderless size="sm" className="mt-3" style={{ maxWidth: 500 }}>
        <tbody>
          {[
            ["Quiz Type", TYPE_LABELS[quiz.quizType] || quiz.quizType],
            ["Points", totalPts],
            ["Assignment Group", GROUP_LABELS[quiz.assignmentGroup] || quiz.assignmentGroup],
            ["Shuffle Answers", quiz.shuffleAnswers ? "Yes" : "No"],
            ["Time Limit", quiz.timeLimit > 0 ? `${quiz.timeLimit} Minutes` : "No Limit"],
            ["Multiple Attempts", quiz.multipleAttempts ? `Yes (${quiz.howManyAttempts})` : "No"],
            ["Show Correct Answers", quiz.showCorrectAnswers || "Immediately"],
            ["One Question at a Time", quiz.oneQuestionAtATime ? "Yes" : "No"],
            ["Webcam Required", quiz.webcamRequired ? "Yes" : "No"],
            ["Lock Questions After Answering", quiz.lockQuestionsAfterAnswering ? "Yes" : "No"],
          ].map(([label, val]) => (
            <tr key={String(label)}>
              <td className="text-end fw-bold pe-3">{label}</td>
              <td>{String(val)}</td>
            </tr>
          ))}
          {quiz.accessCode && (
            <tr><td className="text-end fw-bold pe-3">Access Code</td><td>{quiz.accessCode}</td></tr>
          )}
        </tbody>
      </Table>

      <Table bordered size="sm" className="mt-3" style={{ maxWidth: 600 }}>
        <thead><tr><th>Due</th><th>Available from</th><th>Until</th></tr></thead>
        <tbody><tr>
          <td>{formatDate(quiz.dueDate)}</td>
          <td>{formatDate(quiz.availableDate)}</td>
          <td>{formatDate(quiz.availableUntilDate)}</td>
        </tr></tbody>
      </Table>

      <div className="mt-3 text-muted">{(quiz.questions || []).length} Questions</div>
    </div>
  );
}
