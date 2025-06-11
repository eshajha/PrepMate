export type QuestionType = 'coding' | 'behavioral' | 'ai-generated';

export interface Question {
  id: string;
  type: QuestionType;
  content: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  timestamp: string;
  isBookmarked: boolean;
}

export interface QuestionAttempt extends Question {
  userAnswer: string;
  aiFeedback: string;
  status: 'correct' | 'incorrect' | 'partial';
  notes?: string;
}

export interface AnalyticsData {
  totalAttempted: number;
  correctCount: number;
  incorrectCount: number;
  tagPerformance: {
    tag: string;
    correct: number;
    total: number;
  }[];
}
