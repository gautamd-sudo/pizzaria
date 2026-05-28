import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLogin, useSignup } from '../hooks/useApi';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const loginMutation = useLogin();
  const signupMutation = useSignup();

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Determine where to redirect after login
  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Client-side validations
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters long.');
      return;
    }

    if (isSignUp) {
      if (!name || !email || !password) {
        setErrorMsg('Please fill in all required fields.');
        return;
      }
      
      const signUpData: any = { email, password, name };
      if (phone.trim() !== '') {
        signUpData.phone = phone;
      }

      signupMutation.mutate(
        signUpData,
        {
          onSuccess: (data) => {
            if (data.user.role === 'admin') {
              navigate('/admin');
            } else {
              navigate(from, { replace: true });
            }
          },
          onError: (err: any) => {
            const backendMsg = err.response?.data?.message;
            if (Array.isArray(backendMsg)) {
              setErrorMsg(backendMsg.join(', '));
            } else {
              setErrorMsg(backendMsg || 'Registration failed. Try again.');
            }
          },
        }
      );
    } else {
      if (!email || !password) {
        setErrorMsg('Please enter email and password.');
        return;
      }
      loginMutation.mutate(
        { email, password },
        {
          onSuccess: (data) => {
            if (data.user.role === 'admin') {
              navigate('/admin');
            } else {
              navigate(from, { replace: true });
            }
          },
          onError: (err: any) => {
            const backendMsg = err.response?.data?.message;
            if (Array.isArray(backendMsg)) {
              setErrorMsg(backendMsg.join(', '));
            } else {
              setErrorMsg(backendMsg || 'Invalid email or password.');
            }
          },
        }
      );
    }
  };

  return (
    <div className="bg-background-base text-on-surface min-h-screen flex items-center justify-center font-sans p-6">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAXl199LzWwcJfi6-2VVmls6annyY3KKvvg-xAohPEhtr15ROEZCP2e8IFlE3ltV_fCgfRDRF6J1Z7pAOHN9Rn0z6V18p8NoNOkBsbC-7HVUWDBcYuJWL354NkSjc6eJLRp0RE7KD67LuJsj0EoG2tlkxhRim4ghrWbR9E3x3xU4908hKemTkYRa_E9xPcR850LqPIUDAzaVk19Nf0Ov0H-QU3rKJGWmAx2iS8f4spofraXCNPS_Lx2ZSPQMs2dzlJHsSAsYAvSGpE" 
          alt="Pizza Background" 
          className="w-full h-full object-cover opacity-20 blur-sm scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background-base via-background-base/80 to-transparent"></div>
      </div>

      <div className="relative z-10 w-full max-w-md bg-surface-white border border-outline-variant rounded-2xl shadow-xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <span className="font-headline-lg text-4xl font-black text-primary block cursor-pointer" onClick={() => navigate('/')}>
            PizzaRally
          </span>
          <h2 className="text-xl font-bold text-on-surface">
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </h2>
          <p className="text-sm text-on-surface-variant">
            {isSignUp ? 'Join PizzaRally to order premium authentic pizzas.' : 'Access your catalog, cart, and dashboard.'}
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex bg-surface-container-low p-1 rounded-xl">
          <button 
            type="button"
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${!isSignUp ? 'bg-surface-white text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
            onClick={() => { setIsSignUp(false); setErrorMsg(''); }}
          >
            Sign In
          </button>
          <button 
            type="button"
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${isSignUp ? 'bg-surface-white text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
            onClick={() => { setIsSignUp(true); setErrorMsg(''); }}
          >
            Sign Up
          </button>
        </div>

        {errorMsg && (
          <div className="bg-red-50 text-red-600 border border-red-200 p-3 rounded-lg text-xs font-bold flex items-center gap-2 animate-shake">
            <span className="material-symbols-outlined text-sm">error</span>
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <>
              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface-variant">Full Name *</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                  placeholder="e.g. John Doe"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface-variant">Phone Number</label>
                <input 
                  type="text" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                  placeholder="e.g. +49 176 123456"
                />
              </div>
            </>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-on-surface-variant">Email Address *</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              placeholder="name@example.com"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-on-surface-variant">Password *</label>
              {!isSignUp && (
                <span className="text-[11px] font-bold text-primary hover:underline cursor-pointer">Forgot password?</span>
              )}
            </div>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            className="w-full py-3 bg-primary text-on-primary font-bold rounded-lg text-sm hover:brightness-110 active:scale-95 transition-all shadow-md mt-2 flex items-center justify-center gap-2"
            disabled={loginMutation.isPending || signupMutation.isPending}
          >
            {loginMutation.isPending || signupMutation.isPending ? (
              <span>Processing...</span>
            ) : (
              <>
                <span>{isSignUp ? 'Register Account' : 'Sign In'}</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
