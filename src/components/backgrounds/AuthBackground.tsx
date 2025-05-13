import React from 'react';

interface AuthBackgroundProps {
  children: React.ReactNode;
}

// Updated to white background with subtle pattern
const backgroundStyle = {
  backgroundColor: '#ffffff',
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2316a34a' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
  position: 'relative' as const
};

// Enhanced leaf decorations
const EnhancedPlantElements = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Top left decorative plant */}
      <div className="absolute top-0 left-0 w-64 h-64 z-0 opacity-60" style={{ 
        transform: 'rotate(15deg) translate(-20%, -20%)' 
      }}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M70 30C50 10 20 20 20 50C20 80 50 90 70 70C90 50 90 50 70 30Z" fill="#16a34a" fillOpacity="0.2" />
          <path d="M65 35C50 20 25 25 25 50C25 75 50 85 65 70C80 55 80 50 65 35Z" fill="#16a34a" fillOpacity="0.3" />
        </svg>
      </div>

      {/* Bottom right decorative plant */}
      <div className="absolute bottom-0 right-0 w-72 h-72 z-0 opacity-60" style={{ 
        transform: 'rotate(-25deg) translate(25%, 20%)' 
      }}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M30 70C50 90 80 80 80 50C80 20 50 10 30 30C10 50 10 50 30 70Z" fill="#16a34a" fillOpacity="0.2" />
          <path d="M35 65C50 80 75 75 75 50C75 25 50 15 35 30C20 45 20 50 35 65Z" fill="#16a34a" fillOpacity="0.3" />
        </svg>
      </div>
      
      {/* Small decorative elements */}
      <div className="absolute top-1/4 right-1/3 w-24 h-24 z-0 opacity-60" style={{ 
        transform: 'rotate(45deg)' 
      }}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="8" fill="#16a34a" fillOpacity="0.3" />
          <path d="M50 25C45 35 40 40 50 50C60 40 55 35 50 25Z" fill="#16a34a" fillOpacity="0.2" />
          <path d="M50 75C55 65 60 60 50 50C40 60 45 65 50 75Z" fill="#16a34a" fillOpacity="0.2" />
          <path d="M25 50C35 55 40 60 50 50C40 40 35 45 25 50Z" fill="#16a34a" fillOpacity="0.2" />
          <path d="M75 50C65 45 60 40 50 50C60 60 65 55 75 50Z" fill="#16a34a" fillOpacity="0.2" />
        </svg>
      </div>
      
      <div className="absolute bottom-1/4 left-1/4 w-20 h-20 z-0 opacity-50" style={{ 
        transform: 'rotate(-15deg)' 
      }}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="6" fill="#16a34a" fillOpacity="0.3" />
          <path d="M50 25C42 35 38 40 50 50C62 40 58 35 50 25Z" fill="#16a34a" fillOpacity="0.2" />
          <path d="M50 75C58 65 62 60 50 50C38 60 42 65 50 75Z" fill="#16a34a" fillOpacity="0.2" />
          <path d="M25 50C35 58 40 62 50 50C40 38 35 42 25 50Z" fill="#16a34a" fillOpacity="0.2" />
          <path d="M75 50C65 42 60 38 50 50C60 62 65 58 75 50Z" fill="#16a34a" fillOpacity="0.2" />
        </svg>
      </div>
    </div>
  );
};

// App info section
const AppInfoSection = () => {
  return (
    <div className="p-6 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg z-10 max-w-md">
      <div className="flex items-center mb-4">
        <div className="p-2 bg-green-100 rounded-full mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-800">Plant Care Assistant</h1>
      </div>
      
      <p className="text-gray-600 mb-4">
        Smart tracking application that makes caring for your plants easier with weather data support.
      </p>
      
      <div className="space-y-3">
        <div className="flex items-start">
          <div className="flex-shrink-0 h-5 w-5 text-green-500 mt-1">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="ml-2 text-sm text-gray-600">Smart watering reminders and customized care calendar</p>
        </div>
        
        <div className="flex items-start">
          <div className="flex-shrink-0 h-5 w-5 text-green-500 mt-1">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="ml-2 text-sm text-gray-600">Plant care recommendations integrated with weather data</p>
        </div>
        
        <div className="flex items-start">
          <div className="flex-shrink-0 h-5 w-5 text-green-500 mt-1">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="ml-2 text-sm text-gray-600">Detailed plant health analysis and charts</p>
        </div>
      </div>
    </div>
  );
};

const AuthBackground: React.FC<AuthBackgroundProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 overflow-hidden" style={backgroundStyle}>
      <EnhancedPlantElements />
      
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
          <AppInfoSection />
          
          <div className="relative z-10 w-full max-w-md">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthBackground; 