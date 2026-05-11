import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const TouristLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); 
    setError(null);
    setLoading(true);

    // DEBUG: This proves the button click is registering
    console.log("Attempting login for:", email); 

    try {
      const response = await axios.post('http://localhost:8383/tourismgov/v1/auth/login', {
        email: email,
        password: password
      });

      console.log("Success! Backend returned:", response.data);

      if (response.data && response.data.token) {
        // Save the whole payload (token, role, userId, name) as seen in your Postman
        localStorage.setItem('user', JSON.stringify(response.data));
        navigate('/'); 
      }
    } catch (err) {
      console.error("Full Axios Error Object:", err);
      
      // If the browser blocked it due to CORS, or the server is down
      if (err.message === 'Network Error') {
          setError('Network Error: The browser blocked the request (CORS) or the backend is offline.');
      } else {
          // If the backend actively rejected the credentials (401/403)
          setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF7] text-[#1A237E] font-sans selection:bg-[#FF6D00] selection:text-white flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* BACKGROUND DECORATION */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#FF6D00]/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#1A237E]/5 rounded-full blur-3xl"></div>

      {/* LOGIN CARD */}
      <div className="w-full max-w-md bg-white rounded-[3rem] shadow-[0_32px_64px_-12px_rgba(26,35,126,0.2)] border border-white p-8 md:p-12 relative z-10">
        
        <div className="flex flex-col items-center mb-8">
          <div className="text-[#1A237E] text-2xl font-black tracking-tighter flex items-center gap-2 mb-2">
            <span className="w-3 h-3 rounded-full bg-[#FF6D00]"></span>
            TourismGov
          </div>
          <h2 className="text-4xl font-black uppercase tracking-tighter text-[#1A237E]">Welcome Back</h2>
          <p className="text-[#1A237E]/60 font-bold text-xs uppercase tracking-widest mt-2">Enter your details to travel</p>
        </div>

        {/* ERROR MESSAGE DISPLAY */}
        {error && (
          <div className="mb-6 p-4 bg-[#D81B60]/10 border border-[#D81B60]/20 rounded-[1rem] text-center">
            <p className="text-[#D81B60] font-bold text-[10px] uppercase tracking-widest">{error}</p>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#1A237E] mb-2 ml-4">
              Email Address
            </label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-8 py-4 bg-[#F8F9FF] border-2 border-transparent rounded-full focus:border-[#FF6D00] focus:bg-white outline-none transition-all font-medium text-[#1A237E]"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#1A237E] mb-2 ml-4">
              Password
            </label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-8 py-4 bg-[#F8F9FF] border-2 border-transparent rounded-full focus:border-[#FF6D00] focus:bg-white outline-none transition-all font-medium text-[#1A237E]"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className={`w-1/2 mt-4 block mx-auto bg-[#1A237E] text-white font-black uppercase tracking-[0.2em] py-3 rounded-full shadow-xl transition-all duration-300 ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#FF6D00] hover:-translate-y-1'}`}
          >
            {loading ? 'WAIT...' : 'SIGN IN'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TouristLogin;