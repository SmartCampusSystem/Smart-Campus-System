import React, { useState } from 'react';
import { Mail, Lock, Loader2, Eye, EyeOff, ArrowRight, ShieldCheck, Zap, Fingerprint, Activity } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8082/oauth2/authorization/google';
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const loginData = new URLSearchParams();
    loginData.append('username', email);
    loginData.append('password', password);

    try {
      const response = await fetch('http://localhost:8082/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: loginData,
      });

      if (response.ok) {
        const userDetailsResponse = await fetch(
          `http://localhost:8082/api/users/by-email?email=${encodeURIComponent(email)}`,
          { method: 'GET', headers: { 'Accept': 'application/json' } }
        );

        if (userDetailsResponse.ok) {
          const userData = await userDetailsResponse.json();

          // --- Navbar එක update වීමට අවශ්‍ය දත්ත මෙතනදී save කරනවා ---
          localStorage.setItem('token', 'authenticated_session'); // ඕනෑම string එකක් (token එකක් නැති නිසා)
          localStorage.setItem('user', JSON.stringify(userData));
          
          // Navbar එකට මේ වෙනස වහාම හඳුනාගැනීමට "storage" event එකක් යවනවා
          window.dispatchEvent(new Event("storage"));
          // -------------------------------------------------------

          toast.success(`Welcome back, ${userData.name}!`);
          if (userData.role === 'ADMIN') navigate('/admin/*');
          else if (userData.role === 'TECHNICIAN') navigate('/tech/dashboard');
          else navigate('/');
        } else { 
          // User details ගන්න බැරි වුණත්, login සාර්ථක නම් token එක දානවා
          localStorage.setItem('token', 'authenticated_session');
          window.dispatchEvent(new Event("storage"));
          navigate('/'); 
        }
      } else { 
        toast.error('Access denied. Please check credentials.'); 
      }
    } catch (error) {
      toast.error('Server connection failed.');
    } finally { setLoading(false); }
  };

  return (
    <main className="h-screen w-full overflow-hidden bg-white flex font-sans selection:bg-[#0c5252] selection:text-white">
      
      {/* --- Left Section: Login Interface --- */}
      <section className="relative w-full md:w-[35%] lg:w-[30%] bg-white flex flex-col z-30 border-r border-slate-100">
        
        {/* Branding Line */}
        <div className="h-1.5 w-full bg-[#0c5252]"></div>

        <div className="flex-1 px-10 py-10 flex flex-col justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#0c5252] rounded-xl flex items-center justify-center shadow-lg shadow-[#0c5252]/20">
              <ShieldCheck className="text-white" size={22} />
            </div>
            <div>
              <h2 className="text-[#0c5252] font-black text-xl tracking-tight leading-none uppercase">Smart Campus</h2>
              <p className="text-[#7c5c14] text-[9px] font-bold tracking-[0.2em] uppercase">Operations Hub</p>
            </div>
          </div>

          {/* Login Form Container */}
          <div className="w-full max-w-sm mx-auto">
            <header className="mb-8">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#f0f4f4] text-[#0c5252] text-[10px] font-bold uppercase tracking-widest mb-4">
                <Fingerprint size={12} /> Secure Access
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Sign in to <br/>
                <span className="text-[#0c5252]">Your Account.</span>
              </h1>
            </header>

            <div className="space-y-5">
              {/* Google SSO */}
              <button 
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-3 py-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 text-sm transition-all active:scale-[0.98]"
              >
                <img alt="Google" className="w-4 h-4" src="https://www.svgrepo.com/show/475656/google-color.svg" />
                Sign in with Google
              </button>

              <div className="relative flex items-center py-1">
                <div className="flex-grow border-t border-slate-100"></div>
                <span className="mx-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Or use email</span>
                <div className="flex-grow border-t border-slate-100"></div>
              </div>

              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Email</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0c5252] transition-colors" size={16} />
                    <input
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-transparent focus:border-[#0c5252]/20 focus:bg-white focus:ring-4 focus:ring-[#0c5252]/5 rounded-xl text-slate-900 font-semibold transition-all outline-none text-sm"
                      type="email"
                      placeholder="email@campus.ac.lk"
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center ml-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Password</label>
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0c5252] transition-colors" size={16} />
                    <input
                      className="w-full pl-11 pr-11 py-3 bg-slate-50 border border-transparent focus:border-[#0c5252]/20 focus:bg-white focus:ring-4 focus:ring-[#0c5252]/5 rounded-xl text-slate-900 font-semibold transition-all outline-none text-sm"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#0c5252]">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button 
                  disabled={loading}
                  className="w-full py-3.5 bg-[#0c5252] text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-[#0c5252]/20 hover:bg-[#154646] transition-all flex items-center justify-center gap-2 mt-4"
                  type="submit"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : (
                    <>Sign In <ArrowRight size={14} /></>
                  )}
                </button>
              </form>
            </div>
          </div>

          <div className="text-center">
            <p className="text-xs font-medium text-slate-400">
              Need access? <a className="text-[#0c5252] font-bold hover:underline" href="/register">Register here</a>
            </p>
          </div>
        </div>
      </section>

      {/* --- Right Section: Visual Showcase --- */}
      <section className="hidden md:flex flex-1 relative flex-col items-center justify-center p-12 bg-[#0c5252] overflow-hidden">
        
        {/* Decorative Background Circles */}
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#2d6a6a] opacity-30 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-[#7c5c14] opacity-20 blur-[100px] rounded-full"></div>
        
        <div className="relative w-full max-w-4xl z-10">
          
          {/* Main Mockup Card */}
          <div className="relative rounded-[32px] overflow-hidden shadow-2xl border border-white/10 bg-[#f8fafa]">
            {/* Top Browser Bar */}
            <div className="px-6 py-3 flex items-center justify-between bg-white border-b border-slate-100">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]"></div>
              </div>
              <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest tracking-[0.2em]">Smart Campus System</div>
              <Activity size={14} className="text-[#0c5252]" />
            </div>
            
            {/* Preview Image */}
            <div className="aspect-video relative group">
              <img 
                src="https://i.pinimg.com/1200x/ad/2f/3a/ad2f3a9dbf640cf6cd22b9ca12f90d17.jpg" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                alt="System Interface" 
              />
              <div className="absolute inset-0 bg-[#0c5252]/20 mix-blend-multiply"></div>
              
              {/* Overlay Content */}
              <div className="absolute bottom-8 left-8 right-8">
                <h2 className="text-white text-4xl font-black tracking-tight leading-none mb-2">Modernizing <br/>Education.</h2>
                <p className="text-white/70 text-sm font-medium">Fully integrated facility and asset management system.</p>
              </div>
            </div>
          </div>

          {/* Stats / Info Row */}
          <div className="mt-12 flex justify-between items-center px-4">
            <div className="flex gap-8">
              <div>
                <p className="text-white font-black text-2xl tracking-tight">100%</p>
                <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest">Encrypted</p>
              </div>
              <div>
                <p className="text-white font-black text-2xl tracking-tight">24/7</p>
                <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest">Monitoring</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl backdrop-blur-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
              <span className="text-white/80 text-[10px] font-bold uppercase tracking-widest leading-none">Status: Live</span>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}

export default Login;