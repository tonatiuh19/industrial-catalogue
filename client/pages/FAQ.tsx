import React, { useState, useEffect } from "react";
import {
  Search,
  ChevronDown,
  ChevronRight,
  HelpCircle,
  BookOpen,
} from "lucide-react";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../components/ui/collapsible";
import SEO from "../components/SEO";
import Header from "../components/Header";
import Footer from "../components/Footer";

interface FAQCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  sort_order: number;
  is_active: boolean;
}

interface FAQItem {
  id: number;
  category_id: number;
  question: string;
  answer: string;
  sort_order: number;
  is_active: boolean;
}

const FAQ: React.FC = () => {
  const [categories, setCategories] = useState<FAQCategory[]>([]);
  const [faqItems, setFaqItems] = useState<FAQItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFAQData = async () => {
      try {
        const [categoriesRes, itemsRes] = await Promise.all([
          fetch("/api/faq/categories"),
          fetch("/api/faq/items"),
        ]);

        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json();
          setCategories(categoriesData.categories || []);
        }

        if (itemsRes.ok) {
          const itemsData = await itemsRes.json();
          setFaqItems(itemsData.items || []);
        }
      } catch (error) {
        console.error("Error fetching FAQ data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFAQData();
  }, []);

  const toggleItem = (itemId: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(itemId)) {
      newOpenItems.delete(itemId);
    } else {
      newOpenItems.add(itemId);
    }
    setOpenItems(newOpenItems);
  };

  const filteredItems = faqItems.filter((item) => {
    const matchesSearch =
      !searchTerm ||
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      !selectedCategory || item.category_id === selectedCategory;

    return matchesSearch && matchesCategory && item.is_active;
  });

  const getCategoryById = (categoryId: number) => {
    return categories.find((cat) => cat.id === categoryId);
  };

  const getItemsByCategory = (categoryId: number) => {
    return filteredItems
      .filter((item) => item.category_id === categoryId)
      .sort((a, b) => a.sort_order - b.sort_order);
  };

  const allVisibleCategories = categories
    .filter((cat) => cat.is_active)
    .filter((cat) => !selectedCategory || cat.id === selectedCategory)
    .filter((cat) => getItemsByCategory(cat.id).length > 0)
    .sort((a, b) => a.sort_order - b.sort_order);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse space-y-8">
              <div className="h-8 bg-steel-300 rounded w-1/4"></div>
              <div className="h-4 bg-steel-300 rounded w-2/3"></div>
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-16 bg-steel-300 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Preguntas Frecuentes | Catálogo Industrial"
        description="Encuentra respuestas a preguntas comunes sobre nuestros productos industriales, servicios, proceso de pedidos y soporte técnico."
      />

      <Header />

      {/* Hero Section */}
      <section className="bg-primary text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <HelpCircle className="h-12 w-12 text-accent mx-auto mb-4" />
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Preguntas Frecuentes
            </h1>
            <p className="text-lg text-steel-200 max-w-2xl mx-auto">
              Encuentra respuestas a preguntas comunes sobre nuestros productos
              y servicios
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <div className="bg-steel-50 border-b border-steel-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-steel-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Buscar preguntas y respuestas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Category Filter */}
              <div className="md:w-64">
                <select
                  value={selectedCategory || ""}
                  onChange={(e) =>
                    setSelectedCategory(
                      e.target.value ? parseInt(e.target.value) : null,
                    )
                  }
                  className="w-full p-2 border border-steel-300 rounded-md focus:ring-2 focus:ring-accent focus:border-transparent bg-white"
                >
                  <option value="">Todas las Categorías</option>
                  {categories
                    .filter((cat) => cat.is_active)
                    .sort((a, b) => a.sort_order - b.sort_order)
                    .map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {/* Results count */}
            <div className="mt-4 text-sm text-steel-600">
              {searchTerm || selectedCategory ? (
                <span>
                  Mostrando {filteredItems.length} resultado
                  {filteredItems.length !== 1 ? "s" : ""}
                  {searchTerm && ` para "${searchTerm}"`}
                  {selectedCategory &&
                    ` en ${getCategoryById(selectedCategory)?.name}`}
                </span>
              ) : (
                <span>Explora todas las preguntas por categoría</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          {filteredItems.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <BookOpen className="h-16 w-16 text-steel-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-primary mb-2">
                  {searchTerm || selectedCategory
                    ? "No se encontraron preguntas"
                    : "No hay preguntas disponibles"}
                </h3>
                <p className="text-steel-600 mb-6">
                  {searchTerm || selectedCategory
                    ? "Intenta ajustar tus términos de búsqueda o explora todas las categorías."
                    : "El contenido de preguntas frecuentes estará disponible pronto."}
                </p>
                {(searchTerm || selectedCategory) && (
                  <Button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory(null);
                    }}
                    variant="outline"
                  >
                    Limpiar Filtros
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-8">
              {allVisibleCategories.map((category) => {
                const categoryItems = getItemsByCategory(category.id);

                if (categoryItems.length === 0) return null;

                return (
                  <div key={category.id}>
                    {/* Category Header */}
                    <div className="mb-6">
                      <div className="flex items-center space-x-3 mb-2">
                        <h2 className="text-2xl font-bold text-primary">
                          {category.name}
                        </h2>
                        <Badge variant="secondary">
                          {categoryItems.length} pregunta
                          {categoryItems.length !== 1 ? "s" : ""}
                        </Badge>
                      </div>
                      {category.description && (
                        <p className="text-steel-600">{category.description}</p>
                      )}
                    </div>

                    {/* FAQ Items */}
                    <div className="space-y-3">
                      {categoryItems.map((item) => (
                        <Card key={item.id} className="overflow-hidden">
                          <Collapsible
                            open={openItems.has(item.id)}
                            onOpenChange={() => toggleItem(item.id)}
                          >
                            <CollapsibleTrigger asChild>
                              <Button
                                variant="ghost"
                                className="w-full justify-between p-6 h-auto text-left hover:bg-steel-50"
                              >
                                <span className="font-semibold text-primary pr-4">
                                  {item.question}
                                </span>
                                {openItems.has(item.id) ? (
                                  <ChevronDown className="h-5 w-5 flex-shrink-0 text-accent" />
                                ) : (
                                  <ChevronRight className="h-5 w-5 flex-shrink-0 text-accent" />
                                )}
                              </Button>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              <div className="px-6 pb-6 pt-0 border-t border-steel-200">
                                <div className="text-steel-700 leading-relaxed whitespace-pre-line">
                                  {item.answer}
                                </div>
                              </div>
                            </CollapsibleContent>
                          </Collapsible>
                        </Card>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Contact CTA */}
          <Card className="mt-12 bg-accent/5 border-accent/20">
            <CardContent className="p-8 text-center">
              <h3 className="text-xl font-semibold text-primary mb-2">
                ¿Aún tienes preguntas?
              </h3>
              <p className="text-steel-600 mb-6">
                ¿No encuentras lo que buscas? Nuestro equipo de soporte está
                aquí para ayudarte.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => (window.location.href = "/contact")}
                  className="bg-accent hover:bg-accent/90"
                >
                  Contactar Soporte
                </Button>
                <Button
                  onClick={() => (window.location.href = "/")}
                  variant="outline"
                >
                  Regresar al Inicio
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default FAQ;
