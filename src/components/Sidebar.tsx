import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import type { Location as LocationType } from '../types/types';
import { api } from '../lib/data';

const Sidebar = () => {
  const location = useLocation();
  const [locations, setLocations] = useState<LocationType[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load locations
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        const data = await api.getLocations();
        setLocations(data);
      } catch (error) {
        console.error('Error loading locations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Check active link
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Plant tips list
  const plantTips = [
    "Most indoor plants prefer temperatures between 65-75°F (18-24°C).",
    "Water plants regularly, but wait until the soil dries out before watering again.",
    "Cleaning leaves helps maintain plant health and improves photosynthesis.",
    "Update your plant care routine during seasonal changes.",
    "Some plants need less water than others, create a suitable watering schedule for each plant."
  ];

  // Select a random plant tip
  const randomTip = plantTips[Math.floor(Math.random() * plantTips.length)];

  return (
    <>
      {/* Mobile menu button */}
      <button 
        className="md:hidden fixed right-4 bottom-4 z-20 text-white bg-green-600 rounded-full p-2 shadow-md"
        onClick={toggleSidebar}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>

      {/* Sidebar */}
      <aside 
        className={`bg-white shadow-xl w-64 fixed md:static inset-y-0 left-0 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition duration-200 ease-in-out z-10 overflow-y-auto h-full`}
      >
        <div className="flex flex-col h-full">
          <div className="p-5 bg-gradient-to-b from-green-50 to-white">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-400 rounded-full flex items-center justify-center shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
            <h2 className="text-center text-xl font-bold text-gray-800">Plant Tracker</h2>
            <p className="text-center text-sm text-gray-500 mt-1">Take Care of Your Plants</p>
          </div>
          
          <nav className="p-4 flex-1">
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider pl-2 mb-2">Main Menu</p>
              <Link 
                to="/" 
                className={`flex items-center p-3 rounded-lg transition-colors ${
                  isActive('/') 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-400 text-white shadow-md' 
                    : 'text-gray-700 hover:bg-green-50'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
                Home
              </Link>

              <Link 
                to="/plants/new" 
                className={`flex items-center p-3 rounded-lg transition-colors ${
                  isActive('/plants/new') 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-400 text-white shadow-md' 
                    : 'text-gray-700 hover:bg-green-50'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Add New Plant
              </Link>

              <Link 
                to="/weather" 
                className={`flex items-center p-3 rounded-lg transition-colors ${
                  isActive('/weather') 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-400 text-white shadow-md' 
                    : 'text-gray-700 hover:bg-green-50'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
                </svg>
                Weather
              </Link>
            </div>

            <div className="mt-8">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider pl-2 mb-2">Locations</p>
              {loading ? (
                <div className="text-center p-3">
                  <div className="animate-pulse w-10 h-10 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-500">Loading...</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {locations.map(loc => (
                    <Link 
                      key={loc.id}
                      to={`/locations/${loc.id}`}
                      className={`flex items-center p-3 rounded-lg transition-colors ${
                        isActive(`/locations/${loc.id}`) 
                          ? 'bg-gradient-to-r from-green-500 to-emerald-400 text-white shadow-md' 
                          : 'text-gray-700 hover:bg-green-50'
                      }`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                      {loc.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>
          
          <div className="p-4 border-t border-gray-200">
            <div className="bg-green-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 font-medium">Plant Tip</p>
              <p className="text-sm text-gray-700 mt-1">{randomTip}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar; 