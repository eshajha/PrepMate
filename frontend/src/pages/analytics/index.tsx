import { motion } from 'framer-motion';
import { Card } from '../../components/ui/Card';
import { useGetAnalytics } from '../../hooks/api';

export const AnalyticsPage = () => {
  const { data: analytics, isLoading } = useGetAnalytics();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const totalQuestions = analytics?.totalAttempted || 0;
  const correctPercentage = totalQuestions > 0
    ? Math.round((analytics?.correctCount || 0) / totalQuestions * 100)
    : 0;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <h1 className="text-3xl font-bold">Your Performance</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <h3 className="text-lg font-semibold mb-2">Total Questions</h3>
            <p className="text-3xl font-bold text-primary">{totalQuestions}</p>
          </Card>
          
          <Card>
            <h3 className="text-lg font-semibold mb-2">Correct Answers</h3>
            <p className="text-3xl font-bold text-green-600">{analytics?.correctCount || 0}</p>
          </Card>
          
          <Card>
            <h3 className="text-lg font-semibold mb-2">Success Rate</h3>
            <p className="text-3xl font-bold text-primary">{correctPercentage}%</p>
          </Card>
        </div>

        <Card>
          <h2 className="text-xl font-semibold mb-4">Performance by Topic</h2>
          <div className="space-y-4">
            {analytics?.tagPerformance.map(({ tag, correct, total }) => (
              <div key={tag} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{tag}</span>
                  <span>{Math.round(correct / total * 100)}% ({correct}/{total})</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(correct / total) * 100}%` }}
                    className="h-full bg-primary"
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
};
