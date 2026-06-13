import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ShieldAlert } from 'lucide-react';
import { useFormStore } from '../../store/useFormStore';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export const Login = () => {
  const { login } = useFormStore();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: '',
      password: '',
      remember: true
    }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMsg('');
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      const success = await login(data.email, data.password);
      if (success) {
        navigate('/dashboard');
      } else {
        setErrorMsg('Invalid email or password. Please try again.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'An error occurred. Please check your credentials.');
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
      
      {/* Main card panel */}
      <div className="w-full max-w-md bg-white border border-[#E2E8F0] rounded-xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="p-8 md:p-10 flex flex-col gap-6">
          
          {/* Header */}
          <div className="flex flex-col items-center text-center gap-2">
            <Link to="/" className="text-xl font-bold tracking-tight text-[#0F172A]">
              FormForge
            </Link>
            <div>
              <h2 className="text-xl font-bold text-[#0F172A] mt-1">Sign in to your account</h2>
              <p className="text-xs text-[#64748B] mt-0.5">Enter details to open your admin workspace</p>
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="bg-red-50 border border-red-150 text-[#EF4444] text-xs p-3 rounded-lg flex items-center gap-2">
              <ShieldAlert className="h-4.5 w-4.5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            {/* Email Field */}
            <div className="form-control w-full">
              <Input
                label="Email Address"
                type="email"
                placeholder="e.g. admin@formforge.ai"
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
                placeholder="Enter password..."
                error={errors.password?.message}
                {...register('password', { 
                  required: 'Password is required'
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

            {/* Options */}
            <div className="flex items-center justify-between py-1 text-xs font-semibold">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded border-slate-350 text-[#4F46E5] h-3.5 w-3.5 focus:ring-[#4F46E5]/15"
                  {...register('remember')}
                />
                <span className="text-[#64748B]">Keep me signed in</span>
              </label>
              <Link to="/forgot-password" className="text-[#4F46E5] hover:underline">
                Forgot password?
              </Link>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              loading={loading}
              className="w-full font-bold shadow-sm"
            >
              Sign In
            </Button>
          </form>
          
          <div className="text-center mt-2">
            <span className="text-xs text-[#64748B]">New to FormForge? </span>
            <Link to="/register" className="text-xs font-bold text-[#4F46E5] hover:underline">
              Create an account
            </Link>
          </div>

        </div>
      </div>
    </div>
  </div>
  );
};

export default Login;
