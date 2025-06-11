import { useMutation, useQuery } from '@tanstack/react-query';
import type { Question, QuestionAttempt, QuestionType, AnalyticsData } from '../types/questions';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class APIError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'APIError';
  }
}

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'An unknown error occurred' }));
    throw new APIError(error.error || 'An unknown error occurred', response.status);
  }
  return response.json();
};

// API client functions
const api = {
  async generateQuestion(type: QuestionType): Promise<Question> {
    const response = await fetch(`${API_BASE_URL}/questions/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type }),
    });
    return handleResponse(response);
  },

  async evaluateAnswer(data: { questionId: string; answer: string }): Promise<{ feedback: string }> {
    const response = await fetch(`${API_BASE_URL}/questions/evaluate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  async getHistory(): Promise<QuestionAttempt[]> {
    const response = await fetch(`${API_BASE_URL}/history`);
    return handleResponse(response);
  },

  async getAnalytics(): Promise<AnalyticsData> {
    const response = await fetch(`${API_BASE_URL}/analytics`);
    return handleResponse(response);
  },
};

// React Query hooks
export const useGenerateQuestion = () => {
  return useMutation({
    mutationFn: (type: QuestionType) => api.generateQuestion(type),
  });
};

export const useEvaluateAnswer = () => {
  return useMutation({
    mutationFn: (data: { questionId: string; answer: string }) => api.evaluateAnswer(data),
  });
};

export const useGetHistory = () => {
  return useQuery({
    queryKey: ['history'],
    queryFn: () => api.getHistory(),
  });
};

export const useGetAnalytics = () => {
  return useQuery({
    queryKey: ['analytics'],
    queryFn: () => api.getAnalytics(),
  });
};
