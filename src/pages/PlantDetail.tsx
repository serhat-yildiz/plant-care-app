import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Plant, Location } from '../types/types';
import { api } from '../lib/data';
import PlantHealthChart from '../components/PlantHealthChart';

const PlantDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [plant, setPlant] = useState<Plant | null>(null);
  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load plant data
  useEffect(() => {
    const fetchPlantData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);
        
        // Get plant data
        const plantData = await api.getPlantById(id);
        
        if (plantData) {
          setPlant(plantData);
          
          // Get location data (if available)
          if (plantData.location_id) {
            const locationData = await api.getLocationById(plantData.location_id);
            if (locationData) {
              setLocation(locationData);
            }
          }
        } else {
          setError('Plant not found.');
        }
      } catch (error) {
        console.error('Error loading plant data:', error);
        setError('Could not load plant data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlantData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 bg-green-200 rounded-full flex items-center justify-center mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
            </svg>
          </div>
          <p className="text-green-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !plant) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {error || 'Plant not found.'}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link to="/" className="flex items-center text-green-600 hover:text-green-700 font-medium">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Plants
        </Link>
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-2xl font-bold text-gray-800">{plant.name}</h1>
          <Link 
            to={`/plants/edit/${plant.id}`}
            className="bg-gradient-to-r from-green-600 to-emerald-500 text-white font-medium py-2 px-4 rounded-lg shadow-sm hover:shadow-md transition-all text-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-green-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Plant Information</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Species:</span>
                <span className="text-gray-800">{plant.species}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Plant Type:</span>
                <span className="text-gray-800">{plant.plant_type}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Weekly Water Need:</span>
                <span className="text-gray-800">{plant.weekly_water_need} mm</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Expected Humidity:</span>
                <span className="text-gray-800">{plant.expected_humidity}%</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Watering Interval:</span>
                <span className="text-gray-800">{plant.watering_interval} days</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Planting Date:</span>
                <span className="text-gray-800">{new Date(plant.planted_date).toLocaleDateString('en-US')}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">Last Watering:</span>
                <span className="text-gray-800">{new Date(plant.last_watering_date).toLocaleDateString('en-US')}</span>
              </div>
            </div>
          </div>
          
          {location && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Location Information</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Name:</span>
                  <span className="text-gray-800">{location.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">City:</span>
                  <span className="text-gray-800">{location.city}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Country:</span>
                  <span className="text-gray-800">{location.country}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Coordinates:</span>
                  <span className="text-gray-800">{location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {location && plant && (
        <div className="mb-6">
          <PlantHealthChart plant={plant} location={location} />
        </div>
      )}
      
      {!location && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg mb-6">
          <div className="flex">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>Health data cannot be displayed without location information. Please add a location to this plant.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlantDetail; 