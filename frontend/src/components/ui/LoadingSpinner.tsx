import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner = ({ size = 'md', className = '' }: LoadingSpinnerProps) => {
  const sizes = {
    sm: 'h-6 w-6 border-2',
    md: 'h-12 w-12 border-2',
    lg: 'h-16 w-16 border-3'
  };

  return (
    <div className="flex items-center justify-center min-h-[20vh]">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className={`animate-spin rounded-full border-t-4 border-b-4 border-purple-500 border-opacity-60 ${sizes[size]} ${className}`}
      />
      <span className="ml-4 text-lg text-purple-600 font-semibold">Loading...</span>
    </div>
  );
};
