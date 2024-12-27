interface VotingHeaderProps {
  isVotingOpen: boolean;
  onOpenDialog: () => void;
  userEmail?: string;
}

export const VotingHeader = ({ isVotingOpen, onOpenDialog, userEmail }: VotingHeaderProps) => {
  return (
    <div className="flex flex-col items-center space-y-4 mb-8">
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
        <div className="text-center space-y-2">
          <div className="text-destructive">
            Vous devez être connecté avec un email validé pour voter
          </div>
          <Button 
            variant="outline" 
            onClick={onOpenDialog}
            className="mt-2"
          >
            S'inscrire pour voter
          </Button>
        </div>
      )}
    </div>
  );
};