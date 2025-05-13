import type { Plant, Location, PlantHealth } from '../types/types';

// Demo user
export const DEMO_USER = {
  id: 'user-123',
  name: 'John Smith',
  email: 'demo@planttracker.com'
};

// Demo login credentials
export const DEMO_AUTH = {
  users: [
    { email: 'demo@planttracker.com', password: 'demo1234', id: 'user-123', name: 'Demo User' },
    { email: 'test@planttracker.com', password: 'test1234', id: 'user-456', name: 'Test User' }
  ]
};

// Current timestamp for demo data
const CURRENT_DATE = new Date().toISOString();

// Demo locations
export const LOCATIONS: Location[] = [
  { 
    id: 'loc-1', 
    name: 'Home', 
    city: 'New York', 
    country: 'USA', 
    latitude: 40.7128, 
    longitude: -74.0060, 
    user_id: DEMO_USER.id,
    created_at: CURRENT_DATE
  },
  { 
    id: 'loc-2', 
    name: 'Balcony', 
    city: 'New York', 
    country: 'USA', 
    latitude: 40.7128, 
    longitude: -74.0060, 
    user_id: DEMO_USER.id,
    created_at: CURRENT_DATE
  },
  { 
    id: 'loc-3', 
    name: 'Office', 
    city: 'Boston', 
    country: 'USA', 
    latitude: 42.3601, 
    longitude: -71.0589, 
    user_id: DEMO_USER.id,
    created_at: CURRENT_DATE
  },
  { 
    id: 'loc-4', 
    name: 'Garden', 
    city: 'San Francisco', 
    country: 'USA', 
    latitude: 37.7749, 
    longitude: -122.4194, 
    user_id: DEMO_USER.id,
    created_at: CURRENT_DATE
  }
];

// Demo plants
export const PLANTS: Plant[] = [
  {
    id: 'plant-1',
    name: 'Orchid',
    species: 'Phalaenopsis',
    plant_type: 'Flowering',
    weekly_water_need: 250,
    expected_humidity: 60,
    location_id: 'loc-1',
    image_url: 'https://images.unsplash.com/photo-1569880153113-76e33fc52d5f?auto=format&fit=crop&w=800&q=80',
    planted_date: '2023-01-15',
    watering_interval: 7,
    last_watering_date: new Date().toISOString().split('T')[0],
    user_id: DEMO_USER.id,
    created_at: CURRENT_DATE
  },
  {
    id: 'plant-2',
    name: 'Cactus',
    species: 'Echinopsis',
    plant_type: 'Succulent',
    weekly_water_need: 50,
    expected_humidity: 30,
    location_id: 'loc-2',
    image_url: 'https://images.unsplash.com/photo-1569880153113-76e33fc52d5f?auto=format&fit=crop&w=800&q=80',
    planted_date: '2022-11-20',
    watering_interval: 14,
    last_watering_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    user_id: DEMO_USER.id,
    created_at: CURRENT_DATE
  },
  {
    id: 'plant-3',
    name: 'Violet',
    species: 'Viola',
    plant_type: 'Flowering',
    weekly_water_need: 300,
    expected_humidity: 50,
    location_id: 'loc-1',
    image_url: 'https://images.unsplash.com/photo-1569880153113-76e33fc52d5f?auto=format&fit=crop&w=800&q=80',
    planted_date: '2023-03-05',
    watering_interval: 3,
    last_watering_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    user_id: DEMO_USER.id,
    created_at: CURRENT_DATE
  },
  {
    id: 'plant-4',
    name: 'Succulent',
    species: 'Echeveria',
    plant_type: 'Succulent',
    weekly_water_need: 100,
    expected_humidity: 40,
    location_id: 'loc-3',
    image_url: 'https://images.unsplash.com/photo-1569880153113-76e33fc52d5f?auto=format&fit=crop&w=800&q=80',
    planted_date: '2022-09-10',
    watering_interval: 10,
    last_watering_date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    user_id: DEMO_USER.id,
    created_at: CURRENT_DATE
  },
  {
    id: 'plant-5',
    name: 'Aloe Vera',
    species: 'Aloe',
    plant_type: 'Succulent',
    weekly_water_need: 150,
    expected_humidity: 35,
    location_id: 'loc-4',
    image_url: 'https://images.unsplash.com/photo-1569880153113-76e33fc52d5f?auto=format&fit=crop&w=800&q=80',
    planted_date: '2023-02-20',
    watering_interval: 7,
    last_watering_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    user_id: DEMO_USER.id,
    created_at: CURRENT_DATE
  }
];

// Helper function to generate plant health data
const generateHealthData = (plantId: string, startDate: Date, days: number): PlantHealth[] => {
  const healthData: PlantHealth[] = [];
  const currentDate = new Date(startDate);
  
  for (let i = 0; i < days; i++) {
    // Generate random health score between 60-100
    const healthScore = Math.floor(Math.random() * 41) + 60;
    // Generate random water amount between 20-300 mm
    const actualWater = Math.floor(Math.random() * 281) + 20;
    // Generate random humidity between 20-90%
    const actualHumidity = Math.floor(Math.random() * 71) + 20;
    
    healthData.push({
      id: `health-${plantId}-${i}`,
      plant_id: plantId,
      health_score: healthScore,
      actual_water: actualWater,
      actual_humidity: actualHumidity,
      date: new Date(currentDate).toISOString().split('T')[0],
      created_at: new Date(currentDate).toISOString()
    });
    
    // Add one day
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return healthData;
};

// Health data for the last 30 days
const thirtyDaysAgo = new Date();
thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

// Health data for all plants
export const PLANT_HEALTH: PlantHealth[] = [
  ...generateHealthData('plant-1', thirtyDaysAgo, 30),
  ...generateHealthData('plant-2', thirtyDaysAgo, 30),
  ...generateHealthData('plant-3', thirtyDaysAgo, 30),
  ...generateHealthData('plant-4', thirtyDaysAgo, 30),
  ...generateHealthData('plant-5', thirtyDaysAgo, 30)
];

// API service for handling data operations with static data
export const api = {
  // Authentication operations
  login: async (email: string, password: string) => {
    const user = DEMO_AUTH.users.find(u => u.email === email && u.password === password);
    if (!user) {
      return Promise.reject({ message: 'Invalid email or password' });
    }
    return Promise.resolve({ 
      user: { id: user.id, email: user.email, name: user.name },
      session: { access_token: 'demo-token-' + Date.now() }
    });
  },
  
  register: async (email: string, password: string, name: string) => {
    const existingUser = DEMO_AUTH.users.find(u => u.email === email);
    if (existingUser) {
      return Promise.reject({ message: 'Email already in use' });
    }
    
    const newUser = {
      id: 'user-' + Date.now(),
      email,
      password,
      name
    };
    
    DEMO_AUTH.users.push(newUser);
    
    return Promise.resolve({ 
      user: { id: newUser.id, email: newUser.email, name: newUser.name },
      session: { access_token: 'demo-token-' + Date.now() }
    });
  },
  
  resetPassword: async (email: string) => {
    const user = DEMO_AUTH.users.find(u => u.email === email);
    if (!user) {
      return Promise.reject({ message: 'User not found' });
    }
    return Promise.resolve({ success: true });
  },
  
  updatePassword: async (oldPassword: string, newPassword: string) => {
    console.log(`Updating password from ${oldPassword} to ${newPassword}`);
    return Promise.resolve({ success: true });
  },
  
  logout: async () => {
    return Promise.resolve({ success: true });
  },
  
  // Location operations
  getLocations: async (): Promise<Location[]> => {
    return Promise.resolve([...LOCATIONS]);
  },
  
  getLocationById: async (id: string): Promise<Location | null> => {
    const location = LOCATIONS.find(loc => loc.id === id);
    return Promise.resolve(location || null);
  },
  
  createLocation: async (location: Omit<Location, 'id' | 'user_id' | 'created_at'>) => {
    const newLocation = {
      ...location,
      id: `loc-${Date.now()}`,
      user_id: DEMO_USER.id,
      created_at: new Date().toISOString()
    };
    return Promise.resolve(newLocation);
  },
  
  updateLocation: async (id: string, location: Partial<Location>) => {
    return Promise.resolve({ ...location, id });
  },
  
  deleteLocation: async (id: string) => {
    console.log(`Deleting location with ID: ${id}`);
    return Promise.resolve({ success: true });
  },
  
  // Plant operations
  getPlants: async (): Promise<Plant[]> => {
    return Promise.resolve([...PLANTS]);
  },
  
  getPlantsByLocation: async (locationId: string): Promise<Plant[]> => {
    const plants = PLANTS.filter(plant => plant.location_id === locationId);
    return Promise.resolve(plants);
  },
  
  getPlantById: async (id: string): Promise<Plant | null> => {
    const plant = PLANTS.find(plant => plant.id === id);
    return Promise.resolve(plant || null);
  },
  
  // Plant health operations
  getPlantHealthData: async (plantId: string): Promise<PlantHealth[]> => {
    const healthData = PLANT_HEALTH.filter(h => h.plant_id === plantId);
    return Promise.resolve(healthData);
  },
  
  // Add new plant
  addPlant: async (plant: Omit<Plant, 'id' | 'user_id' | 'created_at'>) => {
    const newPlant: Plant = {
      ...plant,
      id: `plant-${Date.now()}`,
      user_id: DEMO_USER.id,
      created_at: new Date().toISOString()
    };
    
    return Promise.resolve(newPlant);
  },
  
  // Update plant
  updatePlant: async (id: string, plant: Partial<Plant>) => {
    return Promise.resolve({ ...plant, id });
  },
  
  // Delete plant
  deletePlant: async (id: string) => {
    console.log(`Deleting plant with ID: ${id}`);
    return Promise.resolve({ success: true });
  },
  
  // Get plant health data
  getPlantHealth: async (plantId: string, startDate: string, endDate: string) => {
    const healthData = PLANT_HEALTH
      .filter(h => h.plant_id === plantId)
      .filter(h => {
        const date = new Date(h.date);
        return date >= new Date(startDate) && date <= new Date(endDate);
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    return Promise.resolve(healthData);
  },
  
  // Watering operations
  recordWatering: async (plantId: string) => {
    const today = new Date().toISOString().split('T')[0];
    return Promise.resolve({ 
      id: `watering-${Date.now()}`,
      plant_id: plantId,
      date: today,
      created_at: new Date().toISOString()
    });
  },
  
  // Upload operations
  uploadImage: async (file: File) => {
    console.log(`Uploading file: ${file.name}, size: ${file.size} bytes`);
    // Simulated image upload that returns a URL
    return Promise.resolve({ 
      url: 'https://images.unsplash.com/photo-1610630230926-df0525c5fd89?auto=format&fit=crop&w=800&q=80',
      success: true 
    });
  }
}; 