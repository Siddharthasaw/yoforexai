'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignIn() {
  const router = useRouter();
  const [mode, setMode] = useState<'whatsapp' | 'email'>('whatsapp');
  const [step, setStep] = useState<'request' | 'verify'>('request');
  const [whatsapp, setWhatsapp] = useState('');
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRequestOtp = async () => {
    setLoading(true);
    setError('');
    try {
      // await postData('/auth/login/request-otp', { whatsapp });
      setStep('verify');
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    setError('');
    try {
      // await postData('/auth/login/verify-otp', { whatsapp, otp });
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async () => {
    setLoading(true);
    setError('');
    try {
      // await postData('/auth/login/email', { email, password });
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-700 mx-4 my-8">
        
        {/* Header */}
        <div className="bg-gray-800 p-8 text-center border-b border-gray-700">
          <h1 className="text-3xl font-bold text-white">YoForex AI</h1>
          <p className="text-gray-400 mt-2 text-sm">
            Login to access your dashboard
          </p>
        </div>

        {/* Toggle */}
        <div className="p-6">
          <div className="flex items-center mb-6 border border-gray-700 rounded-lg overflow-hidden">
            <button
              onClick={() => setMode('whatsapp')}
              className={`flex-1 py-2 text-sm font-medium ${mode === 'whatsapp' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
            >
              WhatsApp Login
            </button>
            <button
              onClick={() => setMode('email')}
              className={`flex-1 py-2 text-sm font-medium ${mode === 'email' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
            >
              Email Login
            </button>
          </div>

          {mode === 'whatsapp' && (
            <>
              {step === 'request' ? (
                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleRequestOtp(); }}>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">WhatsApp Number</label>
                    <input
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="Enter your WhatsApp number"
                      className="w-full p-3 bg-gray-700 border border-gray-600 text-white rounded-lg placeholder-gray-400"
                      required
                    />
                  </div>
                  {error && <p className="text-xs text-red-400">{error}</p>}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg mt-4"
                  >
                    {loading ? 'Sending OTP...' : 'Send OTP'}
                  </button>
                </form>
              ) : (
                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleVerifyOtp(); }}>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Enter OTP</label>
                    <input
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter OTP"
                      className="w-full p-3 bg-gray-700 border border-gray-600 text-white rounded-lg placeholder-gray-400"
                      required
                    />
                  </div>
                  {error && <p className="text-xs text-red-400">{error}</p>}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg mt-4"
                  >
                    {loading ? 'Verifying...' : 'Verify & Login'}
                  </button>
                </form>
              )}
            </>
          )}

          {mode === 'email' && (
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleEmailLogin(); }}>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full p-3 bg-gray-700 border border-gray-600 text-white rounded-lg placeholder-gray-400"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full p-3 bg-gray-700 border border-gray-600 text-white rounded-lg placeholder-gray-400"
                  required
                />
              </div>

              {error && <p className="text-xs text-red-400">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg mt-4"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
          )}
        </div>

        {/* Signup Link */}
        <div className="px-6 py-4 bg-gray-800 border-t border-gray-700 text-center">
          <p className="text-sm text-gray-400">
            Don&apos;t have an account?{' '}
            <a href="/auth/signUp" className="text-blue-400 font-medium hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
