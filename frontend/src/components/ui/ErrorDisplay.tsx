import { motion } from 'framer-motion';
import { Card } from './Card';
import { Button } from './Button';

interface ErrorDisplayProps {
  error: Error;
  onRetry?: () => void;
  className?: string;
}

export const ErrorDisplay = ({ error, onRetry, className = '' }: ErrorDisplayProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <Card className={`bg-red-50 ${className}`}>
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-red-800">
              {error.name === 'APIError' ? 'API Error' : 'Error'}
            </h3>
            <p className="mt-1 text-sm text-red-700">
              {error.message}
            </p>
            {onRetry && (
              <div className="mt-4">
                <Button
                  onClick={onRetry}
                  variant="outline"
                  size="sm"
                >
                  Try again
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>
      <div className="bg-red-100 border border-red-300 text-red-700 rounded-xl p-4 my-4 shadow">
        <span className="font-semibold">Error:</span> {error.message}
      </div>
    </motion.div>
  );
};
