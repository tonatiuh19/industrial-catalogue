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
import About from "./pages/About";
import Catalogue from "./pages/Catalogue";
import DynamicCatalog from "./pages/DynamicCatalog";
import ProductDetail from "./pages/ProductDetail";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import TermsAndConditions from "./pages/TermsAndConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminHome from "./pages/admin/AdminHome";
import Products from "./pages/admin/Products";
import Quotes from "./pages/admin/Quotes";
import Users from "./pages/admin/Users";
import ContentPages from "./pages/admin/ContentPages";
import Settings from "./pages/admin/Settings";
import SupportTickets from "./pages/admin/SupportTickets";
import FAQManagement from "./pages/admin/FAQManagement";
import ScrollToTop from "@/components/ScrollToTop";

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
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/catalog" element={<DynamicCatalog />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />}>
            <Route path="dashboard" element={<AdminHome />} />
            <Route path="products" element={<Products />} />
            <Route path="quotes" element={<Quotes />} />
            <Route path="support-tickets" element={<SupportTickets />} />
            <Route path="faq-management" element={<FAQManagement />} />
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
