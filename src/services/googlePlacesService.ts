import axios from 'axios';
import { VenueInfo } from '../types/venue';

// Google Places API key from environment variables
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const PLACES_API_URL = 'https://places.googleapis.com/v1/places:searchText';

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
    // Validate API key
    if (!API_KEY) {
      throw new Error('Google API key is missing. Please check your .env file and ensure VITE_GOOGLE_API_KEY is set.');
    }

    // Construct the search query
    const locationPart = city ? `${city}, ${state}` : state;
    const query = `${venueName} ${locationPart}${country !== 'US' ? ', ' + country : ''}`;
    
    console.log('Initiating Places API search with query:', query);
    
    // Make POST request to Places API textSearch endpoint with timeout
    const response = await axios.post(PLACES_API_URL, 
      {
        textQuery: query,
        languageCode: "en",
        pageSize: 1
      }, 
      {
        headers: {
          'X-Goog-Api-Key': API_KEY,
          'X-Goog-FieldMask': 'places.id,places.displayName.text,places.formattedAddress,places.websiteUri,places.addressComponents',
          'Content-Type': 'application/json'
        },
        timeout: 10000 // 10 second timeout
      }
    );

    // Validate response
    if (!response.data) {
      console.error('Empty response from Places API');
      throw new Error('No response received from Google Places API');
    }

    console.log('Places API response received:', {
      status: response.status,      
      hasData: !!response.data,
      placesCount: response.data.places?.length || 0
    });

    console.log('Address Component', {address_component: response.data.places[0].addressComponents } )

    if (!response.data.places || response.data.places.length === 0) {
      console.log('No places found in API response');
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
      // add check for UK and United Kingdom because address formatting is different then // stopgap for now
      if ((country != "UK" ) && (country != "United Kingdom") ){
        for (const part of addressParts) {
          if (!part.match(/^\d/)) { // If part doesn't start with a number

              extractedCity = part;
    
            break;
          }
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
    // Enhanced error handling
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        console.error('Google Places API request timed out');
        throw new Error('Request to Google Places API timed out. Please try again.');
      }
      
      if (!error.response) {
        console.error('Network error when calling Google Places API:', error.message);
        throw new Error('Network error: Unable to connect to Google Places API. Please check your internet connection.');
      }

      const status = error.response.status;
      const errorData = error.response.data;

      switch (status) {
        case 400:
          console.error('Invalid request to Places API:', errorData);
          throw new Error('Invalid request to Google Places API. Please check your search parameters.');
        case 401:
        case 403:
          console.error('Authentication error with Places API:', errorData);
          throw new Error('Authentication failed with Google Places API. Please check your API key.');
        case 429:
          console.error('Rate limit exceeded for Places API');
          throw new Error('Too many requests to Google Places API. Please try again later.');
        case 500:
        case 502:
        case 503:
        case 504:
          console.error('Google Places API server error:', errorData);
          throw new Error('Google Places API is currently experiencing issues. Please try again later.');
        default:
          console.error('Unexpected error from Places API:', {
            status,
            data: errorData,
            message: error.message
          });
          throw new Error(`Unexpected error from Google Places API: ${error.message}`);
      }
    }

    // Handle non-Axios errors
    console.error('Unexpected error during Places API search:', error);
    throw new Error('An unexpected error occurred while searching. Please try again.');
  }
};