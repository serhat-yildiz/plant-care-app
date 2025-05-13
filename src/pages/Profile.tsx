import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser, useClerk } from '@clerk/clerk-react';

const Profile = () => {
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [profileError, setProfileError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');

  // Initialize form fields when user data is loaded
  useEffect(() => {
    if (isLoaded && user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setUsername(user.username || '');
      setAvatarUrl(user.imageUrl || '');
    }
  }, [isLoaded, user]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setProfileError(null);
      setProfileSuccess(null);
      setLoading(true);
      
      if (user) {
        console.log('Updating profile with name:', firstName, lastName);
        
        // Update user profile including firstName, lastName and username if changed
        await user.update({
          firstName: firstName || undefined,
          lastName: lastName || undefined,
          username: username || undefined
        });
        
        console.log('Profile updated successfully');
        setProfileSuccess('Profile successfully updated.');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      
      if (error instanceof Error) {
        const errorMessage = `Error: ${error.message}`;
        console.error(errorMessage);
        setProfileError(errorMessage);
      } else if (typeof error === 'object' && error !== null) {
        try {
          const errorString = JSON.stringify(error);
          console.error('Error object:', errorString);
          setProfileError(`Error: ${errorString}`);
        } catch {
          // Ignore stringify error
          console.error('Could not stringify error object');
          setProfileError('An error occurred while updating your profile.');
        }
      } else {
        setProfileError('An error occurred while updating your profile.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    
    try {
      setProfileError(null);
      setProfileSuccess(null);
      setLoading(true);
      
      if (user) {
        const file = e.target.files[0];
        
        await user.setProfileImage({ file });
        setAvatarUrl(user.imageUrl);
        
        setProfileSuccess('Profile avatar successfully updated.');
      }
    } catch (error) {
      console.error('Avatar upload error:', error);
      setProfileError('Failed to upload avatar. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      
      if (user) {
        await user.delete();
        await signOut();
        navigate('/login');
      }
    } catch (error) {
      console.error('Account deletion error:', error);
      setProfileError('Failed to delete account. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded || !user) {
    return <div className="flex justify-center items-center p-8">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
    </div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h1>
      
      <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
        {/* Profile Information */}
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Profile Information</h2>
          
          {profileError && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{profileError}</p>
                </div>
              </div>
            </div>
          )}
          
          {profileSuccess && (
            <div className="mb-4 bg-green-50 border-l-4 border-green-500 p-4 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">{profileSuccess}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Avatar Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>
            <div className="flex items-center space-x-6">
              <div className="shrink-0">
                <img 
                  className="h-16 w-16 object-cover rounded-full"
                  src={avatarUrl || 'https://via.placeholder.com/150?text=User'} 
                  alt="Profile avatar" 
                />
              </div>
              <label className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                <span>Change Avatar</span>
                <input 
                  id="avatar-upload" 
                  name="avatar-upload" 
                  type="file" 
                  accept="image/*"
                  className="sr-only"
                  onChange={handleAvatarUpload}
                  disabled={loading}
                />
              </label>
            </div>
          </div>
          
          <form onSubmit={handleProfileUpdate}>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                />
                <p className="mt-1 text-xs text-gray-500">Choose a unique username for your account</p>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={user.emailAddresses[0]?.emailAddress || ''}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  disabled
                />
                <p className="mt-1 text-xs text-gray-500">Email address cannot be changed here.</p>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  {loading ? 'Updating...' : 'Update Profile'}
                </button>
              </div>
            </div>
          </form>
        </div>
        
        {/* Change Password - Clerk handles this, but we keep UI for consistency */}
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Password Management</h2>
          
          {passwordError && (
            <div className="mb-4 bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">{passwordError}</p>
                </div>
              </div>
            </div>
          )}
          
          <p className="text-sm text-gray-600 mb-4">
            Password management is handled through Clerk's secure interface. You can reset your password or update it through the authentication flow.
          </p>
          
          <div className="flex justify-end">
            <button
              onClick={() => {
                setPasswordError('Redirecting to password reset page...');
                navigate('/reset-password');
              }}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Reset Password
            </button>
          </div>
        </div>
        
        {/* Account Actions */}
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Account Actions</h2>
          
          <div className="flex flex-col space-y-4">
            <button
              onClick={handleLogout}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Sign Out
            </button>
            
            {!deleteConfirm ? (
              <button
                onClick={() => setDeleteConfirm(true)}
                className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete Account
              </button>
            ) : (
              <div className="border border-red-200 rounded-md p-4 bg-red-50">
                <p className="text-sm text-red-700 mb-4">Are you sure you want to delete your account? This action cannot be undone.</p>
                <div className="flex space-x-3">
                  <button
                    onClick={handleDeleteAccount}
                    disabled={loading}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    {loading ? 'Deleting...' : 'Yes, Delete My Account'}
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(false)}
                    className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 