# Plant Care Application

A modern web application for managing and monitoring plant health using real-time weather data. This application helps users track their plants' well-being across multiple locations, with intelligent health assessments based on local weather conditions.

## Features

- **Plant Management**: Add, edit, and delete plants with detailed metadata
- **Health Monitoring**: Automatic evaluation of plant health based on weather data vs. expected needs
- **Multiple Locations**: Support for plants in different physical locations with location-specific weather data
- **Historical Data**: View and analyze plant health over time with customizable date ranges
- **Weather Integration**: Real-time weather data from Open-Meteo API for accurate plant care recommendations
- **Responsive Design**: Mobile-friendly interface built with React and TailwindCSS
- **User Authentication**: Secure login and registration with Clerk

## Technology Stack

- **Frontend**: React 19, TypeScript, TailwindCSS
- **Backend**: Supabase (PostgreSQL database)
- **Authentication**: Clerk
- **API Integration**: Open-Meteo weather API
- **Charting**: Chart.js with react-chartjs-2
- **Routing**: React Router Dom
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn
- Supabase account
- Clerk account

### Setup

1. Clone the repository:
   ```
   git clone https://github.com/your-username/plant-care-app.git
   cd plant-care-app
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   ```

4. Start the development server:
   ```
   npm run dev
   ```

## Database Schema

The application uses the following data models:

- **Plants**: Type, water needs, expected humidity, location, image
- **Locations**: Name, city, country, geographic coordinates
- **Plant Health**: Historical data on plant health scores, actual weather conditions
- **User**: Authentication and profile information

## Key Features Implementation

### Plant Health Calculation

Plants' health is calculated based on the comparison between expected conditions (water needs, humidity) and actual weather data:

```typescript
export function calculatePlantHealth(
  actualWater: number,
  expectedWater: number,
  actualHumidity: number,
  expectedHumidity: number
): number {
  // Calculate water score (50% of total)
  const waterDifference = Math.abs(actualWater - expectedWater);
  const maxWaterDifference = expectedWater;
  const waterScore = 50 * (1 - Math.min(waterDifference / maxWaterDifference, 1));
  
  // Calculate humidity score (50% of total)
  const humidityDifference = Math.abs(actualHumidity - expectedHumidity);
  const maxHumidityDifference = 50;
  const humidityScore = 50 * (1 - Math.min(humidityDifference / maxHumidityDifference, 1));
  
  // Combined score
  return Math.round(waterScore + humidityScore);
}
```

### Weather Data Integration

The application fetches real-time and historical weather data from the Open-Meteo API:

```typescript
export async function fetchHistoricalWeather(
  latitude: number,
  longitude: number,
  startDate: string,
  endDate: string
): Promise<WeatherData[]> {
  // API integration code
}
```

### Plant Management

Users can add new plants, edit existing ones, and track their health over time. Each plant can be assigned to a specific location and has custom parameters like water needs and expected humidity.

### Multi-Location Support

The application supports multiple locations, each with its own set of plants and weather conditions.

## Project Structure

```
plant-care-app/
├── src/
│   ├── components/       # UI components
│   ├── lib/             # API and utility functions
│   ├── pages/           # Application pages
│   ├── types/           # TypeScript type definitions
│   ├── App.tsx          # Main application component
│   └── main.tsx         # Application entry point
├── public/              # Static assets
├── .env                 # Environment variables (create this)
├── package.json         # Project dependencies
└── README.md            # This file
```

## Deployment

To build the production version:

```
npm run build
```

The built files will be in the `dist` directory, ready for deployment to your preferred hosting service.

## Future Enhancements

- Email notifications for plant care reminders
- Mobile app version
- Plant recognition via photo upload
- Community features for plant care tips
