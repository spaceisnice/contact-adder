export interface StateOption {
  name: string;
  abbr: string;
}

export interface FormData {
  venueName: string;
  city: string;
  state: string;
  region: string;
  country: string;
  address: string;
  phoneNumber: string;
  website: string;
  contactName: string;
  contactEmail: string;
  selectedContactTypes: string[];
  notes: string[];
}