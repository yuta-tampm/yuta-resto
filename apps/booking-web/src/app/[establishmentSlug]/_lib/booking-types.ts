export type Establishment = {
  name: string;
  slug: string;
  timezone: string;
  logoUrl: string | null;
  welcomeMessage: string | null;
  minimumPartySize: number;
  maximumPartySize: number;
  bookingWindowDays: number;
  bookingPolicy: string | null;
  publicPhone: string | null;
  address: string | null;
};

export type Slot = {
  time: string;
  available: boolean;
  remainingCapacity: number;
};
export type Result = {
  reference: string;
  token: string;
  status: string;
  firstName: string;
};
