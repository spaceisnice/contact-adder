import { VenueInfo } from '../types/venue';

export const createVenueInfo = (
  name: string, 
  city: string,
  state: string,
  region: string,
  country: string,
  address?: string,
  phoneNumber?: string,
  website?: string,
  contactName?: string,
  contactEmail?: string,
  contactPhone?: string,
  contactTypes?: string[],
  notes?: string
): VenueInfo => {
  return {
    name,
    address,
    phoneNumber,
    website,
    bookingContact: {
      name: contactName,
      email: contactEmail,
      phone: contactPhone
    },
    city,
    state,
    region,
    country,
    contactTypes,
    notes
  };
};