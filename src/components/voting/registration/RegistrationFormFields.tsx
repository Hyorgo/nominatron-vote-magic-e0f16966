import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
}

interface RegistrationFormFieldsProps {
  formData: FormData;
  onChange: (field: keyof FormData, value: string) => void;
  isSubmitting: boolean;
}

export const RegistrationFormFields = ({
  formData,
  onChange,
  isSubmitting
}: RegistrationFormFieldsProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="firstName">Prénom</Label>
        <Input
          id="firstName"
          value={formData.firstName}
          onChange={(e) => onChange('firstName', e.target.value)}
          required
          disabled={isSubmitting}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="lastName">Nom</Label>
        <Input
          id="lastName"
          value={formData.lastName}
          onChange={(e) => onChange('lastName', e.target.value)}
          required
          disabled={isSubmitting}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => onChange('email', e.target.value)}
          required
          disabled={isSubmitting}
        />
      </div>
    </>
  );
};