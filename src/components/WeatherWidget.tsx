import { useState, useEffect } from 'react';
import { fetchHistoricalWeather } from '../lib/weatherApi';
import type { WeatherData } from '../types/types';

interface WeatherWidgetProps {
  latitude: number;
  longitude: number;
  locationName: string;
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ latitude, longitude, locationName }) => {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log(`WeatherWidget: Fetching weather for ${locationName} at ${latitude}, ${longitude}`);

        // Get weather data for the last 7 days
        const endDate = new Date().toISOString().split('T')[0];
        const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        const data = await fetchHistoricalWeather(
          latitude,
          longitude,
          startDate,
          endDate
        );

        console.log(`WeatherWidget: Received ${data.length} days of weather data`);
        
        if (data.length === 0) {
          setError('Weather data not found. Please check coordinates.');
          // Create test data (for development)
          const dummyData: WeatherData[] = [];
          const today = new Date();
          
          for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            dummyData.unshift({
              date: date.toISOString().split('T')[0],
              precipitation: Math.random() * 5, // 0-5mm precipitation range
              relative_humidity: 40 + Math.random() * 40, // 40-80% humidity range
            });
          }
          
          setWeatherData(dummyData);
        } else {
          setWeatherData(data);
        }
      } catch (error) {
        console.error('Error getting weather data:', error);
        setError('Could not load weather data. Please try again.');
        
        // Create test data (for development)
        const dummyData: WeatherData[] = [];
        const today = new Date();
        
        for (let i = 0; i < 7; i++) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          dummyData.unshift({
            date: date.toISOString().split('T')[0],
            precipitation: Math.random() * 5, // 0-5mm precipitation range
            relative_humidity: 40 + Math.random() * 40, // 40-80% humidity range
          });
        }
        
        setWeatherData(dummyData);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [latitude, longitude, locationName]);

  // Get weather for the latest day
  const getLatestWeather = () => {
    if (weatherData.length === 0) return null;
    return weatherData[weatherData.length - 1];
  };

  // Calculate average values
  const getAverages = () => {
    if (weatherData.length === 0) return { avgPrecipitation: 0, avgHumidity: 0 };

    const totalPrecipitation = weatherData.reduce((sum, day) => sum + day.precipitation, 0);
    const totalHumidity = weatherData.reduce((sum, day) => sum + day.relative_humidity, 0);

    return {
      avgPrecipitation: totalPrecipitation / weatherData.length,
      avgHumidity: totalHumidity / weatherData.length
    };
  };

  const latestWeather = getLatestWeather();
  const { avgPrecipitation, avgHumidity } = getAverages();

  if (loading) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
        <div className="h-20 bg-gray-100 rounded mb-3"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  if (error && weatherData.length === 0) {
    return (
      <div className="bg-red-50 p-4 rounded-lg border border-red-200">
        <p className="text-red-600 text-sm">{error}</p>
        <p className="text-red-600 text-xs mt-2">Coordinates: {latitude}, {longitude}</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-5 rounded-lg shadow-md">
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-bold text-lg text-gray-800">Weather</h3>
        <div className="px-2 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-md">
          {locationName}
        </div>
      </div>

      {latestWeather ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-xs text-blue-500 mb-1">Today</div>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
                <div>
                  <div className="font-medium text-blue-700">{new Date(latestWeather.date).toLocaleDateString()}</div>
                  <div className="text-xs text-blue-500">Humidity: {latestWeather.relative_humidity.toFixed(1)}%</div>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-3 rounded-lg">
              <div className="text-xs text-green-500 mb-1">Precipitation</div>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                <div>
                  <div className="font-medium text-green-700">{latestWeather.precipitation.toFixed(1)} mm</div>
                  <div className="text-xs text-green-500">
                    {latestWeather.precipitation > 0 ? 'Rainy' : 'No rain'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-3">
            <div className="text-sm text-gray-500 mb-2">Weekly Averages</div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center">
                <span className="w-3 h-3 bg-blue-400 rounded-full mr-2"></span>
                <span className="text-gray-600">Humidity: {avgHumidity.toFixed(1)}%</span>
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 bg-green-400 rounded-full mr-2"></span>
                <span className="text-gray-600">Precipitation: {avgPrecipitation.toFixed(1)} mm</span>
              </div>
            </div>
          </div>
          
          {error && (
            <div className="mt-2 text-xs text-yellow-600 bg-yellow-50 p-2 rounded">
              {error} (Showing test data)
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-4">
          <p className="text-gray-500">No weather data found</p>
          <p className="text-gray-400 text-xs mt-2">Coordinates: {latitude}, {longitude}</p>
        </div>
      )}
    </div>
  );
};

export default WeatherWidget; 