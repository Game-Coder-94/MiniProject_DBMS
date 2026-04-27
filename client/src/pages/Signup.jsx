import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    try {
      const apiUrl = import.meta.env.DEV ? '/api/auth/signup' : 'http://localhost:3000/api/auth/signup';
      const response = await axios.post(apiUrl, { username, email, password });
      // Redirect to login upon successful signup
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to enroll into the mission. Try again.');
    }
  };

  return (
    <div className="min-h-screen bg-space-deeper flex flex-col items-center justify-center p-4">
      {/* Optional stardust overlay for deeper space effect */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none mix-blend-screen"></div>

      <div className="relative z-10 w-full max-w-md backdrop-blur-lg bg-white/10 border border-white/20 rounded-3xl p-8 shadow-[0_0_40px_rgba(139,92,246,0.15)] my-8">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-nebula-purple to-cyan-300">
            AstroSignup
          </h1>
          <p className="text-slate-300 mt-2">Join the mission and explore the cosmos</p>
          {error && <p className="text-red-400 mt-4 text-sm font-semibold p-2 bg-red-400/10 border border-red-500/20 rounded-xl">{error}</p>}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-slate-300 text-sm font-semibold mb-2" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-space-dark/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-space-accent focus:ring-1 focus:ring-space-accent transition-colors"
              placeholder="astronaut_2026"
            />
          </div>

          <div>
            <label className="block text-slate-300 text-sm font-semibold mb-2" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-space-dark/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-space-accent focus:ring-1 focus:ring-space-accent transition-colors"
              placeholder="astronaut@nasa.gov"
            />
          </div>

          <div>
            <label className="block text-slate-300 text-sm font-semibold mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-space-dark/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-space-accent focus:ring-1 focus:ring-space-accent transition-colors"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-slate-300 text-sm font-semibold mb-2" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-space-dark/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-space-accent focus:ring-1 focus:ring-space-accent transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-nebula-purple to-cyan-500 hover:from-[rgba(168,85,247,0.8)] hover:to-[rgba(6,182,212,0.8)] text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-[0_0_15px_rgba(139,92,246,0.4)] hover:shadow-[0_0_25px_rgba(139,92,246,0.6)] mt-2"
          >
            Join Mission 🚀
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-white/10 text-center">
          <p className="text-slate-400 text-sm">
            Already have an account? <Link to="/login" className="text-cyan-300 hover:text-cyan-200 transition-colors font-medium">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
