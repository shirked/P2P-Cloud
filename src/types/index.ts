export interface TelemetryValue {
  value: number;
  unit: string;
}

export interface EnergyData {
  generated: TelemetryValue;
  consumed: TelemetryValue;
  totalStorage: TelemetryValue;
  time?: string;
  impact?: {
    co2Saved: string;
    treesEquivalent: number;
    gridIndependence: number;
  };
}

export interface Transaction {
  id: string; // Dynamic ID (listingId or custom)
  type: "buy" | "sell" | "deposit" | "withdraw";
  amount: number;
  price: number;
  status: "Settled" | "Pending" | "Available" | "Completed";
  date: string;
  timestamp?: number | string;
  activity?: string;
  sellerId?: string;
  buyerId?: string;
}
