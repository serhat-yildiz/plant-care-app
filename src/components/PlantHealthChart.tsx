import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import type { ChartData, ChartOptions } from 'chart.js';
import type { PlantHealth, Plant, Location } from '../types/types';
import { updatePlantHealthWithWeather } from '../lib/weatherApi';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface PlantHealthChartProps {
  plant: Plant;
  location: Location;
}

const PlantHealthChart: React.FC<PlantHealthChartProps> = ({ plant, location }) => {
  const [healthData, setHealthData] = useState<PlantHealth[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Date range state
  const [startDate, setStartDate] = useState<string>(() => {
    const date = new Date();
    date.setDate(date.getDate() - 30); // Default to 30 days ago
    return date.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0]; // Today
  });

  useEffect(() => {
    const fetchHealthData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get health data based on weather for the date range
        const data = await updatePlantHealthWithWeather(
          plant.id,
          plant.weekly_water_need,
          plant.expected_humidity,
          location.latitude,
          location.longitude,
          startDate,
          endDate
        );
        
        setHealthData(data);
      } catch (error) {
        console.error('Error fetching health data:', error);
        setError('Could not load plant health data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (plant && location) {
      fetchHealthData();
    }
  }, [plant, location, startDate, endDate]);

  const chartData: ChartData<'line'> = {
    labels: healthData.map(data => data.date),
    datasets: [
      {
        label: 'Health Score',
        data: healthData.map(data => data.health_score),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.2
      },
      {
        label: 'Actual Water (mm)',
        data: healthData.map(data => data.actual_water),
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        tension: 0.2,
        yAxisID: 'y1'
      },
      {
        label: 'Actual Humidity (%)',
        data: healthData.map(data => data.actual_humidity),
        borderColor: 'rgb(153, 102, 255)',
        backgroundColor: 'rgba(153, 102, 255, 0.5)',
        tension: 0.2,
        yAxisID: 'y1'
      }
    ]
  };

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Health Score (0-100)'
        },
        min: 0,
        max: 100
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
          text: 'Water (mm) / Humidity (%)'
        }
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `Health Data for ${plant.name}`,
      },
    },
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'startDate') {
      setStartDate(value);
    } else if (name === 'endDate') {
      setEndDate(value);
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
          <p className="text-green-600 font-medium">Loading health data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-sm">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="mb-6 bg-gray-50 p-4 rounded-md">
        <h2 className="text-lg font-medium text-gray-800 mb-2">Plant Health Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-3 rounded-md border border-gray-200">
            <div className="text-sm font-medium text-gray-500">Weekly Water Need</div>
            <div className="mt-1 flex items-end">
              <span className="text-2xl font-semibold text-gray-800">{plant.weekly_water_need}</span>
              <span className="ml-1 text-gray-600 text-sm">mm</span>
            </div>
          </div>
          <div className="bg-white p-3 rounded-md border border-gray-200">
            <div className="text-sm font-medium text-gray-500">Expected Humidity</div>
            <div className="mt-1 flex items-end">
              <span className="text-2xl font-semibold text-gray-800">{plant.expected_humidity}</span>
              <span className="ml-1 text-gray-600 text-sm">%</span>
            </div>
          </div>
          <div className="bg-white p-3 rounded-md border border-gray-200">
            <div className="text-sm font-medium text-gray-500">Current Health Score</div>
            <div className="mt-1 flex items-end">
              <span className="text-2xl font-semibold text-gray-800">
                {healthData.length > 0 ? healthData[healthData.length - 1].health_score : 'N/A'}
              </span>
              <span className="ml-1 text-gray-600 text-sm">/ 100</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 space-y-4 md:space-y-0">
        <h2 className="text-xl font-bold text-gray-800">Health History</h2>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={startDate}
              onChange={handleDateChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={endDate}
              onChange={handleDateChange}
              min={startDate}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-md mb-4">
        <p className="text-sm text-gray-600">
          This chart shows how your plant's health has been affected by actual weather conditions compared to
          its expected needs over the selected time period.
        </p>
      </div>

      <div className="h-80">
        {healthData.length > 0 ? (
          <Line options={chartOptions} data={chartData} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">No health data available for the selected date range.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlantHealthChart; 