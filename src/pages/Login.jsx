import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // IMPORT AXIOS DIRECTLY

const FormInput = ({ label, type = "text", name, value, onChange, placeholder }) => (
  <div className="mb-5 w-full">
    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#1A237E] mb-1.5 ml-4">
      {label}
    </label>
    <input 
      type={type} 
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder} 
      className="w-full px-6 py-4 text-sm bg-[#F8F9FF] border-2 border-transparent rounded-full focus:border-[#FF6D00] focus:bg-white outline-none transition-all font-medium text-[#1A237E] placeholder-[#1A237E]/30" 
      required
    />
  </div>
);

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(''); // NEW: State to track error messages
  
  const [formData, setFormData] = useState({
    email: '', 
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear the error message as soon as the user starts typing again
    if (errorMsg) setErrorMsg(''); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(''); // Clear previous errors on new submission
    
    try {
      // USING RAW AXIOS HERE WITH THE FULL URL
      const response = await axios.post('http://localhost:8383/tourismgov/v1/auth/login', formData);

      // Save the JWT token to localStorage 
      if (response.data && response.data.token) {
          localStorage.setItem('token', response.data.token);
      }

      // Redirect to the dashboard
      navigate('/dashboard');

    } catch (error) {
      // Set the error state instead of using alert()
      setErrorMsg(error.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF7] text-[#1A237E] font-sans selection:bg-[#FF6D00] selection:text-white flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#FF6D00]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#1A237E]/5 rounded-full blur-3xl" />

      <div className="w-full max-w-5xl relative z-10">
        <div className="bg-white rounded-[3rem] shadow-[0_32px_64px_-12px_rgba(26,35,126,0.2)] overflow-hidden flex flex-col lg:flex-row-reverse border border-white min-h-[600px]">
          
          {/* Right Side Visual (Reversed for variation) */}
          <div className="hidden lg:flex lg:w-1/2 relative bg-[#1A237E] p-12 flex-col justify-end overflow-hidden">
            <img src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80&w=800" alt="Taj Mahal" className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-40 transition-transform duration-1000 hover:scale-110" />
            <div className="absolute top-0 left-0 w-64 h-64 bg-[#FF6D00] rounded-full blur-[80px] opacity-60 -translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative z-10 text-white">
              <Link to="/" className="inline-flex items-center gap-2 mb-8 hover:opacity-80 transition-opacity">
                <span className="w-3 h-3 rounded-full bg-[#FF6D00]"></span>
                <span className="font-black tracking-tighter text-lg uppercase">TourismGov</span>
              </Link>
              <h3 className="text-5xl font-black uppercase tracking-tighter leading-tight mb-4">Welcome<br/>Back.</h3>
              <p className="font-medium text-base opacity-80 leading-relaxed max-w-sm">Log in to access your dashboard, track verifications, and explore Incredible India.</p>
            </div>
          </div>

          {/* Left Side Form */}
          <div className="w-full lg:w-1/2 p-8 lg:p-14 flex flex-col justify-center">
            <div className="mb-10">
              <h2 className="text-4xl font-black uppercase tracking-tighter text-[#1A237E]">Sign In</h2>
              <p className="text-[#1A237E]/60 font-bold text-xs uppercase tracking-widest mt-2">Access your tourist account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-2">
              <FormInput 
                label="Email Address" 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                placeholder="name@example.com" 
              />
              
              <div className="relative mb-2">
                <FormInput 
                    label="Password" 
                    type="password" 
                    name="password" 
                    value={formData.password} 
                    onChange={handleChange} 
                    placeholder="••••••••" 
                />
                <div className="absolute top-0 right-4">
                    <a href="#" className="text-[9px] font-black uppercase text-[#FF6D00] hover:underline tracking-widest">Forgot Password?</a>
                </div>
              </div>

              {/* NEW: Conditional Error Message Display */}
              {errorMsg && (
                <div className="bg-red-50 border border-red-100 text-red-500 text-xs font-bold px-4 py-3 rounded-xl text-center mt-2 mb-4 animate-fadeIn">
                  {errorMsg}
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-[#1A237E] text-white font-black uppercase tracking-[0.2em] py-4 text-sm rounded-full hover:bg-[#FF6D00] shadow-xl transition-all duration-300 hover:-translate-y-1 mt-4 disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {loading ? "Authenticating..." : "Login"}
              </button>
            </form>

            <div className="mt-10 pt-8 border-t border-gray-100 text-center">
              <p className="text-xs font-bold text-[#1A237E]/50 uppercase tracking-widest">
                Don't have an account? 
                <Link to="/register" className="ml-2 text-[#FF6D00] hover:text-[#1A237E] transition-colors hover:underline">Create One</Link>
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;