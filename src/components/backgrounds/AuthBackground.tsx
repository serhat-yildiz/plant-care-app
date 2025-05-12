import React from 'react';

interface AuthBackgroundProps {
  children: React.ReactNode;
}

// CSS for the flower pattern background
const flowerPatternStyle = {
  backgroundImage: `
    radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 30%, transparent 60%),
    radial-gradient(circle at 70% 60%, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 20%, transparent 40%),
    radial-gradient(circle at 40% 80%, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 25%, transparent 50%),
    radial-gradient(circle at 80% 30%, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 20%, transparent 40%),
    radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.05) 30%, transparent 55%),
    radial-gradient(circle at 60% 10%, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.05) 15%, transparent 35%),
    radial-gradient(circle at 90% 80%, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 20%, transparent 40%),
    linear-gradient(to right, #16a34a, #059669)
  `,
  backgroundSize: '100% 100%, 80% 80%, 70% 70%, 60% 60%, 50% 50%, 40% 40%, 30% 30%, 100% 100%',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  position: 'relative' as const
};

// Additional plant-like decorative elements
const plantDecorationsStyle = {
  position: 'absolute' as const,
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  overflow: 'hidden',
  zIndex: 0,
  opacity: 0.5,
  backgroundImage: `
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cpath fill='%23FFFFFF' fill-opacity='0.1' d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z'/%3E%3C/svg%3E"),
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 800'%3E%3Cg fill='none' stroke='%23FFFFFF' stroke-width='1'%3E%3Cpath d='M769 229L1037 260.9M927 880L731 737 520 660 309 538 40 599 295 764 126.5 879.5 40 599-197 493 102 382-31 229 126.5 79.5-69-63'/%3E%3Cpath d='M-31 229L237 261 390 382 731 154 769 229 365 328 40 599 271 725 149 870 391 629 490 490 202 455 295 764'/%3E%3Cpath d='M520 660L578 842 731 737 840 599 603 493 520 660 295 764 40 599 102 382 520 660 295 764 731 154'/%3E%3Cpath d='M520-140L578.5 42.5 731-63M603 493L539 269 237 261 370 105M902 382L539 269M390 382L102 382'/%3E%3Cpath d='M-222 42L126.5 79.5 370 105 539 269 577.5 41.5 927 80 769 229 902 382 603 493 731 737M295-36L577.5 41.5M578 842L295 764M40-201L127 80M102 382L-261 269'/%3E%3C/g%3E%3Cg fill='%23FFFFFF' fill-opacity='0.05'%3E%3Ccircle cx='769' cy='229' r='5'/%3E%3Ccircle cx='539' cy='269' r='5'/%3E%3Ccircle cx='603' cy='493' r='5'/%3E%3Ccircle cx='731' cy='737' r='5'/%3E%3Ccircle cx='520' cy='660' r='5'/%3E%3Ccircle cx='309' cy='538' r='5'/%3E%3Ccircle cx='295' cy='764' r='5'/%3E%3Ccircle cx='40' cy='599' r='5'/%3E%3Ccircle cx='102' cy='382' r='5'/%3E%3Ccircle cx='127' cy='80' r='5'/%3E%3Ccircle cx='370' cy='105' r='5'/%3E%3Ccircle cx='578' cy='42' r='5'/%3E%3Ccircle cx='237' cy='261' r='5'/%3E%3Ccircle cx='390' cy='382' r='5'/%3E%3C/g%3E%3C/svg%3E")
  `,
  backgroundSize: '250px 250px, 500px 500px',
  backgroundPosition: '0 0, 50px 50px',
  animation: 'floatingBg 60s ease-in-out infinite alternate'
};

// Plant elements for decoration - with limited size to avoid overflow
const PlantElements = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Top left corner plant */}
      <div className="absolute top-0 left-0 w-64 h-64 z-0 opacity-30" style={{ 
        transform: 'rotate(10deg) translate(-20%, -20%)' 
      }}>
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 20C80 40 70 60 70 100C70 140 80 160 100 180C120 160 130 140 130 100C130 60 120 40 100 20Z" fill="white" fillOpacity="0.2" style={{ animation: 'petal1 7s ease-in-out infinite' }} />
          <path d="M160 80C140 70 120 70 100 100C80 130 80 150 100 170C120 150 130 130 160 120C190 110 180 90 160 80Z" fill="white" fillOpacity="0.2" style={{ animation: 'petal2 8s ease-in-out infinite' }} />
          <path d="M40 80C60 70 80 70 100 100C120 130 120 150 100 170C80 150 70 130 40 120C10 110 20 90 40 80Z" fill="white" fillOpacity="0.2" style={{ animation: 'petal2 8s ease-in-out infinite' }} />
        </svg>
      </div>

      {/* Bottom right corner plant */}
      <div className="absolute bottom-0 right-0 w-80 h-80 z-0 opacity-30" style={{ 
        transform: 'rotate(-10deg) translate(20%, 20%)' 
      }}>
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 100C40 80 60 70 100 70C140 70 160 80 180 100C160 120 140 130 100 130C60 130 40 120 20 100Z" fill="white" fillOpacity="0.2" style={{ animation: 'petal1 9s ease-in-out infinite' }} />
          <path d="M80 160C70 140 70 120 100 100C130 80 150 80 170 100C150 120 130 130 120 160C110 190 90 180 80 160Z" fill="white" fillOpacity="0.2" style={{ animation: 'petal3 7s ease-in-out infinite' }} />
          <path d="M80 40C90 60 90 80 60 100C30 120 10 120 -10 100C10 80 30 70 40 40C50 10 70 20 80 40Z" fill="white" fillOpacity="0.15" style={{ animation: 'petal3 8s ease-in-out infinite' }} />
        </svg>
      </div>

      {/* Center small flowers */}
      <div className="absolute top-1/2 left-1/4 w-24 h-24 z-0 opacity-20" style={{ 
        transform: 'translateY(-50%)' 
      }}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="10" fill="white" />
          <path d="M50 20C45 30 40 40 50 50C60 40 55 30 50 20Z" fill="white" style={{ animation: 'petal3 4s ease-in-out infinite' }} />
          <path d="M50 80C55 70 60 60 50 50C40 60 45 70 50 80Z" fill="white" style={{ animation: 'petal3 4s ease-in-out infinite' }} />
          <path d="M20 50C30 55 40 60 50 50C40 40 30 45 20 50Z" fill="white" style={{ animation: 'petal3 4s ease-in-out infinite' }} />
          <path d="M80 50C70 45 60 40 50 50C60 60 70 55 80 50Z" fill="white" style={{ animation: 'petal3 4s ease-in-out infinite' }} />
        </svg>
      </div>

      {/* Right mid flowers */}
      <div className="absolute top-1/3 right-10 w-32 h-32 z-0 opacity-25" style={{ 
        transform: 'rotate(15deg)' 
      }}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="8" fill="white" />
          <path d="M50 20C40 30 35 40 50 50C65 40 60 30 50 20Z" fill="white" style={{ animation: 'petal1 5s ease-in-out infinite' }} />
          <path d="M50 80C60 70 65 60 50 50C35 60 40 70 50 80Z" fill="white" style={{ animation: 'petal1 5s ease-in-out infinite' }} />
          <path d="M20 50C30 60 40 65 50 50C40 35 30 40 20 50Z" fill="white" style={{ animation: 'petal1 5s ease-in-out infinite' }} />
          <path d="M80 50C70 40 60 35 50 50C60 65 70 60 80 50Z" fill="white" style={{ animation: 'petal1 5s ease-in-out infinite' }} />
        </svg>
      </div>
    </div>
  );
};

const AuthBackground: React.FC<AuthBackgroundProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 overflow-hidden" style={flowerPatternStyle}>
      <div style={plantDecorationsStyle}></div>
      <PlantElements />
      <div className="relative z-10 flex justify-center items-center">
        {children}
      </div>
    </div>
  );
};

export default AuthBackground; 