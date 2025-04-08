export interface VenueInfo {
  name: string;
  address?: string;
  phoneNumber?: string;
  website?: string;
  bookingContact?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  city: string;
  state: string;
  region: string;
  country: string;
  contactTypes?: string[];
  notes?: string;
}