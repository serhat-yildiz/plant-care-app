import { useState, useEffect } from 'react';
import { useClerk, useAuth } from '@clerk/clerk-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthBackground from '../components/backgrounds/AuthBackground';

const ResetPassword = () => {
  const { client, signOut, setActive } = useClerk();
  const { isLoaded, isSignedIn } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetStep, setResetStep] = useState<'request' | 'verify' | 'complete'>('request');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Redirect if user is already signed in
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      // Only redirect if not in the middle of verification
      if (resetStep !== 'verify') {
        navigate('/');
      }
    }
  }, [isLoaded, isSignedIn, navigate, resetStep]);
  
  // Check if there's a pending reset from URL params
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    if (queryParams.has('email')) {
      const emailParam = queryParams.get('email');
      if (emailParam) {
        setEmail(emailParam);
        setResetStep('verify');
      }
    }
  }, [location]);
  
  const handleSignOutAndReset = async () => {
    try {
      setLoading(true);
      await signOut();
      // After signing out, reload the page to show the reset form
      window.location.reload();
    } catch (err) {
      console.error('Sign out error:', err);
      setError('Failed to sign out. Please try again.');
      setLoading(false);
    }
  };
  
  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Use Clerk's built-in forgot password functionality
      await client.signIn.create({
        strategy: 'reset_password_email_code',
        identifier: email
      });
      
      setResetStep('verify');
    } catch (err) {
      console.error('Reset password error:', err);
      
      if (err instanceof Error) {
        setError(`Error: ${err.message}`);
      } else {
        setError('An error occurred. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!verificationCode) {
      setError('Please enter the verification code sent to your email');
      return;
    }
    
    if (!newPassword) {
      setError('Please enter your new password');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Attempt to get the active sign in attempt
      const signIn = client.signIn;
      
      // Verify the code and set the new password
      const result = await signIn.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code: verificationCode,
        password: newPassword
      });
      
      // If we got a created session ID, activate it
      if (result.status === 'complete' && result.createdSessionId) {
        await setActive({ session: result.createdSessionId });
        setResetStep('complete');
        
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        setResetStep('complete');
      }
    } catch (err) {
      console.error('Verification error:', err);
      
      if (err instanceof Error) {
        setError(`Error: ${err.message}`);
      } else {
        setError('Invalid verification code or password. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while Clerk is initializing
  if (!isLoaded) {
    return (
      <AuthBackground>
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-6">Reset Password</h1>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
          </div>
        </div>
      </AuthBackground>
    );
  }
  
  // If user is already signed in and in completion state, redirect to dashboard
  if (isSignedIn && resetStep === 'complete') {
    return (
      <AuthBackground>
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-6">Reset Password</h1>
          <div className="text-center">
            <div className="mb-4 bg-green-50 border-l-4 border-green-500 p-4 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">Password reset successful! Redirecting to dashboard...</p>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
            </div>
          </div>
        </div>
      </AuthBackground>
    );
  }
  
  return (
    <AuthBackground>
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-6">Reset Password</h1>
        
        {error && (
          <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Show different UI based on whether user is signed in */}
        {isSignedIn && resetStep !== 'complete' ? (
          <div className="text-center">
            <div className="mb-4 bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
              <p className="text-sm text-yellow-700">
                You need to sign out before resetting your password.
              </p>
            </div>
            
            <div className="space-y-4">
              <button
                onClick={handleSignOutAndReset}
                disabled={loading}
                className="w-full px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 font-medium"
              >
                {loading ? 'Signing out...' : 'Sign out and reset password'}
              </button>
              
              <div className="mt-4 text-center">
                <Link 
                  to="/" 
                  className="text-sm text-green-600 hover:text-green-800"
                >
                  Back to Dashboard
                </Link>
              </div>
            </div>
          </div>
        ) : (
          resetStep === 'request' ? (
            <form onSubmit={handleRequestReset}>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter your email"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  We'll send you a verification code to reset your password
                </p>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 font-medium"
              >
                {loading ? 'Sending...' : 'Send Reset Code'}
              </button>
              
              <div className="mt-4 text-center">
                <Link 
                  to="/login" 
                  className="text-sm text-green-600 hover:text-green-800"
                >
                  Back to Login
                </Link>
              </div>
            </form>
          ) : resetStep === 'verify' ? (
            <form onSubmit={handleVerifyCode}>
              <div className="mb-4">
                <p className="text-sm text-gray-700 mb-4">
                  We've sent a verification code to <span className="font-medium">{email}</span>. 
                  Check your email and enter the code below.
                </p>
                
                <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                  Verification Code
                </label>
                <input
                  id="code"
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter 6-digit code"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter new password"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  Password must be at least 8 characters
                </p>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 font-medium"
              >
                {loading ? 'Verifying...' : 'Reset Password'}
              </button>
              
              <div className="mt-4 text-center space-y-2">
                <button
                  type="button" 
                  onClick={() => setResetStep('request')}
                  className="text-sm text-green-600 hover:text-green-800"
                >
                  Resend Code
                </button>
                <div>
                  <Link 
                    to="/login" 
                    className="text-sm text-green-600 hover:text-green-800"
                  >
                    Back to Login
                  </Link>
                </div>
              </div>
            </form>
          ) : (
            <div className="text-center">
              <div className="mb-4 bg-green-50 border-l-4 border-green-500 p-4 rounded">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-700">Password reset successful! You can now log in with your new password.</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center mt-4">
                <Link
                  to="/login"
                  className="text-green-600 hover:text-green-800 font-medium"
                >
                  Go to Login
                </Link>
              </div>
            </div>
          )
        )}
      </div>
    </AuthBackground>
  );
};

export default ResetPassword; 