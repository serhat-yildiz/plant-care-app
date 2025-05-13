import { supabase } from './supabase';
import type { Location } from '../types/types';
import { getCurrentUser } from './supabase';

// Get all locations
export const getLocations = async (): Promise<Location[]> => {
  try {
    const { data: locations, error } = await supabase
      .from('locations')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return (locations as unknown as Location[]) || [];
  } catch (error) {
    console.error('Error getting locations:', error);
    return [];
  }
};

// Get user locations
export const getUserLocations = async (): Promise<Location[]> => {
  try {
    const user = await getCurrentUser();
    if (!user) return [];
    
    const { data: locations, error } = await supabase
      .from('locations')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return (locations as unknown as Location[]) || [];
  } catch (error) {
    console.error('Error getting user locations:', error);
    return [];
  }
};

// Get location by ID
export const getLocationById = async (id: string): Promise<Location | null> => {
  try {
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as unknown as Location;
  } catch (error) {
    console.error('Error getting location details:', error);
    return null;
  }
};

// Add new location
export const addLocation = async (locationData: Omit<Location, 'id' | 'user_id' | 'created_at'>): Promise<Location | null> => {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not logged in');
    
    const newLocation = {
      ...locationData,
      user_id: user.id,
      created_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('locations')
      .insert([newLocation])
      .select()
      .single();
    
    if (error) throw error;
    return data as unknown as Location;
  } catch (error) {
    console.error('Error adding location:', error);
    return null;
  }
};

// Update location
export const updateLocation = async (id: string, locationData: Partial<Location>): Promise<Location | null> => {
  try {
    const { data, error } = await supabase
      .from('locations')
      .update(locationData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as unknown as Location;
  } catch (error) {
    console.error('Error updating location:', error);
    return null;
  }
};

// Delete location
export const deleteLocation = async (id: string): Promise<boolean> => {
  try {
    // Check for plants at this location first
    const { data: plants } = await supabase
      .from('plants')
      .select('id')
      .eq('location_id', id);
    
    if (plants && plants.length > 0) {
      throw new Error('This location has plants associated with it. Delete or move the plants first.');
    }
    
    const { error } = await supabase
      .from('locations')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting location:', error);
    return false;
  }
}; 