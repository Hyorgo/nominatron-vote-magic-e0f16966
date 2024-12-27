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
        <div className="text-muted-foreground text-center">
          Connecté avec : <span className="font-medium">{userEmail}</span>
        </div>
      ) : (
        <div className="text-destructive text-center">
          Vous devez être connecté avec un email validé pour voter
        </div>
      )}
    </div>
  );
};