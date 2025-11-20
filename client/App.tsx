import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { QuoteProvider } from "@/context/QuoteContext";
import { StoreProvider } from "@/store/StoreContext";
import { LoadingMask } from "@/components/LoadingMask";
import { useGlobalLoading } from "@/store/StoreContext";
import Home from "./pages/Home";
import Catalogue from "./pages/Catalogue";
import ProductDetail from "./pages/ProductDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const globalLoading = useGlobalLoading();

  return (
    <>
      <LoadingMask
        isLoading={globalLoading.isLoading}
        message={globalLoading.loadingMessage}
      />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalogue />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

const App = () => (
  <StoreProvider>
    <AppContent />
  </StoreProvider>
);

const Root = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <QuoteProvider>
          <Toaster />
          <Sonner />
          <App />
        </QuoteProvider>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<Root />);
