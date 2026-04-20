export interface EnergyData {
  time: string;
  generated: number;
  consumed: number;
}

export interface Transaction {
  id: string; // Maps to listingId in DynamoDB
  type: "buy" | "sell" | "deposit" | "withdraw";
  amount: number;
  price: number;
  status: "Settled" | "Pending" | "Available";
  date: string;
  sellerId?: string;
  buyerId?: string;
}
