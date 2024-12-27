import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface VotingHeaderProps {
  isVotingOpen: boolean;
  onOpenDialog: () => void;
  userEmail?: string;
}

export const VotingHeader = ({ isVotingOpen, onOpenDialog, userEmail }: VotingHeaderProps) => {
  return (
    <div className="flex flex-col items-center space-y-6 mb-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-center">
        Votez pour vos établissements préférés
      </h1>
      
      {userEmail ? (
        <div className="text-center space-y-2">
          <div className="text-muted-foreground">
            Connecté avec : <span className="font-medium">{userEmail}</span>
          </div>
          {!isVotingOpen && (
            <div className="text-yellow-500">
              Les votes ne sont pas encore ouverts
            </div>
          )}
        </div>
      ) : (
        <div className="text-center space-y-4 w-full max-w-lg">
          <Alert variant="destructive" className="border-destructive/50 text-destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="ml-2 text-base font-medium">
              Vous devez être connecté avec un email validé pour voter
            </AlertDescription>
          </Alert>
          <Button 
            size="lg"
            onClick={onOpenDialog}
            className="w-full sm:w-auto animate-pulse hover:animate-none bg-primary hover:bg-primary/90 text-base"
          >
            S'inscrire pour voter
          </Button>
        </div>
      )}
    </div>
  );
};