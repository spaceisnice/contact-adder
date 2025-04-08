import React from 'react';
import { X, Loader2 } from 'lucide-react';

interface ContactTypeSelectorProps {
  selectedTypes: string[];
  availableTypes: string[];
  isLoading: boolean;
  searchValue: string;
  isDropdownOpen: boolean;
  onSearchChange: (value: string) => void;
  onToggleType: (type: string) => void;
  onRemoveType: (type: string) => void;
  onFocus: () => void;
  dropdownRef: React.RefObject<HTMLDivElement>;
}

const ContactTypeSelector: React.FC<ContactTypeSelectorProps> = ({
  selectedTypes,
  availableTypes,
  isLoading,
  searchValue,
  isDropdownOpen,
  onSearchChange,
  onToggleType,
  onRemoveType,
  onFocus,
  dropdownRef,
}) => {
  const filteredTypes = availableTypes.filter(type =>
    type.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="min-h-[42px] p-2 border border-gray-300 rounded-md bg-white">
        <div className="flex flex-wrap gap-2">
          {selectedTypes.map((type) => (
            <span
              key={type}
              className="inline-flex items-center px-2.5 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
            >
              {type}
              <button
                type="button"
                onClick={() => onRemoveType(type)}
                className="ml-1 p-0.5 hover:bg-blue-200 rounded-full"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={onFocus}
            className="flex-1 min-w-[120px] bg-transparent border-none focus:outline-none text-sm"
            placeholder="Search types..."
          />
        </div>
      </div>
      
      {isDropdownOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg">
          <div className="py-1 max-h-60 overflow-auto">
            {isLoading ? (
              <div className="px-4 py-2 text-sm text-gray-500 flex items-center">
                <Loader2 className="animate-spin h-4 w-4 mr-2" />
                Loading contact types...
              </div>
            ) : filteredTypes.length === 0 ? (
              <div className="px-4 py-2 text-sm text-gray-500">
                {searchValue ? 'No matching types found' : 'No contact types available'}
              </div>
            ) : (
              filteredTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    onToggleType(type);
                    onSearchChange('');
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                    selectedTypes.includes(type)
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
  );
};

export default ContactTypeSelector;