import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PracticePage } from './pages/practice';
import { HistoryPage } from './pages/history';
import { AnalyticsPage } from './pages/analytics';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-blue-50 via-purple-100 to-pink-50">
          <header className="w-full py-6 bg-white/80 shadow-md mb-8">
            <h1 className="text-3xl font-extrabold text-center text-purple-700 tracking-tight drop-shadow-lg">
              PrepMate: AI Interview Prep
            </h1>
            <p className="text-center text-gray-500 mt-2">Practice. Track. Succeed.</p>
          </header>
          <main className="w-full max-w-3xl flex-1 px-4">
            <nav className="bg-white shadow-sm rounded-lg mb-6">
              <div className="max-w-4xl mx-auto px-4">
                <div className="flex justify-between h-16">
                  <div className="flex space-x-8 items-center">
                    <Link to="/" className="text-gray-700 hover:text-primary">Practice</Link>
                    <Link to="/history" className="text-gray-700 hover:text-primary">History</Link>
                    <Link to="/analytics" className="text-gray-700 hover:text-primary">Analytics</Link>
                  </div>
                </div>
              </div>
            </nav>

            <Routes>
              <Route path="/" element={<PracticePage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
            </Routes>
          </main>
          <footer className="w-full py-4 text-center text-xs text-gray-400 bg-white/70 mt-8">
            &copy; {new Date().getFullYear()} PrepMate. All rights reserved.
          </footer>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
