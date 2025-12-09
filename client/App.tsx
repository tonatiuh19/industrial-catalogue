import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { QuoteProvider } from "@/context/QuoteContext";
import { AdminProvider } from "@/context/AdminContext";
import { StoreProvider } from "@/store/StoreContext";
import { LoadingMask } from "@/components/LoadingMask";
import { useGlobalLoading } from "@/store/StoreContext";
import Home from "./pages/Home";
import Catalogue from "./pages/Catalogue";
import ProductDetail from "./pages/ProductDetail";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminHome from "./pages/admin/AdminHome";
import Products from "./pages/admin/Products";
import Quotes from "./pages/admin/Quotes";
import Users from "./pages/admin/Users";
import ContentPages from "./pages/admin/ContentPages";
import Settings from "./pages/admin/Settings";

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

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />}>
            <Route path="dashboard" element={<AdminHome />} />
            <Route path="products" element={<Products />} />
            <Route path="quotes" element={<Quotes />} />
            <Route path="users" element={<Users />} />
            <Route path="content" element={<ContentPages />} />
            <Route path="settings" element={<Settings />} />
          </Route>

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
        <AdminProvider>
          <QuoteProvider>
            <Toaster />
            <Sonner />
            <App />
          </QuoteProvider>
        </AdminProvider>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<Root />);
