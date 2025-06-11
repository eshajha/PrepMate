import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Question, QuestionType } from '../../types/questions';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ErrorDisplay } from '../../components/ui/ErrorDisplay';
import { useGenerateQuestion, useEvaluateAnswer } from '../../hooks/api';

export const PracticePage = () => {
  const [selectedType, setSelectedType] = useState<QuestionType>('behavioral');
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');

  const generateQuestion = useGenerateQuestion();
  const evaluateAnswer = useEvaluateAnswer();

  // Automatically generate a question on mount
  useEffect(() => {
    handleGenerateQuestion();
    // eslint-disable-next-line
  }, []);

  const handleGenerateQuestion = async () => {
    try {
      setCurrentQuestion(null);
      setAnswer('');
      setFeedback('');
      const question = await generateQuestion.mutateAsync(selectedType);
      setCurrentQuestion(question);
    } catch (error) {
      console.error('Failed to generate question:', error);
      // Error will be handled by the ErrorDisplay component
    }
  };

  const handleSubmitAnswer = async () => {
    if (!currentQuestion) return;
    
    try {
      const result = await evaluateAnswer.mutateAsync({
        questionId: currentQuestion.id,
        answer
      });
      setFeedback(result.feedback);
    } catch (error) {
      console.error('Failed to evaluate answer:', error);
    }
  };

  const isPending = generateQuestion.isPending || evaluateAnswer.isPending;

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <h2 className="text-xl font-bold mb-4 text-purple-700">Practice Interview Questions</h2>
          <div className="flex gap-4">
            <Button
              variant={selectedType === 'behavioral' ? 'primary' : 'outline'}
              onClick={() => setSelectedType('behavioral')}
              disabled={isPending}
            >
              Behavioral
            </Button>
            <Button
              variant={selectedType === 'coding' ? 'primary' : 'outline'}
              onClick={() => setSelectedType('coding')}
              disabled={isPending}
            >
              Coding
            </Button>
            <Button
              variant={selectedType === 'ai-generated' ? 'primary' : 'outline'}
              onClick={() => setSelectedType('ai-generated')}
              disabled={isPending}
            >
              AI Generated
            </Button>
          </div>

          <AnimatePresence>
            {generateQuestion.error && (
              <ErrorDisplay 
                error={generateQuestion.error} 
                onRetry={handleGenerateQuestion}
              />
            )}
          </AnimatePresence>

          <Button 
            onClick={handleGenerateQuestion}
            disabled={generateQuestion.isPending}
            className="w-full"
          >
            {generateQuestion.isPending ? (
              <div className="flex items-center gap-2">
                <LoadingSpinner size="sm" />
                Generating...
              </div>
            ) : (
              'Generate New Question'
            )}
          </Button>

          {currentQuestion && (
            <Card className="space-y-4 p-4 border-t border-purple-200">
              <h3 className="text-lg font-semibold text-gray-900">{currentQuestion.content}</h3>
              <div className="flex gap-2 flex-wrap">
                {currentQuestion.tags.map(tag => (
                  <span key={tag} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>

              <AnimatePresence>
                {evaluateAnswer.error && (
                  <ErrorDisplay 
                    error={evaluateAnswer.error}
                    onRetry={() => handleSubmitAnswer()}
                  />
                )}
              </AnimatePresence>

              <textarea
                className="w-full h-32 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your answer here..."
                disabled={evaluateAnswer.isPending}
              />
              <Button 
                onClick={handleSubmitAnswer}
                disabled={evaluateAnswer.isPending || !answer.trim()}
                className="w-full"
              >
                {evaluateAnswer.isPending ? (
                  <div className="flex items-center gap-2">
                    <LoadingSpinner size="sm" />
                    Evaluating...
                  </div>
                ) : (
                  'Submit Answer'
                )}
              </Button>
            </Card>
          )}

          {feedback && (
            <Card className="bg-purple-50 p-4 border-l-4 border-purple-400">
              <h3 className="font-semibold mb-2 text-purple-700">AI Feedback:</h3>
              <p className="text-purple-800">{feedback}</p>
            </Card>
          )}
        </motion.div>
      </Card>
    </div>
  );
};
