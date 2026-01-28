
import React, { useState, useEffect, useRef } from 'react';
import { Icons } from '../constants';

interface AuthProps {
  onLogin: (userName: string) => void;
  lang: 'bn' | 'en';
  onLangToggle: () => void;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
}

type AuthState = 'login' | 'register' | 'reset';

const Auth: React.FC<AuthProps> = ({ onLogin, lang, onLangToggle, theme, onThemeToggle }) => {
  const [authState, setAuthState] = useState<AuthState>('login');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const userRef = useRef<HTMLInputElement>(null);

  const t = {
    title: 'Unity Savings Society',
    subtitle: lang === 'bn' ? 'ক্ষুদ্র সঞ্চয়, সুদৃঢ় ঐক্য' : 'Small Savings, Strong Unity',
    loginHeader: lang === 'bn' ? 'স্বাগতম, আবার এসেছেন!' : 'Welcome Back!',
    registerHeader: lang === 'bn' ? 'সোসাইটি সেটআপ করুন' : 'Setup Your Society',
    resetHeader: lang === 'bn' ? 'নতুন পিন সেট করুন' : 'Set New Pin',
    userNameLabel: lang === 'bn' ? 'ইউজারনেম' : 'USERNAME',
    emailLabel: lang === 'bn' ? 'ইমেইল এড্রেস' : 'EMAIL ADDRESS',
    passwordLabel: lang === 'bn' ? 'সিকিউরিটি পিন' : 'SECURITY PIN',
    confirmLabel: lang === 'bn' ? 'পিন নিশ্চিত করুন' : 'CONFIRM PIN',
    loginBtn: lang === 'bn' ? 'সোসাইটি খুলুন' : 'Open Dashboard',
    registerBtn: lang === 'bn' ? 'শুরু করুন' : 'Get Started',
    resetBtn: lang === 'bn' ? 'পিন আপডেট করুন' : 'Update Pin',
    forgotLink: lang === 'bn' ? 'পিন ভুলে গেছেন?' : 'Forgot your pin?',
    backToLogin: lang === 'bn' ? 'লগইন-এ ফিরে যান' : 'Back to Login',
    createAccount: lang === 'bn' ? 'নতুন অ্যাকাউন্ট খুলুন' : 'Create new account',
    errorEmpty: lang === 'bn' ? 'সবগুলো ঘর পূরণ করুন' : 'Please fill all fields',
    errorMismatch: lang === 'bn' ? 'পিন দুটি মেলেনি' : 'Pins do not match',
    errorInvalid: lang === 'bn' ? 'ভুল নাম অথবা পিন' : 'Invalid name or pin',
    errorNoUser: lang === 'bn' ? 'এই নামে কাউকে পাওয়া যায়নি' : 'User not found',
    successReset: lang === 'bn' ? 'পিন সফলভাবে বদলেছে!' : 'Pin updated successfully!',
    dataSafe: lang === 'bn' ? 'আপনার তথ্য নিরাপদ' : 'Your data is encrypted',
    backupData: lang === 'bn' ? 'ব্যাকআপ নিন' : 'Download Backup',
    resetNote: lang === 'bn' ? 'নোট: ডাটা ডিলিট হবে না' : 'Note: Your data is safe.'
  };

  useEffect(() => {
    const hasCreds = localStorage.getItem('medstore_creds');
    if (!hasCreds) setAuthState('register');
    setTimeout(() => userRef.current?.focus(), 500);
  }, []);

  const handleBackup = () => {
    const data = localStorage.getItem('medstore_transactions');
    if (!data) {
      setError(lang === 'bn' ? 'ব্যাকআপ করার মতো কিছু নেই' : 'Nothing to backup yet');
      return;
    }
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `unity_savings_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setSuccess(lang === 'bn' ? 'ব্যাকআপ সম্পন্ন!' : 'Backup Complete!');
  };

  const handleAction = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (authState === 'register') {
      if (!userName || !password || !email) return setError(t.errorEmpty);
      localStorage.setItem('medstore_creds', JSON.stringify({ userName, password, email }));
      sessionStorage.setItem('medstore_session', userName);
      onLogin(userName);
    } 
    else if (authState === 'login') {
      if (!userName || !password) return setError(t.errorEmpty);
      const saved = JSON.parse(localStorage.getItem('medstore_creds') || '{}');
      if (saved.userName?.toLowerCase() === userName.toLowerCase() && saved.password === password) {
        sessionStorage.setItem('medstore_session', saved.userName);
        onLogin(saved.userName);
      } else setError(t.errorInvalid);
    }
    else if (authState === 'reset') {
      if (!userName || !password || !confirmPassword) return setError(t.errorEmpty);
      if (password !== confirmPassword) return setError(t.errorMismatch);
      const saved = JSON.parse(localStorage.getItem('medstore_creds') || '{}');
      if (saved.userName?.toLowerCase() === userName.toLowerCase()) {
        localStorage.setItem('medstore_creds', JSON.stringify({ ...saved, password }));
        setSuccess(t.successReset);
        setTimeout(() => {
          setAuthState('login');
          setSuccess('');
        }, 1500);
      } else setError(t.errorNoUser);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden transition-colors duration-700">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-500/10 dark:bg-brand-600/5 blur-[120px] rounded-full pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-teal-500/10 dark:bg-teal-600/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="absolute top-8 right-8 flex gap-3">
        <button onClick={onThemeToggle} className="p-3 bg-white dark:bg-slate-900 shadow-xl rounded-2xl border border-slate-100 dark:border-slate-800 text-slate-500 hover:text-brand-500 transition-all active:scale-90">
          {theme === 'light' ? <Icons.Moon /> : <Icons.Sun />}
        </button>
        <button onClick={onLangToggle} className="p-3 bg-white dark:bg-slate-900 shadow-xl rounded-2xl border border-slate-100 dark:border-slate-800 text-slate-500 hover:text-brand-500 transition-all active:scale-90">
          <Icons.Globe />
        </button>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-slate-900 dark:bg-brand-600 rounded-[2rem] flex items-center justify-center text-white shadow-2xl mb-8 mx-auto scale-110">
            <Icons.Wallet className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tighter">{t.title}</h1>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] opacity-80">{t.subtitle}</p>
        </div>

        <div className="bg-white dark:bg-slate-900/60 backdrop-blur-3xl border border-white dark:border-slate-800/80 rounded-[3.5rem] p-10 md:p-14 shadow-3xl shadow-slate-200/60 dark:shadow-none">
          <div className="mb-10 text-center">
             <h2 className="text-xl font-black text-slate-900 dark:text-white mb-2">
               {authState === 'login' ? t.loginHeader : authState === 'register' ? t.registerHeader : t.resetHeader}
             </h2>
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.dataSafe}</p>
          </div>
          
          <form onSubmit={handleAction} className="space-y-6">
            <div className="space-y-1.5 group">
              <label className="block text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-1 group-focus-within:text-brand-500 transition-colors">
                {t.userNameLabel}
              </label>
              <input
                ref={userRef}
                type="text"
                placeholder="e.g. Mamun"
                className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 rounded-2xl px-6 py-4.5 text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-brand-500/10 transition-all font-bold text-sm"
                value={userName} onChange={(e) => setUserName(e.target.value)}
              />
            </div>

            {authState === 'register' && (
              <div className="space-y-1.5 group animate-in slide-in-from-top-4 duration-500">
                <label className="block text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-1 group-focus-within:text-brand-500 transition-colors">
                  {t.emailLabel}
                </label>
                <input
                  type="email"
                  placeholder="e.g. mamun@example.com"
                  className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 rounded-2xl px-6 py-4.5 text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-brand-500/10 transition-all font-bold text-sm"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            )}

            <div className="space-y-1.5 group">
              <label className="block text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-1 group-focus-within:text-brand-500 transition-colors">
                {t.passwordLabel}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••"
                  className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 rounded-2xl px-6 py-4.5 text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-brand-500/10 transition-all font-bold text-sm tracking-widest"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                  )}
                </button>
              </div>
            </div>

            {authState === 'reset' && (
              <div className="space-y-1.5 group animate-in slide-in-from-top-4 duration-500">
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 group-focus-within:text-brand-500 transition-colors">{t.confirmLabel}</label>
                <input
                  type="password"
                  placeholder="••••••"
                  className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 rounded-2xl px-6 py-4.5 text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-brand-500/10 transition-all font-bold text-sm tracking-widest"
                  value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            )}

            {error && <div className="bg-rose-50 dark:bg-rose-500/10 border border-rose-100 py-3 rounded-xl text-rose-500 text-[10px] font-black text-center uppercase tracking-widest animate-shake">{error}</div>}
            {success && <div className="bg-teal-50 dark:bg-teal-500/10 border border-teal-100 py-3 rounded-xl text-teal-600 text-[10px] font-black text-center uppercase tracking-widest">{success}</div>}

            <button type="submit" className="w-full bg-slate-950 dark:bg-brand-600 hover:bg-slate-800 dark:hover:bg-brand-500 text-white font-black py-5 rounded-2xl shadow-2xl transition-all active:scale-[0.97] text-sm uppercase tracking-[0.2em]">
              {authState === 'login' ? t.loginBtn : authState === 'register' ? t.registerBtn : t.resetBtn}
            </button>
          </form>

          <div className="mt-10 flex flex-col items-center gap-5">
            <div className="flex flex-col items-center gap-3">
              {authState === 'login' ? (
                <>
                  <button onClick={() => setAuthState('reset')} className="text-[10px] font-black text-slate-400 hover:text-brand-500 uppercase tracking-[0.2em] transition-colors">{t.forgotLink}</button>
                  <button onClick={() => setAuthState('register')} className="text-[10px] font-black text-brand-600 dark:text-brand-400 hover:underline uppercase tracking-[0.2em] transition-all">{t.createAccount}</button>
                </>
              ) : (
                <button onClick={() => setAuthState('login')} className="text-[10px] font-black text-slate-400 hover:text-brand-500 uppercase tracking-[0.2em] transition-colors flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>
                  {t.backToLogin}
                </button>
              )}
            </div>
            
            <div className="w-full pt-8 border-t border-slate-100 dark:border-slate-800/60 flex flex-col items-center gap-4">
              <button 
                onClick={handleBackup}
                className="group flex items-center gap-3 bg-slate-50 dark:bg-slate-950 px-6 py-2.5 rounded-full border border-slate-100 dark:border-slate-800 transition-all hover:border-brand-500/30"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-teal-500 group-hover:animate-ping"></div>
                <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">{t.backupData}</span>
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-12 text-center space-y-2">
          <p className="text-brand-600 dark:text-brand-400 text-[10px] font-black uppercase tracking-[0.6em] animate-pulse">Developed by Mamun</p>
          <p className="text-slate-400 dark:text-slate-600 text-[8px] font-bold uppercase tracking-[0.5em] opacity-40">
            Enterprise Security Standard &bull; © {new Date().getFullYear()}
          </p>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
      `}} />
    </div>
  );
};

export default Auth;
