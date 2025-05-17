/**
 * Contact Service - Handles all data operations for the contact table
 */

// Create ApperClient instance
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

// Contact table name from schema
const CONTACT_TABLE = 'contact';

// Contact field definitions from schema - used to filter updateable fields
const CONTACT_FIELDS = {
  updateable: [
    'Name',
    'Tags',
    'Owner',
    'firstName',
    'lastName',
    'nickname',
    'birthday',
    'phoneNumbers',
    'emails',
    'address',
    'company',
    'jobTitle',
    'website',
    'notes',
    'tags',
    'isFavorite',
    'profileImage',
    'phoneType',
    'emailType'
  ],
  all: [
    'Name',
    'Tags',
    'Owner',
    'CreatedOn',
    'CreatedBy',
    'ModifiedOn',
    'ModifiedBy',
    'firstName',
    'lastName',
    'nickname',
    'birthday',
    'phoneNumbers',
    'emails',
    'address',
    'company',
    'jobTitle',
    'website',
    'notes',
    'tags',
    'isFavorite',
    'profileImage',
    'phoneType',
    'emailType'
  ]
};

/**
 * Filters the contact record to only include updateable fields
 * @param {Object} contact - Contact record with all fields
 * @returns {Object} - Contact record with only updateable fields
 */
const filterUpdateableFields = (contact) => {
  return Object.keys(contact).reduce((filtered, key) => {
    if (CONTACT_FIELDS.updateable.includes(key) || key === 'Id') {
      filtered[key] = contact[key];
    }
    return filtered;
  }, {});
};

/**
 * Fetch all contacts with optional filtering
 * @param {Object} options - Filter and pagination options
 * @returns {Promise<Array>} - Array of contact records
 */
export const fetchContacts = async (options = {}) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      fields: CONTACT_FIELDS.all,
      pagingInfo: {
        limit: options.limit || 100,
        offset: options.offset || 0
      },
      orderBy: [
        {
          field: options.sortField || 'firstName',
          direction: options.sortDirection || 'asc'
        }
      ]
    };
    
    // Add search filtering if provided
    if (options.searchQuery) {
      const query = options.searchQuery.trim();
      if (query) {
        params.whereGroups = [
          {
            operator: 'OR',
            subGroups: [
              {
                conditions: [
                  {
                    fieldName: 'firstName',
                    operator: 'Contains',
                    values: [query]
                  }
                ]
              },
              {
                conditions: [
                  {
                    fieldName: 'lastName',
                    operator: 'Contains',
                    values: [query]
                  }
                ]
              },
              {
                conditions: [
                  {
                    fieldName: 'emails',
                    operator: 'Contains',
                    values: [query]
                  }
                ]
              },
              {
                conditions: [
                  {
                    fieldName: 'phoneNumbers',
                    operator: 'Contains',
                    values: [query]
                  }
                ]
              }
            ]
          }
        ];
      }
    }
    
    // Add tag filtering if provided
    if (options.filterTag) {
      params.where = [
        {
          fieldName: 'tags',
          operator: 'Contains',
          values: [options.filterTag]
        }
      ];
    }

    const response = await apperClient.fetchRecords(CONTACT_TABLE, params);
    
    if (!response || !response.data) {
      return [];
    }
    
    return response.data;
  } catch (error) {
    console.error('Error fetching contacts:', error);
    throw error;
  }
};

/**
 * Get all contacts - alias for fetchContacts with default options
 * @returns {Promise<Array>} - Array of contact records
 */
export const getAllContacts = async () => {
  return fetchContacts();
};

/**
 * Get only favorite contacts
 * @returns {Promise<Array>} - Array of favorite contact records
 */
export const getFavoriteContacts = async () => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      fields: CONTACT_FIELDS.all,
      where: [
        {
          fieldName: 'isFavorite',
          operator: 'ExactMatch',
          values: [true]
        }
      ],
      orderBy: [
        {
          field: 'firstName',
          direction: 'asc'
        }
      ]
    };
    
    const response = await apperClient.fetchRecords(CONTACT_TABLE, params);
    
    if (!response || !response.data) {
      return [];
    }
    
    return response.data;
  } catch (error) {
    console.error('Error fetching favorite contacts:', error);
    throw error;
  }
};

/**
 * Toggle favorite status for a contact
 * @param {string|number} contactId - ID of the contact
 * @returns {Promise<Object>} - Updated contact with toggled favorite status
 */
export const toggleFavoriteContact = async (contactId) => {
  try {
    const apperClient = getApperClient();
    
    // First, get the current contact to determine its favorite status
    const contact = await apperClient.getRecordById(CONTACT_TABLE, contactId);
    
    if (!contact || !contact.data) {
      throw new Error('Contact not found');
    }
    
    // Toggle the favorite status
    const updateData = {
      Id: contactId,
      isFavorite: !contact.data.isFavorite
    };
    
    // Update the contact
    return updateContact(updateData);
  } catch (error) {
    console.error('Error toggling favorite status:', error);
    throw error;
  }
};

/**
 * Create a new contact
 * @param {Object} contactData - Contact data to create
 * @returns {Promise<Object>} - Newly created contact
 */
export const createContact = async (contactData) => {
  try {
    const apperClient = getApperClient();
    
    // Filter out non-updateable fields
    const updateableData = filterUpdateableFields(contactData);
    
    const params = {
      records: [updateableData]
    };
    
    const response = await apperClient.createRecord(CONTACT_TABLE, params);
    
    if (!response || !response.success || !response.results || response.results.length === 0) {
      throw new Error('Failed to create contact');
    }
    
    return response.results[0].data;
  } catch (error) {
    console.error('Error creating contact:', error);
    throw error;
  }
};

/**
 * Update an existing contact
 * @param {Object} contactData - Contact data to update (must include Id)
 * @returns {Promise<Object>} - Updated contact
 */
export const updateContact = async (contactData) => {
  try {
    const apperClient = getApperClient();
    
    if (!contactData.Id) {
      throw new Error('Contact ID is required for update');
    }
    
    // Filter out non-updateable fields
    const updateableData = filterUpdateableFields(contactData);
    
    const params = {
      records: [updateableData]
    };
    
    const response = await apperClient.updateRecord(CONTACT_TABLE, params);
    
    if (!response || !response.success || !response.results || response.results.length === 0) {
      throw new Error('Failed to update contact');
    }
    
    return response.results[0].data;
  } catch (error) {
    console.error('Error updating contact:', error);
    throw error;
  }
};

/**
 * Delete a contact by ID
 * @param {string|number} contactId - ID of the contact to delete
 * @returns {Promise<boolean>} - Success status
 */
export const deleteContact = async (contactId) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      RecordIds: [contactId]
    };
    
    const response = await apperClient.deleteRecord(CONTACT_TABLE, params);
    
    if (!response || !response.success) {
      throw new Error('Failed to delete contact');
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting contact:', error);
    throw error;
  }
};