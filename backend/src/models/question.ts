import mongoose, { Schema, Document } from 'mongoose';
import type { Question, QuestionAttempt } from '../types';

// Omit the id from the interfaces since Mongoose will handle it
type QuestionDocument = Document & Omit<Question, 'id'>;
type QuestionAttemptDocument = Document & Omit<QuestionAttempt, 'id'>;

const questionSchema = new Schema({
  type: {
    type: String,
    enum: ['coding', 'behavioral', 'ai-generated'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true
  },
  tags: [{
    type: String,
    required: true
  }],
  timestamp: {
    type: String,
    required: true,
    default: () => new Date().toISOString()
  },
  isBookmarked: {
    type: Boolean,
    default: false
  }
});

const questionAttemptSchema = new Schema({
  type: {
    type: String,
    enum: ['coding', 'behavioral', 'ai-generated'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true
  },
  tags: [{
    type: String,
    required: true
  }],
  timestamp: {
    type: String,
    required: true,
    default: () => new Date().toISOString()
  },
  isBookmarked: {
    type: Boolean,
    default: false
  },
  userAnswer: {
    type: String,
    required: true
  },
  aiFeedback: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['correct', 'incorrect', 'partial'],
    required: true
  },
  notes: {
    type: String
  }
});

export const QuestionModel = mongoose.model<QuestionDocument>('Question', questionSchema);
export const QuestionAttemptModel = mongoose.model<QuestionAttemptDocument>('QuestionAttempt', questionAttemptSchema);
