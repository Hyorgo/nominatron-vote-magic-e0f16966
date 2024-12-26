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
      <div className="overflow-x-auto">
        <TabsList className="w-full md:w-auto flex flex-nowrap md:inline-flex">
          <TabsTrigger value="home" className="whitespace-nowrap">Page d'accueil</TabsTrigger>
          <TabsTrigger value="competition" className="whitespace-nowrap">Compétition</TabsTrigger>
          <TabsTrigger value="event" className="whitespace-nowrap">Événement</TabsTrigger>
          <TabsTrigger value="statistics" className="whitespace-nowrap">Statistiques</TabsTrigger>
          <TabsTrigger value="participants" className="whitespace-nowrap">Participants</TabsTrigger>
          <TabsTrigger value="settings" className="whitespace-nowrap">Paramètres</TabsTrigger>
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