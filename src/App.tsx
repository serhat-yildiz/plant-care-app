import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth, SignIn, SignUp } from '@clerk/clerk-react';
import './App.css';
import Dashboard from './pages/Dashboard';
import Header from './components/Header';
import PlantForm from './pages/PlantForm';
import Sidebar from './components/Sidebar';
import PlantDetail from './pages/PlantDetail';
import LocationDetail from './pages/LocationDetail';
import Profile from './pages/Profile';
import AuthBackground from './components/backgrounds/AuthBackground';
import Weather from './pages/Weather';

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isSignedIn, isLoaded } = useAuth();
  
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-50 to-emerald-50">
        <div className="text-center">
          <div className="mb-6 relative">
            <div className="w-24 h-24 rounded-full bg-green-100 animate-pulse mx-auto flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
              <div className="flex space-x-1.5">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-3 h-3 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-3 h-3 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
          <h2 className="text-xl font-semibold text-green-700">Loading your plants...</h2>
          <p className="text-green-600 mt-1">Please wait while we grow your experience</p>
        </div>
      </div>
    );
  }
  
  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Custom appearance for Clerk components to match the app's design
const clerkAppearance = {
  layout: {
    logoPlacement: 'inside' as const,
    logoImageUrl: 'https://cdn-icons-png.flaticon.com/512/628/628324.png',
    showOptionalFields: true,
    socialButtonsVariant: 'iconButton' as const
  },
  elements: {
    rootBox: {
      backgroundColor: 'white',
      borderRadius: '0.75rem',
      maxWidth: '450px',
      width: '100%',
      boxSizing: 'border-box',
      overflow: 'visible'
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '0.75rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      margin: '0 auto',
      maxHeight: 'none'
    },
    header: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#166534' // dark green color
    },
    formButtonPrimary: {
      backgroundColor: '#16a34a', // green-600
      color: 'white',
      fontWeight: 'medium',
      borderRadius: '0.375rem',
      transition: 'all 150ms ease-in-out',
      '&:hover': {
        backgroundColor: '#15803d' // green-700
      },
      '&:focus': {
        outline: 'none',
        boxShadow: '0 0 0 3px rgba(22, 163, 74, 0.5)' // green-600 with opacity
      }
    },
    formFieldLabel: {
      color: '#334155', // slate-700
      fontSize: '0.875rem',
      fontWeight: '500'
    },
    formFieldInput: {
      color: '#1e293b', // slate-800
      borderRadius: '0.375rem',
      borderColor: '#cbd5e1', // slate-300
      '&:focus': {
        borderColor: '#16a34a', // green-600
        boxShadow: '0 0 0 1px rgba(22, 163, 74, 0.5)' // green-600 with opacity
      }
    },
    identityPreview: {
      borderRadius: '0.375rem',
      borderColor: '#e5e7eb' // gray-200
    },
    footerActionLink: {
      color: '#16a34a', // green-600
      '&:hover': {
        color: '#15803d' // green-700
      }
    }
  }
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Authentication pages */}
        <Route path="/login" element={
          <AuthBackground>
            <SignIn 
              routing="path" 
              path="/login" 
              appearance={clerkAppearance}
              signUpUrl="/register"
            />
          </AuthBackground>
        } />
        <Route path="/register" element={
          <AuthBackground>
            <SignUp 
              routing="path" 
              path="/register" 
              appearance={clerkAppearance}
              signInUrl="/login"
            />
          </AuthBackground>
        } />
        
        {/* Main application - protected by Clerk */}
        <Route path="/*" element={
          <ProtectedRoute>
            <div className="flex h-screen bg-gray-100">
              <Sidebar />
              <div className="flex flex-col flex-1 overflow-hidden">
                <Header />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 md:p-6">
                  <div className="container mx-auto">
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/plants/new" element={<PlantForm />} />
                      <Route path="/plants/edit/:id" element={<PlantForm />} />
                      <Route path="/plants/:id" element={<PlantDetail />} />
                      <Route path="/locations/:id" element={<LocationDetail />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/weather" element={<Weather />} />
                    </Routes>
                  </div>
                </main>
              </div>
            </div>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
