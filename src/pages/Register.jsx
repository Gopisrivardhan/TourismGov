import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const FormInput = ({ label, type = "text", name, value, onChange, placeholder }) => (
  <div className="mb-4 w-full">
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

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errorMsg) setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    
    if (formData.password !== formData.confirmPassword) {
      setErrorMsg("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: "TOURIST" 
      };

      await axios.post('http://localhost:8383/tourismgov/v1/auth/register', payload);

      setSuccessMsg("Account created successfully! Redirecting to login...");
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF7] text-[#1A237E] font-sans flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#FF6D00]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#1A237E]/5 rounded-full blur-3xl" />

      <div className="w-full max-w-5xl relative z-10">
        <div className="bg-white rounded-[3rem] shadow-[0_32px_64px_-12px_rgba(26,35,126,0.2)] overflow-hidden flex flex-col lg:flex-row-reverse border border-white min-h-[650px]">
          
          {/* Right Side Visual */}
          <div className="hidden lg:flex lg:w-1/2 relative bg-[#1A237E] p-12 flex-col justify-end overflow-hidden">
            <img src="https://images.unsplash.com/photo-1593693395954-dfc2520098f9?auto=format&fit=crop&q=80&w=800" alt="Indian Heritage" className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-40 transition-transform duration-1000 hover:scale-110" />
            <div className="absolute top-0 left-0 w-64 h-64 bg-[#FF6D00] rounded-full blur-[80px] opacity-60 -translate-y-1/2 -translate-x-1/2" />
            <div className="relative z-10 text-white">
              <Link to="/" className="inline-flex items-center gap-2 mb-8 hover:opacity-80 transition-opacity">
                <span className="w-3 h-3 rounded-full bg-[#FF6D00]"></span>
                <span className="font-black tracking-tighter text-lg uppercase">TourismGov</span>
              </Link>
              <h3 className="text-5xl font-black uppercase tracking-tighter leading-tight mb-4">Start Your<br/>Journey.</h3>
            </div>
          </div>

          {/* Left Side Form */}
          <div className="w-full lg:w-1/2 p-8 lg:px-14 py-10 flex flex-col justify-center">
            <div className="mb-8">
              <h2 className="text-4xl font-black uppercase tracking-tighter text-[#1A237E]">Register</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-1">
              <FormInput label="Full Name" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" />
              <FormInput label="Email Address" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="name@example.com" />
              <FormInput label="Password" type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" />
              <FormInput label="Re-enter Password" type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" />

              {errorMsg && <div className="bg-red-50 text-red-500 text-xs font-bold px-4 py-3 rounded-xl text-center mt-2">{errorMsg}</div>}
              {successMsg && <div className="bg-green-50 text-green-600 text-xs font-bold px-4 py-3 rounded-xl text-center mt-2">{successMsg}</div>}

              <button type="submit" disabled={loading} className="w-full bg-[#1A237E] text-white font-black uppercase tracking-[0.2em] py-4 text-sm rounded-full hover:bg-[#FF6D00] shadow-xl mt-6">
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
              <p className="text-xs font-bold text-[#1A237E]/50 uppercase tracking-widest">
                Already have an account? <Link to="/login" className="ml-2 text-[#FF6D00] hover:underline">Sign In</Link>
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Register;