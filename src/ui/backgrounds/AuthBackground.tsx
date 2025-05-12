import React from 'react';

interface AuthBackgroundProps {
  children: React.ReactNode;
}

const AuthBackground: React.FC<AuthBackgroundProps> = ({ children }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 auth-background">
      {/* Animated background SVG decoration */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Top left decorative elements */}
        <svg className="absolute top-0 left-0 h-64 w-64 text-green-100" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M40 80C40 97.6731 30.7696 113.6633 15.811 123.3012C0.8525 132.9391 -15.811 134.6383 -30 128C-44.189 121.3617 -54 107.6731 -54 90C-54 72.3269 -44.189 58.6383 -30 52C-15.811 45.3617 0.8525 47.0609 15.811 56.6988C30.7696 66.3367 40 82.3269 40 80Z" fill="currentColor" style={{ animation: 'petal1 15s infinite ease-in-out' }} />
        </svg>
        
        {/* Bottom right decorative elements */}
        <svg className="absolute bottom-0 right-0 h-64 w-64 text-green-100" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M160 120C160 137.673 150.77 153.663 135.811 163.301C120.853 172.939 104.189 174.638 90 168C75.811 161.362 66 147.673 66 130C66 112.327 75.811 98.6383 90 92C104.189 85.3617 120.853 87.0609 135.811 96.6988C150.77 106.337 160 122.327 160 120Z" fill="currentColor" style={{ animation: 'petal2 18s infinite ease-in-out' }} />
        </svg>
        
        {/* Plant stem patterns */}
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, #4ade80 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, #22c55e 0%, transparent 50%)
            `,
            backgroundSize: '50% 50%',
            animation: 'floatingBg 30s infinite ease-in-out'
          }}
        />
        
        {/* Decorative leaves */}
        <div className="absolute top-1/4 right-1/4 transform rotate-45 leaf-shadow">
          <svg width="120" height="120" viewBox="0 0 24 24" className="text-green-300" style={{ animation: 'petal3 8s infinite ease-in-out' }}>
            <path fill="currentColor" d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" />
          </svg>
        </div>
        
        <div className="absolute bottom-1/4 left-1/3 transform -rotate-15 leaf-shadow">
          <svg width="80" height="80" viewBox="0 0 24 24" className="text-green-200" style={{ animation: 'petal1 12s infinite ease-in-out' }}>
            <path fill="currentColor" d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" />
          </svg>
        </div>
      </div>
      
      {/* The actual content */}
      <div className="relative z-10 w-full">
        {children}
      </div>
    </div>
  );
};

export default AuthBackground; 