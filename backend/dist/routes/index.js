"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const question_controller_1 = require("../controllers/question.controller");
const router = express_1.default.Router();
router.post('/questions/generate', question_controller_1.QuestionController.generateQuestion);
router.post('/questions/evaluate', question_controller_1.QuestionController.evaluateAnswer);
router.get('/history', question_controller_1.QuestionController.getHistory);
router.get('/analytics', question_controller_1.QuestionController.getAnalytics);
exports.default = router;
