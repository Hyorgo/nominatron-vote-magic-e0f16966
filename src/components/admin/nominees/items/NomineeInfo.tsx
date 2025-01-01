interface NomineeInfoProps {
  name: string;
  description: string;
}

export const NomineeInfo = ({ name, description }: NomineeInfoProps) => {
  return (
    <div>
      <h4 className="font-medium">{name}</h4>
      <p className="text-sm text-muted-foreground">
        {description}
      </p>
    </div>
  );
};