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
      <div className="flex flex-col gap-2">
        <TabsList className="h-auto flex-wrap justify-start gap-2 bg-transparent p-0">
          <div className="flex w-full gap-2 sm:w-auto">
            <TabsTrigger 
              value="home" 
              className="flex-1 sm:flex-none bg-background data-[state=active]:bg-primary"
            >
              Page d'accueil
            </TabsTrigger>
            <TabsTrigger 
              value="competition" 
              className="flex-1 sm:flex-none bg-background data-[state=active]:bg-primary"
            >
              Compétition
            </TabsTrigger>
            <TabsTrigger 
              value="event" 
              className="flex-1 sm:flex-none bg-background data-[state=active]:bg-primary"
            >
              Événement
            </TabsTrigger>
          </div>
          
          <div className="flex w-full gap-2 sm:w-auto">
            <TabsTrigger 
              value="statistics" 
              className="flex-1 sm:flex-none bg-background data-[state=active]:bg-primary"
            >
              Statistiques
            </TabsTrigger>
            <TabsTrigger 
              value="participants" 
              className="flex-1 sm:flex-none bg-background data-[state=active]:bg-primary"
            >
              Participants
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="flex-1 sm:flex-none bg-background data-[state=active]:bg-primary"
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