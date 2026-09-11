import React, { useState } from 'react';

interface ShabaAutosLogoProps {
  className?: string;
  variant?: 'light' | 'dark';
  showDivider?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const ShabaAutosLogo: React.FC<ShabaAutosLogoProps> = ({
  className = '',
  variant = 'light',
  showDivider = true,
  size = 'md',
}) => {
  const [imgError, setImgError] = useState(false);
  const isDark = variant === 'dark';

  // Heights for different sizes
  const heightClass =
    size === 'sm'
      ? 'h-8 sm:h-9'
      : size === 'lg'
      ? 'h-12 sm:h-14'
      : 'h-10 sm:h-11';

  // Direct paths to user's provided logo asset files in /public/assets/
  const svgSource = isDark
    ? '/assets/shabaautos-logo-dark.svg'
    : '/assets/shabaautos-logo.svg';

  const pngSource = isDark
    ? '/assets/shabaautos-logo-dark.png'
    : '/assets/shabaautos-logo.png';

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {!imgError ? (
        <picture>
          <source srcSet={svgSource} type="image/svg+xml" />
          <img
            src={svgSource}
            alt="ShabaAutos - Your Car. Your Choice."
            className={`${heightClass} w-auto object-contain block max-w-full`}
            loading="eager"
            onError={() => {
              // Try PNG fallback if SVG fails to load
              setImgError(true);
            }}
          />
        </picture>
      ) : (
        <img
          src={pngSource}
          alt="ShabaAutos - Your Car. Your Choice."
          className={`${heightClass} w-auto object-contain block max-w-full`}
          loading="eager"
        />
      )}
    </div>
  );
};

