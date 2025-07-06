import React, { useState, useEffect, useRef } from 'react';
import { Save, Loader2, Search, AlertTriangle, RefreshCw, Info, X } from 'lucide-react';
import { createVenueInfo } from '../services/venueSearchService';
import { addVenueToAirtable, verifyAirtableConnection, fetchContactTypes } from '../services/airtableService';
import { searchVenueWithPlaces } from '../services/googlePlacesService';
import { VenueInfo } from '../types/venue';
import PreviewModal from './PreviewModal';
import toast from 'react-hot-toast';

// Region options
const regionOptions = [
  "Mid-Atlantic",
  "Midwest",
  "National",
  "Northeast",
  "NYC",
  "Pacific Northwest",
  "Southeast",
  "West",
  "The Berkshires",
  "Southwest",
  "INTL - Australia",
  "INTL - Canada",
  "INTL - Europe",
  "INTL - Ireland",
  "INTL - Italy",
  "INTL - New Zealand",
  "INTL - South America",
  "INTL - Turkey",
  "INTL - UK",
  "INTL - Russian",
  "INTL - Germany",
  "INTL - Switzerland"
];

// European countries
const europeanCountries = [
  "Albania",
  "Andorra",
  "Austria",
  "Belarus",
  "Belgium",
  "Bosnia and Herzegovina",
  "Bulgaria",
  "Croatia",
  "Czech Republic",
  "Denmark",
  "Estonia",
  "Finland",
  "France",
  "Germany",
  "Greece",
  "Hungary",
  "Iceland",
  "Ireland",
  "Italy",
  "Latvia",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Malta",
  "Moldova",
  "Monaco",
  "Montenegro",
  "Netherlands",
  "North Macedonia",
  "Norway",
  "Poland",
  "Portugal",
  "Romania",
  "Russia",
  "San Marino",
  "Serbia",
  "Slovakia",
  "Slovenia",
  "Spain",
  "Sweden",
  "Switzerland",
  "Ukraine",
  "United Kingdom",
  "Vatican City"
];

// US State options with 2-letter abbreviations
const usStateOptions = [
  { name: "Alabama", abbr: "AL" },
  { name: "Alaska", abbr: "AK" },
  { name: "Arizona", abbr: "AZ" },
  { name: "Arkansas", abbr: "AR" },
  { name: "California", abbr: "CA" },
  { name: "Colorado", abbr: "CO" },
  { name: "Connecticut", abbr: "CT" },
  { name: "Delaware", abbr: "DE" },
  { name: "Florida", abbr: "FL" },
  { name: "Georgia", abbr: "GA" },
  { name: "Hawaii", abbr: "HI" },
  { name: "Idaho", abbr: "ID" },
  { name: "Illinois", abbr: "IL" },
  { name: "Indiana", abbr: "IN" },
  { name: "Iowa", abbr: "IA" },
  { name: "Kansas", abbr: "KS" },
  { name: "Kentucky", abbr: "KY" },
  { name: "Louisiana", abbr: "LA" },
  { name: "Maine", abbr: "ME" },
  { name: "Maryland", abbr: "MD" },
  { name: "Massachusetts", abbr: "MA" },
  { name: "Michigan", abbr: "MI" },
  { name: "Minnesota", abbr: "MN" },
  { name: "Mississippi", abbr: "MS" },
  { name: "Missouri", abbr: "MO" },
  { name: "Montana", abbr: "MT" },
  { name: "Nebraska", abbr: "NE" },
  { name: "Nevada", abbr: "NV" },
  { name: "New Hampshire", abbr: "NH" },
  { name: "New Jersey", abbr: "NJ" },
  { name: "New Mexico", abbr: "NM" },
  { name: "New York", abbr: "NY" },
  { name: "North Carolina", abbr: "NC" },
  { name: "North Dakota", abbr: "ND" },
  { name: "Ohio", abbr: "OH" },
  { name: "Oklahoma", abbr: "OK" },
  { name: "Oregon", abbr: "OR" },
  { name: "Pennsylvania", abbr: "PA" },
  { name: "Rhode Island", abbr: "RI" },
  { name: "South Carolina", abbr: "SC" },
  { name: "South Dakota", abbr: "SD" },
  { name: "Tennessee", abbr: "TN" },
  { name: "Texas", abbr: "TX" },
  { name: "Utah", abbr: "UT" },
  { name: "Vermont", abbr: "VT" },
  { name: "Virginia", abbr: "VA" },
  { name: "Washington", abbr: "WA" },
  { name: "West Virginia", abbr: "WV" },
  { name: "Wisconsin", abbr: "WI" },
  { name: "Wyoming", abbr: "WY" },
  { name: "District of Columbia", abbr: "DC" },
  { name: "American Samoa", abbr: "AS" },
  { name: "Guam", abbr: "GU" },
  { name: "Northern Mariana Islands", abbr: "MP" },
  { name: "Puerto Rico", abbr: "PR" },
  { name: "United States Minor Outlying Islands", abbr: "UM" },
  { name: "U.S. Virgin Islands", abbr: "VI" }
];

const VenueForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [connectionVerified, setConnectionVerified] = useState<boolean | null>(null);
  const [connectionChecking, setConnectionChecking] = useState(false);
  const [searchResults, setSearchResults] = useState<VenueInfo | null>(null);
  const [searchSource, setSearchSource] = useState<string | null>(null);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState<VenueInfo | null>(null);
  
  // Basic venue information
  const [venueName, setVenueName] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [region, setRegion] = useState('');
  const [country, setCountry] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [website, setWebsite] = useState('');
  
  // Contact information
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  
  // Contact types state
  const [contactTypeOptions, setContactTypeOptions] = useState<string[]>([]);
  const [selectedContactTypes, setSelectedContactTypes] = useState<string[]>([]);
  const [isContactTypeDropdownOpen, setIsContactTypeDropdownOpen] = useState(false);
  const [isLoadingContactTypes, setIsLoadingContactTypes] = useState(false);
  const [contactTypeSearch, setContactTypeSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [notes, setNotes] = useState<string[]>([]);
  
  // State options based on region
  const [stateOptions, setStateOptions] = useState<string[] | { name: string, abbr: string }[]>(usStateOptions);
  
  // Filter contact types based on search
  const filteredContactTypes = contactTypeOptions.filter(type =>
    type.toLowerCase().includes(contactTypeSearch.toLowerCase())
  );

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsContactTypeDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update state options when region changes
  useEffect(() => {
    if (region === 'INTL - Europe') {
      setStateOptions(europeanCountries);
      setCountry('EU');
     } else if (region === 'INTL - UK') {
      setCountry('UK');
    } else {
      setStateOptions(usStateOptions);
      // setCountry('');
    }
    // Clear the selected state when region changes
    setState('');
  }, [region]);

  // Fetch contact types on component mount
  useEffect(() => {
    const loadContactTypes = async () => {
      setIsLoadingContactTypes(true);
      try {
        const types = await fetchContactTypes();
        if (types.length > 0) {
          setContactTypeOptions(types);
        }
      } catch (error) {
        console.error('Failed to load contact types:', error);
        toast.error('Failed to load contact types from Airtable' + error );
      } finally {
        setIsLoadingContactTypes(false);
      }
    };

    loadContactTypes();
  }, []);

  // Verify Airtable connection on component mount
  useEffect(() => {
    const checkConnection = async () => {
      setConnectionChecking(true);
      try {
        const isConnected = await verifyAirtableConnection();
        setConnectionVerified(isConnected);
        if (!isConnected) {
          toast.error('Could not connect to Airtable. Please check your configuration.');
        }
      } catch (err) {
        setConnectionVerified(false);
        toast.error('Failed to verify Airtable connection');
      } finally {
        setConnectionChecking(false);
      }
    };
    
    checkConnection();
  }, []);

  const handleSearch = async () => {
    if (!venueName) {
      setError('Please enter contact name to search');
      return;
    }

    setIsSearching(true);
    setError(null);
    setSearchResults(null);
    setSearchSource(null);
    setSearchAttempted(true);

    try {
          
      // Search using Google Places API
      const venueInfo = await searchVenueWithPlaces(venueName, city, state, country);
      
      if (!venueInfo) {
        console.log('No venue information found');
        toast.error('No venue information found');
        setError(`No venue information found for "${venueName}". Please try a different search term, add more location details, or enter information manually.`);
        return;
      }
      
      // console.log('Venue information found:', venueInfo);
      
      // Store search results
      setSearchResults(venueInfo);
      
      // Update form fields with search results
      setCity(venueInfo.city || city);
      setState(venueInfo.state || '');
      setAddress(venueInfo.address || '');
      setPhoneNumber(venueInfo.phoneNumber || '');
      setWebsite(venueInfo.website || '');
      setCountry(venueInfo.country || '');
      
      //update region to INTL - UK if UK is chosen country
      if (venueInfo.country === 'UK'){
        setRegion('INTL - UK');
      }
      
      if (venueInfo.bookingContact) {
        setContactName(venueInfo.bookingContact.name || '');
        setContactEmail(venueInfo.bookingContact.email || '');
      }
      
      // Set search source
      setSearchSource('Google Places API');
      
      toast.success('Venue information found!');
    } catch (err) {
      console.error(err);
      setError('Error searching for venue information. Please try again or enter details manually.');
      toast.error('Search failed');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!venueName) {
      setError('Please enter contact name');
      return;
    }

    if (!region) {
      setError('Please select a region');
      return;
    }

    if (selectedContactTypes.length === 0) {
      setError('Please select at least one contact type');
      return;
    }

    // Check if Airtable connection is verified
    if (connectionVerified === false) {
      setError('Cannot save to Airtable due to connection issues. Please check your Airtable configuration.');
      toast.error('Airtable connection failed');
      return;
    }

    // For US states, use abbreviation. For European countries, use full name
    const stateToSave = region === 'INTL - Europe' ? state : 
      usStateOptions.find(s => s.name === state || s.abbr === state)?.abbr || state;
    
    const venueInfo = createVenueInfo(
      venueName,
      city,
      stateToSave,
      region,
      country,
      address,
      phoneNumber,
      website,
      contactName,
      contactEmail,
      phoneNumber,
      selectedContactTypes,
      notes
    );

    // Show preview modal
    setPreviewData(venueInfo);
    setShowPreview(true);
  };

  const handleSaveConfirm = async () => {
    if (!previewData) return;

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await addVenueToAirtable(previewData);
      setSuccess('Contact information successfully saved to Airtable!');
      toast.success('Contact added to Airtable!');
      
      // Reset form
      resetForm();
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to save contact information to Airtable.';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error(err);
    } finally {
      setIsLoading(false);
      setShowPreview(false);
    }
  };
  
  const resetForm = () => {
    setVenueName('');
    setCity('');
    setState('');
    setRegion('');
    setCountry('');
    setAddress('');
    setPhoneNumber('');
    setWebsite('');
    setContactName('');
    setContactEmail('');
    setSelectedContactTypes([]);
    setNotes([]);
    setSearchResults(null);
    setSearchSource(null);
    setSearchAttempted(false);
    setError(null);
    setSuccess(null);
    setContactTypeSearch('');
    setShowPreview(false);
    setPreviewData(null);
  };

  // Toggle contact type selection
  const toggleContactType = (type: string) => {
    setSelectedContactTypes(prev => {
      if (prev.includes(type)) {
        return prev.filter(t => t !== type);
      } else {
        return [...prev, type];
      }
    });
  };

  // Remove a contact type
  const removeContactType = (type: string) => {
    setSelectedContactTypes(prev => prev.filter(t => t !== type));
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {connectionVerified === false && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800">Airtable Connection Issue</h3>
              <p className="text-sm text-yellow-700 mt-1">
                Unable to connect to Airtable. Please check your Airtable configuration in the .env file:
              </p>
              <ul className="list-disc pl-5 mt-1 text-xs text-yellow-700 space-y-1">
                <li>Verify your Personal Access Token is correct</li>
                <li>Confirm the Base ID exists and you have access to it</li>
                <li>Check that the table name is spelled correctly</li>
                <li>Ensure your Airtable account has permission to access this base</li>
              </ul>
            </div>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Search Section */}
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
                onChange={(e) => setVenueName(e.target.value)}
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
                onChange={(e) => setCity(e.target.value)}
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
                onChange={(e) => setState(e.target.value)}
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
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter country"
              />
            </div>
          </div>
          
          <button
            type="button"
            onClick={handleSearch}
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
        
        {/* Search Results Summary (if available) */}
        {searchResults && (
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
                onClick={handleSearch}
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
        )}
        
        {/* No Results Message */}
        {searchAttempted && !searchResults && !isSearching && (
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
            <div className="flex items-start">
              <Info className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-gray-700">No Results Found</h3>
                <p className="text-sm text-gray-600 mt-1">
                  We couldn't find information for "{venueName}". You can:
                </p>
                <ul className="list-disc pl-5 mt-1 text-xs text-gray-600 space-y-1">
                  <li>Try a different spelling or contact name</li>
                  <li>Add more location details (city, state)</li>
                  <li>Enter the contact information manually below</li>
                </ul>
              </div>
            </div>
          </div>
        )}
        
        {/* Basic Information */}
        <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="venueName" className="block text-sm font-medium text-gray-700 mb-1">
                Contact Name *
              </label>
              <input
                id="venueName"
                type="text"
                value={venueName}
                onChange={(e) => setVenueName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter contact name"
                required
              />
            </div>
            
            {/* Contact Types - Airtable Style with Autocomplete */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Type *
              </label>
              <div className="relative" ref={dropdownRef}>
                {/* Selected Types Display */}
                <div className="min-h-[42px] p-2 border border-gray-300 rounded-md bg-white">
                  <div className="flex flex-wrap gap-2">
                    {selectedContactTypes.map((type) => (
                      <span
                        key={type}
                        className="inline-flex items-center px-2.5 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                      >
                        {type}
                        <button
                          type="button"
                          onClick={() => removeContactType(type)}
                          className="ml-1 p-0.5 hover:bg-blue-200 rounded-full"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      value={contactTypeSearch}
                      onChange={(e) => {
                        setContactTypeSearch(e.target.value);
                        if (!isContactTypeDropdownOpen) {
                          setIsContactTypeDropdownOpen(true);
                        }
                      }}
                      onFocus={() => setIsContactTypeDropdownOpen(true)}
                      className="flex-1 min-w-[120px] bg-transparent border-none focus:outline-none text-sm"
                      placeholder="Search types..."
                    />
                  </div>
                </div>
                
                {/* Dropdown Menu */}
                {isContactTypeDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg">
                    <div className="py-1 max-h-60 overflow-auto">
                      {isLoadingContactTypes ? (
                        <div className="px-4 py-2 text-sm text-gray-500 flex items-center">
                          <Loader2 className="animate-spin h-4 w-4 mr-2" />
                          Loading contact types...
                        </div>
                      ) : filteredContactTypes.length === 0 ? (
                        <div className="px-4 py-2 text-sm text-gray-500">
                          {contactTypeSearch ? 'No matching types found' : 'No contact types available'}
                        </div>
                      ) : (
                        filteredContactTypes.map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => {
                              toggleContactType(type);
                              setContactTypeSearch('');
                            }}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                              selectedContactTypes.includes(type)
                                ? 'bg-blue-50 text-blue-800'
                                : 'text-gray-700'
                            }`}
                          >
                            {type}
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                id="city"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter city"
              />
            </div>
            
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                State
              </label>
              <select
                id="state"
                value={state}
                onChange={(e) => setState(e.target.value)}
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
                {region === 'INTL - Europe' ? 'Select a European country' : 'For international venues, leave blank and country will be used'}
              </p>
            </div>            
            
            <div>
              <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-1">
                Region *
              </label>
              <select
                id="region"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a region...</option>
                {regionOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <input
                id="country"
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter country"
              />
            </div>
            
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <input
                id="address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter full address"
              />
            </div>
            
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                id="phoneNumber"
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter phone number"
              />
            </div>
            
            <div>
              <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                Website
              </label>
              <input
                id="website"
                type="text"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter website URL"
              />
            </div>
          </div>
        </div>
        
        {/* Booking Contact */}
        <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-1">
                Contact
              </label>
              <input
                id="contactName"
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Contact person's name"
              />
            </div>
            
            <div>
              <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="contactEmail"
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Contact email address"
              />
            </div>
          </div>
        </div>
        
        {/* Notes */}
        <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Notes</h3>
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter any additional notes"
              rows={3}
            />
            <p className="text-xs text-gray-500 mt-1">              
            </p>
          </div>
        </div>
        
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
            {error}
          </div>
        )}

        {success && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-md text-green-600">
            {success}
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="submit"
            disabled={isLoading || connectionVerified === false}
            className="flex-1 flex items-center justify-center px-4 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin mr-2 h-5 w-5" />
                Saving to Airtable...
              </>
            ) : connectionChecking ? (
              <>
                <Loader2 className="animate-spin mr-2 h-5 w-5" />
                Verifying Airtable connection...
              </>
            ) : (
              <>
                <Save className="mr-2 h-5 w-5" />
                Preview & Save
              </>
            )}
          </button>
          
          <button
            type="button"
            onClick={resetForm}
            className="sm:w-auto flex items-center justify-center px-4 py-3 bg-gray-200 text-gray-800 font-medium rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Clear Form
          </button>
        </div>
      </form>

      {/* Preview Modal */}
      {showPreview && previewData && (
        <PreviewModal
          data={previewData}
          onConfirm={handleSaveConfirm}
          onCancel={() => setShowPreview(false)}
        />
      )}
    </div>
  );
};

export default VenueForm;