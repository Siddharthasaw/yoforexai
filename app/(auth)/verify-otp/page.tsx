'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { postData } from '../../../utils/api'; // adjust path if needed

export default function VerifyOtp() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const number = searchParams.get('number') || '';
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const phone = `+${number.replace(/\D/g, '')}`;

      const response = await postData('/auth/verify-signup-otp', {
        phone,
        otp,
      });

      if (response?.status === 'success' || response?.token) {
        // Token mil gaya to dashboard bhej do
        router.push('/dashboard');
      } else {
        // API ne success nai bola
        setError('Invalid OTP or verification failed');
      }
    } catch (err: any) {
      let msg = err.message;
      if (err?.response?.detail) {
        if (Array.isArray(err.response.detail)) {
          msg = err.response.detail.map((d: any) => d.msg).join(', ');
        } else if (typeof err.response.detail === 'string') {
          msg = err.response.detail;
        }
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-700 mx-4 my-8">
        <div className="bg-gray-800 p-8 text-center border-b border-gray-700">
          <h1 className="text-3xl font-bold text-white">Verify OTP</h1>
          <p className="text-gray-400 mt-2 text-sm">
            Enter the 6-digit code sent to your WhatsApp ending with {number?.slice(-4)}
          </p>
        </div>

        <form onSubmit={handleVerify} className="p-6 space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">OTP Code</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-digit OTP"
              maxLength={6}
              required
              className="w-full p-3 bg-gray-700 border border-gray-600 text-white rounded-lg placeholder-gray-400"
            />
            {error && (
              <div className="flex items-center gap-2 bg-red-600/10 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-2 animate-shake">
                <svg className="w-5 h-5 text-red-400 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01" />
                </svg>
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition duration-200 flex items-center justify-center mt-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verifying...
              </>
            ) : (
              'Verify & Continue'
            )}
          </button>
        </form>

        <div className="px-6 py-4 bg-gray-800 border-t border-gray-700 text-center">
          <p className="text-sm text-gray-400">
            Wrong number?{' '}
            <a href="/auth/signIn" className="text-blue-400 font-medium hover:underline">
              Go back to login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}


