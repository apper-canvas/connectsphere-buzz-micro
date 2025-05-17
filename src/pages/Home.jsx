import { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, LogOut } from 'lucide-react';
import { getIcon } from '../utils/iconUtils';
import { useSelector } from 'react-redux';
import { AuthContext } from '../App';
import { useNavigate } from 'react-router-dom';
import MainFeature from '../components/MainFeature';

// Hero image URL from Unsplash
const heroImg = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1600";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isContactFormOpen, setIsContactFormOpen] = useState(false); 
  const SearchIcon = getIcon('Search');
  const PlusIcon = getIcon('Plus');
  const LogOutIcon = getIcon('LogOut');
  
  // Get authentication context and user state
  const { logout } = useContext(AuthContext);
  const { user, isAuthenticated } = useSelector(state => state.user);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isAuthenticated) navigate('/login');
  }, [isAuthenticated, navigate]);
  
  const handleOpenContactForm = () => {
    setIsContactFormOpen(true);
  };
  
  const handleCloseContactForm = () => {
    setIsContactFormOpen(false);
  };
  
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-secondary shadow-md">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex items-center flex-shrink-0">
              <motion.div
                initial={{ rotate: -10, scale: 0.9 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-10 h-10 rounded-lg bg-white flex items-center justify-center mr-3 shadow-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-primary">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </motion.div>
              <h1 className="text-2xl font-bold text-white">ConnectSphere</h1>
              </div>
            
            <div className="flex items-center">
              {isAuthenticated && (
                <button
                  onClick={logout}
                  className="ml-4 text-white hover:text-gray-200 flex items-center gap-2"
                >
                  <LogOutIcon className="h-5 w-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              )}
            </div>
            
            <div className="search-container relative w-full md:w-auto md:min-w-[320px] flex-shrink-0">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-primary" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search contacts..."
                className="pl-10 pr-4 py-2.5 w-full rounded-xl border border-white/30 focus:ring-2 focus:ring-white/50 focus:border-transparent bg-white/90 backdrop-blur-sm text-surface-800 placeholder-surface-500 shadow-search transition-all duration-200"
              />
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 md:py-10">
        {/* Quick Action Button */}
        <div className="flex justify-end mb-6">
          <button 
            onClick={handleOpenContactForm}
            className="btn-primary flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Add Contact</span>
          </button>
        </div>
        
        {/* Main Feature */}
        <MainFeature 
          isOpen={isContactFormOpen} 
          onClose={handleCloseContactForm}
          searchQuery={searchQuery}
        />
      </main>
    </div>
  );
};

export default Home;