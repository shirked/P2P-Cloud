import { EnergyData, Transaction } from "@/types";

const LAMBDA_URL = process.env.NEXT_PUBLIC_LAMBDA_URL?.replace(/\/$/, "");

// --- Mock Data ---

// --- Mock Data ---

const MOCK_ENERGY: EnergyData = {
  generated: { value: 6.0, unit: "kWh" },
  consumed: { value: 2.8, unit: "kWh" },
  time: "12:00"
};

const MOCK_LEDGER: Transaction[] = [
  { id: "tx-100", type: "buy", amount: 1.5, price: 0.12, status: "Settled", date: "2026-04-14T10:30:00Z", sellerId: "user-44" },
  { id: "tx-101", type: "sell", amount: 2.0, price: 0.11, status: "Pending", date: "2026-04-15T09:12:00Z", buyerId: "user-92" },
  { id: "tx-102", type: "deposit", amount: 50.0, price: 1.0, status: "Settled", date: "2026-04-10T14:20:00Z" },
];

// --- Mock Data (Legacy fallbacks for internal features) ---

// --- Hybrid Fetchers ---

export const fetchEnergyTelemetry = async (): Promise<EnergyData | null> => {
  if (LAMBDA_URL) {
    try {
      const res = await fetch(`${LAMBDA_URL}/telemetry`);
      if (!res.ok) throw new Error("Failed to fetch telemetry");
      const data = await res.json();
      
      console.log("[API] Telemetry Data Received:", data);

      // Map structure { generated: { value, unit }, ... }
      return {
        generated: { value: Number(data.generated?.value || 0), unit: data.generated?.unit || "kWh" },
        consumed: { value: Number(data.consumed?.value || 0), unit: data.consumed?.unit || "kWh" },
        time: data.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
    } catch (err) {
      console.error("[API] Telemetry fetch error:", err);
      return null;
    }
  }
  // Fallback to Mock
  await new Promise((resolve) => setTimeout(resolve, 600));
  return MOCK_ENERGY;
};

export const fetchUserLedger = async (token: string): Promise<Transaction[]> => {
  if (!LAMBDA_URL) {
    console.error("[API] NEXT_PUBLIC_LAMBDA_URL is missing. Returning mock ledger.");
    await new Promise((resolve) => setTimeout(resolve, 800));
    return MOCK_LEDGER;
  }

  try {
    const res = await fetch(`${LAMBDA_URL}/ledger`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (!res.ok) throw new Error(`Ledger fetch failed with status ${res.status}`);

    const data = await res.json();

    // Data Sanitization & Mapping: energyKWh -> amount, timestamp -> professional date
    return data.map((item: any) => ({
      ...item,
      id: item.transactionId || item.id,
      amount: Number(item.energyKWh || item.amount || 0),
      price: Number(item.price || 0),
      type: item.type?.toLowerCase() || "buy",
      status: item.status || "Settled",
      date: item.timestamp 
        ? new Date(item.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) 
        : (item.date || new Date().toISOString())
    }));
  } catch (error) {
    console.error("[API] Error fetching ledger:", error);
    return [];
  }
};

export const fetchTransactions = async (token?: string): Promise<Transaction[]> => {
  if (token) return fetchUserLedger(token);
  
  if (LAMBDA_URL) {
    const res = await fetch(`${LAMBDA_URL}/transactions`);
    if (!res.ok) throw new Error("Failed to fetch transactions");
    return res.json();
  }
  // Fallback to Mock
  await new Promise((resolve) => setTimeout(resolve, 800));
  return MOCK_LEDGER;
};

export const fetchAvailableUnits = async (token: string): Promise<Transaction[]> => {
  if (!LAMBDA_URL) {
    console.error("[API] NEXT_PUBLIC_LAMBDA_URL is missing. Marketplace will be empty.");
    return [];
  }

  try {
    const res = await fetch(`${LAMBDA_URL}/marketplace`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (!res.ok) throw new Error(`Fetch failed with status ${res.status}`);

    const data = await res.json();
    
    // Data Sanitization: Map id and ensure numeric consistency
    return data.map((item: any) => ({
      ...item,
      id: item.id || item.listingId, // Prioritize 'id' as per Cloud Architect instructions
      amount: Number(item.amount),
      price: Number(item.price)
    }));
  } catch (error) {
    console.error("[API] Error fetching marketplace units:", error);
    return [];
  }
};
export const listEnergyUnit = async (amount: number, price: number, token: string): Promise<boolean> => {
  if (!LAMBDA_URL) {
    console.error("[API] NEXT_PUBLIC_LAMBDA_URL is missing. Listing failed.");
    return false;
  }

  try {
    const res = await fetch(`${LAMBDA_URL}/sell`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ amount, price })
    });

    if (!res.ok) throw new Error(`Listing failed with status ${res.status}`);
    
    return res.status === 201 || res.status === 200;
  } catch (error) {
    console.error("[API] Error creating listing:", error);
    return false;
  }
};

export const purchaseEnergyUnit = async (listingId: string, timestamp: string | number, token: string): Promise<string | null> => {
  if (!LAMBDA_URL) {
    console.error("[API] NEXT_PUBLIC_LAMBDA_URL is missing. Purchase failed.");
    return null;
  }

  try {
    const res = await fetch(`${LAMBDA_URL}/buy`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ listingId, timestamp })
    });

    if (!res.ok) throw new Error(`Purchase failed with status ${res.status}`);
    
    const data = await res.json();
    return data.transactionId || "TX-SUCCESS";
  } catch (error) {
    console.error("[API] Error purchasing energy:", error);
    return null;
  }
};
