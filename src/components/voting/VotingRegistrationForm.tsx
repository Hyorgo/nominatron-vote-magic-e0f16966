import { Button } from "@/components/ui/button";
import { RegistrationFormFields } from "./registration/RegistrationFormFields";
import { useRegistration } from "./registration/useRegistration";

interface VotingRegistrationFormProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export const VotingRegistrationForm = ({ onClose, onSuccess }: VotingRegistrationFormProps) => {
  const {
    formData,
    isSubmitting,
    handleSubmit,
    handleFieldChange,
  } = useRegistration(onClose, onSuccess);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <RegistrationFormFields
        formData={formData}
        onChange={handleFieldChange}
        isSubmitting={isSubmitting}
      />
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Validation en cours..." : "Valider"}
      </Button>
    </form>
  );
};