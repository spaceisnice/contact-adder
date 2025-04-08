import React from 'react';
import { AlertTriangle } from 'lucide-react';

const ConnectionWarning: React.FC = () => {
  return (
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
  );
};

export default ConnectionWarning;