import axios from 'axios';
import { VenueInfo } from '../types/venue';

// Google Places API key from environment variables
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

interface PlacesTextSearchResponse {
  places: Place[];
  status: string;
}

interface Place {
  id: string;
  displayName: {
    text: string;
  };
  formattedAddress: string;
  websiteUri?: string;
}

/**
 * Search for a venue using Google Places API
 */
export const searchVenueWithPlaces = async (
  venueName: string, 
  city: string, 
  state: string, 
  country: string
): Promise<VenueInfo | null> => {
  try {
    if (!API_KEY) {
      throw new Error('Google API key is missing. Please check your .env file.');
    }

    // Construct the search query
    const locationPart = city ? `${city}, ${state}` : state;
    const query = `${venueName} ${locationPart}${country !== 'US' ? ', ' + country : ''}`;
    
    console.log('Places API search query:', query);
    
    // Make POST request to Places API textSearch endpoint
    const response = await axios.post('/api/places/v1/places:searchText', 
      {
        textQuery: query,
        languageCode: "en",
        pageSize: 1
      }, 
      {
        headers: {
          'X-Goog-Api-Key': API_KEY,
          'X-Goog-FieldMask': 'places.id,places.displayName.text,places.formattedAddress,places.websiteUri',
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Places API response:', JSON.stringify(response.data, null, 2));

    if (!response.data || !response.data.places || response.data.places.length === 0) {
      console.log('No places found with Google Places API');
      return null;
    }

    // Get the first place result
    const place = response.data.places[0];

    // Extract city, state, and country from formatted address
    const addressParts = place.formattedAddress.split(',').map(part => part.trim());
    let extractedCity = city;
    let extractedState = state;
    let extractedCountry = country;

    // Try to extract location information from the address
    if (addressParts.length >= 2) {
      // Last part is usually the country
      extractedCountry = addressParts[addressParts.length - 1] || country;
      
      // Second to last part usually contains state/region
      const stateRegionPart = addressParts[addressParts.length - 2];
      if (stateRegionPart) {
        const stateParts = stateRegionPart.split(' ');
        if (stateParts.length > 0) {
          extractedState = stateParts[0];
        }
      }
      
      // City is usually the first part that's not a street address
      for (const part of addressParts) {
        if (!part.match(/^\d/)) { // If part doesn't start with a number
          extractedCity = part;
          break;
        }
      }
    }

    // Parse the place details into venue info and return it
    return {
      name: venueName || place.displayName.text,
      address: place.formattedAddress || '',
      website: place.websiteUri || '',
      city: extractedCity || city,
      state: extractedState || state,
      region: '',
      country: extractedCountry || country,
      bookingContact: {
        name: '',
        email: '',
        phone: ''
      }
    };
  } catch (error) {
    console.log('Error searching venue with Google Places API:', 
      error instanceof Error ? error.message : 'Unknown error');
    return null;
  }
};