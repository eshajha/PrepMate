"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionController = void 0;
const question_service_1 = require("../services/question.service");
class QuestionController {
    static generateQuestion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { type } = req.body;
                const question = yield question_service_1.QuestionService.generateQuestion(type);
                res.json(question);
            }
            catch (error) {
                console.error('Error generating question:', error);
                res.status(500).json({ error: 'Failed to generate question' });
            }
        });
    }
    static evaluateAnswer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { questionId, answer } = req.body;
                const result = yield question_service_1.QuestionService.evaluateAnswer(questionId, answer);
                res.json(result);
            }
            catch (error) {
                console.error('Error evaluating answer:', error);
                res.status(500).json({ error: 'Failed to evaluate answer' });
            }
        });
    }
    static getHistory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const history = yield question_service_1.QuestionService.getHistory();
                res.json(history);
            }
            catch (error) {
                console.error('Error fetching history:', error);
                res.status(500).json({ error: 'Failed to fetch history' });
            }
        });
    }
    static getAnalytics(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const analytics = yield question_service_1.QuestionService.getAnalytics();
                res.json(analytics);
            }
            catch (error) {
                console.error('Error fetching analytics:', error);
                res.status(500).json({ error: 'Failed to fetch analytics' });
            }
        });
    }
}
exports.QuestionController = QuestionController;
