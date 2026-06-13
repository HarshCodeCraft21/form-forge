import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export const ResetPassword = () => {
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      setSuccess(true);
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center items-center p-4 font-sans select-none">

      <div className="w-full max-w-md bg-white border border-[#E2E8F0] rounded-xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="p-8 md:p-10 flex flex-col gap-6">
          
          {/* Header */}
          <div className="flex flex-col items-center text-center gap-2">
            <Link to="/" className="text-xl font-bold tracking-tight text-[#0F172A]">
              FormForge
            </Link>
            <div>
              <h2 className="text-xl font-bold text-[#0F172A] mt-1">Set new password</h2>
              <p className="text-xs text-[#64748B] mt-0.5">Please define a new passcode below</p>
            </div>
          </div>

          {success ? (
            <div className="flex flex-col items-center text-center gap-4 py-4">
              <div className="p-3 bg-emerald-50 text-[#22C55E] rounded-full border border-emerald-150">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <div>
                <h3 className="font-bold text-base text-[#0F172A]">Password Reset!</h3>
                <p className="text-xs text-[#64748B] mt-1">Loading login screen...</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              
              {/* Password */}
              <div className="form-control w-full">
                <Input
                  label="New Password"
                  type="password"
                  placeholder="Min 6 characters..."
                  error={errors.password?.message}
                  {...register('password', { 
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' }
                  })}
                />
              </div>

              {/* Confirm Password */}
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

              <Button
                type="submit"
                loading={loading}
                className="w-full font-bold shadow-sm"
              >
                Reset Password
              </Button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
