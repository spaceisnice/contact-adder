import React from 'react';
import { StateOption } from '../types/form';
import ContactTypeSelector from './ContactTypeSelector';

interface BasicInformationProps {
  venueName: string;
  city: string;
  state: string;
  region: string;
  country: string;
  address: string;
  phoneNumber: string;
  website: string;
  selectedContactTypes: string[];
  contactTypeOptions: string[];
  isLoadingContactTypes: boolean;
  contactTypeSearch: string;
  isContactTypeDropdownOpen: boolean;
  stateOptions: (StateOption | string)[];
  regionOptions: string[];
  dropdownRef: React.RefObject<HTMLDivElement>;
  onVenueNameChange: (value: string) => void;
  onCityChange: (value: string) => void;
  onStateChange: (value: string) => void;
  onRegionChange: (value: string) => void;
  onCountryChange: (value: string) => void;
  onAddressChange: (value: string) => void;
  onPhoneNumberChange: (value: string) => void;
  onWebsiteChange: (value: string) => void;
  onContactTypeSearchChange: (value: string) => void;
  onContactTypeToggle: (type: string) => void;
  onContactTypeRemove: (type: string) => void;
  onContactTypeDropdownOpen: () => void;
}

const BasicInformation: React.FC<BasicInformationProps> = ({
  venueName,
  city,
  state,
  region,
  country,
  address,
  phoneNumber,
  website,
  selectedContactTypes,
  contactTypeOptions,
  isLoadingContactTypes,
  contactTypeSearch,
  isContactTypeDropdownOpen,
  stateOptions,
  regionOptions,
  dropdownRef,
  onVenueNameChange,
  onCityChange,
  onStateChange,
  onRegionChange,
  onCountryChange,
  onAddressChange,
  onPhoneNumberChange,
  onWebsiteChange,
  onContactTypeSearchChange,
  onContactTypeToggle,
  onContactTypeRemove,
  onContactTypeDropdownOpen,
}) => {
  return (
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
            onChange={(e) => onVenueNameChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter contact name"
            required
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contact Type *
          </label>
          <ContactTypeSelector
            selectedTypes={selectedContactTypes}
            availableTypes={contactTypeOptions}
            isLoading={isLoadingContactTypes}
            searchValue={contactTypeSearch}
            isDropdownOpen={isContactTypeDropdownOpen}
            onSearchChange={onContactTypeSearchChange}
            onToggleType={onContactTypeToggle}
            onRemoveType={onContactTypeRemove}
            onFocus={onContactTypeDropdownOpen}
            dropdownRef={dropdownRef}
          />
        </div>
        
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
            City
          </label>
          <input
            id="city"
            type="text"
            value={city}
            onChange={(e) => onCityChange(e.target.value)}
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
            onChange={(e) => onRegionChange(e.target.value)}
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
            onChange={(e) => onCountryChange(e.target.value)}
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
            onChange={(e) => onAddressChange(e.target.value)}
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
            onChange={(e) => onPhoneNumberChange(e.target.value)}
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
            onChange={(e) => onWebsiteChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter website URL"
          />
        </div>
      </div>
    </div>
  );
};

export default BasicInformation;