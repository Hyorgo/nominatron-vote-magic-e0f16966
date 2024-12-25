import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Trophy, Calendar, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface HomeContent {
  section_name: string;
  title: string | null;
  subtitle: string | null;
  content: string | null;
}

const Index = () => {
  const [homeLogo, setHomeLogo] = useState("/lovable-uploads/1017081c-8fa6-42cf-966b-318e893a0f68.png");
  const [yearText, setYearText] = useState("2025");
  const [content, setContent] = useState<Record<string, HomeContent>>({});

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
      .eq('is_active', true);

    if (data) {
      const contentMap = data.reduce((acc, item) => {
        acc[item.section_name] = item;
        return acc;
      }, {} as Record<string, HomeContent>);
      setContent(contentMap);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="container py-16 space-y-16">
        <div className="text-center space-y-4">
          <img 
            src={homeLogo}
            alt="Lyon d'Or" 
            className="mx-auto w-[400px] mb-8 animate-fade-in"
          />
          <h1 className="text-8xl font-bold animate-fade-in">
            <span className="golden-reflection" data-text={yearText}>{yearText}</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in whitespace-nowrap">
            {content.intro?.content}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3 animate-fade-in">
          <div className="bg-card rounded-lg p-6 text-center space-y-4">
            <Trophy className="w-12 h-12 mx-auto text-primary" />
            <h2 className="text-xl font-semibold">{content.card_vote?.title}</h2>
            <p className="text-muted-foreground">
              {content.card_vote?.subtitle}
            </p>
            <Button asChild>
              <Link to="/categories">{content.card_vote?.content}</Link>
            </Button>
          </div>

          <div className="bg-card rounded-lg p-6 text-center space-y-4">
            <Calendar className="w-12 h-12 mx-auto text-primary" />
            <h2 className="text-xl font-semibold">{content.card_book?.title}</h2>
            <p className="text-muted-foreground">
              {content.card_book?.subtitle}
            </p>
            <Button asChild>
              <Link to="/reserver">{content.card_book?.content}</Link>
            </Button>
          </div>

          <div className="bg-card rounded-lg p-6 text-center space-y-4">
            <Mail className="w-12 h-12 mx-auto text-primary" />
            <h2 className="text-xl font-semibold">{content.card_contact?.title}</h2>
            <p className="text-muted-foreground">
              {content.card_contact?.subtitle}
            </p>
            <Button asChild>
              <Link to="/contact">{content.card_contact?.content}</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
