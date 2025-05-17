import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';

const MainFeature = ({ isOpen, onClose, searchQuery = '' }) => {
  // Icons using getIcon utility
  const User = getIcon('User');
  const Phone = getIcon('Phone');
  const Mail = getIcon('Mail');
  const Briefcase = getIcon('Briefcase');
  const UserCircle = getIcon('UserCircle');
  const X = getIcon('X');
  const MapPin = getIcon('MapPin');
  const Calendar = getIcon('Calendar');
  const Globe = getIcon('Globe');
  const Plus = getIcon('Plus');
  const Tag = getIcon('Tag');
  const Save = getIcon('Save');
  const Trash = getIcon('Trash');
  const Star = getIcon('Star');
  const Users = getIcon('Users');
  const Edit = getIcon('Edit');
  
  // Contact form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    nickname: '',
    phoneNumbers: [{ type: 'mobile', number: '', isPrimary: true }],
    emails: [{ type: 'personal', email: '', isPrimary: true }],
    company: '',
    jobTitle: '',
    birthday: '',
    website: '',
    address: '',
    tags: [],
    notes: '',
    isFavorite: false
  });
  
  // Mock contacts for display
  const [contacts, setContacts] = useState([
    {
      id: '1',
      firstName: 'Emma',
      lastName: 'Johnson',
      company: 'TechGlobal Inc.',
      jobTitle: 'Product Manager',
      phoneNumbers: [{ type: 'mobile', number: '(555) 123-4567', isPrimary: true }],
      emails: [{ type: 'work', email: 'emma.j@techglobal.com', isPrimary: true }],
      tags: ['Team', 'Client'],
      isFavorite: true,
      profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80'
    },
    {
      id: '2',
      firstName: 'Marcus',
      lastName: 'Liang',
      company: 'Innovate Solutions',
      jobTitle: 'Software Engineer',
      phoneNumbers: [{ type: 'mobile', number: '(555) 987-6543', isPrimary: true }],
      emails: [{ type: 'personal', email: 'marcus.liang@gmail.com', isPrimary: true }],
      tags: ['Tech', 'Friend'],
      isFavorite: false,
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80'
    },
    {
      id: '3',
      firstName: 'Sophia',
      lastName: 'Rodriguez',
      company: 'Creative Design Studios',
      jobTitle: 'UX Designer',
      phoneNumbers: [{ type: 'mobile', number: '(555) 234-5678', isPrimary: true }],
      emails: [{ type: 'work', email: 'sophia@creativedesign.com', isPrimary: true }],
      tags: ['Design', 'Client'],
      isFavorite: true,
      profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80'
    }
  ]);
  
  // Filter state
  const [filterTag, setFilterTag] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);
  const [isDetailView, setIsDetailView] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Available tags
  const availableTags = ['Team', 'Client', 'Friend', 'Family', 'Tech', 'Design', 'Important'];

  // Function to handle opening the contact form
  const handleOpenContactForm = () => onClose();
  
  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle phone number changes
  const handlePhoneChange = (index, field, value) => {
    const updatedPhones = [...formData.phoneNumbers];
    updatedPhones[index] = { ...updatedPhones[index], [field]: value };
    setFormData({ ...formData, phoneNumbers: updatedPhones });
  };
  
  // Add phone field
  const addPhoneField = () => {
    setFormData({
      ...formData,
      phoneNumbers: [...formData.phoneNumbers, { type: 'mobile', number: '', isPrimary: false }]
    });
  };
  
  // Remove phone field
  const removePhoneField = (index) => {
    if (formData.phoneNumbers.length > 1) {
      const updatedPhones = formData.phoneNumbers.filter((_, i) => i !== index);
      setFormData({ ...formData, phoneNumbers: updatedPhones });
    }
  };
  
  // Handle email changes
  const handleEmailChange = (index, field, value) => {
    const updatedEmails = [...formData.emails];
    updatedEmails[index] = { ...updatedEmails[index], [field]: value };
    setFormData({ ...formData, emails: updatedEmails });
  };
  
  // Add email field
  const addEmailField = () => {
    setFormData({
      ...formData,
      emails: [...formData.emails, { type: 'personal', email: '', isPrimary: false }]
    });
  };
  
  // Remove email field
  const removeEmailField = (index) => {
    if (formData.emails.length > 1) {
      const updatedEmails = formData.emails.filter((_, i) => i !== index);
      setFormData({ ...formData, emails: updatedEmails });
    }
  };
  
  // Toggle tag selection
  const toggleTag = (tag) => {
    const updatedTags = formData.tags.includes(tag)
      ? formData.tags.filter(t => t !== tag)
      : [...formData.tags, tag];
    
    setFormData({ ...formData, tags: updatedTags });
  };
  
  // Toggle favorite
  const toggleFavorite = () => {
    setFormData({ ...formData, isFavorite: !formData.isFavorite });
  };
  
  // Form validation
  const validateForm = () => {
    if (!formData.firstName || !formData.lastName) {
      toast.error("First name and last name are required");
      return false;
    }
    
    if (formData.phoneNumbers.some(phone => phone.number && !/^[\d\s()+-]+$/.test(phone.number))) {
      toast.error("Phone number contains invalid characters");
      return false;
    }
    
    if (formData.emails.some(email => email.email && !/^\S+@\S+\.\S+$/.test(email.email))) {
      toast.error("Invalid email format");
      return false;
    }
    
    return true;
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // If editing, update the contact
    if (isEditing && selectedContact) {
      const updatedContacts = contacts.map(contact => 
        contact.id === selectedContact.id ? { ...formData, id: selectedContact.id } : contact
      );
      setContacts(updatedContacts);
      toast.success("Contact updated successfully!");
      setIsEditing(false);
    } else {
      // Create new contact
      const newContact = {
        ...formData,
        id: Date.now().toString(),
        profileImage: formData.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.firstName)}+${encodeURIComponent(formData.lastName)}&background=4361ee&color=fff`
      };
      
      setContacts([...contacts, newContact]);
      toast.success("Contact created successfully!");
    }
    
    // Reset form
    setFormData({
      firstName: '',
      lastName: '',
      nickname: '',
      phoneNumbers: [{ type: 'mobile', number: '', isPrimary: true }],
      emails: [{ type: 'personal', email: '', isPrimary: true }],
      company: '',
      jobTitle: '',
      birthday: '',
      website: '',
      address: '',
      tags: [],
      notes: '',
      isFavorite: false
    });
    
    onClose();
  };
  
  // Delete contact
  const handleDeleteContact = (id) => {
    const updatedContacts = contacts.filter(contact => contact.id !== id);
    setContacts(updatedContacts);
    setSelectedContact(null);
    setIsDetailView(false);
    toast.success("Contact deleted successfully!");
  };
  
  // View contact details
  const viewContactDetails = (contact) => {
    setSelectedContact(contact);
    setIsDetailView(true);
  };
  
  // Edit contact
  const editContact = (contact) => {
    setFormData({
      ...contact,
      phoneNumbers: contact.phoneNumbers || [{ type: 'mobile', number: '', isPrimary: true }],
      emails: contact.emails || [{ type: 'personal', email: '', isPrimary: true }],
      tags: contact.tags || []
    });
    setSelectedContact(contact);
    setIsEditing(true);
    setIsDetailView(false);
    onClose(); // Close detail view
  };
  
  // Search and filter contacts
  const filteredContacts = contacts.filter(contact => {
    // First filter by tag if a tag is selected
    if (filterTag && (!contact.tags || !contact.tags.includes(filterTag))) {
      return false;
    }
    
    // Then filter by search query if one exists
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      const fullName = `${contact.firstName} ${contact.lastName}`.toLowerCase();
      const emails = contact.emails ? contact.emails.map(e => e.email.toLowerCase()) : [];
      const phones = contact.phones ? contact.phones.map(p => p.number.toLowerCase()) : [];
      
      return fullName.includes(query) || 
             contact.firstName.toLowerCase().includes(query) || 
             contact.lastName.toLowerCase().includes(query) ||
             emails.some(email => email.includes(query)) ||
             contact.phoneNumbers.some(phone => phone.number.toLowerCase().includes(query));
    }
    return true;
  });
  
  // Close contact details
  const closeDetails = () => {
    setIsDetailView(false);
    setSelectedContact(null);
  };
  
  // Get color for tag
  const getTagColor = (tag) => {
    const colors = {
      'Team': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'Client': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'Friend': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'Family': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
      'Tech': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
      'Design': 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
      'Important': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    };
    
    return colors[tag] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  };
  
  return (
    <div className="space-y-8">
      {/* Filters */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-surface-800 dark:text-surface-200 flex items-center">
            <span>Contacts</span>
            <span className="filter-counter">{filteredContacts.length}</span>
          </h3>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {/* All contacts filter */}
          <div className="filter-group">
            <button 
              className={`filter-toggle ${filterTag === '' ? 'filter-toggle-active' : 'filter-toggle-inactive'}`}
              onClick={() => setFilterTag('')}
            >
              <Users className="w-4 h-4" />
              <span>All Contacts</span>
            </button>
          </div>
          
          {/* Personal connection filters */}
          <div className="filter-group">
            <div className="filter-container">
              {['Friend', 'Family'].map(tag => (
                <button key={tag} className={`filter-toggle ${filterTag === tag ? 'filter-toggle-active' : 'filter-toggle-inactive'}`} onClick={() => setFilterTag(tag)}>
                  {tag}
                </button>
              ))}
            </div>
          </div>
          
          {/* Work-related filters */}
          <div className="filter-group">
            <div className="filter-container">
              {['Team', 'Client', 'Tech', 'Design', 'Important'].map(tag => (
                <button key={tag} className={`filter-toggle ${filterTag === tag ? 'filter-toggle-active' : 'filter-toggle-inactive'}`} onClick={() => setFilterTag(tag)}>
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Contact Stats */}
      <div className="mb-4 text-surface-600 dark:text-surface-400 text-sm">
        {filteredContacts.length === 0 ? (
          <span>No contacts found</span>
        ) : filterTag ? (
          <span>Showing {filteredContacts.length} contacts tagged with "{filterTag}"</span>
        ) : (
          <span>Showing all {filteredContacts.length} contacts</span>
        )}
      </div>
      
      {/* Contact List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredContacts.map(contact => (
          <motion.div
            key={contact.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="contact-card cursor-pointer transform hover:-translate-y-1 transition-all"
            onClick={() => viewContactDetails(contact)}
          >
            <div className="contact-card-content">
              <div className="flex items-center justify-between">
                {/* Profile Image */}
                <div className="avatar w-16 h-16 flex-shrink-0">
                  {contact.profileImage ? (
                    <img 
                      src={contact.profileImage} 
                      alt={`${contact.firstName} ${contact.lastName}`}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <UserCircle className="w-12 h-12" />
                  )}
                </div>
                
                {/* Favorite Indicator */}
                {contact.isFavorite && (
                  <div className="favorite-indicator">
                    <Star className="w-5 h-5 fill-amber-400" />
                  </div>
                )}
              </div>
              
              {/* Content */}
              <div className="mt-2">
                <h3 className="text-lg font-semibold truncate mb-1">
                  {contact.firstName} {contact.lastName}
                </h3>
                
                {contact.jobTitle && contact.company && (
                  <p className="text-surface-600 dark:text-surface-400 text-sm mb-3">
                    {contact.jobTitle}, {contact.company}
                  </p>
                )}
              </div>
              
              {/* Contact Details */}
              <div className="space-y-1">
                {contact.phoneNumbers && contact.phoneNumbers.length > 0 && (
                  <div className="contact-info-row">
                    <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="truncate">{contact.phoneNumbers[0].number}</span>
                  </div>
                )}
                
                {contact.emails && contact.emails.length > 0 && (
                  <div className="contact-info-row">
                    <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="truncate">{contact.emails[0].email}</span>
                  </div>
                )}
              </div>
              
              {/* Tags */}
              {contact.tags && contact.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2 pt-2 border-t border-surface-100 dark:border-surface-700">
                  {contact.tags.map(tag => (
                    <span 
                      key={tag} 
                      className={`px-2 py-0.5 text-xs rounded-full ${getTagColor(tag)}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* No contacts message */}
      {filteredContacts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="w-16 h-16 rounded-full bg-surface-200 dark:bg-surface-700 flex items-center justify-center mb-4">
            <UserCircle className="w-8 h-8 text-surface-600 dark:text-surface-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No contacts found</h3>
          <p className="text-surface-600 dark:text-surface-400 mb-4">
            {filterTag ? `No contacts with the tag "${filterTag}"` : "You haven't added any contacts yet"}
          </p>
          <button 
            onClick={() => { setFilterTag(''); handleOpenContactForm(); }}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add New Contact
          </button>
        </div>
      )}
      
      {/* Add/Edit Contact Form Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-40"
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white dark:bg-surface-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="sticky top-0 z-10 bg-white dark:bg-surface-800 px-6 py-4 border-b border-surface-200 dark:border-surface-700 flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  {isEditing ? "Edit Contact" : "Add New Contact"}
                </h2>
                <button 
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6">
                <div className="space-y-6">
                  {/* Basic Info */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium flex items-center gap-2 text-surface-800 dark:text-surface-200">
                      <User className="w-5 h-5 text-primary" />
                      Basic Information
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                          First Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required
                          className="input-field"
                          placeholder="Enter first name"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                          Last Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required
                          className="input-field"
                          placeholder="Enter last name"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                          Nickname
                        </label>
                        <input
                          type="text"
                          name="nickname"
                          value={formData.nickname}
                          onChange={handleInputChange}
                          className="input-field"
                          placeholder="Enter nickname"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                          Birthday
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Calendar className="h-5 w-5 text-surface-400" />
                          </div>
                          <input
                            type="date"
                            name="birthday"
                            value={formData.birthday}
                            onChange={handleInputChange}
                            className="input-field pl-10"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Contact Info */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium flex items-center gap-2 text-surface-800 dark:text-surface-200">
                      <Phone className="w-5 h-5 text-primary" />
                      Contact Information
                    </h3>
                    
                    {/* Phone Numbers */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300">
                          Phone Numbers
                        </label>
                        <button
                          type="button"
                          onClick={addPhoneField}
                          className="text-primary text-sm hover:text-primary-dark font-medium"
                        >
                          + Add Phone
                        </button>
                      </div>
                      
                      {formData.phoneNumbers.map((phone, index) => (
                        <div key={index} className="flex gap-3">
                          <select
                            value={phone.type}
                            onChange={(e) => handlePhoneChange(index, 'type', e.target.value)}
                            className="input-field w-1/3"
                          >
                            <option value="mobile">Mobile</option>
                            <option value="work">Work</option>
                            <option value="home">Home</option>
                            <option value="other">Other</option>
                          </select>
                          
                          <div className="relative flex-1">
                            <input
                              type="tel"
                              value={phone.number}
                              onChange={(e) => handlePhoneChange(index, 'number', e.target.value)}
                              className="input-field"
                              placeholder="(555) 123-4567"
                            />
                          </div>
                          
                          {formData.phoneNumbers.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removePhoneField(index)}
                              className="p-2 rounded-full text-surface-500 hover:bg-surface-200 dark:hover:bg-surface-700 dark:text-surface-400"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    {/* Email Addresses */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300">
                          Email Addresses
                        </label>
                        <button
                          type="button"
                          onClick={addEmailField}
                          className="text-primary text-sm hover:text-primary-dark font-medium"
                        >
                          + Add Email
                        </button>
                      </div>
                      
                      {formData.emails.map((email, index) => (
                        <div key={index} className="flex gap-3">
                          <select
                            value={email.type}
                            onChange={(e) => handleEmailChange(index, 'type', e.target.value)}
                            className="input-field w-1/3"
                          >
                            <option value="personal">Personal</option>
                            <option value="work">Work</option>
                            <option value="other">Other</option>
                          </select>
                          
                          <div className="relative flex-1">
                            <input
                              type="email"
                              value={email.email}
                              onChange={(e) => handleEmailChange(index, 'email', e.target.value)}
                              className="input-field"
                              placeholder="example@email.com"
                            />
                          </div>
                          
                          {formData.emails.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeEmailField(index)}
                              className="p-2 rounded-full text-surface-500 hover:bg-surface-200 dark:hover:bg-surface-700 dark:text-surface-400"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    {/* Address */}
                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                        Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <MapPin className="h-5 w-5 text-surface-400" />
                        </div>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className="input-field pl-10"
                          placeholder="Enter address"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Work Info */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium flex items-center gap-2 text-surface-800 dark:text-surface-200">
                      <Briefcase className="w-5 h-5 text-primary" />
                      Work Information
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                          Company
                        </label>
                        <input
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleInputChange}
                          className="input-field"
                          placeholder="Enter company name"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                          Job Title
                        </label>
                        <input
                          type="text"
                          name="jobTitle"
                          value={formData.jobTitle}
                          onChange={handleInputChange}
                          className="input-field"
                          placeholder="Enter job title"
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                          Website
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Globe className="h-5 w-5 text-surface-400" />
                          </div>
                          <input
                            type="url"
                            name="website"
                            value={formData.website}
                            onChange={handleInputChange}
                            className="input-field pl-10"
                            placeholder="https://example.com"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Tags and Notes */}
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Tag className="w-5 h-5 text-primary" />
                        <label className="text-sm font-medium text-surface-700 dark:text-surface-300">
                          Tags
                        </label>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {availableTags.map(tag => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => toggleTag(tag)}
                            className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                              formData.tags.includes(tag)
                                ? `${getTagColor(tag)} font-medium`
                                : 'bg-surface-200 dark:bg-surface-700 text-surface-700 dark:text-surface-300 hover:bg-surface-300 dark:hover:bg-surface-600'
                            }`}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                        Notes
                      </label>
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        rows="3"
                        className="input-field"
                        placeholder="Add any additional notes about this contact..."
                      ></textarea>
                    </div>
                  </div>
                  
                  {/* Favorite toggle */}
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={toggleFavorite}
                      className="flex items-center justify-center w-6 h-6 rounded-full mr-2"
                    >
                      <Star 
                        className={`w-6 h-6 ${formData.isFavorite ? 'text-amber-400 fill-amber-400' : 'text-surface-400 dark:text-surface-500'}`}
                      />
                    </button>
                    <span className="text-sm text-surface-700 dark:text-surface-300">
                      {formData.isFavorite ? 'Marked as favorite' : 'Mark as favorite'}
                    </span>
                  </div>
                </div>
                
                {/* Form Actions */}
                <div className="mt-8 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-lg border border-surface-300 dark:border-surface-600 text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary flex items-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    {isEditing ? "Update Contact" : "Save Contact"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Contact Detail Modal */}
      <AnimatePresence>
        {isDetailView && selectedContact && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-40"
            onClick={closeDetails}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white dark:bg-surface-800 rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="relative">
                {/* Header and Actions */}
                <div className="px-6 py-4 border-b border-surface-200 dark:border-surface-700 flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Contact Details</h2>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => editContact(selectedContact)}
                      className="p-2 rounded-full hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors text-primary"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={closeDetails}
                      className="p-2 rounded-full hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                {/* Contact Header */}
                <div className="p-6 border-b border-surface-200 dark:border-surface-700">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                    <div className="avatar w-24 h-24 shrink-0">
                      {selectedContact.profileImage ? (
                        <img 
                          src={selectedContact.profileImage} 
                          alt={`${selectedContact.firstName} ${selectedContact.lastName}`}
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <UserCircle className="w-16 h-16" />
                      )}
                    </div>
                    <div className="text-center sm:text-left">
                      <div className="flex flex-col sm:flex-row items-center gap-2">
                        <h3 className="text-2xl font-bold">
                          {selectedContact.firstName} {selectedContact.lastName}
                        </h3>
                        {selectedContact.isFavorite && (
                          <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                        )}
                      </div>
                      
                      {selectedContact.nickname && (
                        <p className="text-surface-600 dark:text-surface-400 text-lg">
                          "{selectedContact.nickname}"
                        </p>
                      )}
                      
                      {selectedContact.jobTitle && selectedContact.company && (
                        <p className="text-primary font-medium mt-1">
                          {selectedContact.jobTitle} at {selectedContact.company}
                        </p>
                      )}
                      
                      {selectedContact.tags && selectedContact.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3 justify-center sm:justify-start">
                          {selectedContact.tags.map(tag => (
                            <span 
                              key={tag} 
                              className={`px-2 py-0.5 text-xs rounded-full ${getTagColor(tag)}`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Contact Details */}
                <div className="p-6">
                  <div className="space-y-6">
                    {/* Phone Numbers */}
                    {selectedContact.phoneNumbers && selectedContact.phoneNumbers.length > 0 && (
                      <div>
                        <h4 className="text-sm uppercase text-surface-500 dark:text-surface-400 font-medium mb-2">
                          Phone Numbers
                        </h4>
                        <ul className="space-y-2">
                          {selectedContact.phoneNumbers.map((phone, index) => (
                            <li key={index} className="flex items-center gap-3">
                              <Phone className="w-5 h-5 text-primary" />
                              <div>
                                <p className="text-surface-800 dark:text-surface-200 font-medium">
                                  {phone.number}
                                </p>
                                <p className="text-xs text-surface-500 dark:text-surface-400 capitalize">
                                  {phone.type}
                                </p>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {/* Email Addresses */}
                    {selectedContact.emails && selectedContact.emails.length > 0 && (
                      <div>
                        <h4 className="text-sm uppercase text-surface-500 dark:text-surface-400 font-medium mb-2">
                          Email Addresses
                        </h4>
                        <ul className="space-y-2">
                          {selectedContact.emails.map((email, index) => (
                            <li key={index} className="flex items-center gap-3">
                              <Mail className="w-5 h-5 text-primary" />
                              <div>
                                <p className="text-surface-800 dark:text-surface-200 font-medium">
                                  {email.email}
                                </p>
                                <p className="text-xs text-surface-500 dark:text-surface-400 capitalize">
                                  {email.type}
                                </p>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {/* Website */}
                    {selectedContact.website && (
                      <div>
                        <h4 className="text-sm uppercase text-surface-500 dark:text-surface-400 font-medium mb-2">
                          Website
                        </h4>
                        <div className="flex items-center gap-3">
                          <Globe className="w-5 h-5 text-primary" />
                          <a 
                            href={selectedContact.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            {selectedContact.website}
                          </a>
                        </div>
                      </div>
                    )}
                    
                    {/* Birthday */}
                    {selectedContact.birthday && (
                      <div>
                        <h4 className="text-sm uppercase text-surface-500 dark:text-surface-400 font-medium mb-2">
                          Birthday
                        </h4>
                        <div className="flex items-center gap-3">
                          <Calendar className="w-5 h-5 text-primary" />
                          <p>{new Date(selectedContact.birthday).toLocaleDateString()}</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Address */}
                    {selectedContact.address && (
                      <div>
                        <h4 className="text-sm uppercase text-surface-500 dark:text-surface-400 font-medium mb-2">
                          Address
                        </h4>
                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                          <p>{selectedContact.address}</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Notes */}
                    {selectedContact.notes && (
                      <div>
                        <h4 className="text-sm uppercase text-surface-500 dark:text-surface-400 font-medium mb-2">
                          Notes
                        </h4>
                        <div className="bg-surface-100 dark:bg-surface-700/50 rounded-lg p-3">
                          <p className="text-surface-700 dark:text-surface-300 whitespace-pre-line">
                            {selectedContact.notes}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Actions */}
                <div className="p-6 border-t border-surface-200 dark:border-surface-700 flex justify-between">
                  <button
                    onClick={() => handleDeleteContact(selectedContact.id)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <Trash className="w-5 h-5" />
                    <span>Delete Contact</span>
                  </button>
                  
                  <button
                    onClick={() => editContact(selectedContact)}
                    className="btn-primary flex items-center gap-2"
                  >
                    <Edit className="w-5 h-5" />
                    <span>Edit Contact</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MainFeature;