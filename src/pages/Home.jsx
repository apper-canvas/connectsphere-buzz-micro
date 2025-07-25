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
          <div className="relative">
            
            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="flex w-full md:w-auto justify-between items-center">
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
                
                {/* Visible Logout Button on mobile */}
                {isAuthenticated && (
                  <button
                    onClick={logout}
                    className="md:hidden btn bg-white/15 hover:bg-white/25 text-white border border-white/30 shadow-sm flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 whitespace-nowrap"
                    aria-label="Logout"
                  >
                    <LogOutIcon className="h-5 w-5" />
                  </button>
                )}
              </div>
              
              <div className="flex flex-1 w-full md:w-auto items-center justify-between gap-3">
                <div className="search-container relative w-full md:min-w-[320px] flex-1">
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
                
                {/* Visible Logout Button on desktop */}
                {isAuthenticated && (
                  <button
                    onClick={logout}
                    className="hidden md:flex btn bg-white/15 hover:bg-white/25 text-white border border-white/30 shadow-sm items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 whitespace-nowrap"
                    aria-label="Logout"
                  >
                    <LogOutIcon className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 md:py-10">
        
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