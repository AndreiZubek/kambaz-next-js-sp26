"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Button,
  Card,
  Form,
  Row,
  Col,
  Spinner,
  Tab,
  Tabs,
} from "react-bootstrap";
import * as client from "../client";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
import { Quiz, QuizChoice, QuizQuestion, QuestionType } from "../types";

const defaultQuestion = {
  type: "MULTIPLE_CHOICE",
  title: "Easy Question",
  question: "",
  points: 1,
  choices: [
    { text: "", isCorrect: true },
    { text: "", isCorrect: false },
  ],
  correctAnswer: true,
  correctAnswers: [""],
} as Partial<QuizQuestion>;

export default function QuizEditorPage() {
  const { cid, qid } = useParams();
  const courseId = cid as string;
  const quizId = qid as string;
  const router = useRouter();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("details");

  const currentUserRole = useSelector(
    (state: RootState) =>
      ((state.accountReducer.currentUser as { role?: string } | null)?.role ||
        "") as string,
  );
  const isFaculty = ["FACULTY", "ADMIN", "TA"].includes(currentUserRole);

  const totalPoints = useMemo(
    () =>
      (quiz?.questions || []).reduce(
        (sum: number, q: QuizQuestion) => sum + Number(q.points || 0),
        0,
      ),
    [quiz],
  );

  const loadQuiz = useCallback(async () => {
    try {
      setLoading(true);
      const data = await client.fetchQuizById(quizId);
      setQuiz({ ...data, questions: data.questions || [] });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [quizId]);

  useEffect(() => {
    loadQuiz();
  }, [loadQuiz]);

  const onSave = async () => {
    if (!quiz) return;
    const updated = await client.updateQuiz({
      ...quiz,
      points: totalPoints,
    });
    setQuiz(updated);
    router.push(`/courses/${courseId}/quizzes/${quizId}`);
  };

  const onSaveAndPublish = async () => {
    if (!quiz) return;
    await client.updateQuiz({
      ...quiz,
      points: totalPoints,
      published: true,
    });
    await client.setQuizPublished(quizId, true);
    router.push(`/courses/${courseId}/quizzes`);
  };

  const onCancel = () => router.push(`/courses/${courseId}/quizzes`);

  const addQuestion = async () => {
    const created = await client.addQuestion(quizId, defaultQuestion);
    setQuiz((prev) =>
      prev
        ? { ...prev, questions: [...(prev.questions || []), created] }
        : prev,
    );
    setActiveTab("questions");
  };

  const updateQuestionLocal = (index: number, next: QuizQuestion) => {
    setQuiz((prev) => {
      if (!prev) return prev;
      const questions = [...(prev.questions || [])];
      questions[index] = next;
      return { ...prev, questions };
    });
  };

  const saveQuestion = async (question: QuizQuestion) => {
    const updated = await client.updateQuestion(quizId, question._id, question);
    setQuiz((prev) =>
      prev
        ? {
            ...prev,
            questions: prev.questions.map((q) =>
              q._id === updated._id ? updated : q,
            ),
          }
        : prev,
    );
  };

  const removeQuestion = async (questionId: string) => {
    await client.deleteQuestion(quizId, questionId);
    setQuiz((prev) =>
      prev
        ? {
            ...prev,
            questions: prev.questions.filter((q) => q._id !== questionId),
          }
        : prev,
    );
  };

  if (loading || !quiz) {
    return <Spinner animation="border" />;
  }

  if (!isFaculty) {
    return (
      <div>
        <h4>{quiz.title}</h4>
        <p className="text-muted">{quiz.description}</p>
        <p>
          {quiz.points || totalPoints} pts | {(quiz.questions || []).length}{" "}
          questions
        </p>
        <Button
          variant="danger"
          onClick={() =>
            router.push(`/courses/${courseId}/quizzes/${quizId}/take`)
          }
        >
          Start Quiz
        </Button>
      </div>
    );
  }

  return (
    <div className="pe-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">{quiz.title}</h4>
        <div>
          <span className="me-3">Points: {totalPoints}</span>
          <span className="text-muted">
            {quiz.published ? "Published" : "Not Published"}
          </span>
        </div>
      </div>

      <Tabs
        activeKey={activeTab}
        onSelect={(key) => setActiveTab(key || "details")}
        className="mb-3"
      >
        <Tab eventKey="details" title="Details">
          <Form.Group className="mb-3">
            <Form.Label>Quiz Title</Form.Label>
            <Form.Control
              value={quiz.title || ""}
              onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={quiz.description || ""}
              onChange={(e) =>
                setQuiz({ ...quiz, description: e.target.value })
              }
            />
          </Form.Group>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Label>Quiz Type</Form.Label>
              <Form.Select
                value={quiz.quizType || "GRADED_QUIZ"}
                onChange={(e) =>
                  setQuiz({
                    ...quiz,
                    quizType: e.target.value as Quiz["quizType"],
                  })
                }
              >
                <option value="GRADED_QUIZ">Graded Quiz</option>
                <option value="PRACTICE_QUIZ">Practice Quiz</option>
                <option value="GRADED_SURVEY">Graded Survey</option>
                <option value="UNGRADED_SURVEY">Ungraded Survey</option>
              </Form.Select>
            </Col>
            <Col md={6}>
              <Form.Label>Assignment Group</Form.Label>
              <Form.Select
                value={quiz.assignmentGroup || "QUIZZES"}
                onChange={(e) =>
                  setQuiz({
                    ...quiz,
                    assignmentGroup: e.target.value as Quiz["assignmentGroup"],
                  })
                }
              >
                <option value="QUIZZES">Quizzes</option>
                <option value="EXAMS">Exams</option>
                <option value="ASSIGNMENTS">Assignments</option>
                <option value="PROJECT">Project</option>
              </Form.Select>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={4}>
              <Form.Label>Time Limit (minutes)</Form.Label>
              <Form.Control
                type="number"
                value={quiz.timeLimit ?? 20}
                onChange={(e) =>
                  setQuiz({ ...quiz, timeLimit: Number(e.target.value) })
                }
              />
            </Col>
            <Col md={4}>
              <Form.Label>Multiple Attempts</Form.Label>
              <Form.Select
                value={quiz.multipleAttempts ? "YES" : "NO"}
                onChange={(e) =>
                  setQuiz({
                    ...quiz,
                    multipleAttempts: e.target.value === "YES",
                  })
                }
              >
                <option value="NO">No</option>
                <option value="YES">Yes</option>
              </Form.Select>
            </Col>
            <Col md={4}>
              <Form.Label>How Many Attempts</Form.Label>
              <Form.Control
                type="number"
                value={quiz.howManyAttempts ?? 1}
                onChange={(e) =>
                  setQuiz({ ...quiz, howManyAttempts: Number(e.target.value) })
                }
                disabled={!quiz.multipleAttempts}
              />
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Check
                type="switch"
                id="wd-shuffle-answers"
                label="Shuffle Answers"
                checked={Boolean(quiz.shuffleAnswers)}
                onChange={(e) =>
                  setQuiz({ ...quiz, shuffleAnswers: e.target.checked })
                }
              />
              <Form.Check
                type="switch"
                id="wd-one-question"
                label="One Question at a Time"
                checked={Boolean(quiz.oneQuestionAtATime)}
                onChange={(e) =>
                  setQuiz({ ...quiz, oneQuestionAtATime: e.target.checked })
                }
              />
              <Form.Check
                type="switch"
                id="wd-lock-after"
                label="Lock Questions After Answering"
                checked={Boolean(quiz.lockQuestionsAfterAnswering)}
                onChange={(e) =>
                  setQuiz({
                    ...quiz,
                    lockQuestionsAfterAnswering: e.target.checked,
                  })
                }
              />
            </Col>
            <Col md={6}>
              <Form.Check
                type="switch"
                id="wd-webcam-required"
                label="Webcam Required"
                checked={Boolean(quiz.webcamRequired)}
                onChange={(e) =>
                  setQuiz({ ...quiz, webcamRequired: e.target.checked })
                }
              />
              <Form.Group className="mt-2">
                <Form.Label>Access Code</Form.Label>
                <Form.Control
                  value={quiz.accessCode || ""}
                  onChange={(e) =>
                    setQuiz({ ...quiz, accessCode: e.target.value })
                  }
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={4}>
              <Form.Label>Due</Form.Label>
              <Form.Control
                type="datetime-local"
                value={(quiz.dueDate || "").slice(0, 16)}
                onChange={(e) => setQuiz({ ...quiz, dueDate: e.target.value })}
              />
            </Col>
            <Col md={4}>
              <Form.Label>Available from</Form.Label>
              <Form.Control
                type="datetime-local"
                value={(quiz.availableDate || "").slice(0, 16)}
                onChange={(e) =>
                  setQuiz({ ...quiz, availableDate: e.target.value })
                }
              />
            </Col>
            <Col md={4}>
              <Form.Label>Until</Form.Label>
              <Form.Control
                type="datetime-local"
                value={(quiz.availableUntilDate || "").slice(0, 16)}
                onChange={(e) =>
                  setQuiz({ ...quiz, availableUntilDate: e.target.value })
                }
              />
            </Col>
          </Row>
        </Tab>

        <Tab eventKey="questions" title="Questions">
          <div className="mb-3">
            <Button variant="light" onClick={addQuestion}>
              + New Question
            </Button>
          </div>

          {(quiz.questions || []).map(
            (question: QuizQuestion, index: number) => (
              <Card className="mb-3" key={question._id}>
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <Form.Control
                      style={{ maxWidth: "220px" }}
                      value={question.title || ""}
                      onChange={(e) =>
                        updateQuestionLocal(index, {
                          ...question,
                          title: e.target.value,
                        })
                      }
                    />
                    <div className="d-flex align-items-center gap-2">
                      <Form.Select
                        style={{ width: "180px" }}
                        value={question.type}
                        onChange={(e) =>
                          updateQuestionLocal(index, {
                            ...question,
                            type: e.target.value as QuestionType,
                          })
                        }
                      >
                        <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                        <option value="TRUE_FALSE">True/False</option>
                        <option value="FILL_BLANK">Fill In The Blank</option>
                      </Form.Select>
                      <Form.Control
                        style={{ width: "80px" }}
                        type="number"
                        value={question.points ?? 1}
                        onChange={(e) =>
                          updateQuestionLocal(index, {
                            ...question,
                            points: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                  </div>

                  <Form.Group className="mb-2">
                    <Form.Label>Question</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      value={question.question || ""}
                      onChange={(e) =>
                        updateQuestionLocal(index, {
                          ...question,
                          question: e.target.value,
                        })
                      }
                    />
                  </Form.Group>

                  {question.type === "MULTIPLE_CHOICE" && (
                    <div>
                      {(question.choices || []).map(
                        (choice: QuizChoice, cIndex: number) => (
                          <div
                            key={choice._id || cIndex}
                            className="d-flex mb-2"
                          >
                            <Form.Check
                              type="radio"
                              className="me-2"
                              name={`correct-${question._id}`}
                              checked={Boolean(choice.isCorrect)}
                              onChange={() => {
                                updateQuestionLocal(index, {
                                  ...question,
                                  choices: (question.choices || []).map(
                                    (c: QuizChoice, i: number) => ({
                                      ...c,
                                      isCorrect: i === cIndex,
                                    }),
                                  ),
                                });
                              }}
                            />
                            <Form.Control
                              value={choice.text || ""}
                              onChange={(e) => {
                                const nextChoices = [
                                  ...(question.choices || []),
                                ];
                                nextChoices[cIndex] = {
                                  ...choice,
                                  text: e.target.value,
                                };
                                updateQuestionLocal(index, {
                                  ...question,
                                  choices: nextChoices,
                                });
                              }}
                            />
                          </div>
                        ),
                      )}
                      <Button
                        size="sm"
                        variant="link"
                        className="text-danger p-0"
                        onClick={() =>
                          updateQuestionLocal(index, {
                            ...question,
                            choices: [
                              ...(question.choices || []),
                              { text: "", isCorrect: false },
                            ],
                          })
                        }
                      >
                        + Add Another Answer
                      </Button>
                    </div>
                  )}

                  {question.type === "TRUE_FALSE" && (
                    <Form.Select
                      value={String(question.correctAnswer ?? true)}
                      onChange={(e) =>
                        updateQuestionLocal(index, {
                          ...question,
                          correctAnswer: e.target.value === "true",
                        })
                      }
                    >
                      <option value="true">True</option>
                      <option value="false">False</option>
                    </Form.Select>
                  )}

                  {question.type === "FILL_BLANK" && (
                    <div>
                      {(question.correctAnswers || [""]).map(
                        (answer: string, aIndex: number) => (
                          <Form.Control
                            key={`${question._id}-blank-${aIndex}`}
                            className="mb-2"
                            value={answer}
                            placeholder="Possible answer"
                            onChange={(e) => {
                              const answers = [
                                ...(question.correctAnswers || []),
                              ];
                              answers[aIndex] = e.target.value;
                              updateQuestionLocal(index, {
                                ...question,
                                correctAnswers: answers,
                              });
                            }}
                          />
                        ),
                      )}
                      <Button
                        size="sm"
                        variant="link"
                        className="text-danger p-0"
                        onClick={() =>
                          updateQuestionLocal(index, {
                            ...question,
                            correctAnswers: [
                              ...(question.correctAnswers || []),
                              "",
                            ],
                          })
                        }
                      >
                        + Add Another Answer
                      </Button>
                    </div>
                  )}

                  <div className="mt-3 d-flex justify-content-end gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => removeQuestion(question._id)}
                    >
                      Delete
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => saveQuestion(question)}
                    >
                      Update Question
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            ),
          )}
        </Tab>
      </Tabs>

      <div className="d-flex justify-content-end gap-2 mt-4">
        <Button
          variant="outline-secondary"
          onClick={() =>
            router.push(
              `/courses/${courseId}/quizzes/${quizId}/take?preview=true`,
            )
          }
        >
          Preview
        </Button>
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onSaveAndPublish}>
          Save and Publish
        </Button>
        <Button variant="danger" onClick={onSave}>
          Save
        </Button>
      </div>
    </div>
  );
}
