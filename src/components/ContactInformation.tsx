import React from 'react';

interface ContactInformationProps {
  contactName: string;
  contactEmail: string;
  onContactNameChange: (value: string) => void;
  onContactEmailChange: (value: string) => void;
}

const ContactInformation: React.FC<ContactInformationProps> = ({
  contactName,
  contactEmail,
  onContactNameChange,
  onContactEmailChange,
}) => {
  return (
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
            onChange={(e) => onContactNameChange(e.target.value)}
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
            onChange={(e) => onContactEmailChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Contact email address"
          />
        </div>
      </div>
    </div>
  );
};

export default ContactInformation;