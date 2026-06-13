import React, { useState, useRef, useEffect } from 'react';
import { 
  Settings as SettingsIcon, 
  User, 
  Lock, 
  Palette, 
  FileCheck
} from 'lucide-react';
import { useFormStore } from '../../store/useFormStore';
import Button from '../../components/ui/Button';

export const Settings = () => {
  const { user, theme, toggleTheme, updateProfile } = useFormStore();
  const [activeTab, setActiveTab] = useState('profile'); // profile | account | appearance
  const [toastMessage, setToastMessage] = useState('');

  // Profile Details State
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  // Password Update State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSaveProfile = async () => {
    if (!name.trim() || !email.trim()) {
      showToast('Name and email are required');
      return;
    }
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }
      await updateProfile(formData);
      showToast('Profile details updated!');
      setAvatarFile(null);
      setAvatarPreview(null);
    } catch (err) {
      showToast(err.message || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!newPassword) {
      showToast('Please enter a new password');
      return;
    }
    if (newPassword.length < 6) {
      showToast('Password must be at least 6 characters long');
      return;
    }
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('password', newPassword);
      await updateProfile(formData);
      showToast('Password updated!');
      setNewPassword('');
      setCurrentPassword('');
    } catch (err) {
      showToast(err.message || 'Failed to update password');
    } finally {
      setIsSubmitting(false);
    }
  };

  const tabs = [
    { id: 'profile', name: 'Profile Details', icon: User },
    { id: 'account', name: 'Account Settings', icon: Lock },
    { id: 'appearance', name: 'Appearance', icon: Palette }
  ];

  return (
    <div className="space-y-6 select-none relative font-sans">
      
      {/* Toast popup Alert */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-[200] shadow-xl bg-slate-900 text-white py-3 px-5 rounded-lg flex gap-3 items-center border border-slate-800 animate-bounce">
          <FileCheck className="h-5 w-5 text-[#4F46E5]" />
          <span className="font-semibold text-xs">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="border-b border-[#E2E8F0] pb-5">
        <h1 className="text-2xl font-bold text-[#0F172A] flex items-center gap-2">
          <SettingsIcon className="h-6 w-6 text-[#64748B]" />
          System Settings
        </h1>
        <p className="text-xs text-[#64748B] mt-1">Customize workspace configurations, profile details, and theme settings.</p>
      </div>

      {/* Grid: Tabs left, Content right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left tabs selector (3 Columns) */}
        <section className="lg:col-span-3 flex flex-col gap-1 bg-white p-2.5 rounded-xl border border-[#E2E8F0] shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold text-left w-full transition-colors cursor-pointer ${
                  isActive 
                    ? 'bg-slate-100 text-[#0F172A]' 
                    : 'text-[#64748B] hover:bg-slate-50 hover:text-[#0F172A]'
                }`}
              >
                <Icon className={`h-4.5 w-4.5 shrink-0 ${isActive ? 'text-[#0F172A]' : 'text-[#64748B]'}`} />
                {tab.name}
              </button>
            );
          })}
        </section>

        {/* Right Tab Content Card (9 Columns) */}
        <section className="lg:col-span-9 bg-white border border-[#E2E8F0] rounded-xl overflow-hidden min-h-[420px] shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
          <div className="p-6 md:p-8">
            
            {/* Tab: Profile */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-[#0F172A]">Profile Information</h3>
                  <p className="text-xs text-[#64748B] mt-0.5">Update your personal account credentials and profile display image.</p>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-slate-50 rounded-lg border border-[#E2E8F0]">
                  <img src={avatarPreview || user?.avatar || 'https://via.placeholder.com/150'} alt={user?.name} className="h-14 w-14 rounded-lg object-cover border border-[#E2E8F0] ring-4 ring-slate-100 shrink-0" />
                  <div className="text-center sm:text-left">
                    <h4 className="font-semibold text-xs text-[#0F172A]">{user?.name}</h4>
                    <p className="text-[10px] text-[#64748B] mt-0.5">{user?.role}</p>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleAvatarChange} 
                    />
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center justify-center mt-2 border border-[#E2E8F0] hover:bg-white text-[10px] font-semibold text-[#64748B] px-2 py-1 rounded transition-colors cursor-pointer"
                    >
                      Change Avatar
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-[#0F172A]">Full Name</label>
                    <input 
                      type="text" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-white border border-[#E2E8F0] focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/10 rounded-lg px-3 py-2 text-xs text-[#0F172A] outline-none transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-[#0F172A]">Email Address</label>
                    <input 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white border border-[#E2E8F0] focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/10 rounded-lg px-3 py-2 text-xs text-[#0F172A] outline-none transition-colors"
                    />
                  </div>
                </div>

                <Button 
                  onClick={handleSaveProfile} 
                  disabled={isSubmitting} 
                  className="font-semibold px-4 text-xs"
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            )}

            {/* Tab: Account */}
            {activeTab === 'account' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-[#0F172A]">Account Settings</h3>
                  <p className="text-xs text-[#64748B] mt-0.5">Modify safety passcodes or configure session logins.</p>
                </div>

                <div className="space-y-4 max-w-md">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-[#0F172A]">Current Password</label>
                    <input 
                      type="password" 
                      placeholder="••••••••" 
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full bg-white border border-[#E2E8F0] focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/10 rounded-lg px-3 py-2 text-xs text-[#0F172A] outline-none transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-[#0F172A]">New Password</label>
                    <input 
                      type="password" 
                      placeholder="Min 6 characters" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-white border border-[#E2E8F0] focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/10 rounded-lg px-3 py-2 text-xs text-[#0F172A] outline-none transition-colors"
                    />
                  </div>
                </div>

                <Button 
                  onClick={handleUpdatePassword} 
                  disabled={isSubmitting}
                  className="font-semibold px-4 text-xs"
                >
                  {isSubmitting ? 'Updating...' : 'Update Password'}
                </Button>

                <hr className="border-[#E2E8F0] my-2" />

                <div className="p-4 bg-red-50 border border-red-200 rounded-lg gap-3 flex flex-col">
                  <h4 className="font-semibold text-xs text-red-700">Danger Zone</h4>
                  <p className="text-xs text-red-600/80">Permanently delete your account along with all dynamic form schemas and responses logs.</p>
                  <button className="inline-flex items-center justify-center border border-red-200 hover:bg-white text-xs font-semibold text-red-700 px-3 py-1.5 rounded-lg transition-colors w-fit">
                    Delete Account
                  </button>
                </div>
              </div>
            )}

            {/* Tab: Appearance */}
            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-[#0F172A]">Appearance Settings</h3>
                  <p className="text-xs text-[#64748B] mt-0.5">Customize display layouts, themes, and screen visual elements.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  {/* Theme toggles */}
                  <div 
                    onClick={() => { if (theme === 'light') toggleTheme(); }}
                    className={`p-5 rounded-xl border-2 flex flex-col items-center justify-center text-center gap-3.5 cursor-pointer transition-all duration-200 ${
                      theme === 'dark' 
                        ? 'border-[#4F46E5] bg-slate-50' 
                        : 'border-[#E2E8F0] bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="p-3 bg-slate-800 text-white rounded-lg"><Palette className="h-5 w-5" /></div>
                    <span className="font-semibold text-xs text-[#0F172A]">Charcoal Dark Theme</span>
                    <p className="text-[10px] text-[#64748B] leading-relaxed">A sleep-friendly dark presentation utilizing optimal contrast values.</p>
                  </div>
                  
                  <div 
                    onClick={() => { if (theme === 'dark') toggleTheme(); }}
                    className={`p-5 rounded-xl border-2 flex flex-col items-center justify-center text-center gap-3.5 cursor-pointer transition-all duration-200 ${
                      theme === 'light' 
                        ? 'border-[#4F46E5] bg-slate-50' 
                        : 'border-[#E2E8F0] bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="p-3 bg-slate-100 text-slate-800 rounded-lg border border-[#E2E8F0]"><Palette className="h-5 w-5" /></div>
                    <span className="font-semibold text-xs text-[#0F172A]">Crisp Light Theme</span>
                    <p className="text-[10px] text-[#64748B] leading-relaxed">A vibrant day-friendly presentation matching crisp document sheets.</p>
                  </div>
                </div>
              </div>
            )}

          </div>
        </section>

      </div>

    </div>
  );
};

export default Settings;
