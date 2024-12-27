import { HomeHero } from "@/components/home/HomeHero";
import { ActionCards } from "@/components/home/ActionCards";
import BokehEffect from "@/components/effects/BokehEffect";
import "@/styles/bokeh.css";
import { useIsMobile } from "@/hooks/use-mobile";

export const Index = () => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen relative">
      <BokehEffect />
      {!isMobile && <div className="gold-halo" />}
      <div className="container px-4 md:px-6 py-4 md:py-6 space-y-8 md:space-y-16">
        <HomeHero />
        <div className="mt-8 md:mt-48">
          <ActionCards />
        </div>
      </div>
    </div>
  );
};

export default Index;