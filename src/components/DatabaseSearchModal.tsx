import React from 'react';
import { X } from 'lucide-react';

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

interface DatabaseSearchModalProps {
  results: DatabaseSearchResult[];
  searchTerm: string;
  onClose: () => void;
}

const DatabaseSearchModal: React.FC<DatabaseSearchModalProps> = ({ 
  results, 
  searchTerm, 
  onClose 
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              Database Search Results for "{searchTerm}"
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="overflow-y-auto max-h-[70vh]">
            {results.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 text-lg">No matches found in Airtable</p>
                <p className="text-gray-400 text-sm mt-2">
                  No contacts found with the name "{searchTerm}"
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {results.map((result, index) => (
                  <div key={result.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-lg font-medium text-gray-900">
                        {result.name}
                      </h4>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        Record {index + 1}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="space-y-3">
                        <h5 className="font-medium text-gray-700 text-sm">Location</h5>
                        {result.address && (
                          <div>
                            <dt className="text-xs font-medium text-gray-500">Address</dt>
                            <dd className="text-sm text-gray-900">{result.address}</dd>
                          </div>
                        )}
                        {result.city && (
                          <div>
                            <dt className="text-xs font-medium text-gray-500">City</dt>
                            <dd className="text-sm text-gray-900">{result.city}</dd>
                          </div>
                        )}
                        {result.state && (
                          <div>
                            <dt className="text-xs font-medium text-gray-500">State</dt>
                            <dd className="text-sm text-gray-900">{result.state}</dd>
                          </div>
                        )}
                        {result.region && (
                          <div>
                            <dt className="text-xs font-medium text-gray-500">Region</dt>
                            <dd className="text-sm text-gray-900">{result.region}</dd>
                          </div>
                        )}
                      </div>

                      <div className="space-y-3">
                        <h5 className="font-medium text-gray-700 text-sm">Contact Info</h5>
                        {result.phone && (
                          <div>
                            <dt className="text-xs font-medium text-gray-500">Phone</dt>
                            <dd className="text-sm text-gray-900">{result.phone}</dd>
                          </div>
                        )}
                        {result.email && (
                          <div>
                            <dt className="text-xs font-medium text-gray-500">Email</dt>
                            <dd className="text-sm text-gray-900">{result.email}</dd>
                          </div>
                        )}
                        {result.contact && (
                          <div>
                            <dt className="text-xs font-medium text-gray-500">Contact Person</dt>
                            <dd className="text-sm text-gray-900">{result.contact}</dd>
                          </div>
                        )}
                        {result.website && (
                          <div>
                            <dt className="text-xs font-medium text-gray-500">Website</dt>
                            <dd className="text-sm text-gray-900">
                              <a 
                                href={result.website} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-blue-600 hover:underline break-all"
                              >
                                {result.website.replace(/^https?:\/\//, '')}
                              </a>
                            </dd>
                          </div>
                        )}
                        {result.socialMediaUrl && (
                          <div>
                            <dt className="text-xs font-medium text-gray-500">Social Media</dt>
                            <dd className="text-sm text-gray-900 break-all">{result.socialMediaUrl}</dd>
                          </div>
                        )}
                      </div>

                      <div className="space-y-3">
                        <h5 className="font-medium text-gray-700 text-sm">Additional Info</h5>
                        {result.contactType && result.contactType.length > 0 && (
                          <div>
                            <dt className="text-xs font-medium text-gray-500">Contact Types</dt>
                            <dd className="text-sm text-gray-900">
                              <div className="flex flex-wrap gap-1 mt-1">
                                {result.contactType.map((type, idx) => (
                                  <span 
                                    key={idx}
                                    className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
                                  >
                                    {type}
                                  </span>
                                ))}
                              </div>
                            </dd>
                          </div>
                        )}
                        {result.notes && (
                          <div>
                            <dt className="text-xs font-medium text-gray-500">Notes</dt>
                            <dd className="text-sm text-gray-900 whitespace-pre-wrap">{result.notes}</dd>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatabaseSearchModal;