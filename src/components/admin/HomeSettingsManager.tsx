import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const HomeSettingsManager = ({ 
  onUpdate 
}: { 
  onUpdate: () => void;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Paramètres de la page d'accueil</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-sm text-muted-foreground">
          Les paramètres de la page d'accueil ont été simplifiés.
        </p>
      </CardContent>
    </Card>
  );
};