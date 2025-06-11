import { Request, Response } from 'express';
import { QuestionService } from '../services/question.service';
import { QuestionType } from '../types';

export class QuestionController {
  static async generateQuestion(req: Request, res: Response) {
    try {
      const { type } = req.body as { type: QuestionType };
      const question = await QuestionService.generateQuestion(type);
      res.json(question);
    } catch (error) {
      console.error('Error generating question:', error);
      res.status(500).json({ error: 'Failed to generate question' });
    }
  }

  static async evaluateAnswer(req: Request, res: Response) {
    try {
      const { questionId, answer } = req.body as { questionId: string; answer: string };
      const result = await QuestionService.evaluateAnswer(questionId, answer);
      res.json(result);
    } catch (error) {
      console.error('Error evaluating answer:', error);
      res.status(500).json({ error: 'Failed to evaluate answer' });
    }
  }

  static async getHistory(req: Request, res: Response) {
    try {
      const history = await QuestionService.getHistory();
      res.json(history);
    } catch (error) {
      console.error('Error fetching history:', error);
      res.status(500).json({ error: 'Failed to fetch history' });
    }
  }

  static async getAnalytics(req: Request, res: Response) {
    try {
      const analytics = await QuestionService.getAnalytics();
      res.json(analytics);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      res.status(500).json({ error: 'Failed to fetch analytics' });
    }
  }
}
