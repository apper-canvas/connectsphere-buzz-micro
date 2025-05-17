import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';

// Pages
import Home from './pages/Home';
import NotFound from './pages/NotFound';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return savedTheme === 'dark' || (!savedTheme && prefersDark);
  });

  // Apply theme when it changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900 transition-colors duration-200">
      {/* Theme Toggle Button */}
      <button
        onClick={toggleDarkMode}
        className="fixed z-30 bottom-6 right-6 p-3 rounded-full bg-surface-200 dark:bg-surface-800 text-surface-800 dark:text-surface-200 shadow-lg hover:shadow-xl transition-all duration-300"
        aria-label="Toggle dark mode"
      >
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: darkMode ? 360 : 0 }}
          transition={{ duration: 0.5 }}
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </motion.div>
      </button>
      
      {/* Main Content */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={darkMode ? 'dark' : 'light'}
        toastClassName="!bg-surface-100 dark:!bg-surface-800 !text-surface-800 dark:!text-surface-200"
        progressClassName="!bg-primary"
      />
    </div>
  );
}

export default App;