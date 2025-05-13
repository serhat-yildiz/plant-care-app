export interface Location {
  id: string;
  name: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  user_id: string;
  created_at: string;
}

export interface Plant {
  id: string;
  name: string;
  species: string;
  plant_type: string;
  weekly_water_need: number; // in millimeters
  expected_humidity: number; // percentage
  location_id: string;
  image_url: string | null;
  planted_date: string;
  watering_interval: number;
  last_watering_date: string;
  user_id: string;
  created_at: string;
}

export interface PlantHealth {
  id: string;
  plant_id: string;
  health_score: number;
  actual_water: number; // actual rainfall in mm
  actual_humidity: number; // actual humidity percentage
  date: string;
  created_at: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  created_at?: string;
}

export interface WeatherData {
  date: string;
  precipitation: number; // rainfall in mm
  relative_humidity: number; // percentage
} 