"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Button, Card, Form, Row, Col, Spinner, Tab, Tabs,
} from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import * as quizClient from "../../client";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../store";
import { Quiz, QuizChoice, QuizQuestion, QuestionType } from "../../types";

const DEFAULT_Q: Partial<QuizQuestion> = {
  type: "MULTIPLE_CHOICE",
  title: "New Question",
  question: "",
  points: 1,
  choices: [
    { text: "", isCorrect: true },
    { text: "", isCorrect: false },
  ],
  correctAnswer: true,
  correctAnswers: [""],
};

export default function QuizEditorPage() {
  const { cid, qid } = useParams() as { cid: string; qid: string };
  const router = useRouter();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("details");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const currentUser: any = useSelector((state: RootState) => state.accountReducer.currentUser);
  const isFaculty = ["FACULTY", "ADMIN", "TA"].includes(currentUser?.role || "");

  const totalPoints = useMemo(
    () => (quiz?.questions || []).reduce((s, q) => s + Number(q.points || 0), 0),
    [quiz],
  );

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await quizClient.fetchQuizById(qid);
      setQuiz({ ...data, questions: data.questions || [] });
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [qid]);

  useEffect(() => { load(); }, [load]);

  const onSave = async () => {
    if (!quiz) return;
    await quizClient.updateQuiz({ ...quiz, points: totalPoints });
    router.push(`/courses/${cid}/quizzes/${qid}`);
  };

  const onSaveAndPublish = async () => {
    if (!quiz) return;
    await quizClient.updateQuiz({ ...quiz, points: totalPoints, published: true });
    await quizClient.setQuizPublished(qid, true);
    router.push(`/courses/${cid}/quizzes`);
  };

  const onCancel = () => router.push(`/courses/${cid}/quizzes`);

  const addQuestion = async () => {
    const created = await quizClient.addQuestion(qid, DEFAULT_Q);
    setQuiz((p) => p ? { ...p, questions: [...p.questions, created] } : p);
    setActiveTab("questions");
  };

  const updateLocal = (i: number, next: QuizQuestion) =>
    setQuiz((p) => {
      if (!p) return p;
      const qs = [...p.questions];
      qs[i] = next;
      return { ...p, questions: qs };
    });

  const saveQuestion = async (q: QuizQuestion) => {
    const updated = await quizClient.updateQuestion(qid, q._id, q);
    setQuiz((p) =>
      p ? { ...p, questions: p.questions.map((x) => (x._id === updated._id ? updated : x)) } : p,
    );
  };

  const removeQuestion = async (questionId: string) => {
    await quizClient.deleteQuestion(qid, questionId);
    setQuiz((p) => p ? { ...p, questions: p.questions.filter((x) => x._id !== questionId) } : p);
  };

  if (loading || !quiz) return <Spinner animation="border" />;
  if (!isFaculty) { router.push(`/courses/${cid}/quizzes/${qid}`); return null; }

  return (
    <div className="pe-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">{quiz.title}</h4>
        <div>
          <span className="me-3">Points: {totalPoints}</span>
          <span className="text-muted">{quiz.published ? "Published" : "Not Published"}</span>
        </div>
      </div>

      <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k || "details")} className="mb-3">

        <Tab eventKey="details" title="Details">
          <Form.Group className="mb-3">
            <Form.Control value={quiz.title || ""}
              onChange={(e) => setQuiz({ ...quiz, title: e.target.value })} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Quiz Instructions</Form.Label>
            <Form.Control as="textarea" rows={4} value={quiz.description || ""}
              onChange={(e) => setQuiz({ ...quiz, description: e.target.value })} />
          </Form.Group>

          <Row className="mb-3">
            <Col md={6} className="mt-3 d-flex justify-content-end">
              <Form.Label>Quiz Type</Form.Label>
            </Col>
            <Col className="mt-3">
              <Form.Select value={quiz.quizType || "GRADED_QUIZ"}
                onChange={(e) => setQuiz({ ...quiz, quizType: e.target.value as Quiz["quizType"] })}>
                <option value="GRADED_QUIZ">Graded Quiz</option>
                <option value="PRACTICE_QUIZ">Practice Quiz</option>
                <option value="GRADED_SURVEY">Graded Survey</option>
                <option value="UNGRADED_SURVEY">Ungraded Survey</option>
              </Form.Select>
            </Col>
            <Col md={6} className="mt-3 d-flex justify-content-end">
              <Form.Label>Assignment Group</Form.Label>
            </Col>
            <Col className="mt-3">
              <Form.Select value={quiz.assignmentGroup || "QUIZZES"}
                onChange={(e) => setQuiz({ ...quiz, assignmentGroup: e.target.value as Quiz["assignmentGroup"] })}>
                <option value="QUIZZES">Quizzes</option>
                <option value="EXAMS">Exams</option>
                <option value="ASSIGNMENTS">Assignments</option>
                <option value="PROJECT">Project</option>
              </Form.Select>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col></Col>
            <Col>
              <h6><strong>Options</strong></h6>

              <Form.Check type="checkbox" id="wd-shuffle" label="Shuffle Answers"
                checked={Boolean(quiz.shuffleAnswers)}
                onChange={(e) => setQuiz({ ...quiz, shuffleAnswers: e.target.checked })} />

              <div className="d-flex align-items-center mt-2 mb-2">
                <Form.Check type="checkbox" id="wd-time-limit"
                  label="Time Limit"
                  checked={quiz.timeLimit > 0}
                  onChange={(e) => setQuiz({ ...quiz, timeLimit: e.target.checked ? 20 : 0 })} />
                {quiz.timeLimit > 0 && (
                  <div className="d-flex align-items-center ms-3">
                    <Form.Control type="number" style={{ width: 80 }}
                      value={quiz.timeLimit}
                      onChange={(e) => setQuiz({ ...quiz, timeLimit: Number(e.target.value) })} />
                    <span className="ms-2">Minutes</span>
                  </div>
                )}
              </div>

              <div className="d-flex align-items-center mb-2">
                <Form.Check type="checkbox" id="wd-multiple-attempts"
                  label="Allow Multiple Attempts"
                  checked={Boolean(quiz.multipleAttempts)}
                  onChange={(e) => setQuiz({ ...quiz, multipleAttempts: e.target.checked, howManyAttempts: e.target.checked ? (quiz.howManyAttempts || 3) : 1 })} />
                {quiz.multipleAttempts && (
                  <div className="d-flex align-items-center ms-3">
                    <Form.Control type="number" style={{ width: 80 }}
                      value={quiz.howManyAttempts ?? 1}
                      onChange={(e) => setQuiz({ ...quiz, howManyAttempts: Number(e.target.value) })} />
                    <span className="ms-2">Attempts</span>
                  </div>
                )}
              </div>

              <Form.Check type="checkbox" id="wd-one-q" label="One Question at a Time"
                checked={Boolean(quiz.oneQuestionAtATime)}
                onChange={(e) => setQuiz({ ...quiz, oneQuestionAtATime: e.target.checked })} />
              <Form.Check type="checkbox" id="wd-webcam" label="Webcam Required"
                checked={Boolean(quiz.webcamRequired)}
                onChange={(e) => setQuiz({ ...quiz, webcamRequired: e.target.checked })} />
              <Form.Check type="checkbox" id="wd-lock" label="Lock Questions After Answering"
                checked={Boolean(quiz.lockQuestionsAfterAnswering)}
                onChange={(e) => setQuiz({ ...quiz, lockQuestionsAfterAnswering: e.target.checked })} />

              <Form.Group className="mt-2 mb-2">
                <Form.Label>Access Code</Form.Label>
                <Form.Control value={quiz.accessCode || ""}
                  onChange={(e) => setQuiz({ ...quiz, accessCode: e.target.value })} />
              </Form.Group>
              <Form.Group>
                <Form.Label>Show Correct Answers</Form.Label>
                <Form.Control value={quiz.showCorrectAnswers || ""}
                  onChange={(e) => setQuiz({ ...quiz, showCorrectAnswers: e.target.value })} />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col className="d-flex justify-content-end align-items-start pt-2">
              <Form.Label>Assign</Form.Label>
            </Col>
            <Col>
              <div className="border rounded p-3">
                <table className="w-100">
                  <tbody>
                    <tr>
                      <td className="pb-3">
                        <Form.Label className="fw-bold">Due</Form.Label>
                        <Form.Control type="date"
                          value={(quiz.dueDate || "").slice(0, 10)}
                          onChange={(e) => setQuiz({ ...quiz, dueDate: e.target.value })} />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className="d-flex gap-3">
                          <div className="flex-fill">
                            <Form.Label className="fw-bold">Available from</Form.Label>
                            <Form.Control type="date"
                              value={(quiz.availableDate || "").slice(0, 10)}
                              onChange={(e) => setQuiz({ ...quiz, availableDate: e.target.value })} />
                          </div>
                          <div className="flex-fill">
                            <Form.Label className="fw-bold">Until</Form.Label>
                            <Form.Control type="date"
                              value={(quiz.availableUntilDate || "").slice(0, 10)}
                              onChange={(e) => setQuiz({ ...quiz, availableUntilDate: e.target.value })} />
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Col>
          </Row>
        </Tab>






        <Tab eventKey="questions" title="Questions">
          <div className="mb-3">
            <Button variant="secondary" onClick={addQuestion}>+ New Question</Button>
          </div>

          {(quiz.questions || []).map((q, i) => (
            <QuestionCard key={q._id} question={q} index={i}
              onUpdate={(next) => updateLocal(i, next)}
              onSave={(updated) => saveQuestion(updated)}
              onDelete={() => removeQuestion(q._id)} />
          ))}
        </Tab>
      </Tabs>

      <hr />
      <div className="d-flex justify-content-end gap-2 mt-2 mb-4">
        <Button variant="outline-secondary"
          onClick={() => router.push(`/courses/${cid}/quizzes/${qid}/take?preview=true`)}>
          Preview
        </Button>
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button variant="danger" onClick={onSaveAndPublish}>Save and Publish</Button>
        <Button variant="danger" onClick={onSave}>Save</Button>
      </div>
    </div>
  );
}





function QuestionCard({ question, index, onUpdate, onSave, onDelete }: {
  question: QuizQuestion; index: number;
  onUpdate: (q: QuizQuestion) => void; onSave: (q: QuizQuestion) => void; onDelete: () => void;
}) {
  const [editing, setEditing] = useState(true);
  const [draft, setDraft] = useState<QuizQuestion>(question);
  useEffect(() => { setDraft(question); }, [question]);

  const cancelEdit = () => { setDraft(question); setEditing(false); };
  const saveEdit = () => { onUpdate(draft); onSave(draft); setEditing(false); };

  if (!editing) {
    return (
      <Card className="mb-3">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <strong>{index + 1}. {draft.title}</strong>{" "}
              <span className="text-muted">
                {draft.type === "MULTIPLE_CHOICE" ? "Multiple Choice" : draft.type === "TRUE_FALSE" ? "True/False" : "Fill in the Blank"} - {draft.points} pts
              </span>
            </div>
            <div className="d-flex gap-2">
              <Button variant="secondary" onClick={() => setEditing(true)}>Edit</Button>
              <Button variant="outline-danger" onClick={onDelete}><FaTrash /></Button>
            </div>
          </div>
          {draft.question && <p className="mb-0 mt-1 text-muted">{draft.question}</p>}
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="mb-3">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
          <Form.Control style={{ maxWidth: 220 }} value={draft.title || ""}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
          <div className="d-flex align-items-center gap-2">
            <Form.Select style={{ width: 180 }} value={draft.type}
              onChange={(e) => setDraft({ ...draft, type: e.target.value as QuestionType })}>
              <option value="MULTIPLE_CHOICE">Multiple Choice</option>
              <option value="TRUE_FALSE">True/False</option>
              <option value="FILL_BLANK">Fill In The Blank</option>
            </Form.Select>
            <span className="text-nowrap">pts:</span>
            <Form.Control style={{ width: 80 }} type="number" value={draft.points ?? 1}
              onChange={(e) => setDraft({ ...draft, points: Number(e.target.value) })} />
          </div>
        </div>

        <Form.Group className="mb-2">
          <Form.Label>Question</Form.Label>
          <Form.Control as="textarea" rows={2} value={draft.question || ""}
            onChange={(e) => setDraft({ ...draft, question: e.target.value })} />
        </Form.Group>

        {draft.type === "MULTIPLE_CHOICE" && (
          <div>
            <small className="text-muted d-block mb-1">Select the correct answer.</small>
            {(draft.choices || []).map((choice: QuizChoice, ci: number) => (
              <div key={choice._id || ci} className="d-flex mb-2 align-items-center">
                <Form.Check type="radio" className="me-2"
                  name={`mc-${draft._id}`} checked={Boolean(choice.isCorrect)}
                  onChange={() => setDraft({
                    ...draft,
                    choices: (draft.choices || []).map((c, j) => ({ ...c, isCorrect: j === ci })),
                  })}
                  label={choice.isCorrect ? "Correct Answer" : "Possible Answer"} />
                <Form.Control className="ms-2" value={choice.text || ""}
                  onChange={(e) => {
                    const next = [...(draft.choices || [])];
                    next[ci] = { ...choice, text: e.target.value };
                    setDraft({ ...draft, choices: next });
                  }} />
                {(draft.choices || []).length > 2 && (
                  <Button variant="outline-danger" size="sm" className="ms-2"
                    onClick={() => setDraft({
                      ...draft,
                      choices: (draft.choices || []).filter((_, j) => j !== ci),
                    })}><FaTrash /></Button>
                )}
              </div>
            ))}
            <Button size="sm" variant="link" className="text-danger p-0"
              onClick={() => setDraft({
                ...draft, choices: [...(draft.choices || []), { text: "", isCorrect: false }],
              })}>+ Add Another Answer</Button>
          </div>
        )}

        {draft.type === "TRUE_FALSE" && (
          <div>
            <Form.Check type="radio" name={`tf-${draft._id}`} label="True"
              checked={draft.correctAnswer === true}
              onChange={() => setDraft({ ...draft, correctAnswer: true })} />
            <Form.Check type="radio" name={`tf-${draft._id}`} label="False"
              checked={draft.correctAnswer === false}
              onChange={() => setDraft({ ...draft, correctAnswer: false })} />
          </div>
        )}

        {draft.type === "FILL_BLANK" && (
          <div>
            <small className="text-muted d-block mb-1">Enter all accepted answers (case-insensitive).</small>
            {(draft.correctAnswers || [""]).map((ans: string, ai: number) => (
              <div key={ai} className="d-flex mb-2 align-items-center">
                <span className="text-nowrap me-2">Possible Answer</span>
                <Form.Control value={ans} placeholder="Possible answer"
                  onChange={(e) => {
                    const next = [...(draft.correctAnswers || [])];
                    next[ai] = e.target.value;
                    setDraft({ ...draft, correctAnswers: next });
                  }} />
                {(draft.correctAnswers || []).length > 1 && (
                  <Button variant="outline-danger" size="sm" className="ms-2"
                    onClick={() => setDraft({
                      ...draft,
                      correctAnswers: (draft.correctAnswers || []).filter((_, j) => j !== ai),
                    })}><FaTrash /></Button>
                )}
              </div>
            ))}
            <Button size="sm" variant="link" className="text-danger p-0"
              onClick={() => setDraft({
                ...draft, correctAnswers: [...(draft.correctAnswers || []), ""],
              })}>+ Add Another Answer</Button>
          </div>
        )}

        <div className="mt-3 d-flex justify-content-end gap-2">
          <Button variant="secondary" onClick={cancelEdit}>Cancel</Button>
          <Button variant="danger" onClick={saveEdit}>Update Question</Button>
        </div>
      </Card.Body>
    </Card>
  );
}
