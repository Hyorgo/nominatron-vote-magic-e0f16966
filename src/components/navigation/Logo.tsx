import { useHeaderLogo } from "@/hooks/useHeaderLogo";
import { LogoLoading } from "./logo/LogoLoading";
import { LogoDisplay } from "./logo/LogoDisplay";
import { logger } from "@/services/monitoring/logger";

export const Logo = () => {
  const { headerLogo, isLoading, error } = useHeaderLogo();

  if (isLoading) {
    return <LogoLoading />;
  }

  if (error) {
    logger.error(error);
    return <LogoDisplay logoUrl={null} />;
  }

  return <LogoDisplay logoUrl={headerLogo} />;
};