import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export const ForgotPassword = () => {
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      setSuccess(true);
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
              <h2 className="text-xl font-bold text-[#0F172A] mt-1">Recover password</h2>
              <p className="text-xs text-[#64748B] mt-0.5">We will send reset instructions to your inbox</p>
            </div>
          </div>

          {success ? (
            <div className="flex flex-col items-center text-center gap-4 py-4">
              <div className="p-3 bg-emerald-50 text-[#22C55E] rounded-full border border-emerald-150">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <div>
                <h3 className="font-bold text-base text-[#0F172A]">Instructions Sent</h3>
                <p className="text-xs text-[#64748B] mt-1">Check your inbox for password reset instructions.</p>
              </div>
              <Link to="/reset-password" className="text-xs font-bold text-[#4F46E5] hover:underline mt-2">
                Simulate Resetting Password
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

              <Button
                type="submit"
                loading={loading}
                className="w-full font-bold shadow-sm"
              >
                Send Reset Link
              </Button>
            </form>
          )}

          <div className="text-center mt-2 border-t border-[#E2E8F0] pt-4">
            <Link to="/login" className="text-xs font-bold text-[#64748B] hover:text-[#0F172A] flex items-center justify-center gap-1.5 hover:underline">
              <ArrowLeft className="h-4 w-4" />
              Back to Sign In
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
