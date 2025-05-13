import { createClient } from '@supabase/supabase-js';
import type { User } from '../types/types';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a variable to hold the Supabase client
let supabaseClient: ReturnType<typeof createClient>;

// Check if environment variables are properly set
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase configuration. Please check your environment variables:');
  console.error('VITE_SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing');
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Set' : 'Missing');
  
  // For development/testing purposes, you can use the following fallback values
  // Only use this temporarily and replace with your actual Supabase credentials
  const mockSupabaseUrl = 'https://your-project-id.supabase.co';
  const mockSupabaseKey = 'your-anon-key';
  
  // Alert the developer that mock values are being used
  console.warn('Using mock Supabase values for development. Please set up proper environment variables.');
  
  // Use mock values only in development mode
  if (import.meta.env.DEV) {
    // Create a dummy client for development without throwing errors
    supabaseClient = createClient(mockSupabaseUrl, mockSupabaseKey);
  } else {
    // In production, we shouldn't use mock values
    throw new Error('Supabase configuration missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.');
  }
} else {
  // Initialize Supabase client with proper credentials
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
}

// Export the client
export const supabase = supabaseClient;

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const { data } = await supabase.auth.getUser();
    return data?.user ? {
      id: data.user.id,
      email: data.user.email || '',
      name: data.user.user_metadata?.full_name || '',
      avatar_url: data.user.user_metadata?.avatar_url,
      created_at: data.user.created_at
    } : null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

export const isUserSignedIn = async (): Promise<boolean> => {
  try {
    const { data } = await supabase.auth.getSession();
    return !!data.session;
  } catch (error) {
    console.error('Error checking user session:', error);
    return false;
  }
}; 