import { TabsContent } from "@/components/ui/tabs";
import { HomeSettingsManager } from "../HomeSettingsManager";
import { HomeContentManager } from "../home/HomeContentManager";
import { BackgroundManager } from "../BackgroundManager";
import { CategoriesManager } from "../CategoriesManager";
import { NomineesManager } from "../NomineesManager";
import { EventConfigManager } from "../EventConfigManager";
import { VoteStatistics } from "../statistics/VoteStatistics";
import { VoteParticipants } from "../statistics/components/VoteParticipants";
import { LogoManager } from "../LogoManager";
import { StripeSettingsManager } from "../StripeSettingsManager";

interface TabContentProps {
  homeContent: any[];
  backgrounds: any[];
  headerLogo: string;
  homeLogo: string;
  homeYearText: string;
  onUpdate: () => void;
}

export const TabContent = ({
  homeContent,
  backgrounds,
  headerLogo,
  homeLogo,
  homeYearText,
  onUpdate,
}: TabContentProps) => {
  return (
    <>
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
    </>
  );
};