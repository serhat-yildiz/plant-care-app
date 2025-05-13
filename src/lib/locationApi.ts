import { supabase } from './supabase';
import type { Location } from '../types/types';
import { getCurrentUser } from './supabase';

// Tüm konumları getir
export const getLocations = async (): Promise<Location[]> => {
  try {
    const { data: locations, error } = await supabase
      .from('locations')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return locations || [];
  } catch (error) {
    console.error('Konumlar alınırken hata oluştu:', error);
    return [];
  }
};

// Kullanıcının konumlarını getir
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
    return locations || [];
  } catch (error) {
    console.error('Kullanıcı konumları alınırken hata oluştu:', error);
    return [];
  }
};

// Belirli bir konumu getir
export const getLocationById = async (id: string): Promise<Location | null> => {
  try {
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Konum detayları alınırken hata oluştu:', error);
    return null;
  }
};

// Yeni konum ekle
export const addLocation = async (locationData: Omit<Location, 'id' | 'user_id' | 'created_at'>): Promise<Location | null> => {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('Kullanıcı oturum açmamış');
    
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
    return data;
  } catch (error) {
    console.error('Konum eklenirken hata oluştu:', error);
    return null;
  }
};

// Konum güncelle
export const updateLocation = async (id: string, locationData: Partial<Location>): Promise<Location | null> => {
  try {
    const { data, error } = await supabase
      .from('locations')
      .update(locationData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Konum güncellenirken hata oluştu:', error);
    return null;
  }
};

// Konum sil
export const deleteLocation = async (id: string): Promise<boolean> => {
  try {
    // Önce bu konuma bağlı bitkileri kontrol et
    const { data: plants } = await supabase
      .from('plants')
      .select('id')
      .eq('location_id', id);
    
    if (plants && plants.length > 0) {
      throw new Error('Bu konuma bağlı bitkiler var. Önce bitkileri silmeli veya başka bir konuma taşımalısınız.');
    }
    
    const { error } = await supabase
      .from('locations')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Konum silinirken hata oluştu:', error);
    return false;
  }
}; 