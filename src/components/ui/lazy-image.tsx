import { useState } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "./skeleton";

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallback?: React.ReactNode;
}

const LazyImage = ({ src, alt, className, fallback, ...props }: LazyImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return fallback || <Skeleton className={className} />;
  }

  return (
    <>
      {!isLoaded && (fallback || <Skeleton className={className} />)}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={cn(
          "transition-opacity duration-300",
          !isLoaded && "opacity-0 absolute",
          isLoaded && "opacity-100",
          className
        )}
        {...props}
      />
    </>
  );
};

export default LazyImage;