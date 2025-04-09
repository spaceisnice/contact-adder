# Contact Manager

A web application for searching and storing contact information using Google Places API, Google Custom Search, and Airtable.

## Features

- Search for contact information using Google Places API (with fallback to Google Custom Search)
- Automatically extract contact details including address, phone number, website, and social media
- Preview data before saving to Airtable
- Required fields for Region and Contact Type
- Support for both US and international contacts
- Save contact information to Airtable
- Responsive UI built with React and Tailwind CSS

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Google API Key with Places API and Custom Search API enabled
- Airtable account with a base set up

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
VITE_AIRTABLE_PERSONAL_ACCESS_TOKEN=your_airtable_personal_access_token
VITE_AIRTABLE_BASE_ID=your_airtable_base_id
VITE_AIRTABLE_TABLE_NAME=your_airtable_table_name
VITE_GOOGLE_API_KEY=your_google_api_key
VITE_GOOGLE_SEARCH_ENGINE_ID=your_google_search_engine_id
```

### Google API Key Setup

1. **Create a Google Cloud Project**:
   - Go to the [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Navigate to "APIs & Services" > "Dashboard"

2. **Enable the Places API**:
   - Click on "+ ENABLE APIS AND SERVICES"
   - Search for "Places API" and select it
   - Click "Enable"

3. **Enable the Custom Search API** (as fallback):
   - Click on "+ ENABLE APIS AND SERVICES"
   - Search for "Custom Search API" and select it
   - Click "Enable"

4. **Create API Key**:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create credentials" > "API key"
   - Copy the generated API key
   - (Optional but recommended) Restrict the API key to only the Places API and Custom Search API

5. **Set up Custom Search Engine**:
   - Go to the [Google Programmable Search Engine](https://programmablesearchengine.google.com/cse/all)
   - Click "Add" to create a new search engine
   - Enter a name for your search engine
   - Under "Sites to search", select "Search the entire web"
   - Click "Create"
   - Copy the "Search engine ID" (cx parameter)
   - Add this ID to your `.env` file as `VITE_GOOGLE_SEARCH_ENGINE_ID`

### Airtable Setup

1. **Create an Airtable Base**:
   - Go to [Airtable](https://airtable.com/) and create a new base
   - Create a table with the following fields:
     - Name or Company (Single line text)
     - Address (Single line text)
     - Phone (Single line text)
     - Website (URL)
     - Contact (Single line text)
     - Email (Email)
     - City (Single line text)
     - State (Single line text)
     - Region (Single line text)
     - Contact Type (Multiple select)
     - Notes (Long text)

2. **Get Airtable API Key**:
   - Go to your [Airtable account](https://airtable.com/account)
   - Under "API", create a Personal Access Token
   - Copy the token to your `.env` file as `VITE_AIRTABLE_PERSONAL_ACCESS_TOKEN`

3. **Get Base ID**:
   - Open your Airtable base
   - Look at the URL: `https://airtable.com/[BASE_ID]/[TABLE_NAME]/[VIEW_NAME]`
   - Copy the `[BASE_ID]` part to your `.env` file as `VITE_AIRTABLE_BASE_ID`
   - Set `VITE_AIRTABLE_TABLE_NAME` to the name of your table

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

1. Enter a contact name in the search form (city and state are optional but recommended for better results)
2. Click "Search for Contact Information"
3. Review and edit the information as needed
4. Select a Region (required)
5. Select at least one Contact Type (required)
6. Click "Preview & Save" to review the information
7. Confirm the information in the preview modal to save to Airtable

## Required Fields

The following fields are required before saving:
- Contact Name
- Region
- Contact Type (at least one)

## International Contacts

The application supports both US and international contacts:
- For US contacts, states are shown with their abbreviations
- For European contacts, full country names are used
- For other international contacts, country information is used in place of state

## Troubleshooting

### API Key Issues

- Ensure your Google API key has the Places API set up
- Check that your API key doesn't have any restrictions that would prevent it from being used in your development environment
- Verify that your Airtable Personal Access Token has the correct permissions


### CORS Issues

- The application uses a proxy in the Vite configuration to avoid CORS issues with the Google Places API
- If you're still experiencing CORS issues, check that the proxy is correctly configured in `vite.config.ts`

### Airtable Connection Issues

- Verify that your Airtable base ID and table name are correct
- Ensure your Airtable table has all the required fields
- Check that your Personal Access Token has access to the specified base
- Verify that the Contact Type field is set up as a Multiple Select field type

### Deployment

- Using Netlity https://app.netlify.com/teams/spaceisnice/sites through Github 
- Continuous deployment when changes pushed to main https://docs.netlify.com/site-deploys/create-deploys/#deploy-with-git
- todo get all apps up on this platform

## License

MIT