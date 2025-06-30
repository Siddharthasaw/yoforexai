'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Select from 'react-select';
import countryList from 'react-select-country-list';
import ReactCountryFlag from 'react-country-flag';
import { postData } from '../../../utils/api'; // ✅ path adjust kar lena agar zarurat ho

const countryOptions = countryList().getData();

function getOptionLabel(option: any) {
  return (
    <span className="flex items-center gap-2">
      <ReactCountryFlag countryCode={option.value} svg style={{ width: '1.2em', height: '1.2em' }} />
      {option.label}
    </span>
  );
}

function formatPhone(phone: string) {
  // Agar + se start nahi hai, to +91 laga do (ya user country ke hisaab se)
  if (phone.startsWith('+')) return phone;
  // Default India ke liye +91, aap country code dynamic bhi kar sakte hain
  return '+91' + phone.replace(/^0+/, '');
}

export default function SignUp() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    email: '',
    country: 'India',
    whatsapp: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [apiError, setApiError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let newErrors: { [key: string]: string } = {};
    if (!form.name) newErrors.name = "Full Name is required";
    if (!form.email) newErrors.email = "Email is required";
    if (!form.country) newErrors.country = "Country is required";
    if (!form.whatsapp) newErrors.whatsapp = "WhatsApp number is required";
    if (!form.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      const payload = {
        name: form.name,
        email: form.email,
        country: form.country,
        phone: formatPhone(form.whatsapp), // <-- yahan formatPhone use karo
        password: form.password
      };

      await postData('/auth/signup', payload);
      router.push(`/verify-otp?number=${formatPhone(form.whatsapp)}`);
    } catch (err: any) {
      let msg = err.message;
      if (err?.response?.detail) {
        if (Array.isArray(err.response.detail)) {
          msg = err.response.detail.map((d: any) => d.msg).join(', ');
        } else {
          msg = err.response.detail;
        }
      }
      setApiError(msg);
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
            One account to access all DeepSeek services
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {apiError && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-400 text-red-300 px-4 py-3 rounded-lg mb-2 animate-shake">
              <svg className="w-5 h-5 text-red-400 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium">{apiError}</span>
            </div>
          )}

          {/* Full Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Full Name</label>
            <input
              name="name"
              placeholder="Enter your full name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full p-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
            />
            {errors.name && <p className="text-xs text-red-400">{errors.name}</p>}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={!!form.email}
                readOnly
                className="h-4 w-4 text-blue-500 rounded border-gray-600 bg-gray-700"
              />
              <label className="ml-2 text-sm font-medium text-gray-300">Email address</label>
            </div>
            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full p-3 bg-gray-700 border border-gray-600 text-white rounded-lg placeholder-gray-400"
            />
            {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
          </div>

          {/* Country */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Country</label>
            <Select
              options={countryOptions}
              value={countryOptions.find(opt => opt.label === form.country)}
              onChange={option => setForm({ ...form, country: option?.label || '' })}
              classNamePrefix="react-select"
              getOptionLabel={getOptionLabel}
              styles={{
                control: (base) => ({
                  ...base,
                  backgroundColor: '#374151',
                  borderColor: '#4b5563',
                  color: '#fff',
                  borderRadius: '0.5rem',
                  minHeight: '48px',
                }),
                singleValue: (base) => ({ ...base, color: '#fff' }),
                menu: (base) => ({ ...base, backgroundColor: '#374151', color: '#fff' }),
                option: (base, state) => ({
                  ...base,
                  backgroundColor: state.isFocused ? '#2563eb' : '#374151',
                  color: '#fff',
                }),
                input: (base) => ({ ...base, color: '#fff' }),
              }}
            />
            {errors.country && <p className="text-red-500 text-xs">{errors.country}</p>}
          </div>

          {/* WhatsApp */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">WhatsApp Number</label>
            <input
              name="whatsapp"
              placeholder="Enter your WhatsApp number"
              value={form.whatsapp}
              onChange={handleChange}
              required
              className="w-full p-3 bg-gray-700 border border-gray-600 text-white rounded-lg placeholder-gray-400 autofill:bg-gray-700"
            />
            {errors.whatsapp && <p className="text-red-500 text-xs">{errors.whatsapp}</p>}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={!!form.password}
                readOnly
                className="h-4 w-4 text-blue-500 rounded border-gray-600 bg-gray-700"
              />
              <label className="ml-2 text-sm font-medium text-gray-300">Password</label>
            </div>
            <input
              name="password"
              type="password"
              placeholder="Create a password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full p-3 bg-gray-700 border border-gray-600 text-white rounded-lg placeholder-gray-400 autofill:bg-gray-700"
            />
            {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200 flex items-center justify-center mt-6"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating account...
              </>
            ) : (
              'Sign Up'
            )}
          </button>

          {/* Terms */}
          <p className="text-xs text-gray-500 text-center mt-4">
            By signing up, you agree to our <a href="#" className="text-blue-400 hover:underline">Terms</a> and <a href="#" className="text-blue-400 hover:underline">Privacy Policy</a>.
          </p>
        </form>

        {/* Login Link */}
        <div className="px-6 py-4 bg-gray-800 border-t border-gray-700 text-center">
          <p className="text-sm text-gray-400">
            Already have an account?{' '}
            <a href="/auth/login" className="text-blue-400 font-medium hover:underline">
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}


