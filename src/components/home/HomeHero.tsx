import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const HomeHero = () => {
  const [homeLogo, setHomeLogo] = useState("/lovable-uploads/1017081c-8fa6-42cf-966b-318e893a0f68.png");
  const [yearText, setYearText] = useState("2025");
  const [introContent, setIntroContent] = useState("");

  useEffect(() => {
    loadSettings();
    loadContent();
  }, []);

  const loadSettings = async () => {
    const { data: siteSettings } = await supabase
      .from('site_settings')
      .select('setting_name, setting_value');
    
    if (siteSettings) {
      const homeLogoSetting = siteSettings.find(s => s.setting_name === 'home_logo');
      const yearTextSetting = siteSettings.find(s => s.setting_name === 'home_year_text');
      
      if (homeLogoSetting) setHomeLogo(homeLogoSetting.setting_value);
      if (yearTextSetting) setYearText(yearTextSetting.setting_value);
    }
  };

  const loadContent = async () => {
    const { data } = await supabase
      .from('home_content')
      .select('*')
      .eq('is_active', true)
      .eq('section_name', 'intro')
      .single();

    if (data) {
      setIntroContent(data.content || "");
    }
  };

  return (
    <div className="text-center space-y-4 md:space-y-8">
      <img 
        src={homeLogo}
        alt="Lyon d'Or" 
        className="mx-auto w-[200px] md:w-[400px] mb-4 md:mb-8 animate-fade-in"
      />
      <div className="relative mx-auto w-[200px] md:w-[400px] mb-4 md:mb-8 animate-fade-in">
        <div className="absolute inset-0 blur-[20px] opacity-50 bg-gold-light rounded-full" />
        <div className="absolute inset-0 blur-[40px] opacity-30 bg-primary rounded-full" />
        <img 
          src="/lovable-uploads/64f527a4-72a8-4d81-ac97-405a93d7d159.png"
          alt="Sortir à Lyon" 
          className="relative z-10 w-full h-auto"
        />
      </div>
      <h1 className="text-5xl md:text-8xl font-bold animate-fade-in">
        <span className="golden-reflection" data-text={yearText}>{yearText}</span>
      </h1>
      <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in px-4 md:px-0">
        {introContent}
      </p>
    </div>
  );
};