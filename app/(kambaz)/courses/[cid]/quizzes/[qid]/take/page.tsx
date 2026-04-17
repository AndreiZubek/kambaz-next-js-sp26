"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Alert, Button, Card, Form, Spinner } from "react-bootstrap";
import { FaCheck, FaTimes } from "react-icons/fa";
import * as client from "../../client";
import { Quiz, QuestionResult } from "../../types";

export default function TakeQuizPage() {
  const { cid, qid } = useParams() as { cid: string; qid: string };
  const router = useRouter();
  const params = useSearchParams();
  const isPreview = params.get("preview") === "true";

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<string, string | boolean | undefined>>({});
  const [result, setResult] = useState<{
    score: number; pointsPossible: number; questionResults: QuestionResult[];
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await client.fetchQuizById(qid);
      setQuiz(data);
    } catch (e: unknown) {
      console.error(e);
      const err = e as { response?: { data?: { message?: string } } };
      setErrorMessage(err?.response?.data?.message || "Unable to load quiz");
    } finally { setLoading(false); }
  }, [qid]);

  useEffect(() => { load(); }, [load]);

  const preparedAnswers = useMemo(
    () => Object.entries(answers)
      .filter(([, v]) => v !== undefined)
      .map(([questionId, value]) => ({ questionId, value: value as string | boolean })),
    [answers],
  );

  const submitQuiz = async () => {
    try {
      setErrorMessage("");
      const response = isPreview
        ? await client.previewQuizAttempt(qid, preparedAnswers)
        : await client.submitQuizAttempt(qid, preparedAnswers);
      setResult(response.attempt);
    } catch (e: unknown) {
      console.error(e);
      const err = e as { response?: { data?: { message?: string } } };
      setErrorMessage(err?.response?.data?.message || "Unable to submit quiz");
    }
  };

  if (loading || !quiz) return <Spinner animation="border" />;

  const questions = quiz.questions || [];
  const showOneAtATime = quiz.oneQuestionAtATime && !result;
  const current = questions[currentIndex];

  if (result) {
    return (
      <div className="pe-3">
        <h4>{quiz.title}</h4>
        {isPreview && ( // Preview mode banner for viewer to be notified
          <Alert variant="info">This is a preview of the published version of the quiz.</Alert>
        )}
        <Card className="mb-3">
          <Card.Body>
            <h5>Score: {result.score}/{result.pointsPossible}</h5>
            <hr />
            {(result.questionResults || []).map((qr, i) => {
              const question = questions.find((q) => q._id === qr.questionId);
              if (!question) return null;
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
                        const picked = answers[question._id] === choice._id;
                        return (
                          <div key={choice._id} className={`ms-3 ${picked ? "fw-bold" : ""}`}>
                            {picked ? "→ " : "  "}{choice.text}
                            {picked && qr.correct && <span className="text-success ms-2">(your answer ✓)</span>}
                            {picked && !qr.correct && <span className="text-danger ms-2">(your answer)</span>}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {question.type === "TRUE_FALSE" && (
                    <div className="ms-3">
                      Your answer: <strong>{String(answers[question._id])}</strong>
                      {qr.correct
                        ? <span className="text-success ms-2">(correct ✓)</span>
                        : <span className="text-danger ms-2">(incorrect)</span>}
                    </div>
                  )}

                  {question.type === "FILL_BLANK" && (
                    <div className="ms-3">
                      Your answer: <strong>&quot;{String(answers[question._id] || "")}&quot;</strong>
                      {qr.correct
                        ? <span className="text-success ms-2">(correct)</span>
                        : <span className="text-danger ms-2">(incorrect)</span>}
                    </div>
                  )}
                </div>
              );
            })}
            <div className="d-flex gap-2 mt-3">
              {isPreview ? (
                <>
                  <Button variant="outline-danger"
                    onClick={() => router.push(`/courses/${cid}/quizzes/${qid}/editor`)}>
                    Keep Editing This Quiz
                  </Button>
                  <Button variant="secondary"
                    onClick={() => router.push(`/courses/${cid}/quizzes`)}>
                    Back to Quizzes
                  </Button>
                </>
              ) : (
                <Button variant="danger"
                  onClick={() => router.push(`/courses/${cid}/quizzes/${qid}`)}>
                  View Results
                </Button>
              )}
            </div>
          </Card.Body>
        </Card>
      </div>
    );
  }

  const renderQuestion = (question: typeof questions[0], idx: number) => (
    <Card className="mb-3" key={question._id}>
      <Card.Body>
        <div className="d-flex justify-content-between">
          <h6>Question {idx + 1}: {question.title}</h6>
          <span>{question.points} pts</span>
        </div>
        <p>{question.question}</p>

        {question.type === "MULTIPLE_CHOICE" &&
          (question.choices || []).map((choice) => (
            <Form.Check key={choice._id} type="radio" name={question._id}
              label={choice.text}
              checked={answers[question._id] === choice._id}
              onChange={() => setAnswers({ ...answers, [question._id]: choice._id })} />
          ))}

        {question.type === "TRUE_FALSE" && (
          <>
            <Form.Check type="radio" name={question._id} label="True"
              checked={answers[question._id] === true}
              onChange={() => setAnswers({ ...answers, [question._id]: true })} />
            <Form.Check type="radio" name={question._id} label="False"
              checked={answers[question._id] === false}
              onChange={() => setAnswers({ ...answers, [question._id]: false })} />
          </>
        )}

        {question.type === "FILL_BLANK" && (
          <Form.Control
            value={(answers[question._id] as string | undefined) || ""}
            onChange={(e) => setAnswers({ ...answers, [question._id]: e.target.value })}
            placeholder="Type your answer" />
        )}
      </Card.Body>
    </Card>
  );

  return (
    <div className="pe-3">
      <h4 className="mb-1">{quiz.title}</h4>
      {quiz.description && <p className="text-muted">{quiz.description}</p>}
      {isPreview && (
        <Alert variant="info">This is a preview of the published version of the quiz.</Alert>
      )}
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

      {showOneAtATime && current ? (
        <>
          {renderQuestion(current, currentIndex)}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="d-flex gap-1 flex-wrap">
              {questions.map((_, i) => (
                <Button key={i} size="sm"
                  variant={i === currentIndex ? "danger" : "outline-secondary"}
                  onClick={() => setCurrentIndex(i)}>
                  {i + 1}
                </Button>
              ))}
            </div>
            <div className="d-flex gap-2">
              {currentIndex > 0 && (
                <Button variant="outline-secondary" onClick={() => setCurrentIndex(currentIndex - 1)}>
                  Previous
                </Button>
              )}
              {currentIndex < questions.length - 1 ? (
                <Button variant="outline-secondary" onClick={() => setCurrentIndex(currentIndex + 1)}>
                  Next
                </Button>
              ) : (
                <Button variant="danger" onClick={submitQuiz}>
                  {isPreview ? "Submit Preview" : "Submit Quiz"}
                </Button>
              )}
            </div>
          </div>
        </>
      ) : (
        <>
          {questions.map((q, i) => renderQuestion(q, i))}
          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary"
              onClick={() => router.push(`/courses/${cid}/quizzes`)}>Cancel</Button>
            <Button variant="danger" onClick={submitQuiz}>
              {isPreview ? "Submit Preview" : "Submit Quiz"}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
