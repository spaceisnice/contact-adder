import React, { useState } from 'react';
import { Search, Loader2, Database } from 'lucide-react';
import { searchContactsByName } from '../services/airtableService';
import DatabaseSearchModal from './DatabaseSearchModal';
import toast from 'react-hot-toast';

interface DatabaseSearchResult {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  website?: string;
  socialMediaUrl?: string;
  contact?: string;
  email?: string;
  city?: string;
  state?: string;
  region?: string;
  contactType?: string[];
  notes?: string;
}

const DatabaseSearchSection: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<DatabaseSearchResult[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [lastSearchTerm, setLastSearchTerm] = useState('');

  const handleDatabaseSearch = async () => {
    if (!searchTerm.trim()) {
      toast.error('Please enter a contact name to search');
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchContactsByName(searchTerm.trim());
      setSearchResults(results);
      setLastSearchTerm(searchTerm.trim());
      setShowModal(true);
      
      if (results.length === 0) {
        toast.error(`No matches found for "${searchTerm}"`);
      } else {
        toast.success(`Found ${results.length} match${results.length === 1 ? '' : 'es'}`);
      }
    } catch (error: any) {
      console.error('Database search error:', error);
      toast.error(error.message || 'Failed to search database');
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleDatabaseSearch();
    }
  };

  return (
    <>
      <div className="bg-purple-50 p-4 rounded-md border border-purple-200 mb-6">
        <h3 className="text-lg font-medium text-purple-800 mb-4 flex items-center">
          <Database className="h-5 w-5 mr-2" />
          Search Airtable First
        </h3>
        <p className="text-sm text-purple-600 mb-4">
          Search existing contacts in the Airtable database by contact name.
        </p>
        
        <div className="flex gap-3">
          <div className="flex-1">
            <label htmlFor="databaseSearch" className="block text-sm font-medium text-gray-700 mb-1">
              Contact Name
            </label>
            <input
              id="databaseSearch"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter contact name to search database"
            />
          </div>
          
          <div className="flex items-end">
            <button
              type="button"
              onClick={handleDatabaseSearch}
              disabled={isSearching || !searchTerm.trim()}
              className="flex items-center justify-center px-4 py-2 bg-purple-600 text-white font-medium rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:bg-purple-300"
            >
              {isSearching ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </>
              )}
            </button>
          </div>
        </div>
        
        <p className="text-xs text-gray-500 mt-2">
          Search will retrieve partial, case-insensitive matches in "Name or Company" field of the World Domination database. Any records found will show in a popup. 
          <br /><strong>Note:</strong> It is still possible to add duplicate records, this just shows what's there.
        </p>
      </div>

      {/* Search Results Modal */}
      {showModal && (
        <DatabaseSearchModal
          results={searchResults}
          searchTerm={lastSearchTerm}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default DatabaseSearchSection;