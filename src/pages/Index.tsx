
import CurrencyConverter from "@/components/CurrencyConverter";
import { Toaster } from "@/components/ui/sonner";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-blue-50">
      <header className="py-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-converter-primary to-converter-secondary text-transparent bg-clip-text">
          Currency Converter
        </h1>
        <p className="mt-2 text-muted-foreground max-w-md mx-auto px-4">
          Convert between currencies with real-time exchange rates
        </p>
      </header>
      
      <main className="flex-grow container max-w-4xl mx-auto px-4 py-8">
        <CurrencyConverter />
      </main>
      
      <footer className="py-6 text-center text-sm text-muted-foreground">
        <p>Powered by ExchangeRate API • {new Date().getFullYear()}</p>
      </footer>
      
      <Toaster />
    </div>
  );
};

export default Index;
