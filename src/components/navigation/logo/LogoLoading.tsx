import { Loader2 } from "lucide-react";

export const LogoLoading = () => {
  return (
    <div className="h-16 w-16 flex items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin" />
    </div>
  );
};