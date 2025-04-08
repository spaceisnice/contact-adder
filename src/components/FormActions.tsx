import React from 'react';
import { Save, Loader2 } from 'lucide-react';

interface FormActionsProps {
  isLoading: boolean;
  connectionChecking: boolean;
  connectionVerified: boolean | null;
  onSubmit: () => void;
  onReset: () => void;
}

const FormActions: React.FC<FormActionsProps> = ({
  isLoading,
  connectionChecking,
  connectionVerified,
  onSubmit,
  onReset,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <button
        type="submit"
        disabled={isLoading || connectionVerified === false}
        onClick={onSubmit}
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
        onClick={onReset}
        className="sm:w-auto flex items-center justify-center px-4 py-3 bg-gray-200 text-gray-800 font-medium rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
      >
        Clear Form
      </button>
    </div>
  );
};

export default FormActions;