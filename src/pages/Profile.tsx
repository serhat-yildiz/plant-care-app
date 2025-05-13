import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser, useClerk } from '@clerk/clerk-react';

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { signOut } = useClerk();
  
  const [name, setName] = useState(user?.firstName || '');
  const [profileError, setProfileError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setProfileError(null);
      setProfileSuccess(null);
      setLoading(true);
      
      if (user) {
        console.log('Updating profile with name:', name);
        
        // Split name into first and last parts
        const nameParts = name.split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(' ') || undefined;
        
        // Clerk has camelCase types but requires snake_case parameters
        // Using type assertion to bypass TypeScript checks
        await user.update({
          firstName,
          lastName
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

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  if (!user) {
    return <div>Loading user profile...</div>;
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
          
          <form onSubmit={handleProfileUpdate}>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                />
                <p className="mt-1 text-xs text-gray-500">Enter your full name (first and last name)</p>
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
                setPasswordError('Password resets are handled through Clerk\'s secure interface.');
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
          
          <button
            onClick={handleLogout}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile; 