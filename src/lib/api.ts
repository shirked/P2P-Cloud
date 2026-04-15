"use client";

// AWS Lambda REST API & Mock integrations

export interface EnergyData {
  time: string;
  generated: number;
  consumed: number;
}

export interface Transaction {
  id: string;
  type: "buy" | "sell" | "deposit" | "withdraw";
  amount: number;
  price: number;
  status: "Settled" | "Pending" | "Available";
  date: string;
  sellerId?: string;
  buyerId?: string;
}

const LAMBDA_URL = process.env.NEXT_PUBLIC_LAMBDA_URL;

// --- Mock Data ---

const MOCK_ENERGY: EnergyData[] = [
  { time: "08:00", generated: 2.4, consumed: 1.2 },
  { time: "09:00", generated: 3.1, consumed: 1.5 },
  { time: "10:00", generated: 4.5, consumed: 2.1 },
  { time: "11:00", generated: 5.2, consumed: 2.4 },
  { time: "12:00", generated: 6.0, consumed: 2.8 },
  { time: "13:00", generated: 5.8, consumed: 3.1 },
  { time: "14:00", generated: 4.9, consumed: 2.9 },
];

const MOCK_LEDGER: Transaction[] = [
  { id: "tx-100", type: "buy", amount: 1.5, price: 0.12, status: "Settled", date: "2026-04-14T10:30:00Z", sellerId: "user-44" },
  { id: "tx-101", type: "sell", amount: 2.0, price: 0.11, status: "Pending", date: "2026-04-15T09:12:00Z", buyerId: "user-92" },
  { id: "tx-102", type: "deposit", amount: 50.0, price: 1.0, status: "Settled", date: "2026-04-10T14:20:00Z" },
];

const MOCK_UNITS: Transaction[] = [
  { id: "mk-1", type: "sell", amount: 1.0, price: 0.10, status: "Available", date: "2026-04-15T10:00:00Z", sellerId: "user-12" },
  { id: "mk-2", type: "sell", amount: 1.0, price: 0.11, status: "Available", date: "2026-04-15T09:45:00Z", sellerId: "user-78" },
  { id: "mk-3", type: "sell", amount: 5.0, price: 0.09, status: "Available", date: "2026-04-15T11:20:00Z", sellerId: "user-88" },
  { id: "mk-4", type: "sell", amount: 2.5, price: 0.12, status: "Available", date: "2026-04-15T12:00:00Z", sellerId: "user-33" },
];

// --- Hybrid Fetchers ---

export const fetchEnergyTelemetry = async (): Promise<EnergyData[]> => {
  if (LAMBDA_URL) {
    const res = await fetch(`${LAMBDA_URL}/telemetry`);
    if (!res.ok) throw new Error("Failed to fetch telemetry");
    return res.json();
  }
  // Fallback to Mock
  await new Promise((resolve) => setTimeout(resolve, 600));
  return MOCK_ENERGY;
};

export const fetchTransactions = async (): Promise<Transaction[]> => {
  if (LAMBDA_URL) {
    const res = await fetch(`${LAMBDA_URL}/transactions`);
    if (!res.ok) throw new Error("Failed to fetch transactions");
    return res.json();
  }
  // Fallback to Mock
  await new Promise((resolve) => setTimeout(resolve, 800));
  return MOCK_LEDGER;
};

export const fetchAvailableUnits = async (): Promise<Transaction[]> => {
  if (LAMBDA_URL) {
    const res = await fetch(`${LAMBDA_URL}/marketplace`);
    if (!res.ok) throw new Error("Failed to fetch marketplace units");
    return res.json();
  }
  // Fallback to Mock
  await new Promise((resolve) => setTimeout(resolve, 600));
  return MOCK_UNITS;
};
