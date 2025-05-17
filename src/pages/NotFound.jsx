import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getIcon } from '../utils/iconUtils';

const NotFound = () => {
  const HomeIcon = getIcon('Home');
  const AlertCircleIcon = getIcon('AlertCircle');

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card max-w-lg w-full p-8 text-center"
      >
        <div className="mb-6 flex justify-center">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: [0.8, 1.2, 1] }}
            transition={{ times: [0, 0.5, 1], duration: 0.8 }}
            className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center"
          >
            <AlertCircleIcon className="w-12 h-12 text-primary" />
          </motion.div>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">404</h1>
        <h2 className="text-2xl md:text-3xl font-semibold mb-3 text-surface-800 dark:text-surface-200">Page Not Found</h2>
        
        <p className="text-surface-600 dark:text-surface-400 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>
        
        <Link to="/" className="btn-primary inline-flex items-center gap-2">
          <HomeIcon className="w-5 h-5" />
          <span>Back to Home</span>
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;