import { GoogleGenerativeAI } from '@google/generative-ai';
import { QuestionModel, QuestionAttemptModel } from '../models/question';
import { Question, QuestionType, QuestionAttempt, AnalyticsData } from '../types';
import dotenv from 'dotenv';

// Ensure environment variables are loaded
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  console.error('GEMINI_API_KEY is not set in environment variables');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export class QuestionService {
  private static async generateWithGemini(type: QuestionType): Promise<Question> {
    try {
      const prompt = `Generate an interview ${type} question. Include relevant context and format as JSON with these fields:
      - content (the question text)
      - difficulty (easy/medium/hard)
      - tags (array of relevant topics)`;

      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
      const result = await model.generateContent(prompt);
      let responseText = result.response.text();
      // Remove code block formatting if present
      responseText = responseText.trim();
      if (responseText.startsWith('```')) {
        responseText = responseText.replace(/^```[a-zA-Z]*\n?/, '').replace(/```$/, '').trim();
      }
      let response;
      try {
        response = JSON.parse(responseText);
      } catch (error) {
        console.error('Failed to parse Gemini response:', responseText);
        throw new Error('Invalid response format from AI');
      }

      if (!response.content || !response.difficulty || !response.tags) {
        throw new Error('Incomplete response from AI');
      }

      return {
        id: new Date().getTime().toString(),
        type,
        content: response.content,
        difficulty: response.difficulty,
        tags: response.tags,
        timestamp: new Date().toISOString(),
        isBookmarked: false
      };
    } catch (error) {
      console.error('Error in generateWithGemini:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to generate question');
    }
  }

  private static async evaluateWithGemini(question: Question, answer: string): Promise<string> {
    const prompt = `Evaluate this ${question.type} interview answer. Question: "${question.content}" Answer: "${answer}"
    Provide detailed, constructive feedback on the answer's strengths and areas for improvement.`;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent(prompt);
    return result.response.text();
  }

  static async generateQuestion(type: QuestionType): Promise<Question> {
    const question = await this.generateWithGemini(type);
    await QuestionModel.create(question);
    return question;
  }

  static async evaluateAnswer(questionId: string, answer: string): Promise<{ feedback: string }> {
    const question = await QuestionModel.findById(questionId);
    if (!question) {
      throw new Error('Question not found');
    }

    // Ensure the object matches the Question type
    const qObj = question.toObject();
    const questionForAI: Question = {
      id: (qObj._id as string)?.toString?.() ?? '',
      type: qObj.type,
      content: qObj.content,
      difficulty: qObj.difficulty,
      tags: qObj.tags,
      timestamp: qObj.timestamp,
      isBookmarked: qObj.isBookmarked
    };

    const feedback = await this.evaluateWithGemini(questionForAI, answer);
    const status = feedback.toLowerCase().includes('correct') ? 'correct' 
      : feedback.toLowerCase().includes('partial') ? 'partial' 
      : 'incorrect';

    await QuestionAttemptModel.create({
      ...question.toObject(),
      userAnswer: answer,
      aiFeedback: feedback,
      status
    });

    return { feedback };
  }

  static async getHistory(): Promise<QuestionAttempt[]> {
    const docs = await QuestionAttemptModel.find().sort({ timestamp: -1 });
    return docs.map((doc: any) => ({
      id: doc._id?.toString?.() ?? '',
      type: doc.type,
      content: doc.content,
      difficulty: doc.difficulty,
      tags: doc.tags,
      timestamp: doc.timestamp,
      isBookmarked: doc.isBookmarked,
      userAnswer: doc.userAnswer,
      aiFeedback: doc.aiFeedback,
      status: doc.status
    }));
  }

  static async getAnalytics(): Promise<AnalyticsData> {
    const attempts = await QuestionAttemptModel.find();
    
    const tagMap = new Map<string, { correct: number; total: number }>();
    attempts.forEach(attempt => {
      attempt.tags.forEach(tag => {
        const stats = tagMap.get(tag) || { correct: 0, total: 0 };
        if (attempt.status === 'correct') stats.correct++;
        stats.total++;
        tagMap.set(tag, stats);
      });
    });

    return {
      totalAttempted: attempts.length,
      correctCount: attempts.filter(a => a.status === 'correct').length,
      incorrectCount: attempts.filter(a => a.status === 'incorrect').length,
      tagPerformance: Array.from(tagMap.entries()).map(([tag, stats]) => ({
        tag,
        ...stats
      }))
    };
  }
}
