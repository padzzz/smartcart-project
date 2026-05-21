import React, { useState, useEffect } from "react";

interface ProductImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  alt?: string;
  className?: string;
  category?: string;
  fallbackSrc?: string;
}

// Highly polished, active royalty-free Unsplash e-commerce fallback category photos
export const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  watch: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
  shoes: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
  electronics: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
  fashion: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=600&q=80",
  accessories: "https://images.unsplash.com/photo-1627124765111-f439de0209f8?auto=format&fit=crop&w=600&q=80",
  mobile: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80",
  computer: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=600&q=80",
  default: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80"
};

export function ProductImage({
  src,
  alt = "Product Photo",
  category,
  fallbackSrc,
  className = "",
  ...props
}: ProductImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Clean-up and reset on src change to give the new image a chance to load
  useEffect(() => {
    setHasError(false);
    setIsLoaded(false);

    // Safety timeout: If the image holds loading state for over 4.5 seconds, default to loaded fallback
    const timer = setTimeout(() => {
      setIsLoaded((loaded) => {
        if (!loaded) {
          setHasError(true);
          return true;
        }
        return loaded;
      });
    }, 4500);

    return () => clearTimeout(timer);
  }, [src]);

  // Determine elegant fallback based on category
  const getFallbackImage = () => {
    if (fallbackSrc) return fallbackSrc;
    const cleanCat = (category || "").toLowerCase().trim();
    return CATEGORY_FALLBACK_IMAGES[cleanCat] || CATEGORY_FALLBACK_IMAGES.default;
  };

  // Ensure Unsplash images are high-quality, fast-loading cropped squares if they don't have existing queries
  const getOptimizedSrc = (sourceUrl?: string) => {
    if (!sourceUrl) return getFallbackImage();
    if (hasError) return getFallbackImage();
    
    // If it's an Unsplash URL without sizing/auto parameters, enhance it for optimal e-commerce speed & layout
    if (sourceUrl.includes("images.unsplash.com") && !sourceUrl.includes("?")) {
      return `${sourceUrl}?auto=format&fit=crop&w=600&h=600&q=85`;
    }
    return sourceUrl;
  };

  const handleImageError = () => {
    if (!hasError) {
      setHasError(true);
    }
  };

  const finalSrc = getOptimizedSrc(src);

  return (
    <div className="relative w-full h-full bg-muted/30 overflow-hidden select-none">
      <img
        key={finalSrc}
        src={finalSrc}
        alt={alt}
        onError={handleImageError}
        onLoad={() => setIsLoaded(true)}
        className={`transition-all duration-500 ease-in-out ${
          isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
        } ${className}`}
        referrerPolicy="no-referrer"
        {...props}
      />
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted-foreground/10 backdrop-blur-[2px]">
          <span className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
