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
import { VoteStatistics } from "./admin/statistics/VoteStatistics";

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [scrollingTexts, setScrollingTexts] = useState<any[]>([]);
  const [backgrounds, setBackgrounds] = useState<any[]>([]);
  const [homeContent, setHomeContent] = useState<any[]>([]);
  const [headerLogo, setHeaderLogo] = useState("");
  const [homeLogo, setHomeLogo] = useState("");
  const [homeYearText, setHomeYearText] = useState("");

  useEffect(() => {
    checkAdmin();
    loadHomePageData();
  }, []);

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

  if (loading) {
    return <div className="container mx-auto p-6">Chargement...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Tableau de bord administrateur</h1>
        <Button onClick={handleLogout}>
          Déconnexion
        </Button>
      </div>

      <Tabs defaultValue="home" className="space-y-4">
        <TabsList>
          <TabsTrigger value="home">Page d'accueil</TabsTrigger>
          <TabsTrigger value="competition">Compétition</TabsTrigger>
          <TabsTrigger value="statistics">Statistiques</TabsTrigger>
          <TabsTrigger value="settings">Paramètres</TabsTrigger>
        </TabsList>

        <TabsContent value="home" className="space-y-4">
          <HomeSettingsManager 
            currentLogo={homeLogo}
            currentYear={homeYearText}
            onUpdate={loadHomePageData}
          />
          <HomeContentManager 
            homeContent={homeContent}
            onUpdate={loadHomePageData}
          />
          <ScrollingTextManager 
            scrollingTexts={scrollingTexts}
            onUpdate={loadHomePageData}
          />
          <BackgroundManager 
            backgrounds={backgrounds}
            onUpdate={loadHomePageData}
          />
        </TabsContent>

        <TabsContent value="competition" className="space-y-4">
          <CategoriesManager onUpdate={loadHomePageData} />
          <NomineesManager onUpdate={loadHomePageData} />
        </TabsContent>

        <TabsContent value="statistics" className="space-y-4">
          <VoteStatistics />
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <LogoManager
            currentLogo={headerLogo}
            onUpdate={loadHomePageData}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};