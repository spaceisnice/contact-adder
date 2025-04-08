import React from 'react';
import { Search, Loader2 } from 'lucide-react';
import { StateOption } from '../types/form';

interface SearchSectionProps {
  venueName: string;
  city: string;
  state: string;
  country: string;
  isSearching: boolean;
  stateOptions: (StateOption | string)[];
  region: string;
  onVenueNameChange: (value: string) => void;
  onCityChange: (value: string) => void;
  onStateChange: (value: string) => void;
  onCountryChange: (value: string) => void;
  onSearch: () => void;
}

const SearchSection: React.FC<SearchSectionProps> = ({
  venueName,
  city,
  state,
  country,
  isSearching,
  stateOptions,
  region,
  onVenueNameChange,
  onCityChange,
  onStateChange,
  onCountryChange,
  onSearch,
}) => {
  return (
    <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
      <h3 className="text-lg font-medium text-blue-800 mb-4">Search for Contact</h3>
      <p className="text-sm text-blue-600 mb-4">
        Enter the contact name and location details to search for information automatically.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div>
          <label htmlFor="searchVenueName" className="block text-sm font-medium text-gray-700 mb-1">
            Contact Name *
          </label>
          <input
            id="searchVenueName"
            type="text"
            value={venueName}
            onChange={(e) => onVenueNameChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter contact name"
            required
          />
        </div>
        
        <div>
          <label htmlFor="searchCity" className="block text-sm font-medium text-gray-700 mb-1">
            City
          </label>
          <input
            id="searchCity"
            type="text"
            value={city}
            onChange={(e) => onCityChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter city"
          />
        </div>
        
        <div>
          <label htmlFor="searchState" className="block text-sm font-medium text-gray-700 mb-1">
            State (or Country if INTL)
          </label>
          <select
            id="searchState"
            value={state}
            onChange={(e) => onStateChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a state...</option>
            {Array.isArray(stateOptions) && stateOptions.map((option) => (
              <option 
                key={typeof option === 'string' ? option : option.abbr} 
                value={typeof option === 'string' ? option : option.abbr}
              >
                {typeof option === 'string' ? option : `${option.name} (${option.abbr})`}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            {region === 'INTL - Europe' ? 'Select a European country' : 'For international venues, leave blank'}
          </p>
        </div>
        
        <div>
          <label htmlFor="searchCountry" className="block text-sm font-medium text-gray-700 mb-1">
            Country
          </label>
          <input
            id="searchCountry"
            type="text"
            value={country}
            onChange={(e) => onCountryChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter country"
          />
        </div>
      </div>
      
      <button
        type="button"
        onClick={onSearch}
        disabled={isSearching}
        className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300"
      >
        {isSearching ? (
          <>
            <Loader2 className="animate-spin mr-2 h-5 w-5" />
            Searching...
          </>
        ) : (
          <>
            <Search className="mr-2 h-5 w-5" />
            Search for Contact Information
          </>
        )}
      </button>
      
      <p className="text-xs text-gray-500 mt-2">
        Note: Search results will populate the form below. You can edit any information before saving.
      </p>
    </div>
  );
};

export default SearchSection;