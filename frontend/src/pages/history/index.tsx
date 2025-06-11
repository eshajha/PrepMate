import { motion } from 'framer-motion';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useGetHistory } from '../../hooks/api';

export const HistoryPage = () => {
  const { data: history, isLoading } = useGetHistory();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <h1 className="text-3xl font-bold">Practice History</h1>
        
        <div className="space-y-4">
          {history?.map((attempt) => (
            <Card key={attempt.id} className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold mb-2">{attempt.content}</h2>
                  <div className="flex gap-2 mb-4">
                    {attempt.tags.map(tag => (
                      <span key={tag} className="bg-primary/10 text-primary px-2 py-1 rounded-full text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {/* Toggle bookmark */}}
                >
                  {attempt.isBookmarked ? 'Bookmarked' : 'Bookmark'}
                </Button>
              </div>

              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-semibold mb-2">Your Answer:</h3>
                <p className="text-gray-700">{attempt.userAnswer}</p>
              </div>

              <div className="bg-primary/5 p-4 rounded-md">
                <h3 className="font-semibold mb-2">AI Feedback:</h3>
                <p className="text-gray-700">{attempt.aiFeedback}</p>
              </div>

              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>{new Date(attempt.timestamp).toLocaleDateString()}</span>
                <span className={`px-2 py-1 rounded-full ${
                  attempt.status === 'correct' ? 'bg-green-100 text-green-800' :
                  attempt.status === 'incorrect' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {attempt.status.charAt(0).toUpperCase() + attempt.status.slice(1)}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
