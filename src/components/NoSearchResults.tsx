import React from 'react';
import { Info } from 'lucide-react';

interface NoSearchResultsProps {
  searchTerm: string;
}

const NoSearchResults: React.FC<NoSearchResultsProps> = ({ searchTerm }) => {
  return (
    <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
      <div className="flex items-start">
        <Info className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
        <div>
          <h3 className="text-sm font-medium text-gray-700">No Results Found</h3>
          <p className="text-sm text-gray-600 mt-1">
            We couldn't find information for "{searchTerm}". You can:
          </p>
          <ul className="list-disc pl-5 mt-1 text-xs text-gray-600 space-y-1">
            <li>Try a different spelling or contact name</li>
            <li>Add more location details (city, state)</li>
            <li>Enter the contact information manually below</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NoSearchResults;