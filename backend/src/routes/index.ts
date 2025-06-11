import express from 'express';
import { QuestionController } from '../controllers/question.controller';

const router = express.Router();

router.post('/questions/generate', QuestionController.generateQuestion);
router.post('/questions/evaluate', QuestionController.evaluateAnswer);
router.get('/history', QuestionController.getHistory);
router.get('/analytics', QuestionController.getAnalytics);

export default router;
