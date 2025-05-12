import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Dashboard from './pages/Dashboard';
import Header from './components/Header';
import PlantForm from './pages/PlantForm';
import Sidebar from './components/Sidebar';
import PlantDetail from './pages/PlantDetail';
import LocationDetail from './pages/LocationDetail';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import ResetPassword from './pages/ResetPassword';
import UpdatePassword from './pages/UpdatePassword';

function App() {
  return (
    <Router>
      <Routes>
        {/* Authentication pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/update-password" element={<UpdatePassword />} />
        
        {/* Main application */}
        <Route path="/*" element={
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
        } />
      </Routes>
    </Router>
  );
}

export default App;
