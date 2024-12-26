import { User } from "lucide-react";

interface WelcomeMessageProps {
  firstName?: string;
}

export const WelcomeMessage = ({ firstName }: WelcomeMessageProps) => {
  if (!firstName) return null;

  return (
    <div className="flex items-center gap-2 text-primary">
      <User className="h-5 w-5" />
      <p className="text-xl font-semibold">
        Bienvenue {firstName} 👋 : Nous sommes ravis de vous voir participer aux votes.
      </p>
    </div>
  );
};