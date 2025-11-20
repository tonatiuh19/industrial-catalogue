import React, { createContext, useContext, useState } from "react";

export interface SelectedProduct {
  id: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
}

interface QuoteContextType {
  selectedProducts: SelectedProduct[];
  addProduct: (product: SelectedProduct) => void;
  removeProduct: (id: string) => void;
  updateProductQuantity: (id: string, quantity: number) => void;
  clearProducts: () => void;
  isWizardOpen: boolean;
  openWizard: () => void;
  closeWizard: () => void;
}

const QuoteContext = createContext<QuoteContextType | undefined>(undefined);

export const QuoteProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>(
    [],
  );
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  const addProduct = (product: SelectedProduct) => {
    setSelectedProducts((prev) => {
      const existing = prev.find((p) => p.id === product.id);
      if (existing) {
        return prev.map((p) =>
          p.id === product.id
            ? { ...p, quantity: p.quantity + product.quantity }
            : p,
        );
      }
      return [...prev, product];
    });
  };

  const removeProduct = (id: string) => {
    setSelectedProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const updateProductQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeProduct(id);
    } else {
      setSelectedProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, quantity } : p)),
      );
    }
  };

  const clearProducts = () => {
    setSelectedProducts([]);
  };

  const openWizard = () => {
    setIsWizardOpen(true);
  };

  const closeWizard = () => {
    setIsWizardOpen(false);
  };

  return (
    <QuoteContext.Provider
      value={{
        selectedProducts,
        addProduct,
        removeProduct,
        updateProductQuantity,
        clearProducts,
        isWizardOpen,
        openWizard,
        closeWizard,
      }}
    >
      {children}
    </QuoteContext.Provider>
  );
};

export const useQuote = () => {
  const context = useContext(QuoteContext);
  if (context === undefined) {
    throw new Error("useQuote must be used within QuoteProvider");
  }
  return context;
};
