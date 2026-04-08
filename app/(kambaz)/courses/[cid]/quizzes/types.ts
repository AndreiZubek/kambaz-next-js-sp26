export type QuizType =
  | "GRADED_QUIZ"
  | "PRACTICE_QUIZ"
  | "GRADED_SURVEY"
  | "UNGRADED_SURVEY";

export type AssignmentGroup = "QUIZZES" | "EXAMS" | "ASSIGNMENTS" | "PROJECT";
export type QuestionType = "MULTIPLE_CHOICE" | "TRUE_FALSE" | "FILL_BLANK";

export interface QuizChoice {
  _id?: string;
  text: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  _id: string;
  type: QuestionType;
  title: string;
  question: string;
  points: number;
  choices?: QuizChoice[];
  correctAnswer?: boolean;
  correctAnswers?: string[];
}

export interface Quiz {
  _id: string;
  title: string;
  description: string;
  course: string;
  published: boolean;
  quizType: QuizType;
  assignmentGroup: AssignmentGroup;
  shuffleAnswers: boolean;
  timeLimit: number;
  multipleAttempts: boolean;
  howManyAttempts: number;
  showCorrectAnswers: string;
  accessCode: string;
  oneQuestionAtATime: boolean;
  webcamRequired: boolean;
  lockQuestionsAfterAnswering: boolean;
  dueDate: string;
  availableDate: string;
  availableUntilDate: string;
  questions: QuizQuestion[];
  points: number;
}

export interface QuizAnswer {
  questionId: string;
  value: string | boolean;
}

export interface QuestionResult {
  questionId: string;
  correct: boolean;
  pointsPossible: number;
  pointsEarned: number;
  submittedAnswer: string | boolean;
}

export interface QuizAttempt {
  _id: string;
  quiz: string;
  user: string;
  attemptNumber: number;
  answers: QuizAnswer[];
  questionResults: QuestionResult[];
  score: number;
  pointsPossible: number;
  submittedAt: string;
}
