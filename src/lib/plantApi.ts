import { supabase } from './supabase';
import type { Plant } from '../types/types';
import { getCurrentUser } from './supabase';

// Tüm bitkileri getir
export const getPlants = async (): Promise<Plant[]> => {
  try {
    const { data: plants, error } = await supabase
      .from('plants')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return plants || [];
  } catch (error) {
    console.error('Bitkiler alınırken hata oluştu:', error);
    return [];
  }
};

// Kullanıcının bitkilerini getir
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
    return plants || [];
  } catch (error) {
    console.error('Kullanıcı bitkileri alınırken hata oluştu:', error);
    return [];
  }
};

// Belirli bir konuma ait bitkileri getir
export const getPlantsByLocation = async (locationId: string): Promise<Plant[]> => {
  try {
    const { data: plants, error } = await supabase
      .from('plants')
      .select('*')
      .eq('location_id', locationId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return plants || [];
  } catch (error) {
    console.error('Konum bitkileri alınırken hata oluştu:', error);
    return [];
  }
};

// Belirli bir bitkiyi getir
export const getPlantById = async (id: string): Promise<Plant | null> => {
  try {
    const { data, error } = await supabase
      .from('plants')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Bitki detayları alınırken hata oluştu:', error);
    return null;
  }
};

// Yeni bitki ekle
export const addPlant = async (plantData: Omit<Plant, 'id' | 'user_id' | 'created_at'>): Promise<Plant | null> => {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('Kullanıcı oturum açmamış');
    
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
    return data;
  } catch (error) {
    console.error('Bitki eklenirken hata oluştu:', error);
    return null;
  }
};

// Bitki güncelle
export const updatePlant = async (id: string, plantData: Partial<Plant>): Promise<Plant | null> => {
  try {
    const { data, error } = await supabase
      .from('plants')
      .update(plantData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Bitki güncellenirken hata oluştu:', error);
    return null;
  }
};

// Bitki sil
export const deletePlant = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('plants')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Bitki silinirken hata oluştu:', error);
    return false;
  }
};

// Sulama işlemini kaydet
export const recordWatering = async (plantId: string): Promise<boolean> => {
  try {
    // Sulamayı kaydederken bitkinin son sulama tarihini güncelle
    const today = new Date().toISOString().split('T')[0];
    
    const { error } = await supabase
      .from('plants')
      .update({ last_watering_date: today })
      .eq('id', plantId);
    
    if (error) throw error;
    
    // İsterseniz ayrı bir watering_history tablosuna da kayıt yapabilirsiniz
    // Örnek:
    // await supabase.from('watering_history').insert({
    //   plant_id: plantId,
    //   date: today,
    // });
    
    return true;
  } catch (error) {
    console.error('Sulama kaydedilirken hata oluştu:', error);
    return false;
  }
};

// Bitki resmi yükle
export const uploadPlantImage = async (file: File): Promise<string | null> => {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('Kullanıcı oturum açmamış');
    
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
    console.error('Bitki resmi yüklenirken hata oluştu:', error);
    return null;
  }
}; 