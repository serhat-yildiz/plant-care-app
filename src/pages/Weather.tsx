import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/data';
import { fetchHistoricalWeather } from '../lib/weatherApi';
import type { Location, Plant, WeatherData } from '../types/types';

// Weather data type for location
interface LocationWeather {
  location: Location;
  weather: WeatherData[];
  plants: Plant[];
}

const Weather = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [locationWeather, setLocationWeather] = useState<LocationWeather[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days ago
    endDate: new Date().toISOString().split('T')[0], // today
  });

  // Load all locations
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await api.getLocations();
        if (data) {
          setLocations(data);
        }
      } catch (error) {
        console.error('Error loading locations:', error);
        setError('Could not load locations. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchLocations();
  }, []);

  // Load weather and plant data for each location
  useEffect(() => {
    const fetchWeatherAndPlants = async () => {
      if (locations.length === 0) return;
      
      try {
        setLoading(true);
        
        // Get data for all plants
        const plants = await api.getPlants();
        
        // Get weather for each location
        const weatherPromises = locations.map(async (location) => {
          console.log(`Weather page: Fetching weather for ${location.name} at ${location.latitude}, ${location.longitude}`);
          
          let weather = await fetchHistoricalWeather(
            location.latitude,
            location.longitude,
            dateRange.startDate,
            dateRange.endDate
          );
          
          console.log(`Weather page: Received ${weather.length} days of data for ${location.name}`);
          
          // If no data, show test data
          if (weather.length === 0) {
            console.warn(`No weather data for ${location.name}, generating test data`);
            
            // Generate test data
            const dummyData: WeatherData[] = [];
            const startDateObj = new Date(dateRange.startDate);
            const endDateObj = new Date(dateRange.endDate);
            const dayDiff = Math.floor((endDateObj.getTime() - startDateObj.getTime()) / (1000 * 60 * 60 * 24));
            
            for (let i = 0; i <= dayDiff; i++) {
              const date = new Date(startDateObj);
              date.setDate(date.getDate() + i);
              dummyData.push({
                date: date.toISOString().split('T')[0],
                precipitation: Math.random() * 5, // 0-5mm range
                relative_humidity: 40 + Math.random() * 40 // 40-80% range
              });
            }
            
            weather = dummyData;
          }
          
          // Find plants in this location
          const locationPlants = plants.filter((plant: Plant) => plant.location_id === location.id);
          
          return {
            location,
            weather,
            plants: locationPlants
          };
        });
        
        const results = await Promise.all(weatherPromises);
        setLocationWeather(results);
      } catch (error) {
        console.error('Error loading weather data:', error);
        setError('Could not load weather data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchWeatherAndPlants();
  }, [locations, dateRange.startDate, dateRange.endDate]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDateRange(prev => ({ ...prev, [name]: value }));
  };

  // Calculate plant-weather compatibility
  const calculatePlantWeatherCompatibility = (plant: Plant, weather: WeatherData[]) => {
    if (!weather || weather.length === 0) return null;
    
    const lastDay = weather[weather.length - 1];
    const humidityDiff = Math.abs(lastDay.relative_humidity - plant.expected_humidity);
    
    // Score based on humidity difference
    if (humidityDiff <= 10) {
      return {
        score: 'Excellent',
        color: 'text-green-600'
      };
    } else if (humidityDiff <= 20) {
      return {
        score: 'Good',
        color: 'text-yellow-600'
      };
    } else {
      return {
        score: 'Not Suitable',
        color: 'text-red-600'
      };
    }
  };

  if (loading && locations.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
            </svg>
          </div>
          <p className="text-blue-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {error}
      </div>
    );
  }

  return (
    <div className="pb-10">
      <div className="bg-gradient-to-r from-blue-50 to-sky-50 rounded-xl p-6 mb-8 shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Weather Monitoring</h1>
            <p className="text-gray-600">
              Weather and plant compatibility for all locations
            </p>
          </div>
          <Link
            to="/"
            className="flex items-center text-blue-600 hover:text-blue-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Return to Home
          </Link>
        </div>
      </div>

      {/* Date selection */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <h2 className="text-lg font-semibold mb-4">Select Date Range</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="startDate">
              Start Date
            </label>
            <input
              id="startDate"
              name="startDate"
              type="date"
              value={dateRange.startDate}
              onChange={handleDateChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="endDate">
              End Date
            </label>
            <input
              id="endDate"
              name="endDate"
              type="date"
              value={dateRange.endDate}
              onChange={handleDateChange}
              min={dateRange.startDate}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center h-20 bg-white p-4 rounded-lg shadow-md mb-6">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-blue-600">Loading weather data...</span>
        </div>
      )}

      {/* Weather cards */}
      <div className="space-y-8">
        {locationWeather.map(({ location, weather, plants }) => (
          <div key={location.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-blue-50 p-4 border-b border-blue-100">
              <h2 className="text-xl font-bold text-gray-800">{location.name}</h2>
              <p className="text-gray-600 text-sm">{location.city}, {location.country}</p>
            </div>
            
            {weather.length > 0 ? (
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-3">Recent Weather</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {weather.slice(-3).reverse().map((day, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-sm font-medium text-gray-500 mb-2">
                        {new Date(day.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="bg-blue-100 p-2 rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                          </svg>
                        </div>
                        <div>
                          <div className="flex items-center">
                            <span className="text-blue-600 font-medium">Humidity:</span>
                            <span className="ml-2">{day.relative_humidity.toFixed(1)}%</span>
                          </div>
                          <div className="flex items-center">
                            <span className="text-green-600 font-medium">Precipitation:</span>
                            <span className="ml-2">{day.precipitation.toFixed(1)} mm</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {plants.length > 0 ? (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Plant Compatibility</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Plant Name
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Species
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Expected Humidity
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Expected Water
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Compatibility
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {plants.map(plant => {
                            const compatibility = calculatePlantWeatherCompatibility(plant, weather);
                            return (
                              <tr key={plant.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="ml-4">
                                      <div className="text-sm font-medium text-gray-900">
                                        <Link to={`/plants/${plant.id}`} className="hover:text-blue-600">
                                          {plant.name}
                                        </Link>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-500">{plant.species}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-500">{plant.expected_humidity}%</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-500">{plant.weekly_water_need} mm/week</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  {compatibility && (
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-opacity-10 ${compatibility.color}`}>
                                      {compatibility.score}
                                    </span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <p className="text-yellow-700">No plants have been added to this location yet.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4">
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-yellow-700">No weather data found for this location.</p>
                </div>
              </div>
            )}
          </div>
        ))}

        {locationWeather.length === 0 && !loading && (
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">No locations found</h2>
            <p className="text-gray-600 mb-4">
              You need to add plant locations first to see weather information.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Weather; 