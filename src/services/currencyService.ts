
import { toast } from "sonner";

// API endpoint for exchange rates
const API_URL = "https://v6.exchangerate-api.com/v6/43c9a4e03d787e9fdbde01d4/latest/USD";

// Define currency types
export type Currency = {
  code: string;
  name: string;
};

// Cache exchange rates to reduce API calls
const rateCache: { [key: string]: { rates: Record<string, number>; timestamp: number } } = {};
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

// List of available currencies
export const currencies: Currency[] = [
  { code: "USD", name: "US Dollar" },
  { code: "EUR", name: "Euro" },
  { code: "GBP", name: "British Pound" },
  { code: "JPY", name: "Japanese Yen" },
  { code: "AUD", name: "Australian Dollar" },
  { code: "CAD", name: "Canadian Dollar" },
  { code: "CHF", name: "Swiss Franc" },
  { code: "CNY", name: "Chinese Yuan" },
  { code: "INR", name: "Indian Rupee" },
  { code: "BRL", name: "Brazilian Real" },
  { code: "ZAR", name: "South African Rand" },
  { code: "RUB", name: "Russian Ruble" },
  { code: "MXN", name: "Mexican Peso" },
  { code: "SGD", name: "Singapore Dollar" },
  { code: "NZD", name: "New Zealand Dollar" },
];

/**
 * Get exchange rates for a base currency
 */
export const getExchangeRates = async (baseCurrency: string): Promise<Record<string, number>> => {
  try {
    // Check if we have cached rates that are still valid
    const cachedData = rateCache[baseCurrency];
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
      return cachedData.rates;
    }

    // Fetch new rates from API
    const response = await fetch(`${API_URL}${baseCurrency}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch exchange rates (HTTP ${response.status})`);
    }
    
    const data = await response.json();
    
    // Cache the new rates
    rateCache[baseCurrency] = {
      rates: data.rates,
      timestamp: Date.now()
    };
    
    return data.rates;
  } catch (error) {
    console.error("Error fetching exchange rates:", error);
    toast.error("Failed to fetch exchange rates. Please try again later.");
    throw error;
  }
};

/**
 * Convert an amount from one currency to another
 */
export const convertCurrency = async (
  amount: number,
  fromCurrency: string,
  toCurrency: string
): Promise<number> => {
  try {
    const rates = await getExchangeRates(fromCurrency);
    const rate = rates[toCurrency];
    
    if (!rate) {
      throw new Error(`Exchange rate not found for ${toCurrency}`);
    }
    
    return amount * rate;
  } catch (error) {
    console.error("Error converting currency:", error);
    toast.error("Currency conversion failed. Please try again later.");
    throw error;
  }
};

/**
 * Format a number as a currency string
 */
export const formatCurrency = (amount: number, currencyCode: string): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};
