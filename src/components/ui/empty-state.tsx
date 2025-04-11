
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  actionPath?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionText = 'Continue Shopping',
  actionPath = '/'
}) => {
  const navigate = useNavigate();
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center py-20"
    >
      <div className="mx-auto h-16 w-16 text-gray-300 dark:text-gray-600 mb-4">
        {icon}
      </div>
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-6">{description}</p>
      <Button onClick={() => navigate(actionPath)}>
        {actionText}
      </Button>
    </motion.div>
  );
};

export default EmptyState;
