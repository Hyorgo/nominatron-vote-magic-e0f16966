import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Award, BarChart3 } from "lucide-react";

export const AdminDashboard = () => {
  return (
    <div className="container py-8 animate-fade-in">
      <h1 className="text-4xl font-bold mb-8">Tableau de bord</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Catégories</h3>
            <Award className="h-5 w-5 text-primary" />
          </div>
          <p className="text-3xl font-bold mb-4">14</p>
          <Button className="w-full" variant="outline">
            <PlusCircle className="h-4 w-4 mr-2" />
            Ajouter une catégorie
          </Button>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Nominés</h3>
            <Award className="h-5 w-5 text-primary" />
          </div>
          <p className="text-3xl font-bold mb-4">70</p>
          <Button className="w-full" variant="outline">
            <PlusCircle className="h-4 w-4 mr-2" />
            Ajouter un nominé
          </Button>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Votes totaux</h3>
            <BarChart3 className="h-5 w-5 text-primary" />
          </div>
          <p className="text-3xl font-bold mb-4">1,234</p>
          <Button className="w-full" variant="outline">
            Voir les statistiques
          </Button>
        </Card>
      </div>
    </div>
  );
};