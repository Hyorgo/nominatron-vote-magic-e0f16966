import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollingTextManager } from "./admin/ScrollingTextManager";
import { BackgroundManager } from "./admin/BackgroundManager";
import { HomeContentManager } from "./admin/home/HomeContentManager";
import { LogoManager } from "./admin/LogoManager";
import { HomeSettingsManager } from "./admin/HomeSettingsManager";
import { CategoriesManager } from "./admin/CategoriesManager";
import { NomineesManager } from "./admin/NomineesManager";
import { AdminSidebar } from "./admin/AdminSidebar";
import { AdminBreadcrumbs } from "./admin/AdminBreadcrumbs";
import { AdminSearch } from "./admin/AdminSearch";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrollingTexts, setScrollingTexts] = useState<any[]>([]);
  const [backgrounds, setBackgrounds] = useState<any[]>([]);
  const [homeContent, setHomeContent] = useState<any[]>([]);
  const [headerLogo, setHeaderLogo] = useState("");
  const [homeLogo, setHomeLogo] = useState("");
  const [homeYearText, setHomeYearText] = useState("");

  const checkAdmin = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/admin');
      return;
    }

    const { data: adminData, error: adminError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', session.user.email)
      .single();

    if (adminError || !adminData) {
      navigate('/admin');
      return;
    }

    setLoading(false);
  };

  const loadHomePageData = async () => {
    const { data: scrollingData } = await supabase
      .from('scrolling_text')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (scrollingData) {
      setScrollingTexts(scrollingData);
    }

    const { data: backgroundData } = await supabase
      .from('page_backgrounds')
      .select('*')
      .eq('page_name', 'home')
      .order('created_at', { ascending: false });
    
    if (backgroundData) {
      setBackgrounds(backgroundData);
    }

    const { data: contentData } = await supabase
      .from('home_content')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (contentData) {
      setHomeContent(contentData);
    }

    const { data: siteSettings } = await supabase
      .from('site_settings')
      .select('setting_name, setting_value');
    
    if (siteSettings) {
      const headerLogoSetting = siteSettings.find(s => s.setting_name === 'header_logo');
      const homeLogoSetting = siteSettings.find(s => s.setting_name === 'home_logo');
      const homeYearSetting = siteSettings.find(s => s.setting_name === 'home_year_text');
      
      if (headerLogoSetting) setHeaderLogo(headerLogoSetting.setting_value);
      if (homeLogoSetting) setHomeLogo(homeLogoSetting.setting_value);
      if (homeYearSetting) setHomeYearText(homeYearSetting.setting_value);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin');
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query.toLowerCase());
  };

  useEffect(() => {
    checkAdmin();
    loadHomePageData();
  }, []);

  if (loading) {
    return <div className="container mx-auto p-6">Chargement...</div>;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AdminSidebar />
        <div className="flex-1">
          <div className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center gap-4">
              <SidebarTrigger />
              <AdminBreadcrumbs />
              <div className="ml-auto w-[200px]">
                <AdminSearch onSearch={handleSearch} />
              </div>
              <Button onClick={handleLogout} variant="outline">
                Déconnexion
              </Button>
            </div>
          </div>

          <div className="container py-6">
            <div className="space-y-6">
              <div id="home-settings">
                <HomeSettingsManager
                  currentLogo={homeLogo}
                  currentYear={homeYearText}
                  onUpdate={loadHomePageData}
                />
              </div>

              <div id="home-content">
                <HomeContentManager
                  homeContent={homeContent}
                  onUpdate={loadHomePageData}
                />
              </div>

              <div id="scrolling-text">
                <ScrollingTextManager
                  scrollingTexts={scrollingTexts}
                  onUpdate={loadHomePageData}
                />
              </div>

              <div id="backgrounds">
                <BackgroundManager
                  backgrounds={backgrounds}
                  onUpdate={loadHomePageData}
                />
              </div>

              <div id="categories">
                <CategoriesManager onUpdate={loadHomePageData} />
              </div>

              <div id="nominees">
                <NomineesManager onUpdate={loadHomePageData} />
              </div>

              <div id="logo">
                <LogoManager
                  currentLogo={headerLogo}
                  onUpdate={loadHomePageData}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};
