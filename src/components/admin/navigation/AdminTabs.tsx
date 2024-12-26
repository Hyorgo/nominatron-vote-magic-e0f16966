import { Tabs } from "@/components/ui/tabs";
import { TabList } from "./TabList";
import { TabContent } from "./TabContent";

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
  backgrounds,
  headerLogo,
  homeLogo,
  homeYearText,
  onUpdate,
}: AdminTabsProps) => {
  return (
    <Tabs defaultValue="home" className="space-y-4">
      <TabList />
      <TabContent
        homeContent={homeContent}
        backgrounds={backgrounds}
        headerLogo={headerLogo}
        homeLogo={homeLogo}
        homeYearText={homeYearText}
        onUpdate={onUpdate}
      />
    </Tabs>
  );
};