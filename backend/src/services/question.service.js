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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionService = void 0;
const generative_ai_1 = require("@google/generative-ai");
const question_1 = require("../models/question");
const dotenv_1 = __importDefault(require("dotenv"));
// Ensure environment variables are loaded
dotenv_1.default.config();
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY is not set in environment variables');
    process.exit(1);
}
const genAI = new generative_ai_1.GoogleGenerativeAI(GEMINI_API_KEY);
class QuestionService {
    static generateWithGemini(type) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const prompt = `Generate an interview ${type} question. Include relevant context and format as JSON with these fields:
      - content (the question text)
      - difficulty (easy/medium/hard)
      - tags (array of relevant topics)`;
                const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
                const result = yield model.generateContent(prompt);
                const responseText = result.response.text();
                if (!responseText) {
                    throw new Error('Empty response from Gemini API');
                }
                let response;
                try {
                    response = JSON.parse(responseText);
                }
                catch (error) {
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
            }
            catch (error) {
                console.error('Error in generateWithGemini:', error);
                throw new Error(error instanceof Error ? error.message : 'Failed to generate question');
            }
        });
    }
    static evaluateWithGemini(question, answer) {
        return __awaiter(this, void 0, void 0, function* () {
            const prompt = `Evaluate this ${question.type} interview answer. Question: "${question.content}" Answer: "${answer}"
    Provide detailed, constructive feedback on the answer's strengths and areas for improvement.`;
            const model = genAI.getGenerativeModel({ model: 'gemini-2.0-pro' });
            const result = yield model.generateContent(prompt);
            return result.response.text();
        });
    }
    static generateQuestion(type) {
        return __awaiter(this, void 0, void 0, function* () {
            const question = yield this.generateWithGemini(type);
            yield question_1.QuestionModel.create(question);
            return question;
        });
    }
    static evaluateAnswer(questionId, answer) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const question = yield question_1.QuestionModel.findById(questionId);
            if (!question) {
                throw new Error('Question not found');
            }
            // Ensure the object matches the Question type
            const qObj = question.toObject();
            const questionForAI = {
                id: (_c = (_b = (_a = qObj._id) === null || _a === void 0 ? void 0 : _a.toString) === null || _b === void 0 ? void 0 : _b.call(_a)) !== null && _c !== void 0 ? _c : '',
                type: qObj.type,
                content: qObj.content,
                difficulty: qObj.difficulty,
                tags: qObj.tags,
                timestamp: qObj.timestamp,
                isBookmarked: qObj.isBookmarked
            };
            const feedback = yield this.evaluateWithGemini(questionForAI, answer);
            const status = feedback.toLowerCase().includes('correct') ? 'correct'
                : feedback.toLowerCase().includes('partial') ? 'partial'
                    : 'incorrect';
            yield question_1.QuestionAttemptModel.create(Object.assign(Object.assign({}, question.toObject()), { userAnswer: answer, aiFeedback: feedback, status }));
            return { feedback };
        });
    }
    static getHistory() {
        return __awaiter(this, void 0, void 0, function* () {
            const docs = yield question_1.QuestionAttemptModel.find().sort({ timestamp: -1 });
            return docs.map((doc) => {
                var _a, _b, _c;
                return ({
                    id: (_c = (_b = (_a = doc._id) === null || _a === void 0 ? void 0 : _a.toString) === null || _b === void 0 ? void 0 : _b.call(_a)) !== null && _c !== void 0 ? _c : '',
                    type: doc.type,
                    content: doc.content,
                    difficulty: doc.difficulty,
                    tags: doc.tags,
                    timestamp: doc.timestamp,
                    isBookmarked: doc.isBookmarked,
                    userAnswer: doc.userAnswer,
                    aiFeedback: doc.aiFeedback,
                    status: doc.status
                });
            });
        });
    }
    static getAnalytics() {
        return __awaiter(this, void 0, void 0, function* () {
            const attempts = yield question_1.QuestionAttemptModel.find();
            const tagMap = new Map();
            attempts.forEach(attempt => {
                attempt.tags.forEach(tag => {
                    const stats = tagMap.get(tag) || { correct: 0, total: 0 };
                    if (attempt.status === 'correct')
                        stats.correct++;
                    stats.total++;
                    tagMap.set(tag, stats);
                });
            });
            return {
                totalAttempted: attempts.length,
                correctCount: attempts.filter(a => a.status === 'correct').length,
                incorrectCount: attempts.filter(a => a.status === 'incorrect').length,
                tagPerformance: Array.from(tagMap.entries()).map(([tag, stats]) => (Object.assign({ tag }, stats)))
            };
        });
    }
}
exports.QuestionService = QuestionService;
