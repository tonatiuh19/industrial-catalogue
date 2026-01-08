import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminStore } from "@/store/AdminStoreContext";
import { useAdmin } from "@/context/AdminContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Save, Loader2, ShieldAlert } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function ContentPages() {
  const { admin } = useAdmin();
  const navigate = useNavigate();
  const { state, fetchContentPages, updateContentPage } = useAdminStore();
  const { content: contentState } = state;
  const { toast } = useToast();
  const [termsContent, setTermsContent] = useState("");
  const [privacyContent, setPrivacyContent] = useState("");
  const [activeTab, setActiveTab] = useState("terms");

  useEffect(() => {
    // Check if user has permission to access this page
    if (admin?.role !== "super_admin") {
      toast({
        title: "Acceso Denegado",
        description: "No tienes permisos para acceder a esta página",
        variant: "destructive",
      });
      navigate("/admin/dashboard");
      return;
    }
    loadPages();
  }, [admin]);

  useEffect(() => {
    // Update local state when pages are loaded
    const termsPage = contentState.pages.find((p) => p.slug === "terms");
    const privacyPage = contentState.pages.find((p) => p.slug === "privacy");

    if (termsPage) setTermsContent(termsPage.content);
    if (privacyPage) setPrivacyContent(privacyPage.content);
  }, [contentState.pages]);

  const loadPages = async () => {
    try {
      await fetchContentPages();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load content pages",
        variant: "destructive",
      });
    }
  };

  const handleSave = async (slug: string, content: string) => {
    try {
      const page = contentState.pages.find((p) => p.slug === slug);
      await updateContentPage(slug, {
        title: page?.title || slug,
        content,
      });
      toast({
        title: "Success",
        description: "Content saved successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save content",
        variant: "destructive",
      });
    }
  };

  // Additional safety check
  if (admin?.role !== "super_admin") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <ShieldAlert className="h-16 w-16 text-slate-400" />
        <h2 className="text-2xl font-semibold text-slate-700">
          Acceso Denegado
        </h2>
        <p className="text-slate-600 text-center max-w-md">
          No tienes permisos para acceder a esta página. Solo los Super
          Administradores pueden gestionar el contenido.
        </p>
        <Button onClick={() => navigate("/admin/dashboard")}>
          Volver al Tablero
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Content Pages</h1>
        <p className="text-slate-600">
          Edit terms & conditions and privacy policy
        </p>
      </div>

      {contentState.loading.isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        </div>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList>
            <TabsTrigger value="terms">Terms & Conditions</TabsTrigger>
            <TabsTrigger value="privacy">Privacy Policy</TabsTrigger>
          </TabsList>
          <TabsContent value="terms">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Terms & Conditions</CardTitle>
                  <Button onClick={() => handleSave("terms", termsContent)}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={termsContent}
                  onChange={(e) => setTermsContent(e.target.value)}
                  placeholder="Enter terms and conditions..."
                  className="min-h-[400px] font-mono text-sm"
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="privacy">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Privacy Policy</CardTitle>
                  <Button onClick={() => handleSave("privacy", privacyContent)}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={privacyContent}
                  onChange={(e) => setPrivacyContent(e.target.value)}
                  placeholder="Enter privacy policy..."
                  className="min-h-[400px] font-mono text-sm"
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
