"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Alert, Button, Card, Form, Spinner } from "react-bootstrap";
import * as client from "../../client";
import { Quiz, QuestionResult } from "../../types";

export default function TakeQuizPage() {
  const { cid, qid } = useParams();
  const courseId = cid as string;
  const quizId = qid as string;
  const router = useRouter();
  const params = useSearchParams();
  const isPreview = params.get("preview") === "true";

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<
    Record<string, string | boolean | undefined>
  >({});
  const [result, setResult] = useState<{
    score: number;
    pointsPossible: number;
    questionResults: QuestionResult[];
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const loadQuiz = useCallback(async () => {
    try {
      setLoading(true);
      const data = await client.fetchQuizById(quizId);
      setQuiz(data);
    } catch (error: unknown) {
      console.error(error);
      const maybeError = error as {
        response?: { data?: { message?: string } };
      };
      setErrorMessage(
        maybeError?.response?.data?.message || "Unable to load quiz",
      );
    } finally {
      setLoading(false);
    }
  }, [quizId]);

  useEffect(() => {
    loadQuiz();
  }, [loadQuiz]);

  const preparedAnswers = useMemo(
    () =>
      Object.entries(answers)
        .filter(([, value]) => value !== undefined)
        .map(([questionId, value]) => ({
          questionId,
          value: value as string | boolean,
        })),
    [answers],
  );

  const submitQuiz = async () => {
    try {
      setErrorMessage("");
      const response = isPreview
        ? await client.previewQuizAttempt(quizId, preparedAnswers)
        : await client.submitQuizAttempt(quizId, preparedAnswers);
      setResult(response.attempt);
    } catch (error: unknown) {
      console.error(error);
      const maybeError = error as {
        response?: { data?: { message?: string } };
      };
      setErrorMessage(
        maybeError?.response?.data?.message || "Unable to submit quiz",
      );
    }
  };

  if (loading || !quiz) {
    return <Spinner animation="border" />;
  }

  return (
    <div className="pe-3">
      <h4 className="mb-1">{quiz.title}</h4>
      <p className="text-muted">{quiz.description}</p>

      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

      {result ? (
        <Card>
          <Card.Body>
            <h5>
              Score: {result.score}/{result.pointsPossible}
            </h5>
            {(result.questionResults || []).map(
              (questionResult: QuestionResult) => (
                <div key={questionResult.questionId} className="mb-2">
                  <span
                    className={
                      questionResult.correct ? "text-success" : "text-danger"
                    }
                  >
                    {questionResult.correct ? "Correct" : "Incorrect"}
                  </span>{" "}
                  - {questionResult.pointsEarned}/
                  {questionResult.pointsPossible} pts
                </div>
              ),
            )}
            <div className="mt-3">
              <Button
                variant="secondary"
                onClick={() => router.push(`/courses/${courseId}/quizzes`)}
              >
                Back to Quizzes
              </Button>
            </div>
          </Card.Body>
        </Card>
      ) : (
        <>
          {(quiz.questions || []).map((question, index: number) => (
            <Card className="mb-3" key={question._id}>
              <Card.Body>
                <h6>
                  Question {index + 1}: {question.title} ({question.points} pts)
                </h6>
                <p>{question.question}</p>

                {question.type === "MULTIPLE_CHOICE" &&
                  (question.choices || []).map((choice) => (
                    <Form.Check
                      key={choice._id}
                      type="radio"
                      name={question._id}
                      label={choice.text}
                      checked={answers[question._id] === choice._id}
                      onChange={() =>
                        setAnswers({ ...answers, [question._id]: choice._id })
                      }
                    />
                  ))}

                {question.type === "TRUE_FALSE" && (
                  <Form.Select
                    value={String(answers[question._id] ?? "")}
                    onChange={(e) =>
                      setAnswers({
                        ...answers,
                        [question._id]: e.target.value === "true",
                      })
                    }
                  >
                    <option value="">Select one</option>
                    <option value="true">True</option>
                    <option value="false">False</option>
                  </Form.Select>
                )}

                {question.type === "FILL_BLANK" && (
                  <Form.Control
                    value={(answers[question._id] as string | undefined) || ""}
                    onChange={(e) =>
                      setAnswers({ ...answers, [question._id]: e.target.value })
                    }
                    placeholder="Type your answer"
                  />
                )}
              </Card.Body>
            </Card>
          ))}

          <div className="d-flex justify-content-end gap-2">
            <Button
              variant="secondary"
              onClick={() => router.push(`/courses/${courseId}/quizzes`)}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={submitQuiz}>
              {isPreview ? "Preview Quiz" : "Submit Quiz"}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
