import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Plant } from '../types/types';
import { getPlantById, addPlant, updatePlant, uploadPlantImage, getUserLocations } from '../lib';
import type { Location } from '../types/types';

// Initial plant template
const INITIAL_PLANT = {
  name: '',
  species: '',
  plant_type: '',
  weekly_water_need: 100,
  expected_humidity: 50,
  watering_interval: 7,
  planted_date: new Date().toISOString().split('T')[0],
  last_watering_date: new Date().toISOString().split('T')[0],
  location_id: '',
  image_url: null,
  created_at: new Date().toISOString()
};

// Sample plant species
const PLANT_SPECIES = [
  "Succulent", "Cactus", "Vine", "Flowering Plant", "Leafy Plant", 
  "Fern", "Palm", "Orchid", "Shrub", "Bonsai", "Tree", "Vegetable"
];

// Sample plant types
const PLANT_TYPES = [
  "Indoor", "Outdoor", "Flowering", "Succulent", "Tropical", 
  "Desert", "Aquatic", "Medicinal", "Edible", "Ornamental"
];

const PlantForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState<Omit<Plant, 'id' | 'user_id'>>(INITIAL_PLANT);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Random plant icon
  const plantIcons = ["🌵", "🌴", "🌲", "🌱", "🌿", "☘️", "🍀", "🌺", "🌻", "🌹", "🌷", "🌸"];
  const randomIcon = plantIcons[Math.floor(Math.random() * plantIcons.length)];

  // Konumları yükle
  useEffect(() => {
    const loadLocations = async () => {
      try {
        const userLocations = await getUserLocations();
        setLocations(userLocations);
      } catch (error) {
        console.error('Konumlar yüklenirken hata oluştu:', error);
      }
    };
    
    loadLocations();
  }, []);

  // If in edit mode, get plant data
  useEffect(() => {
    if (isEditMode && id) {
      const fetchPlant = async () => {
        try {
          setLoading(true);
          setError(null);
          
          const data = await getPlantById(id);
          
          if (data) {
            // Transfer data to formData excluding id and user_id
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { id: _id, user_id: _userId, ...plantData } = data;
            setFormData(plantData);
          } else {
            setError('Plant not found.');
          }
        } catch (error) {
          console.error('Error loading plant data:', error);
          setError('Could not load plant data. Please try again.');
        } finally {
          setLoading(false);
        }
      };

      fetchPlant();
    }
  }, [id, isEditMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let parsedValue: string | number = value;
    
    // Conversion for numeric fields
    if (name === 'watering_interval' || name === 'weekly_water_need' || name === 'expected_humidity') {
      parsedValue = parseInt(value) || 0;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: parsedValue
    }));
  };

  // Dosya seçimi
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      // Eğer resim varsa önce yükle
      let imageUrl = formData.image_url;
      if (selectedFile) {
        setUploadingImage(true);
        try {
          const uploadedUrl = await uploadPlantImage(selectedFile);
          if (uploadedUrl) {
            imageUrl = uploadedUrl;
          }
        } catch (uploadError) {
          console.error('Image upload error:', uploadError);
          setError('Image upload failed. Plant data will be saved without image.');
        } finally {
          setUploadingImage(false);
        }
      }
      
      const plantDataToSave = {
        ...formData,
        image_url: imageUrl
      };
      
      if (isEditMode && id) {
        // Update plant
        const updatedPlant = await updatePlant(id, plantDataToSave);
        if (updatedPlant) {
          setSuccess('Plant updated successfully!');
        } else {
          throw new Error('Failed to update plant');
        }
      } else {
        // Add new plant
        const newPlant = await addPlant(plantDataToSave);
        if (newPlant) {
          setSuccess('New plant added successfully!');
          // Reset form after adding new plant
          setFormData(INITIAL_PLANT);
          setSelectedFile(null);
        } else {
          throw new Error('Failed to add plant');
        }
      }
      
      // Return to home page after 2 seconds or clear message
      setTimeout(() => {
        if (!isEditMode) {
          setSuccess(null);
        } else {
          navigate('/');
        }
      }, 2000);
    } catch (error) {
      console.error('Error saving plant:', error);
      setError('Failed to save plant. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 bg-green-200 rounded-full flex items-center justify-center mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
            </svg>
          </div>
          <p className="text-green-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 sm:p-6 mb-4 sm:mb-8 shadow-sm">
        <div className="flex items-center mb-2">
          <span className="text-4xl mr-3">{randomIcon}</span>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            {isEditMode ? 'Edit Plant' : 'Add New Plant'}
          </h1>
        </div>
        <p className="text-gray-600 ml-12 sm:ml-14">
          Fill in the necessary information to track your plants
        </p>
      </div>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 mb-4 rounded shadow-sm">
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
      )}

      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-3 mb-4 rounded shadow-sm">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm">{success}</p>
            </div>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg overflow-hidden w-full">
        <div className="border-b border-gray-200 bg-gray-50 px-3 sm:px-6 py-3 sm:py-4">
          <h2 className="text-lg font-medium text-gray-700">Plant Information</h2>
          <p className="text-sm text-gray-500">Please specify your plant's characteristics</p>
        </div>
        
        <div className="p-3 sm:p-6 grid grid-cols-1 gap-y-4 sm:gap-y-6 gap-x-3 sm:gap-x-4 sm:grid-cols-6">
          <div className="col-span-1 sm:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">
              Plant Name
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">
                <span className="text-green-500 sm:text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                </span>
              </div>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Ex: Orchid, Cactus..."
                className="block w-full pl-8 sm:pl-10 pr-2 sm:pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"              />
            </div>
          </div>
          
          <div className="col-span-1 sm:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="species">
              Plant Species
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">
                <span className="text-green-500 sm:text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </span>
              </div>
              <select
                id="species"
                name="species"
                value={formData.species}
                onChange={handleChange}
                required
                className="block w-full pl-8 sm:pl-10 pr-2 sm:pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              >
                <option value="">-- Select Species --</option>
                {PLANT_SPECIES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="col-span-1 sm:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="plant_type">
              Plant Type
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">
                <span className="text-green-500 sm:text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </span>
              </div>
              <select
                id="plant_type"
                name="plant_type"
                value={formData.plant_type}
                onChange={handleChange}
                required
                className="block w-full pl-8 sm:pl-10 pr-2 sm:pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              >
                <option value="">-- Select Plant Type --</option>
                {PLANT_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="col-span-1 sm:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="watering_interval">
              Watering Interval (days)
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">
                <span className="text-green-500 sm:text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </span>
              </div>
              <input
                id="watering_interval"
                name="watering_interval"
                type="number"
                min="1"
                step="1"
                value={formData.watering_interval}
                onChange={handleChange}
                required
                className="block w-full pl-8 sm:pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"              />
              <div className="absolute inset-y-0 right-0 pr-2 sm:pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">days</span>
              </div>
            </div>
            <p className="mt-1 text-xs text-gray-500">Specify the watering interval for the plant in days</p>
          </div>

          <div className="col-span-1 sm:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="weekly_water_need">
              Weekly Water Need (mm)
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">
                <span className="text-green-500 sm:text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </span>
              </div>
              <input
                id="weekly_water_need"
                name="weekly_water_need"
                type="number"
                min="0"
                step="5"
                value={formData.weekly_water_need}
                onChange={handleChange}
                required
                className="block w-full pl-8 sm:pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
              <div className="absolute inset-y-0 right-0 pr-2 sm:pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">mm</span>
              </div>
            </div>
            <p className="mt-1 text-xs text-gray-500">Required water amount per week in millimeters</p>
          </div>

          <div className="col-span-1 sm:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="expected_humidity">
              Expected Humidity (%)
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">
                <span className="text-green-500 sm:text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </span>
              </div>
              <input
                id="expected_humidity"
                name="expected_humidity"
                type="number"
                min="0"
                max="100"
                step="1"
                value={formData.expected_humidity}
                onChange={handleChange}
                required
                className="block w-full pl-8 sm:pl-10 pr-6 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
              <div className="absolute inset-y-0 right-0 pr-2 sm:pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">%</span>
              </div>
            </div>
            <p className="mt-1 text-xs text-gray-500">Expected relative humidity percentage</p>
          </div>
          
          <div className="col-span-1 sm:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="planted_date">
              Planting Date
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">
                <span className="text-green-500 sm:text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </span>
              </div>
              <input
                id="planted_date"
                name="planted_date"
                type="date"
                value={formData.planted_date}
                onChange={handleChange}
                required
                className="block w-full pl-8 sm:pl-10 pr-2 sm:pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"              />
            </div>
          </div>
          
          <div className="col-span-1 sm:col-span-6">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="location_id">
              Location
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">
                <span className="text-green-500 sm:text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </span>
              </div>
              <select
                id="location_id"
                name="location_id"
                value={formData.location_id || ''}
                onChange={handleChange}
                required
                className="block w-full pl-8 sm:pl-10 pr-2 sm:pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              >
                <option value="">-- Select Location --</option>
                {locations.map(location => (
                  <option key={location.id} value={location.id}>{location.name}</option>
                ))}
              </select>
            </div>
            <p className="mt-1 text-xs text-gray-500">Select a location for your plant</p>
          </div>
          
          {/* Bitki resmi yükleme alanı */}
          <div className="col-span-1 sm:col-span-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Plant Image
            </label>
            <div className="mt-1 flex flex-col sm:flex-row items-start sm:items-center">
              {formData.image_url && (
                <div className="mb-4 sm:mb-0 sm:mr-4">
                  <img 
                    src={formData.image_url} 
                    alt={formData.name} 
                    className="h-24 w-24 object-cover rounded-md"
                  />
                </div>
              )}
              <div className="flex-1 w-full">
                <div className="relative border-2 border-dashed border-gray-300 rounded-md px-4 sm:px-6 py-6 sm:py-10 text-center">
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="space-y-1 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    <div className="text-sm text-gray-600">
                      <label htmlFor="file-upload" className="cursor-pointer font-medium text-green-600 hover:text-green-500">
                        Upload a file
                      </label>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                    {selectedFile && (
                      <p className="text-sm text-gray-600 break-all">
                        Selected: {selectedFile.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="px-3 sm:px-6 py-3 sm:py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-center sm:justify-end space-y-3 sm:space-y-0 sm:space-x-3">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={loading || uploadingImage}
            className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            {(loading || uploadingImage) ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {uploadingImage ? 'Uploading Image...' : 'Processing...'}
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {isEditMode ? 'Update' : 'Save'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PlantForm; 