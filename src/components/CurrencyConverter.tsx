
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeftRight, Loader2 } from "lucide-react";
import { convertCurrency, currencies, formatCurrency } from "@/services/currencyService";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const CurrencyConverter = () => {
  const [amount, setAmount] = useState<number>(1);
  const [fromCurrency, setFromCurrency] = useState<string>("USD");
  const [toCurrency, setToCurrency] = useState<string>("EUR");
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Perform conversion when component mounts or when inputs change
  useEffect(() => {
    handleConvert();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleConvert = async () => {
    if (!amount || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      setIsLoading(true);
      const result = await convertCurrency(amount, fromCurrency, toCurrency);
      setConvertedAmount(result);
      setExchangeRate(result / amount);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Conversion error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    // We'll trigger a new conversion in the useEffect
    setConvertedAmount(null);
    setTimeout(handleConvert, 100);
  };

  return (
    <Card className="currency-card w-full max-w-lg mx-auto shadow-lg">
      <CardHeader className="converter-gradient text-white rounded-t-lg">
        <CardTitle className="text-center text-2xl font-bold">Currency Converter</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Amount Input */}
          <div className="space-y-2">
            <label htmlFor="amount" className="block text-sm font-medium">
              Amount
            </label>
            <Input
              id="amount"
              type="number"
              value={amount || ""}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              className="w-full"
              placeholder="Enter amount"
              min="0"
              step="any"
            />
          </div>

          {/* Currency Selection */}
          <div className="grid grid-cols-[1fr,auto,1fr] items-center gap-4">
            <div className="space-y-2">
              <label htmlFor="from-currency" className="block text-sm font-medium">
                From
              </label>
              <Select value={fromCurrency} onValueChange={setFromCurrency}>
                <SelectTrigger id="from-currency" className="w-full">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      {currency.code} - {currency.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="outline"
              size="icon"
              className="mt-6"
              onClick={handleSwapCurrencies}
              aria-label="Swap currencies"
            >
              <ArrowLeftRight className="h-4 w-4" />
            </Button>

            <div className="space-y-2">
              <label htmlFor="to-currency" className="block text-sm font-medium">
                To
              </label>
              <Select value={toCurrency} onValueChange={setToCurrency}>
                <SelectTrigger id="to-currency" className="w-full">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      {currency.code} - {currency.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Convert Button */}
          <Button
            className="w-full bg-gradient-to-r from-converter-primary to-converter-secondary hover:opacity-90 transition-opacity"
            onClick={handleConvert}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Converting...
              </>
            ) : (
              "Convert"
            )}
          </Button>

          {/* Results */}
          {convertedAmount !== null && (
            <div className="mt-6 space-y-4">
              <Separator />
              <div className="rounded-lg bg-muted p-4">
                <div className="text-sm text-muted-foreground mb-2">Conversion Result:</div>
                <div className="text-2xl font-bold">{formatCurrency(convertedAmount, toCurrency)}</div>
                {exchangeRate && (
                  <div className="text-sm text-muted-foreground mt-2">
                    1 {fromCurrency} = {exchangeRate.toFixed(6)} {toCurrency}
                  </div>
                )}
                {lastUpdated && (
                  <div className="text-xs text-muted-foreground mt-2">
                    Last updated: {lastUpdated.toLocaleTimeString()}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrencyConverter;
