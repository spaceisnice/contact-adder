import Airtable from 'airtable';
import { VenueInfo } from '../types/venue';

const personalAccessToken = import.meta.env.VITE_AIRTABLE_PERSONAL_ACCESS_TOKEN;
const baseId = import.meta.env.VITE_AIRTABLE_BASE_ID;
const tableName = import.meta.env.VITE_AIRTABLE_TABLE_NAME;

// Validate configuration before initializing Airtable
if (!personalAccessToken || !baseId || !tableName) {
  throw new Error(`Missing required Airtable configuration:
    ${!personalAccessToken ? '- VITE_AIRTABLE_PERSONAL_ACCESS_TOKEN' : ''}
    ${!baseId ? '- VITE_AIRTABLE_BASE_ID' : ''}
    ${!tableName ? '- VITE_AIRTABLE_TABLE_NAME' : ''}
    Please check your .env file and ensure all required variables are set.`
  );
}

// Configure Airtable with Personal Access Token
const base = new Airtable({ apiKey: personalAccessToken }).base(baseId);

export const addVenueToAirtable = async (venueInfo: VenueInfo): Promise<string> => {
  try {
    // Log configuration for debugging (remove in production)
    console.log('Using Airtable config:', { 
      baseId, 
      tableName,
      // Don't log the full token for security reasons
      tokenPrefix: personalAccessToken ? personalAccessToken.substring(0, 10) + '...' : 'missing'
    });
    
    // Handle state value based on country
    let stateValue = venueInfo.state;
    
    // Only convert to abbreviation if it's a US state
    if (venueInfo.country === 'US' && stateValue && stateValue.length > 2) {
      const stateMap: {[key: string]: string} = {
        'alabama': 'AL',
        'alaska': 'AK',
        'arizona': 'AZ',
        'arkansas': 'AR',
        'california': 'CA',
        'colorado': 'CO',
        'connecticut': 'CT',
        'delaware': 'DE',
        'florida': 'FL',
        'georgia': 'GA',
        'hawaii': 'HI',
        'idaho': 'ID',
        'illinois': 'IL',
        'indiana': 'IN',
        'iowa': 'IA',
        'kansas': 'KS',
        'kentucky': 'KY',
        'louisiana': 'LA',
        'maine': 'ME',
        'maryland': 'MD',
        'massachusetts': 'MA',
        'michigan': 'MI',
        'minnesota': 'MN',
        'mississippi': 'MS',
        'missouri': 'MO',
        'montana': 'MT',
        'nebraska': 'NE',
        'nevada': 'NV',
        'new hampshire': 'NH',
        'new jersey': 'NJ',
        'new mexico': 'NM',
        'new york': 'NY',
        'north carolina': 'NC',
        'north dakota': 'ND',
        'ohio': 'OH',
        'oklahoma': 'OK',
        'oregon': 'OR',
        'pennsylvania': 'PA',
        'rhode island': 'RI',
        'south carolina': 'SC',
        'south dakota': 'SD',
        'tennessee': 'TN',
        'texas': 'TX',
        'utah': 'UT',
        'vermont': 'VT',
        'virginia': 'VA',
        'washington': 'WA',
        'west virginia': 'WV',
        'wisconsin': 'WI',
        'wyoming': 'WY',
        'district of columbia': 'DC',
        'american samoa': 'AS',
        'guam': 'GU',
        'northern mariana islands': 'MP',
        'puerto rico': 'PR',
        'united states minor outlying islands': 'UM',
        'u.s. virgin islands': 'VI'
      };
      
      const normalizedState = stateValue.toLowerCase().trim();
      if (stateMap[normalizedState]) {
        stateValue = stateMap[normalizedState];
        console.log(`Converted US state name "${venueInfo.state}" to abbreviation "${stateValue}"`);
      }
    } else if (!stateValue && venueInfo.country) {
      // If state is not provided but country is, use country for state field
      stateValue = venueInfo.country;
      console.log(`No state provided, using country "${stateValue}" for state field`);
    }
    
    // Create record with proper field mapping
    const record = await base(tableName).create({
      "Name or Company": venueInfo.name,
      "Address": venueInfo.address || '',
      "Phone": venueInfo.phoneNumber || '',
      "Website": venueInfo.website || '',
      "Contact": venueInfo.bookingContact?.name || '',
      "Email": venueInfo.bookingContact?.email || '',
      "City": venueInfo.city,
      "State": stateValue, // Use the processed state value
      "Region": venueInfo.region || '',
      "Notes": venueInfo.notes || '',
      "Contact Type": venueInfo.contactTypes || [] // Support multiple contact types
    }, { typecast: true });
    
    return record.getId();
  } catch (error: any) {
    // Enhanced error handling with more detailed information
    console.error('Error adding venue to Airtable:', error);
    
    // Check for specific error types and provide more helpful messages
    if (error.statusCode === 401 || error.error === 'AUTHENTICATION_REQUIRED') {
      throw new Error('Authentication failed. Please check your Airtable Personal Access Token.');
    } else if (error.statusCode === 403 || error.error === 'NOT_AUTHORIZED') {
      throw new Error('Not authorized to access this Airtable base or table. Please check your permissions.');
    } else if (error.statusCode === 404 || error.error === 'NOT_FOUND') {
      throw new Error(`Table "${tableName}" not found in base "${baseId}". Please verify your base ID and table name.`);
    } else if (error.statusCode === 422 || error.error === 'UNKNOWN_FIELD_NAME') {
      throw new Error(`Unknown field name in Airtable. Please check that your field names match exactly with Airtable: ${error.message}`);
    } else {
      throw new Error(`Failed to save to Airtable: ${error.message || 'Unknown error'}`);
    }
  }
};

// Add a function to verify Airtable connection
export const verifyAirtableConnection = async (): Promise<boolean> => {
  try {
    if (!personalAccessToken || !baseId || !tableName) {
      throw new Error('Missing required Airtable configuration');
    }
    // Try to fetch a single record to verify connection
    await base(tableName).select({ maxRecords: 1 }).firstPage();
    return true;
  } catch (error: any) {
    console.error('Airtable connection verification failed:', error);
    if (error.statusCode === 401) {
      throw new Error('Invalid Airtable Personal Access Token');
    } else if (error.statusCode === 403) {
      throw new Error('Not authorized to access this Airtable base');
    } else if (error.statusCode === 404) {
      throw new Error('Airtable base or table not found');
    }
    return false;
  }
};

// Function to fetch available Contact Types from Airtable
export const fetchContactTypes = async (): Promise<string[]> => {
  try {
    // Verify configuration before attempting to fetch
    if (!personalAccessToken || !baseId || !tableName) {
      throw new Error('Missing required Airtable configuration. Please check your .env file.');
    }

    // Verify connection before proceeding
    const isConnected = await verifyAirtableConnection();
    if (!isConnected) {
      throw new Error('Failed to connect to Airtable. Please check your configuration and network connection.');
    }

    // Get all records to extract unique contact types
    const records = await base(tableName).select({
      fields: ['Contact Type']
    }).all();

    // Extract unique contact types from all records
    const contactTypesSet = new Set<string>();
    records.forEach(record => {
      const types = record.get('Contact Type');
      if (Array.isArray(types)) {
        types.forEach(type => {
          if (typeof type === 'string') {
            contactTypesSet.add(type);
          }
        });
      }
    });

    // Convert Set to sorted array
    return Array.from(contactTypesSet).sort();
  } catch (error: any) {
    // Enhanced error handling with specific error messages
    console.error('Error fetching contact types:', error);
    
    if (error.statusCode === 401) {
      throw new Error('Invalid Airtable Personal Access Token. Please check your configuration.');
    } else if (error.statusCode === 403) {
      throw new Error('Not authorized to access this Airtable base. Please check your permissions.');
    } else if (error.statusCode === 404) {
      throw new Error('Airtable base or table not found. Please verify your Base ID and Table Name.');
    } else if (!personalAccessToken || !baseId || !tableName) {
      throw new Error('Missing required Airtable configuration. Please check your .env file.');
    } else {
      throw new Error(`Failed to fetch contact types: ${error.message || 'Unknown error'}`);
    }
  }
};