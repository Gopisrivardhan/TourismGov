import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api'; // Make sure this path matches where you saved api.js
 
// Reusable Input Component updated with name, value, and onChange props
const FormInput = ({ label, type = "text", placeholder, options, className = "", name, value, onChange }) => (
  <div className={className}>
    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#1A237E] mb-1.5 ml-4">
      {label}
    </label>
    {type === "select" ? (
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-6 py-3 text-sm bg-[#F8F9FF] border-2 border-transparent rounded-full focus:border-[#FF6D00] focus:bg-white outline-none transition-all font-medium text-[#1A237E] appearance-none cursor-pointer"
        required
      >
        <option value="" disabled>Select {label}</option>
        {options.map(opt => <option key={opt.val} value={opt.val}>{opt.label}</option>)}
      </select>
    ) : (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-6 py-3 text-sm bg-[#F8F9FF] border-2 border-transparent rounded-full focus:border-[#FF6D00] focus:bg-white outline-none transition-all font-medium text-[#1A237E] placeholder-[#1A237E]/30"
        required
      />
    )}
  </div>
);
 
const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
 
  // State to hold the form data exactly as the backend expects
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    gender: '',
    contactInfo: '',
    email: '',
    address: '',
    password: ''
  });
 
  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
 
  // Submit to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
   
    try {
      await api.post('/tourismgov/v1/tourist/create', formData);
      alert("Registration Successful! Please login.");
      navigate('/login');
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed. Check your inputs.");
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <div className="min-h-screen bg-[#FFFDF7] text-[#1A237E] font-sans selection:bg-[#FF6D00] selection:text-white flex items-center justify-center p-6 py-12 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#FF6D00]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#1A237E]/5 rounded-full blur-3xl" />
 
      <div className="w-full max-w-4xl relative z-10">
        <div className="bg-white rounded-[3rem] shadow-[0_32px_64px_-12px_rgba(26,35,126,0.2)] overflow-hidden flex flex-col lg:flex-row border border-white">
         
          {/* Left Side Visual */}
          <div className="hidden lg:flex lg:w-5/12 relative min-h-[400px] bg-[#1A237E] p-10 flex-col justify-end overflow-hidden">
            <img src="https://images.unsplash.com/photo-1515091943-9d5c0ad74bfa?auto=format&fit=crop&q=80&w=800" alt="Wanderlust" className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-40 transition-transform duration-1000 hover:scale-110" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF6D00] rounded-full blur-[80px] opacity-60 -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10 text-white">
              <Link to="/" className="inline-flex items-center gap-2 mb-6 hover:opacity-80 transition-opacity">
                <span className="w-3 h-3 rounded-full bg-[#FF6D00]"></span>
                <span className="font-black tracking-tighter text-lg uppercase">TourismGov</span>
              </Link>
              <h3 className="text-4xl font-black uppercase tracking-tighter leading-tight mb-3">Start Your<br/>Journey.</h3>
              <p className="font-medium text-sm opacity-80 leading-relaxed">Register to book verified events, save itineraries, and access official state guides.</p>
            </div>
          </div>
 
          {/* Right Side Form */}
          <div className="w-full lg:w-7/12 p-8 lg:p-10 flex flex-col justify-center">
            <div className="mb-8">
              <h2 className="text-3xl font-black uppercase tracking-tighter text-[#1A237E]">Register Account</h2>
              <p className="text-[#1A237E]/60 font-bold text-[10px] uppercase tracking-widest mt-1">Enter your details below</p>
            </div>
 
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormInput label="Full Name" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" />
             
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput label="Date of Birth" type="date" name="dob" value={formData.dob} onChange={handleChange} />
                <FormInput
                  label="Gender"
                  type="select"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  options={[
                    {val: 'MALE', label: 'Male'},
                    {val: 'FEMALE', label: 'Female'},
                    {val: 'OTHER', label: 'Other'}
                  ]}
                />
              </div>
 
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput label="Phone Number" type="tel" name="contactInfo" value={formData.contactInfo} onChange={handleChange} placeholder="98765 43210" />
                <FormInput label="Email Address" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="name@example.com" />
              </div>
 
              <FormInput label="Full Address" name="address" value={formData.address} onChange={handleChange} placeholder="123 Heritage Lane, City, State, Zip" />
 
              {/* Note: I removed the "Confirm Password" input because the backend DTO only accepts a single "password" field. */}
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <FormInput label="Password" type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" />
              </div>
 
              <button
                type="submit"
                disabled={loading}
                className="w-1/2 block mx-auto bg-[#1A237E] text-white font-black uppercase tracking-[0.2em] py-3 text-sm rounded-full hover:bg-[#FF6D00] shadow-md transition-all duration-300 hover:-translate-y-1 mt-6 disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {loading ? "Creating..." : "Create Account"}
              </button>
            </form>
 
            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
              <p className="text-xs font-bold text-[#1A237E]/50 uppercase tracking-widest">
                Already have an account?
                <Link to="/login" className="ml-2 text-[#FF6D00] hover:text-[#1A237E] transition-colors hover:underline">Sign In</Link>
              </p>
            </div>
          </div>
 
        </div>
      </div>
    </div>
  );
};
 
export default Register;
 