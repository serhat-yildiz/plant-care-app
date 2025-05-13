import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SignIn, SignUp } from '@clerk/clerk-react';
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
import { clerkAppearance } from './lib/config';
import { ProtectedRoute } from './lib/routes';
import NotFound from './components/NotFound';

function App() {
  return (
    <Router>
      <Routes>
        {/* Authentication pages */}
        <Route path="/login" element={
          <AuthBackground>
            <SignIn 
              routing="hash" 
              appearance={clerkAppearance}
              signUpUrl="/register"
              redirectUrl="/"
              // OAuth optimization
              afterSignInUrl="/"
              // Enable auto handling of OAuth accounts
              oauthFlow="auto"
              // Enable email authentication properly
              signInUrl="/login"
              afterSignUpUrl="/"
            />
          </AuthBackground>
        } />
        <Route path="/register" element={
          <AuthBackground>
            <SignUp 
              routing="hash" 
              appearance={clerkAppearance}
              signInUrl="/login"
              redirectUrl="/"
              afterSignUpUrl="/"
              // Enable auto handling of OAuth accounts
              oauthFlow="auto"
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
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </div>
                </main>
              </div>
            </div>
          </ProtectedRoute>
        } />
        
        {/* 404 Page - For non-authenticated routes that don't exist */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
