import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ShieldCheck, ShieldAlert } from 'lucide-react';
import { useFormStore } from '../../store/useFormStore';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export const Register = () => {
  const { register: storeRegister } = useFormStore();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMsg('');
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      await storeRegister(data.name, data.email, data.password);
      setSuccessMsg('Account created! Logging in...');
      setTimeout(() => navigate('/dashboard'), 500);
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans select-none">
      
      {/* Sticky Header Navbar */}
      <header className="sticky top-0 z-50 bg-white border-b border-[#E2E8F0] px-6 py-4 shadow-[0_1px_2px_0_rgba(0,0,0,0.02)] shrink-0">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between">
          <Link to="/" className="text-lg font-bold tracking-tight text-[#0F172A]">
            FormForge
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/login" className="px-3 py-1.5 text-sm font-semibold text-[#64748B] hover:text-[#0F172A] transition-colors">
              Sign In
            </Link>
            <Link to="/register">
              <Button variant="primary" size="sm" className="font-semibold shadow-sm">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main card center container */}
      <div className="flex-1 flex flex-col justify-center items-center p-4">
      
      <div className="w-full max-w-md bg-white border border-[#E2E8F0] rounded-xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="p-8 md:p-10 flex flex-col gap-6">
          
          {/* Header */}
          <div className="flex flex-col items-center text-center gap-2">
            <Link to="/" className="text-xl font-bold tracking-tight text-[#0F172A]">
              FormForge
            </Link>
            <div>
              <h2 className="text-xl font-bold text-[#0F172A] mt-1">Create your account</h2>
              <p className="text-xs text-[#64748B] mt-0.5">Start building dynamic forms immediately</p>
            </div>
          </div>

          {/* Success Dialog */}
          {successMsg && (
            <div className="bg-emerald-50 border border-emerald-150 text-[#22C55E] text-xs p-3 rounded-lg flex items-center gap-2">
              <ShieldCheck className="h-4.5 w-4.5 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Error Dialog */}
          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-500 text-xs p-3 rounded-lg flex items-center gap-2">
              <ShieldAlert className="h-4.5 w-4.5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            {/* Name Field */}
            <div className="form-control w-full">
              <Input
                label="Full Name"
                type="text"
                placeholder="Jane Doe"
                error={errors.name?.message}
                {...register('name', { required: 'Name is required' })}
              />
            </div>

            {/* Email Field */}
            <div className="form-control w-full">
              <Input
                label="Email Address"
                type="email"
                placeholder="jane@formforge.ai"
                error={errors.email?.message}
                {...register('email', { 
                  required: 'Email is required',
                  pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
                })}
              />
            </div>

            {/* Password Field */}
            <div className="form-control w-full relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Choose password..."
                error={errors.password?.message}
                {...register('password', { 
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters' }
                })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[34px] text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {/* Confirm Password Field */}
            <div className="form-control w-full">
              <Input
                label="Confirm Password"
                type="password"
                placeholder="Verify password..."
                error={errors.confirmPassword?.message}
                {...register('confirmPassword', { 
                  required: 'Please confirm password',
                  validate: value => value === password || 'Passwords do not match'
                })}
              />
            </div>

            {/* Terms checkbox */}
            <label className="flex items-start gap-2.5 py-1.5 cursor-pointer">
              <input
                type="checkbox"
                required
                className="rounded border-slate-350 text-[#4F46E5] h-3.5 w-3.5 focus:ring-[#4F46E5]/15 mt-0.5"
              />
              <span className="text-xs text-[#64748B] leading-relaxed">
                I agree to the Terms of Service and Privacy Policy
              </span>
            </label>

            {/* Register Trigger Button */}
            <Button
              type="submit"
              loading={loading}
              className="w-full font-bold shadow-sm"
            >
              Create Account
            </Button>
          </form>

          <div className="text-center mt-2">
            <span className="text-xs text-[#64748B]">Already have an account? </span>
            <Link to="/login" className="text-xs font-bold text-[#4F46E5] hover:underline">
              Sign In
            </Link>
          </div>

        </div>
      </div>
    </div>
  </div>
  );
};

export default Register;
