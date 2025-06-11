"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionAttemptModel = exports.QuestionModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const questionSchema = new mongoose_1.Schema({
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
const questionAttemptSchema = new mongoose_1.Schema({
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
exports.QuestionModel = mongoose_1.default.model('Question', questionSchema);
exports.QuestionAttemptModel = mongoose_1.default.model('QuestionAttempt', questionAttemptSchema);
