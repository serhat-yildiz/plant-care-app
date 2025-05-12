import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PlantCard from '../components/PlantCard';
import type { Plant, PlantHealth } from '../types/types';
import { api } from '../lib/data';

const Dashboard = () => {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [healthData, setHealthData] = useState<Record<string, number>>({});

  // Get plants
  useEffect(() => {
    const fetchPlants = async () => {
      try {
        setLoading(true);
        
        // Static data API call
        const data = await api.getPlants();
        
        if (data) {
          setPlants(data);
          // Get plant health data
          await fetchHealthData(data.map((p: Plant) => p.id));
        }
      } catch (error) {
        console.error('Error loading plants:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlants();
  }, []);

  // Get plant health data
  const fetchHealthData = async (plantIds: string[]) => {
    if (plantIds.length === 0) return;
    
    try {
      // Get health data for each plant from static API
      const promises = plantIds.map(id => api.getPlantHealthData(id));
      
      const results = await Promise.all(promises);
      
      // Calculate latest health score per plant
      const latestHealthByPlant: Record<string, number> = {};
      
      results.forEach((data, index) => {
        if (data && data.length > 0) {
          // Get health record with the latest date
          const latestRecord = data.sort((a: PlantHealth, b: PlantHealth) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
          )[0];
          
          latestHealthByPlant[plantIds[index]] = latestRecord.health_score;
        }
      });

      setHealthData(latestHealthByPlant);
    } catch (error) {
      console.error('Error loading health data:', error);
    }
  };

  // Delete plant
  const handleDeletePlant = async (id: string) => {
    try {
      // Delete plant using static API
      await api.deletePlant(id);
      
      // Update UI after successful deletion
      setPlants(plants.filter(plant => plant.id !== id));
    } catch (error) {
      console.error('Error deleting plant:', error);
    }
  };

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

  return (
    <div className="pb-10">
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 mb-8 shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">My Plants</h1>
            <p className="text-gray-600">
              You are tracking <span className="font-semibold text-green-600">{plants.length}</span> plants in total
            </p>
          </div>
          <Link
            to="/plants/new"
            className="inline-flex items-center bg-gradient-to-r from-green-600 to-emerald-500 text-white font-medium py-2 px-4 rounded-lg shadow-sm hover:shadow-md transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Plant
          </Link>
        </div>
      </div>

      {plants.length === 0 ? (
        <div className="bg-white shadow-md rounded-xl p-8 text-center border border-gray-100">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold mb-2 text-gray-800">You haven't added any plants yet</h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            You need to add at least one plant to start tracking. You can start by adding a new plant.
          </p>
          <Link
            to="/plants/new"
            className="inline-flex items-center bg-gradient-to-r from-green-600 to-emerald-500 text-white font-medium py-3 px-6 rounded-lg shadow-sm hover:shadow-md transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Your First Plant
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plants.map(plant => (
            <PlantCard
              key={plant.id}
              plant={plant}
              healthScore={healthData[plant.id] || 0}
              onDelete={handleDeletePlant}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard; 