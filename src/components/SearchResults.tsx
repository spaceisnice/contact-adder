import React from 'react';
import { RefreshCw } from 'lucide-react';
import { VenueInfo } from '../types/venue';

interface SearchResultsProps {
  searchResults: VenueInfo;
  searchSource: string | null;
  onRefresh: () => void;
  isSearching: boolean;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  searchResults,
  searchSource,
  onRefresh,
  isSearching,
}) => {
  return (
    <div className="bg-green-50 p-4 rounded-md border border-green-200">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium text-green-800 mb-2">Search Results</h3>
          {searchSource && (
            <p className="text-xs text-green-600 mb-2">Source: {searchSource}</p>
          )}
        </div>
        <button 
          type="button"
          onClick={onRefresh}
          disabled={isSearching}
          className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
        >
          <RefreshCw className="h-3 w-3 mr-1" />
          Refresh
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm">
        {searchResults.website && (
          <div>
            <span className="font-medium text-gray-700">Website:</span>{' '}
            <a href={searchResults.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
              {searchResults.website.replace(/^https?:\/\//, '')}
            </a>
          </div>
        )}
        
        {searchResults.address && (
          <div>
            <span className="font-medium text-gray-700">Address:</span>{' '}
            <span className="text-gray-600">{searchResults.address}</span>
          </div>
        )}
        
        {searchResults.phoneNumber && (
          <div>
            <span className="font-medium text-gray-700">Phone:</span>{' '}
            <span className="text-gray-600">{searchResults.phoneNumber}</span>
          </div>
        )}
        
        {searchResults.bookingContact?.email && (
          <div>
            <span className="font-medium text-gray-700">Email:</span>{' '}
            <span className="text-gray-600">{searchResults.bookingContact.email}</span>
          </div>
        )}
        
        {searchResults.bookingContact?.name && (
          <div>
            <span className="font-medium text-gray-700">Contact:</span>{' '}
            <span className="text-gray-600">{searchResults.bookingContact.name}</span>
          </div>
        )}
        
        {searchResults.country && (
          <div>
            <span className="font-medium text-gray-700">Country:</span>{' '}
            <span className="text-gray-600">{searchResults.country}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;