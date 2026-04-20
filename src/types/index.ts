export interface TelemetryValue {
  value: number;
  unit: string;
}

export interface EnergyData {
  generated: TelemetryValue;
  consumed: TelemetryValue;
  time?: string;
}

export interface Transaction {
  id: string; // Dynamic ID (listingId or custom)
  type: "buy" | "sell" | "deposit" | "withdraw";
  amount: number;
  price: number;
  status: "Settled" | "Pending" | "Available" | "Completed";
  date: string;
  timestamp?: number | string;
  sellerId?: string;
  buyerId?: string;
}
