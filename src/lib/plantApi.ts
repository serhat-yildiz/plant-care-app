import { supabase } from './supabase';
import type { Plant } from '../types/types';
import { getCurrentUser } from './supabase';

// Get all plants
export const getPlants = async (): Promise<Plant[]> => {
  try {
    const { data: plants, error } = await supabase
      .from('plants')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return (plants as unknown as Plant[]) || [];
  } catch (error) {
    console.error('Error getting plants:', error);
    return [];
  }
};

// Get user plants
export const getUserPlants = async (): Promise<Plant[]> => {
  try {
    const user = await getCurrentUser();
    if (!user) return [];
    
    const { data: plants, error } = await supabase
      .from('plants')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return (plants as unknown as Plant[]) || [];
  } catch (error) {
    console.error('Error getting user plants:', error);
    return [];
  }
};

// Get plants by location
export const getPlantsByLocation = async (locationId: string): Promise<Plant[]> => {
  try {
    const { data: plants, error } = await supabase
      .from('plants')
      .select('*')
      .eq('location_id', locationId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return (plants as unknown as Plant[]) || [];
  } catch (error) {
    console.error('Error getting location plants:', error);
    return [];
  }
};

// Get plant by ID
export const getPlantById = async (id: string): Promise<Plant | null> => {
  try {
    const { data, error } = await supabase
      .from('plants')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as unknown as Plant;
  } catch (error) {
    console.error('Error getting plant details:', error);
    return null;
  }
};

// Add new plant
export const addPlant = async (plantData: Omit<Plant, 'id' | 'user_id' | 'created_at'>): Promise<Plant | null> => {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not logged in');
    
    const newPlant = {
      ...plantData,
      user_id: user.id,
      created_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('plants')
      .insert([newPlant])
      .select()
      .single();
    
    if (error) throw error;
    return data as unknown as Plant;
  } catch (error) {
    console.error('Error adding plant:', error);
    return null;
  }
};

// Update plant
export const updatePlant = async (id: string, plantData: Partial<Plant>): Promise<Plant | null> => {
  try {
    const { data, error } = await supabase
      .from('plants')
      .update(plantData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as unknown as Plant;
  } catch (error) {
    console.error('Error updating plant:', error);
    return null;
  }
};

// Delete plant
export const deletePlant = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('plants')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting plant:', error);
    return false;
  }
};

// Record watering
export const recordWatering = async (plantId: string): Promise<boolean> => {
  try {
    // Update plant's last watering date
    const today = new Date().toISOString().split('T')[0];
    
    const { error } = await supabase
      .from('plants')
      .update({ last_watering_date: today })
      .eq('id', plantId);
    
    if (error) throw error;
    
    // Optionally, you could also add a record to a watering_history table
    // Example:
    // await supabase.from('watering_history').insert({
    //   plant_id: plantId,
    //   date: today,
    // });
    
    return true;
  } catch (error) {
    console.error('Error recording watering:', error);
    return false;
  }
};

// Upload plant image
export const uploadPlantImage = async (file: File): Promise<string | null> => {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not logged in');
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;
    
    const { error } = await supabase.storage
      .from('plant_images')
      .upload(fileName, file);
    
    if (error) throw error;
    
    const { data } = supabase.storage
      .from('plant_images')
      .getPublicUrl(fileName);
    
    return data.publicUrl;
  } catch (error) {
    console.error('Error uploading plant image:', error);
    return null;
  }
}; 