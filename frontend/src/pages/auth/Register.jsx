import React, { useState } from 'react';
import { Mail, Lock, User, Loader2, Eye, EyeOff, ArrowRight, ShieldCheck, Fingerprint, Globe, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleSignUp = () => {
    window.location.href = 'http://localhost:8082/oauth2/authorization/google';
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8082/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Registration Successful!');
        navigate('/login');
      } else {
        const errorText = await response.text();
        toast.error(errorText || 'Registration failed.');
      }
    } catch (error) {
      toast.error('Connection error. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="h-screen w-full overflow-hidden bg-white flex font-sans selection:bg-[#0c5252] selection:text-white">
      
      {/* --- Left Section: Registration Interface --- */}
      <section className="relative w-full md:w-[35%] lg:w-[30%] bg-white flex flex-col z-30 border-r border-slate-100">
        
        {/* Branding Line */}
        <div className="h-1.5 w-full bg-[#0c5252]"></div>

        <div className="flex-1 px-10 py-6 flex flex-col justify-between overflow-hidden">
          
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

          {/* Registration Form Container */}
          <div className="w-full max-w-sm mx-auto">
            <header className="mb-6">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#f0f4f4] text-[#0c5252] text-[10px] font-bold uppercase tracking-widest mb-3">
                <Fingerprint size={12} /> Create Account
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Join our <br/>
                <span className="text-[#0c5252]">Campus Hub.</span>
              </h1>
            </header>

            <div className="space-y-4">
              {/* Google Button */}
              <button 
                onClick={handleGoogleSignUp}
                className="w-full flex items-center justify-center gap-3 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 text-sm transition-all active:scale-[0.98]"
              >
                <img alt="Google" className="w-4 h-4" src="https://www.svgrepo.com/show/475656/google-color.svg" />
                Sign up with Google
              </button>

              <div className="relative flex items-center py-1">
                <div className="flex-grow border-t border-slate-100"></div>
                <span className="mx-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Or enter details</span>
                <div className="flex-grow border-t border-slate-100"></div>
              </div>

              <form onSubmit={handleRegister} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0c5252] transition-colors" size={16} />
                    <input
                      className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-transparent focus:border-[#0c5252]/20 focus:bg-white focus:ring-4 focus:ring-[#0c5252]/5 rounded-xl text-slate-900 font-semibold transition-all outline-none text-sm"
                      type="text"
                      name="name"
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0c5252] transition-colors" size={16} />
                    <input
                      className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-transparent focus:border-[#0c5252]/20 focus:bg-white focus:ring-4 focus:ring-[#0c5252]/5 rounded-xl text-slate-900 font-semibold transition-all outline-none text-sm"
                      type="email"
                      name="email"
                      placeholder="name@campus.ac.lk"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0c5252] transition-colors" size={16} />
                    <input
                      className="w-full pl-11 pr-11 py-2.5 bg-slate-50 border border-transparent focus:border-[#0c5252]/20 focus:bg-white focus:ring-4 focus:ring-[#0c5252]/5 rounded-xl text-slate-900 font-semibold transition-all outline-none text-sm"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="At least 6 characters"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#0c5252]">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button 
                  disabled={loading}
                  className="w-full py-3 bg-[#0c5252] text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-[#0c5252]/20 hover:bg-[#154646] transition-all flex items-center justify-center gap-2 mt-2"
                  type="submit"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : (
                    <>Register <ArrowRight size={14} /></>
                  )}
                </button>
              </form>
            </div>
          </div>

          <div className="text-center pt-4">
            <p className="text-xs font-medium text-slate-400">
              Member already? <Link className="text-[#0c5252] font-bold hover:underline" to="/login">Login here</Link>
            </p>
          </div>
        </div>
      </section>

      {/* --- Right Section: Professional Showcase --- */}
      <section className="hidden md:flex flex-1 relative flex-col items-center justify-center p-12 bg-[#0c5252] overflow-hidden">
        
        <div className="absolute top-[-15%] right-[-5%] w-[600px] h-[600px] bg-[#2d6a6a] opacity-25 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-[#7c5c14] opacity-15 blur-[100px] rounded-full"></div>
        
        <div className="relative w-full max-w-4xl z-10 flex flex-col justify-center h-full">
          
          <div className="relative rounded-[32px] overflow-hidden shadow-2xl border border-white/10 bg-white">
            <div className="px-8 py-3 flex items-center justify-between bg-slate-50 border-b border-slate-100">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-200"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-slate-200"></div>
              </div>
              <div className="text-[9px] font-black text-slate-300 tracking-[0.2em] uppercase">Smart Campus System</div>
              <Globe size={14} className="text-[#7c5c14]" />
            </div>
            
            <div className="aspect-video relative group">
              <img 
                src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2072" 
                className="w-full h-full object-cover" 
                alt="Architecture" 
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0c5252]/80 to-transparent"></div>
              
              <div className="absolute inset-0 p-10 flex flex-col justify-center">
                <h2 className="text-white text-4xl font-black tracking-tighter leading-tight mb-4">
                  Everything <br/> <span className="text-[#98c7c7]">Connected.</span>
                </h2>
                <div className="space-y-3">
                  {["Secure Login", "Resource Booking", "Issue Tracking"].map((text, i) => (
                    <div key={i} className="flex items-center gap-3 text-white/90">
                      <CheckCircle size={14} className="text-[#98c7c7]" />
                      <span className="text-xs font-bold tracking-wide">{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between bg-white/5 border border-white/10 p-6 rounded-[24px] backdrop-blur-md">
            <div className="flex gap-10">
              <div>
                <p className="text-white font-black text-2xl tracking-tight">Active</p>
                <p className="text-[#98c7c7] text-[9px] font-bold uppercase tracking-widest">System Status</p>
              </div>
              <div className="h-10 w-px bg-white/10"></div>
              <div>
                <p className="text-white font-black text-2xl tracking-tight">Encrypted</p>
                <p className="text-[#98c7c7] text-[9px] font-bold uppercase tracking-widest">Data Guard</p>
              </div>
            </div>
            <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest text-right">Smart Campus <br/> Hub v2.0</p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Register;