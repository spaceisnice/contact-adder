import { Toaster } from 'react-hot-toast';
import { Music } from 'lucide-react';
import VenueForm from './components/VenueSearchForm';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-right" />
      
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center">
            <Music className="h-8 w-8 text-red-600 mr-3" />
            <h1 className="text-2xl font-bold text-gray-900">Contact Adder Thingy</h1>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
          <p className="text-gray-600 mb-6">
            Search for contact information using Google or enter details manually. All information will be saved to your Airtable database with the note "*robot generated*".
          </p>
          
          <VenueForm />
        </div>
      </main>
      
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Contact Adder Thing. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;