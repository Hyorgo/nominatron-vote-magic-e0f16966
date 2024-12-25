import { HomeHero } from "@/components/home/HomeHero";
import { ActionCards } from "@/components/home/ActionCards";
import { BokehEffect } from "@/components/effects/BokehEffect";

const Index = () => {
  return (
    <div className="min-h-screen">
      <BokehEffect />
      <div className="container py-16 space-y-16">
        <HomeHero />
        <ActionCards />
      </div>
    </div>
  );
};

export default Index;