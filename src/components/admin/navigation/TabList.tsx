import { TabsList, TabsTrigger } from "@/components/ui/tabs";

export const TabList = () => {
  return (
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
  );
};