import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-10 py-5 bg-white/90 backdrop-blur-lg border-b border-slate-100 sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-200">S</div>
        <span className="text-xl font-bold tracking-tight text-slate-800">SmartCampus</span>
      </div>
      <div className="hidden md:flex items-center gap-8 font-medium text-slate-600">
        <a href="#features" className="hover:text-blue-600 transition">Features</a>
        <a href="#about" className="hover:text-blue-600 transition">About</a>
        <Link to="/" className="bg-slate-900 text-white px-6 py-2.5 rounded-full hover:bg-blue-600 transition duration-300">
          Sign In
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;