import { Nominee } from "@/types/nominees";
import { NomineeImage } from "./items/NomineeImage";
import { NomineeInfo } from "./items/NomineeInfo";
import { NomineeActions } from "./items/NomineeActions";

interface NomineeItemProps {
  nominee: Nominee;
  onDelete: (id: string) => void;
}

export const NomineeItem = ({ nominee, onDelete }: NomineeItemProps) => {
  return (
    <div className="flex items-center justify-between p-3 bg-background rounded-lg border border-border hover:border-primary/50 transition-colors">
      <div className="flex items-center gap-4 flex-1">
        <NomineeImage 
          imageUrl={nominee.image_url} 
          nomineeName={nominee.name} 
        />
        <NomineeInfo 
          name={nominee.name} 
          description={nominee.description} 
        />
      </div>
      <NomineeActions 
        nomineeName={nominee.name}
        onDelete={() => onDelete(nominee.id)}
      />
    </div>
  );
};