import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollingTextManager } from "../ScrollingTextManager";
import { BackgroundManager } from "../BackgroundManager";
import { HomeContentManager } from "../home/HomeContentManager";
import { LogoManager } from "../LogoManager";
import { HomeSettingsManager } from "../HomeSettingsManager";
import { CategoriesManager } from "../CategoriesManager";
import { NomineesManager } from "../NomineesManager";
import { VoteStatistics } from "../statistics/VoteStatistics";
import { VoteParticipants } from "../statistics/components/VoteParticipants";
import { EventConfigManager } from "../EventConfigManager";

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
      <TabsList>
        <TabsTrigger value="home">Page d'accueil</TabsTrigger>
        <TabsTrigger value="competition">Compétition</TabsTrigger>
        <TabsTrigger value="event">Événement</TabsTrigger>
        <TabsTrigger value="statistics">Statistiques</TabsTrigger>
        <TabsTrigger value="participants">Participants</TabsTrigger>
        <TabsTrigger value="settings">Paramètres</TabsTrigger>
      </TabsList>

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
        <ScrollingTextManager 
          scrollingTexts={scrollingTexts}
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
      </TabsContent>
    </Tabs>
  );
};