import { Tabs } from "@/components/ui/tabs";
import { TabList } from "./TabList";
import { TabContent } from "./TabContent";

interface AdminTabsProps {
  homeContent: any[];
  scrollingTexts: any[];
  backgrounds: any[];
  onUpdate: () => void;
}

export const AdminTabs = ({
  homeContent,
  backgrounds,
  onUpdate,
}: AdminTabsProps) => {
  return (
    <Tabs defaultValue="home" className="space-y-4">
      <TabList />
      <TabContent
        homeContent={homeContent}
        backgrounds={backgrounds}
        onUpdate={onUpdate}
      />
    </Tabs>
  );
};