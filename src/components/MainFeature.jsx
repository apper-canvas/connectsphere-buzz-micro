import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, X, ArrowDownUp, Check, Star, Mail, Phone } from 'lucide-react';
import { toast } from 'react-toastify';
import { getAllContacts, getFavoriteContacts, toggleFavoriteContact, addNewContact } from '../services/contactService';

const MainFeature = ({ isOpen, onClose, searchQuery }) => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  
  // Form state for adding a new contact
  const [newContact, setNewContact] = useState({
    firstName: '',
    lastName: '',
    emails: '',
    phoneNumbers: '',
    company: '',
    jobTitle: '',
    tags: [],
    isFavorite: false
  });

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setLoading(true);
        const data = await getAllContacts();
        setContacts(data);
        setFilteredContacts(data);
      } catch (error) {
        console.error("Error fetching contacts:", error);
        toast.error("Failed to load contacts");
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  // Filter by searchQuery
  useEffect(() => {
    let result = contacts;
    
    // Filter by active filter
    if (activeFilter === 'favorites') {
      result = result.filter(contact => contact.isFavorite);
    }
    
    // Apply search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(contact => 
        contact.firstName?.toLowerCase().includes(query) || 
        contact.lastName?.toLowerCase().includes(query) ||
        contact.company?.toLowerCase().includes(query) ||
        contact.jobTitle?.toLowerCase().includes(query) ||
        contact.emails?.toLowerCase().includes(query) ||
        contact.phoneNumbers?.toLowerCase().includes(query)
      );
    }
    
    // Sort contacts
    result = sortContacts(result, sortField, sortDirection);
    
    setFilteredContacts(result);
  }, [contacts, searchQuery, activeFilter, sortField, sortDirection]);

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  const sortContacts = (contactsToSort, field, direction) => {
    return [...contactsToSort].sort((a, b) => {
      let valueA = a[field] || '';
      let valueB = b[field] || '';
      
      if (field === 'name') {
        valueA = `${a.firstName || ''} ${a.lastName || ''}`.trim();
        valueB = `${b.firstName || ''} ${b.lastName || ''}`.trim();
      }
      
      if (direction === 'asc') {
        return valueA.localeCompare(valueB);
      } else {
        return valueB.localeCompare(valueA);
      }
    });
  };

  const handleSortChange = (field) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field with default asc direction
      setSortField(field);
      setSortDirection('asc');
    }
    setSortDropdownOpen(false);
  };

  const handleToggleFavorite = async (contactId) => {
    try {
      await toggleFavoriteContact(contactId);
      // Update local state
      setContacts(contacts.map(contact => 
        contact.id === contactId 
          ? { ...contact, isFavorite: !contact.isFavorite } 
          : contact
      ));
      toast.success("Favorite status updated");
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error("Failed to update favorite status");
    }
  };

  const handleSubmitContact = async (e) => {
    e.preventDefault();
    try {
      const createdContact = await addNewContact(newContact);
      setContacts([...contacts, createdContact]);
      setNewContact({
        firstName: '',
        lastName: '',
        emails: '',
        phoneNumbers: '',
        company: '',
        jobTitle: '',
        tags: [],
        isFavorite: false
      });
      onClose();
      toast.success("Contact added successfully!");
    } catch (error) {
      console.error("Error adding contact:", error);
      toast.error("Failed to add contact");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        {/* Add filter buttons and filter toggle at the top */}
        <div className="flex flex-wrap items-center gap-3">
          <button 
            className={`filter-toggle ${activeFilter === 'all' ? 'filter-toggle-active' : 'filter-toggle-inactive'}`}
            onClick={() => handleFilterChange('all')}
          >
            All Contacts
            <span className="filter-counter">{contacts.length}</span>
          </button>
          
          <button 
            className={`filter-toggle ${activeFilter === 'favorites' ? 'filter-toggle-active' : 'filter-toggle-inactive'}`}
            onClick={() => handleFilterChange('favorites')}
          >
            <Star className="w-4 h-4" />
            Favorites
            <span className="filter-counter">{contacts.filter(c => c.isFavorite).length}</span>
          </button>
          
          {/* Sort dropdown */}
          <div className="sort-dropdown group">
            <button className="sort-dropdown-button" onClick={() => setSortDropdownOpen(!sortDropdownOpen)}>
              <ArrowDownUp className="w-4 h-4 mr-2" />
              Sort
              <ChevronDown className="w-4 h-4 ml-2" />
            </button>
            
            <div className={`sort-dropdown-menu ${sortDropdownOpen ? 'visible opacity-100 translate-y-0' : ''}`}>
              <button className={`sort-option ${sortField === 'name' ? 'active' : ''}`} onClick={() => handleSortChange('name')}>
                Name
              </button>
              <button className={`sort-option ${sortField === 'company' ? 'active' : ''}`} onClick={() => handleSortChange('company')}>
                Company
              </button>
              <div className="sort-divider"></div>
              <button className="sort-option" onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}>
                {sortDirection === 'asc' ? 'Ascending' : 'Descending'}
              </button>
            </div>
          </div>
        </div>
        
        {/* Add Contact Button moved to top right */}
        <button 
          onClick={isOpen ? onClose : () => onClose(false)}
          className="btn-primary flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
        >
          <span className="w-5 h-5">+</span>
          <span>Add Contact</span>
        </button>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : filteredContacts.length === 0 ? (
        <div className="bg-surface-100 dark:bg-surface-800 rounded-xl p-8 text-center">
          <div className="inline-flex items-center justify-center p-4 bg-surface-200 dark:bg-surface-700 rounded-full mb-4">
            <X className="h-8 w-8 text-surface-500 dark:text-surface-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No contacts found</h3>
          <p className="text-surface-600 dark:text-surface-400 mb-6">
            {searchQuery 
              ? "No contacts match your search criteria." 
              : activeFilter === 'favorites' 
                ? "You don't have any favorite contacts yet." 
                : "You haven't added any contacts yet."}
          </p>
          {!searchQuery && activeFilter !== 'favorites' && (
            <button 
              onClick={() => onClose(false)}
              className="btn-primary inline-flex items-center gap-2"
            >
              <span className="w-5 h-5">+</span>
              <span>Add your first contact</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredContacts.map(contact => (
            <div key={contact.id} className="contact-card">
              <div className="contact-card-content">
                <div className="contact-profile-section">
                  <div>
                    <h3 className="contact-name">{contact.firstName} {contact.lastName}</h3>
                    {contact.jobTitle && contact.company && (
                      <p className="contact-position">{contact.jobTitle} at {contact.company}</p>
                    )}
                  </div>
                  
                  <button 
                    onClick={() => handleToggleFavorite(contact.id)}
                    className={`star-favorite ${contact.isFavorite ? 'text-amber-500' : 'text-surface-400'}`}
                    aria-label={contact.isFavorite ? "Remove from favorites" : "Add to favorites"}
                  >
                    <Star className="h-5 w-5 fill-current" />
                  </button>
                </div>
                
                <div className="contact-details-section">
                  {contact.emails && (
                    <div className="contact-info-row">
                      <Mail className="h-4 w-4 text-primary" />
                      <span>{contact.emails}</span>
                    </div>
                  )}
                  
                  {contact.phoneNumbers && (
                    <div className="contact-info-row">
                      <Phone className="h-4 w-4 text-primary" />
                      <span>{contact.phoneNumbers}</span>
                    </div>
                  )}
                </div>
                
                {contact.tags && contact.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {contact.tags.map((tag, idx) => (
                      <span key={idx} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-light/10 text-primary-dark">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Contact Form Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-surface-800 rounded-xl shadow-xl w-full max-w-lg"
            >
              <div className="flex justify-between items-center border-b border-surface-200 dark:border-surface-700 p-4">
                <h2 className="text-xl font-semibold">Add New Contact</h2>
                <button onClick={onClose} className="text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200">
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <form onSubmit={handleSubmitContact} className="p-4 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">First Name*</label>
                    <input
                      type="text"
                      id="firstName"
                      value={newContact.firstName}
                      onChange={(e) => setNewContact({...newContact, firstName: e.target.value})}
                      className="input-field"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Last Name*</label>
                    <input
                      type="text"
                      id="lastName"
                      value={newContact.lastName}
                      onChange={(e) => setNewContact({...newContact, lastName: e.target.value})}
                      className="input-field"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="emails" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    id="emails"
                    value={newContact.emails}
                    onChange={(e) => setNewContact({...newContact, emails: e.target.value})}
                    className="input-field"
                  />
                </div>
                
                <div>
                  <label htmlFor="phoneNumbers" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    id="phoneNumbers"
                    value={newContact.phoneNumbers}
                    onChange={(e) => setNewContact({...newContact, phoneNumbers: e.target.value})}
                    className="input-field"
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Company</label>
                    <input
                      type="text"
                      id="company"
                      value={newContact.company}
                      onChange={(e) => setNewContact({...newContact, company: e.target.value})}
                      className="input-field"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="jobTitle" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Job Title</label>
                    <input
                      type="text"
                      id="jobTitle"
                      value={newContact.jobTitle}
                      onChange={(e) => setNewContact({...newContact, jobTitle: e.target.value})}
                      className="input-field"
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isFavorite"
                    checked={newContact.isFavorite}
                    onChange={(e) => setNewContact({...newContact, isFavorite: e.target.checked})}
                    className="h-4 w-4 text-primary focus:ring-primary rounded"
                  />
                  <label htmlFor="isFavorite" className="text-sm font-medium text-surface-700 dark:text-surface-300">Add to favorites</label>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Save Contact
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MainFeature;