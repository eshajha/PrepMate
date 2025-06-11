"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
// Configure dotenv before other imports
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes"));
const database_1 = require("./config/database");
const rate_limit_1 = require("./middleware/rate-limit");
const helmet_1 = __importDefault(require("helmet"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
// Security middleware
app.use((0, helmet_1.default)()); // Adds various HTTP headers for security
app.use((0, cors_1.default)({
    origin: process.env.NODE_ENV === 'production'
        ? 'https://prepmate.com'
        : 'http://localhost:5173',
    credentials: true
}));
app.use(express_1.default.json());
// Apply rate limiting
app.use('/api/auth', rate_limit_1.authLimiter); // Stricter rate limiting for auth routes
app.use('/api', rate_limit_1.rateLimiter); // General rate limiting for all routes
// Routes
app.use('/api', routes_1.default);
// Error handling middleware
app.use(rate_limit_1.errorHandler);
// Connect to MongoDB and start server
(0, database_1.connectDatabase)().then(() => {
    app.listen(port, () => {
        console.log(`Server running in ${process.env.NODE_ENV} mode at http://localhost:${port}`);
    });
});
