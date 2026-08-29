interface LumiCatProps {
  size?: number;
  className?: string;
  animate?: boolean;
  variant?: 'full' | 'head' | 'sleepy' | 'peek';
}

export function LumiCat({ size = 120, className = '', animate = true, variant = 'full' }: LumiCatProps) {
  const animClass = animate ? 'lumi-cat-anim' : '';
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${animClass} ${className}`}
      role="img"
      aria-label="Lumi the black cat"
    >
      <defs>
        <radialGradient id="lumiGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#EDE9FE" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#A78BFA" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="95" fill="url(#lumiGlow)" opacity="0.3" />

      {variant === 'full' && (
        <>
          {/* Body */}
          <ellipse cx="100" cy="165" rx="42" ry="28" fill="#2A2235" />
          {/* Tail */}
          <path d="M140 160 Q165 150 160 125 Q158 115 150 118" stroke="#2A2235" strokeWidth="9" strokeLinecap="round" fill="none" />
          {/* Paws */}
          <ellipse cx="82" cy="188" rx="9" ry="6" fill="#2A2235" />
          <ellipse cx="118" cy="188" rx="9" ry="6" fill="#2A2235" />
        </>
      )}

      {/* Ears — soft rounded */}
      <path d="M50 70 Q40 35 58 38 Q66 50 64 66 Z" fill="#2A2235" />
      <path d="M150 70 Q160 35 142 38 Q134 50 136 66 Z" fill="#2A2235" />
      {/* Inner ears — lavender accent */}
      <path d="M53 62 Q50 48 57 50 Q61 58 59 64 Z" fill="#C4B5FD" opacity="0.35" />
      <path d="M147 62 Q150 48 143 50 Q139 58 141 64 Z" fill="#C4B5FD" opacity="0.35" />

      {/* Head — rounded */}
      <ellipse cx="100" cy="100" rx="55" ry="50" fill="#2A2235" />

      {/* Cheek blush — subtle */}
      <ellipse cx="68" cy="115" rx="9" ry="5" fill="#7C3AED" opacity="0.12" />
      <ellipse cx="132" cy="115" rx="9" ry="5" fill="#7C3AED" opacity="0.12" />

      {/* Eyes — normal cute, NOT glowing */}
      {variant === 'sleepy' ? (
        <>
          <path d="M70 95 Q78 100 86 95" stroke="#EDE9FE" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M114 95 Q122 100 130 95" stroke="#EDE9FE" strokeWidth="3" strokeLinecap="round" fill="none" />
        </>
      ) : (
        <>
          <ellipse cx="78" cy="95" rx="8" ry="10" fill="#EDE9FE" />
          <ellipse cx="122" cy="95" rx="8" ry="10" fill="#EDE9FE" />
          {/* Pupils — soft, not exaggerated */}
          <ellipse cx="79" cy="96" rx="4.5" ry="6.5" fill="#241B35" />
          <ellipse cx="123" cy="96" rx="4.5" ry="6.5" fill="#241B35" />
          {/* Eye highlights */}
          <circle cx="81" cy="93" r="1.8" fill="#FFFFFF" opacity="0.9" />
          <circle cx="125" cy="93" r="1.8" fill="#FFFFFF" opacity="0.9" />
        </>
      )}

      {/* Nose — tiny, simple */}
      <path d="M96 113 Q100 110 104 113 Q102 117 100 117 Q98 117 96 113 Z" fill="#C4B5FD" />

      {/* Mouth — tiny subtle smile */}
      <path d="M100 118 Q94 124 90 121" stroke="#C4B5FD" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.8" />
      <path d="M100 118 Q106 124 110 121" stroke="#C4B5FD" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.8" />

      {/* Whiskers — soft */}
      <path d="M62 112 L40 108" stroke="#A78BFA" strokeWidth="1.2" strokeLinecap="round" opacity="0.4" />
      <path d="M62 118 L42 120" stroke="#A78BFA" strokeWidth="1.2" strokeLinecap="round" opacity="0.4" />
      <path d="M138 112 L160 108" stroke="#A78BFA" strokeWidth="1.2" strokeLinecap="round" opacity="0.4" />
      <path d="M138 118 L158 120" stroke="#A78BFA" strokeWidth="1.2" strokeLinecap="round" opacity="0.4" />

      {/* Tiny stars */}
      <circle cx="32" cy="48" r="1.5" fill="#EDE9FE" opacity="0.6" />
      <circle cx="168" cy="68" r="1.5" fill="#EDE9FE" opacity="0.6" />
      <circle cx="42" cy="158" r="1" fill="#EDE9FE" opacity="0.4" />
    </svg>
  );
}

export function LumiAvatar({ size = 40, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Lumi avatar"
    >
      <circle cx="100" cy="100" r="100" fill="#4C1D95" />
      <circle cx="100" cy="100" r="100" fill="url(#lumiAvGlow)" />
      {/* Ears */}
      <path d="M50 70 Q40 35 58 38 Q66 50 64 66 Z" fill="#2A2235" />
      <path d="M150 70 Q160 35 142 38 Q134 50 136 66 Z" fill="#2A2235" />
      <path d="M53 62 Q50 48 57 50 Q61 58 59 64 Z" fill="#C4B5FD" opacity="0.35" />
      <path d="M147 62 Q150 48 143 50 Q139 58 141 64 Z" fill="#C4B5FD" opacity="0.35" />
      {/* Head */}
      <ellipse cx="100" cy="100" rx="55" ry="50" fill="#2A2235" />
      {/* Eyes */}
      <ellipse cx="78" cy="95" rx="8" ry="10" fill="#EDE9FE" />
      <ellipse cx="122" cy="95" rx="8" ry="10" fill="#EDE9FE" />
      <ellipse cx="79" cy="96" rx="4.5" ry="6.5" fill="#241B35" />
      <ellipse cx="123" cy="96" rx="4.5" ry="6.5" fill="#241B35" />
      <circle cx="81" cy="93" r="1.8" fill="#FFFFFF" opacity="0.9" />
      <circle cx="125" cy="93" r="1.8" fill="#FFFFFF" opacity="0.9" />
      {/* Nose */}
      <path d="M96 113 Q100 110 104 113 Q102 117 100 117 Q98 117 96 113 Z" fill="#C4B5FD" />
      {/* Smile */}
      <path d="M100 118 Q94 124 90 121" stroke="#C4B5FD" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.8" />
      <path d="M100 118 Q106 124 110 121" stroke="#C4B5FD" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.8" />
      <defs>
        <radialGradient id="lumiAvGlow" cx="0.5" cy="0.4" r="0.6">
          <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#7C3AED" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}

export function LumiSleepy({ size = 80, className = '' }: { size?: number; className?: string }) {
  return <LumiCat size={size} className={className} animate={false} variant="sleepy" />;
}

export function CatPaw({ size = 16, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-hidden="true"
    >
      <ellipse cx="12" cy="16" rx="6" ry="5" fill="currentColor" />
      <ellipse cx="6" cy="9" rx="2.5" ry="3" fill="currentColor" />
      <ellipse cx="18" cy="9" rx="2.5" ry="3" fill="currentColor" />
      <ellipse cx="9" cy="5" rx="2" ry="2.5" fill="currentColor" />
      <ellipse cx="15" cy="5" rx="2" ry="2.5" fill="currentColor" />
    </svg>
  );
}
