import React from 'react';

interface NotesSectionProps {
  notes: string[];
  onChange: (value: string[]) => void;
}

const NotesSection: React.FC<NotesSectionProps> = ({ notes, onChange }) => {
  return (
    <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
      <h3 className="text-lg font-medium text-gray-800 mb-4">Notes</h3>
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
          Notes
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter any additional notes"
          rows={3}
        />
      </div>
    </div>
  );
};

export default NotesSection;