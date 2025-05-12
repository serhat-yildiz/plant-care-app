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
import ResetPassword from './pages/ResetPassword';
import UpdatePassword from './pages/UpdatePassword';
import AuthBackground from './components/backgrounds/AuthBackground';

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isSignedIn, isLoaded } = useAuth();
  
  if (!isLoaded) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
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
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/update-password" element={<UpdatePassword />} />
        
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
