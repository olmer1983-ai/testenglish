export interface AnswerOption {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  questionText: string;
  options: AnswerOption[];
  correctAnswerId: string;
}

export interface Test {
  id: string;
  title: string;
  teacherName: string;
  questions: Question[];
}

export interface TestResult {
  id: string;
  studentName: string;
  testId: string;
  testTitle: string;
  score: number;
  totalQuestions: number;
  date: string;
}

export interface User {
  role: 'teacher' | 'student';
  fullName: string;
}
