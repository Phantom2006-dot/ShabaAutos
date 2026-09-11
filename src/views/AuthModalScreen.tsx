import React, { useState } from 'react';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  Phone,
  Headphones,
  Car as CarIcon,
  CreditCard,
  Truck,
  Wrench,
  ArrowRight,
} from 'lucide-react';
import { ScreenId } from '../types';

interface AuthModalScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onClose?: () => void;
}

export const AuthModalScreen: React.FC<AuthModalScreenProps> = ({ onNavigate }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [resetMessage, setResetMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('saved-compare');
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col justify-between">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Welcome copy, value points, car photo & metrics card matching Web2.png */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-black text-slate-950 tracking-tight leading-[1.1] mb-3">
                Welcome to <br />
                <span className="text-[#0e7c3a]">ShabaAutos</span>
              </h1>
              <p className="text-slate-600 text-sm sm:text-base font-normal mb-8 max-w-xl leading-relaxed">
                Your one-stop platform to buy, rent or import quality cars with confidence.
              </p>

              {/* 3 Value Points */}
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-200/70 text-[#0e7c3a] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 leading-tight">Verified Cars</h3>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">Quality cars you can trust.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-200/70 text-[#0e7c3a] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 leading-tight">Secure & Transparent</h3>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">Safe payments and clear processes.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-200/70 text-[#0e7c3a] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Headphones className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 leading-tight">Support You Can Rely On</h3>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">We're here to help you at every step.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Car Showcase with Urban City Skyline matching Web2.png */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm bg-white mt-2">
              <img
                src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1400&q=85"
                alt="Silver Luxury SUV on Urban Promenade"
                className="w-full h-64 sm:h-72 lg:h-80 object-cover object-center"
              />

              {/* Floating Bottom Card: 3 Key Metrics */}
              <div className="bg-white/95 backdrop-blur-xs border-t border-slate-200/80 px-4 py-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#0e7c3a] border border-emerald-100 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Trusted Platform</h4>
                    <p className="text-[11px] text-slate-500 leading-tight">Thousands of happy customers</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 border-t sm:border-t-0 sm:border-l border-slate-100 sm:pl-4 pt-3 sm:pt-0">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#0e7c3a] border border-emerald-100 flex items-center justify-center flex-shrink-0">
                    <CarIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Wide Selection</h4>
                    <p className="text-[11px] text-slate-500 leading-tight">New, tokunbo and rental cars</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 border-t sm:border-t-0 sm:border-l border-slate-100 sm:pl-4 pt-3 sm:pt-0">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#0e7c3a] border border-emerald-100 flex items-center justify-center flex-shrink-0">
                    <Headphones className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Expert Support</h4>
                    <p className="text-[11px] text-slate-500 leading-tight">Our team is always ready to assist</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sign In / Create Account Card matching Web2.png */}
          <div className="lg:col-span-5 flex flex-col justify-start">
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
              {/* Tabs: Sign In / Create Account */}
              <div className="flex border-b border-slate-200 mb-6">
                <button
                  type="button"
                  onClick={() => setIsSignUp(false)}
                  className={`flex-1 pb-3 text-center text-sm font-bold transition-all relative ${
                    !isSignUp
                      ? 'text-[#0e7c3a]'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Sign In
                  {!isSignUp && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#0e7c3a] rounded-full" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setIsSignUp(true)}
                  className={`flex-1 pb-3 text-center text-sm font-bold transition-all relative ${
                    isSignUp
                      ? 'text-[#0e7c3a]'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Create Account
                  {isSignUp && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#0e7c3a] rounded-full" />
                  )}
                </button>
              </div>

              {/* Card Heading */}
              <div className="mb-6">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {isSignUp ? 'Create Account' : 'Sign In'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  {isSignUp
                    ? 'Fill in your details to start buying, renting or importing.'
                    : 'Welcome back! Please sign in to your account.'}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {isSignUp && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Enter your full name"
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#0e7c3a]/20 focus:border-[#0e7c3a]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+234 810 123 4567"
                          className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#0e7c3a]/20 focus:border-[#0e7c3a]"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#0e7c3a]/20 focus:border-[#0e7c3a]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#0e7c3a]/20 focus:border-[#0e7c3a]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {!isSignUp && (
                  <div className="flex flex-col items-end gap-1">
                    <button
                      type="button"
                      onClick={() => setResetMessage('Password reset link sent to your registered email.')}
                      className="text-xs font-bold text-[#0e7c3a] hover:underline cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                    {resetMessage && (
                      <span className="text-[11px] text-emerald-700 font-medium animate-in fade-in">
                        {resetMessage}
                      </span>
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 bg-[#0a502c] hover:bg-[#07391f] text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-xs hover:shadow-sm transition-all cursor-pointer mt-2"
                >
                  {isSignUp ? 'Create Account' : 'Sign In'}
                </button>
              </form>

              {/* or continue with */}
              <div className="relative flex py-4 items-center my-1">
                <div className="grow border-t border-slate-200" />
                <span className="shrink mx-3 text-xs text-slate-400 font-medium">
                  or continue with
                </span>
                <div className="grow border-t border-slate-200" />
              </div>

              {/* Social Login Buttons: Google & Facebook */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                <button
                  type="button"
                  onClick={() => onNavigate('saved-compare')}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  Google
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('saved-compare')}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-[#1877F2]" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Facebook
                </button>
              </div>

              {/* Bottom switch link */}
              <p className="text-center text-xs text-slate-600">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="font-bold text-[#0e7c3a] hover:underline cursor-pointer"
                >
                  {isSignUp ? 'Sign In' : 'Create Account'}
                </button>
              </p>
            </div>

            {/* 3 Security Features under Card matching Web2.png */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-2">
              <div className="flex items-center gap-2 text-slate-700">
                <Lock className="w-4 h-4 text-[#0e7c3a] flex-shrink-0" />
                <div>
                  <h5 className="text-xs font-bold leading-tight">Secure & Encrypted</h5>
                  <p className="text-[10px] text-slate-500">Your data is protected</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-[#0e7c3a] flex-shrink-0" />
                <div>
                  <h5 className="text-xs font-bold leading-tight">Easy & Fast</h5>
                  <p className="text-[10px] text-slate-500">Quick access to your account</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-slate-700">
                <Headphones className="w-4 h-4 text-[#0e7c3a] flex-shrink-0" />
                <div>
                  <h5 className="text-xs font-bold leading-tight">Need Help?</h5>
                  <p className="text-[10px] text-slate-500">+234 810 123 4567</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom 4-Pillar Trust Bar matching Web2.png & design system */}
      <div className="border-t border-slate-200 bg-white py-5 px-4 sm:px-6 lg:px-8 mt-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 text-[#0e7c3a] flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-slate-900">7-Day Inspection</h5>
              <p className="text-[11px] text-slate-500">Peace of mind before you buy</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 text-[#0e7c3a] flex items-center justify-center flex-shrink-0">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-slate-900">Nationwide Delivery</h5>
              <p className="text-[11px] text-slate-500">We deliver to your doorstep</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 text-[#0e7c3a] flex items-center justify-center flex-shrink-0">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-slate-900">Flexible Payment</h5>
              <p className="text-[11px] text-slate-500">Multiple secure payment options</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 text-[#0e7c3a] flex items-center justify-center flex-shrink-0">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-slate-900">After-Sales Support</h5>
              <p className="text-[11px] text-slate-500">We've got you covered</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
