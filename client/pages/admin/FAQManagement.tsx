import React, { useState, useEffect } from "react";
import {
  HelpCircle,
  Plus,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  Save,
  X,
  ChevronUp,
  ChevronDown,
  BookOpen,
  Folder,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Alert, AlertDescription } from "../../components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { LoadingMask } from "../../components/LoadingMask";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";

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
  category_name?: string;
}

const FAQManagement: React.FC = () => {
  const [categories, setCategories] = useState<FAQCategory[]>([]);
  const [faqItems, setFaqItems] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Category form state
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<FAQCategory | null>(
    null,
  );
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    slug: "",
    description: "",
    sort_order: 0,
    is_active: true,
  });

  // FAQ item form state
  const [showItemForm, setShowItemForm] = useState(false);
  const [editingItem, setEditingItem] = useState<FAQItem | null>(null);
  const [itemForm, setItemForm] = useState({
    category_id: 0,
    question: "",
    answer: "",
    sort_order: 0,
    is_active: true,
  });

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/faq/categories?include_inactive=1");
      if (!response.ok) throw new Error("Failed to fetch categories");
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (err) {
      setError("Error loading FAQ categories");
      console.error("Error fetching categories:", err);
    }
  };

  const fetchItems = async () => {
    try {
      const response = await fetch("/api/faq/items?include_inactive=1");
      if (!response.ok) throw new Error("Failed to fetch items");
      const data = await response.json();
      setFaqItems(data.items || []);
    } catch (err) {
      setError("Error loading FAQ items");
      console.error("Error fetching items:", err);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchCategories(), fetchItems()]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Category management functions
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const url = editingCategory
        ? `/api/admin/faq/categories/${editingCategory.id}`
        : "/api/admin/faq/categories";
      const method = editingCategory ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoryForm),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save category");
      }

      await fetchCategories();
      setShowCategoryForm(false);
      setEditingCategory(null);
      setCategoryForm({
        name: "",
        slug: "",
        description: "",
        sort_order: 0,
        is_active: true,
      });
    } catch (err: any) {
      setError(err.message || "Error saving category");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (
      !confirm(
        "Are you sure you want to delete this category? All FAQ items in this category will also be affected.",
      )
    ) {
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`/api/admin/faq/categories/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete category");
      }

      await fetchData();
    } catch (err: any) {
      setError(err.message || "Error deleting category");
    } finally {
      setSaving(false);
    }
  };

  const startEditCategory = (category: FAQCategory) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
      sort_order: category.sort_order,
      is_active: category.is_active,
    });
    setShowCategoryForm(true);
  };

  // FAQ item management functions
  const handleItemSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const url = editingItem
        ? `/api/admin/faq/items/${editingItem.id}`
        : "/api/admin/faq/items";
      const method = editingItem ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...itemForm,
          created_by: 1, // This should come from auth context
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save FAQ item");
      }

      await fetchItems();
      setShowItemForm(false);
      setEditingItem(null);
      setItemForm({
        category_id: 0,
        question: "",
        answer: "",
        sort_order: 0,
        is_active: true,
      });
    } catch (err: any) {
      setError(err.message || "Error saving FAQ item");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteItem = async (id: number) => {
    if (!confirm("Are you sure you want to delete this FAQ item?")) {
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`/api/admin/faq/items/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete item");
      }

      await fetchItems();
    } catch (err: any) {
      setError(err.message || "Error deleting item");
    } finally {
      setSaving(false);
    }
  };

  const startEditItem = (item: FAQItem) => {
    setEditingItem(item);
    setItemForm({
      category_id: item.category_id,
      question: item.question,
      answer: item.answer,
      sort_order: item.sort_order,
      is_active: item.is_active,
    });
    setShowItemForm(true);
  };

  const moveItem = async (itemId: number, direction: "up" | "down") => {
    setSaving(true);
    try {
      const currentItem = faqItems.find((item) => item.id === itemId);
      if (!currentItem) return;

      const categoryItems = faqItems
        .filter((item) => item.category_id === currentItem.category_id)
        .sort((a, b) => a.sort_order - b.sort_order);

      const currentIndex = categoryItems.findIndex(
        (item) => item.id === itemId,
      );
      if (currentIndex === -1) return;

      let targetIndex;
      if (direction === "up" && currentIndex > 0) {
        targetIndex = currentIndex - 1;
      } else if (
        direction === "down" &&
        currentIndex < categoryItems.length - 1
      ) {
        targetIndex = currentIndex + 1;
      } else {
        return;
      }

      const targetItem = categoryItems[targetIndex];

      // Swap sort orders
      await Promise.all([
        fetch(`/api/admin/faq/items/${currentItem.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sort_order: targetItem.sort_order }),
        }),
        fetch(`/api/admin/faq/items/${targetItem.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sort_order: currentItem.sort_order }),
        }),
      ]);

      await fetchItems();
    } catch (err) {
      setError("Error reordering items");
      console.error("Error moving item:", err);
    } finally {
      setSaving(false);
    }
  };

  const getItemsByCategory = (categoryId: number) => {
    return faqItems
      .filter((item) => item.category_id === categoryId)
      .sort((a, b) => a.sort_order - b.sort_order);
  };

  if (loading) {
    return (
      <div className="p-6">
        <LoadingMask isLoading={true} />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <HelpCircle className="h-8 w-8 mr-3 text-blue-600" />
            Gestión de FAQ
          </h1>
          <p className="text-gray-600 mt-1">
            Gestionar categorías y elementos de FAQ para el centro de ayuda
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={() => window.open("/faq", "_blank")}
            variant="outline"
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview FAQ
          </Button>
        </div>
      </div>

      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="items" className="w-full">
        <TabsList>
          <TabsTrigger value="items" className="flex items-center space-x-2">
            <BookOpen className="h-4 w-4" />
            <span>FAQ Items</span>
          </TabsTrigger>
          <TabsTrigger
            value="categories"
            className="flex items-center space-x-2"
          >
            <Folder className="h-4 w-4" />
            <span>Categories</span>
          </TabsTrigger>
        </TabsList>

        {/* FAQ Items Tab */}
        <TabsContent value="items" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">FAQ Items</h2>
            <Dialog open={showItemForm} onOpenChange={setShowItemForm}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    setEditingItem(null);
                    setItemForm({
                      category_id: 0,
                      question: "",
                      answer: "",
                      sort_order: 0,
                      is_active: true,
                    });
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add FAQ Item
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingItem ? "Edit FAQ Item" : "Add New FAQ Item"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleItemSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <Select
                      value={itemForm.category_id.toString()}
                      onValueChange={(value) =>
                        setItemForm({
                          ...itemForm,
                          category_id: parseInt(value),
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories
                          .filter((cat) => cat.is_active)
                          .map((category) => (
                            <SelectItem
                              key={category.id}
                              value={category.id.toString()}
                            >
                              {category.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Question *
                    </label>
                    <Input
                      value={itemForm.question}
                      onChange={(e) =>
                        setItemForm({ ...itemForm, question: e.target.value })
                      }
                      placeholder="Enter the question"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Answer *
                    </label>
                    <Textarea
                      value={itemForm.answer}
                      onChange={(e) =>
                        setItemForm({ ...itemForm, answer: e.target.value })
                      }
                      placeholder="Enter the answer"
                      rows={6}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sort Order
                      </label>
                      <Input
                        type="number"
                        value={itemForm.sort_order}
                        onChange={(e) =>
                          setItemForm({
                            ...itemForm,
                            sort_order: parseInt(e.target.value) || 0,
                          })
                        }
                        min="0"
                      />
                    </div>

                    <div className="flex items-center space-x-2 mt-6">
                      <input
                        type="checkbox"
                        id="item-active"
                        checked={itemForm.is_active}
                        onChange={(e) =>
                          setItemForm({
                            ...itemForm,
                            is_active: e.target.checked,
                          })
                        }
                        className="rounded"
                      />
                      <label
                        htmlFor="item-active"
                        className="text-sm text-gray-700"
                      >
                        Active
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-4 border-t">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowItemForm(false)}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                    <Button type="submit" disabled={saving}>
                      <Save className="h-4 w-4 mr-2" />
                      {saving ? "Saving..." : "Save Item"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-6">
            {categories.map((category) => {
              const categoryItems = getItemsByCategory(category.id);
              return (
                <Card key={category.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span>{category.name}</span>
                        <Badge
                          variant={category.is_active ? "default" : "secondary"}
                        >
                          {category.is_active ? "Active" : "Inactive"}
                        </Badge>
                        <Badge variant="outline">
                          {categoryItems.length} items
                        </Badge>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {categoryItems.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">
                        No FAQ items in this category
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {categoryItems.map((item, index) => (
                          <div key={item.id} className="border rounded-lg p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <h4 className="font-semibold text-gray-900">
                                    {item.question}
                                  </h4>
                                  <Badge
                                    variant={
                                      item.is_active ? "default" : "secondary"
                                    }
                                  >
                                    {item.is_active ? "Active" : "Inactive"}
                                  </Badge>
                                </div>
                                <p className="text-gray-600 text-sm line-clamp-2">
                                  {item.answer}
                                </p>
                              </div>
                              <div className="flex items-center space-x-1 ml-4">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => moveItem(item.id, "up")}
                                  disabled={index === 0 || saving}
                                >
                                  <ChevronUp className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => moveItem(item.id, "down")}
                                  disabled={
                                    index === categoryItems.length - 1 || saving
                                  }
                                >
                                  <ChevronDown className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => startEditItem(item)}
                                >
                                  <Edit3 className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteItem(item.id)}
                                  disabled={saving}
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">FAQ Categories</h2>
            <Dialog open={showCategoryForm} onOpenChange={setShowCategoryForm}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    setEditingCategory(null);
                    setCategoryForm({
                      name: "",
                      slug: "",
                      description: "",
                      sort_order: 0,
                      is_active: true,
                    });
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Category
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingCategory ? "Edit Category" : "Add New Category"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCategorySubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name *
                    </label>
                    <Input
                      value={categoryForm.name}
                      onChange={(e) => {
                        const name = e.target.value;
                        setCategoryForm({
                          ...categoryForm,
                          name,
                          slug: editingCategory
                            ? categoryForm.slug
                            : generateSlug(name),
                        });
                      }}
                      placeholder="Category name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Slug *
                    </label>
                    <Input
                      value={categoryForm.slug}
                      onChange={(e) =>
                        setCategoryForm({
                          ...categoryForm,
                          slug: e.target.value,
                        })
                      }
                      placeholder="category-slug"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <Textarea
                      value={categoryForm.description}
                      onChange={(e) =>
                        setCategoryForm({
                          ...categoryForm,
                          description: e.target.value,
                        })
                      }
                      placeholder="Optional description"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sort Order
                      </label>
                      <Input
                        type="number"
                        value={categoryForm.sort_order}
                        onChange={(e) =>
                          setCategoryForm({
                            ...categoryForm,
                            sort_order: parseInt(e.target.value) || 0,
                          })
                        }
                        min="0"
                      />
                    </div>

                    <div className="flex items-center space-x-2 mt-6">
                      <input
                        type="checkbox"
                        id="category-active"
                        checked={categoryForm.is_active}
                        onChange={(e) =>
                          setCategoryForm({
                            ...categoryForm,
                            is_active: e.target.checked,
                          })
                        }
                        className="rounded"
                      />
                      <label
                        htmlFor="category-active"
                        className="text-sm text-gray-700"
                      >
                        Active
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-4 border-t">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowCategoryForm(false)}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                    <Button type="submit" disabled={saving}>
                      <Save className="h-4 w-4 mr-2" />
                      {saving ? "Saving..." : "Save Category"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {categories.map((category) => (
              <Card key={category.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {category.name}
                        </h3>
                        <Badge
                          variant={category.is_active ? "default" : "secondary"}
                        >
                          {category.is_active ? "Active" : "Inactive"}
                        </Badge>
                        <Badge variant="outline">
                          {getItemsByCategory(category.id).length} items
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Slug:</strong> {category.slug}
                      </p>
                      {category.description && (
                        <p className="text-gray-600">{category.description}</p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => startEditCategory(category)}
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteCategory(category.id)}
                        disabled={saving}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FAQManagement;
