import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Location, Plant } from '../types/types';
import { api } from '../lib/data';
import PlantCard from '../components/PlantCard';

const LocationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [location, setLocation] = useState<Location | null>(null);
  const [plants, setPlants] = useState<Plant[]>([]);
  const [healthData, setHealthData] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocationData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);
        
        // Lokasyon bilgilerini al
        const locationData = await api.getLocationById(id);
        
        if (locationData) {
          setLocation(locationData);
          
          // Bu lokasyondaki bitkileri al
          const locationPlants = await api.getPlantsByLocation(id);
          
          setPlants(locationPlants);
          
          // Bitkilerin sağlık verilerini getir
          if (locationPlants.length > 0) {
            // Her bitki için sağlık verilerini al
            const healthScores: Record<string, number> = {};
            
            await Promise.all(
              locationPlants.map(async (plant) => {
                const healthData = await api.getPlantHealthData(plant.id);
                if (healthData.length > 0) {
                  // En son sağlık verisi
                  const latestHealth = healthData.sort((a, b) => 
                    new Date(b.date).getTime() - new Date(a.date).getTime()
                  )[0];
                  healthScores[plant.id] = latestHealth.health_score;
                }
              })
            );
            
            setHealthData(healthScores);
          }
        } else {
          setError('Lokasyon bulunamadı.');
        }
      } catch (error) {
        console.error('Lokasyon verileri yüklenirken hata oluştu:', error);
        setError('Lokasyon verileri yüklenemedi. Lütfen tekrar deneyin.');
      } finally {
        setLoading(false);
      }
    };

    fetchLocationData();
  }, [id]);

  // Bitki silme
  const handleDeletePlant = async (plantId: string) => {
    try {
      await api.deletePlant(plantId);
      
      // Başarılı silme sonrası UI güncelleme
      setPlants(plants.filter(plant => plant.id !== plantId));
    } catch (error) {
      console.error('Bitki silinirken hata oluştu:', error);
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
          <p className="text-green-600 font-medium">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error || !location) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {error || 'Lokasyon bulunamadı.'}
      </div>
    );
  }

  return (
    <div className="pb-10">
      <div className="mb-6">
        <Link to="/" className="flex items-center text-green-600 hover:text-green-700 font-medium">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Ana Sayfaya Dön
        </Link>
      </div>
      
      <div className="bg-gradient-to-r from-green-50 to-green-200 rounded-xl p-6 mb-8 shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center">
              <div className="bg-green-500 rounded-lg p-2 mr-3 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-1">{location.name}</h1>
                <p className="text-gray-600">
                  {location.city}, {location.country}
                </p>
              </div>
            </div>
          </div>
          <div className="text-gray-600 bg-white px-4 py-2 rounded-lg shadow-sm">
            <p className="text-sm">Coordinates:</p>
            <p className="font-mono text-xs">{location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}</p>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Bu Lokasyondaki Bitkiler</h2>
        
        {plants.length === 0 ? (
          <div className="bg-white shadow-md rounded-xl p-8 text-center border border-gray-100">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold mb-2 text-gray-800">Bu lokasyonda bitki bulunmuyor</h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Bu lokasyona henüz bir bitki eklenmemiş. Yeni bir bitki ekleyerek başlayabilirsiniz.
            </p>
            <Link
              to="/plants/new"
              className="inline-flex items-center bg-gradient-to-r from-green-600 to-emerald-500 text-white font-medium py-3 px-6 rounded-lg shadow-sm hover:shadow-md transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Yeni Bitki Ekle
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
    </div>
  );
};

export default LocationDetail; 