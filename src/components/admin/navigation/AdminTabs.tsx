import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BackgroundManager } from "../BackgroundManager";
import { HomeContentManager } from "../home/HomeContentManager";
import { LogoManager } from "../LogoManager";
import { HomeSettingsManager } from "../HomeSettingsManager";
import { CategoriesManager } from "../CategoriesManager";
import { NomineesManager } from "../NomineesManager";
import { VoteStatistics } from "../statistics/VoteStatistics";
import { VoteParticipants } from "../statistics/components/VoteParticipants";
import { EventConfigManager } from "../EventConfigManager";
import { StripeSettingsManager } from "../StripeSettingsManager";

interface AdminTabsProps {
  homeContent: any[];
  scrollingTexts: any[];
  backgrounds: any[];
  headerLogo: string;
  homeLogo: string;
  homeYearText: string;
  onUpdate: () => void;
}

export const AdminTabs = ({
  homeContent,
  scrollingTexts,
  backgrounds,
  headerLogo,
  homeLogo,
  homeYearText,
  onUpdate,
}: AdminTabsProps) => {
  return (
    <Tabs defaultValue="home" className="space-y-4">
      <div className="flex flex-col gap-4">
        <TabsList className="h-auto flex-wrap justify-start gap-4 bg-transparent p-0">
          <div className="grid w-full grid-cols-1 sm:grid-cols-3 gap-2">
            <TabsTrigger 
              value="home" 
              className="w-full h-12 text-base bg-background hover:bg-accent data-[state=active]:bg-primary data-[state=active]:text-primary-foreground shadow-sm"
            >
              Page d'accueil
            </TabsTrigger>
            <TabsTrigger 
              value="competition" 
              className="w-full h-12 text-base bg-background hover:bg-accent data-[state=active]:bg-primary data-[state=active]:text-primary-foreground shadow-sm"
            >
              Compétition
            </TabsTrigger>
            <TabsTrigger 
              value="event" 
              className="w-full h-12 text-base bg-background hover:bg-accent data-[state=active]:bg-primary data-[state=active]:text-primary-foreground shadow-sm"
            >
              Événement
            </TabsTrigger>
          </div>
          
          <div className="grid w-full grid-cols-1 sm:grid-cols-3 gap-2">
            <TabsTrigger 
              value="statistics" 
              className="w-full h-12 text-base bg-background hover:bg-accent data-[state=active]:bg-primary data-[state=active]:text-primary-foreground shadow-sm"
            >
              Statistiques
            </TabsTrigger>
            <TabsTrigger 
              value="participants" 
              className="w-full h-12 text-base bg-background hover:bg-accent data-[state=active]:bg-primary data-[state=active]:text-primary-foreground shadow-sm"
            >
              Participants
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="w-full h-12 text-base bg-background hover:bg-accent data-[state=active]:bg-primary data-[state=active]:text-primary-foreground shadow-sm"
            >
              Paramètres
            </TabsTrigger>
          </div>
        </TabsList>
      </div>

      <TabsContent value="home" className="space-y-4">
        <HomeSettingsManager 
          currentLogo={homeLogo}
          currentYear={homeYearText}
          onUpdate={onUpdate}
        />
        <HomeContentManager 
          homeContent={homeContent}
          onUpdate={onUpdate}
        />
        <BackgroundManager 
          backgrounds={backgrounds}
          onUpdate={onUpdate}
        />
      </TabsContent>

      <TabsContent value="competition" className="space-y-4">
        <CategoriesManager onUpdate={onUpdate} />
        <NomineesManager onUpdate={onUpdate} />
      </TabsContent>

      <TabsContent value="event" className="space-y-4">
        <EventConfigManager />
      </TabsContent>

      <TabsContent value="statistics" className="space-y-4">
        <VoteStatistics />
      </TabsContent>

      <TabsContent value="participants" className="space-y-4">
        <VoteParticipants />
      </TabsContent>

      <TabsContent value="settings" className="space-y-4">
        <LogoManager
          currentLogo={headerLogo}
          onUpdate={onUpdate}
        />
        <StripeSettingsManager />
      </TabsContent>
    </Tabs>
  );
};