import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export const HomeHero = () => {
  const [homeLogo, setHomeLogo] = useState("/lovable-uploads/1017081c-8fa6-42cf-966b-318e893a0f68.png");
  const [yearText, setYearText] = useState("2025");
  const [introContent, setIntroContent] = useState("");
  const [eventDate, setEventDate] = useState("");

  useEffect(() => {
    loadSettings();
    loadContent();
    loadEventDate();
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

  const loadEventDate = async () => {
    const { data } = await supabase
      .from('event_information')
      .select('event_date')
      .order('created_at', { ascending: false })
      .limit(1);

    if (data && data[0]?.event_date) {
      const formattedDate = format(
        new Date(data[0].event_date),
        "EEEE d MMMM yyyy 'à' HH'h'mm",
        { locale: fr }
      );
      setEventDate(formattedDate);
    }
  };

  return (
    <div className="text-center space-y-4 md:space-y-8 pt-20">
      <img 
        src={homeLogo}
        alt="Lyon d'Or" 
        className="mx-auto h-[150px] md:h-[300px] object-contain animate-fade-in"
      />
      <h1 className="text-5xl md:text-8xl font-bold animate-fade-in">
        <span className="golden-reflection" data-text={yearText}>{yearText}</span>
      </h1>
      {eventDate && (
        <p className="text-xl md:text-2xl text-gold animate-fade-in whitespace-nowrap">
          {eventDate}
        </p>
      )}
      <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in px-4 md:px-0">
        {introContent}
      </p>
    </div>
  );
};