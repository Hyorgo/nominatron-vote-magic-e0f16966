import { HomeHero } from "@/components/home/HomeHero";
import { ActionCards } from "@/components/home/ActionCards";
import BokehEffect from "@/components/effects/BokehEffect";
import "@/styles/bokeh.css";

const Index = () => {
  return (
    <div className="min-h-screen relative">
      <BokehEffect />
      <div className="gold-halo" />
      <div className="container py-6 space-y-8">
        <HomeHero />
        <ActionCards />
      </div>
    </div>
  );
};

export default Index;