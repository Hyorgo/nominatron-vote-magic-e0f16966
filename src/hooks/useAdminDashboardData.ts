import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export const useAdminDashboardData = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    checkAdmin();
    loadHomePageData();
  }, []);

  return {
    loading,
    scrollingTexts,
    backgrounds,
    homeContent,
    headerLogo,
    homeLogo,
    homeYearText,
    loadHomePageData,
  };
};