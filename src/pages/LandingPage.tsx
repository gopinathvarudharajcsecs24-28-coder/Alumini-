import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Users, ShieldCheck, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-slate-900">KSRCE Alumni</span>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex gap-4">
            <Link to="/login" className="text-slate-600 hover:text-blue-600 font-medium px-4 py-2 rounded-lg transition-colors">Login</Link>
            <Link to="/login?isSignUp=true" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">Sign Up</Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Nav Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-slate-100 overflow-hidden"
            >
              <div className="px-4 py-6 space-y-4">
                <Link 
                  to="/login" 
                  className="block text-center text-slate-600 font-medium py-2 hover:text-blue-600"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/login?isSignUp=true" 
                  className="block text-center bg-blue-600 text-white font-medium py-3 rounded-xl hover:bg-blue-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <main>
        <div className="relative bg-blue-600 overflow-hidden">
          <div className="absolute inset-0">
            <img
              className="w-full h-full object-cover opacity-20"
              src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
              alt="College Campus"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-32">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                KSR College of Engineering
              </h1>
              <p className="mt-4 text-lg md:text-xl text-blue-100 max-w-3xl mx-auto font-medium">
                Alumni Management System
              </p>
              <p className="mt-2 text-base md:text-lg text-blue-200">
                Connecting Alumni, Empowering Students, Strengthening the Institution
              </p>
              <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/login?role=student" className="bg-white text-blue-600 px-8 py-3 rounded-xl font-bold hover:bg-blue-50 transition-all shadow-lg">
                  Join as Student
                </Link>
                <Link to="/login?role=alumni" className="bg-blue-700 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-800 transition-all shadow-lg border border-blue-500/30">
                  Join as Alumni
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Quotes Section */}
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 text-center">
                <p className="italic text-slate-600">"Alumni are the pride of every institution."</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 text-center">
                <p className="italic text-slate-600">"Your journey inspires future engineers."</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 text-center">
                <p className="italic text-slate-600">"Stay connected with your roots."</p>
              </div>
            </div>
          </div>
        </div>

        {/* Login Options */}
        <div className="py-16 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">Access the Portal</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              
              <Link to="/login?role=student" className="group">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all text-center">
                  <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Student Login</h3>
                  <p className="text-slate-500 text-sm">Connect with alumni, find mentors, and explore career paths.</p>
                </div>
              </Link>

              <Link to="/login?role=alumni" className="group">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all text-center">
                  <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <GraduationCap className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Alumni Login</h3>
                  <p className="text-slate-500 text-sm">Update your profile, mentor students, and stay connected.</p>
                </div>
              </Link>

              <Link to="/admin-login" className="group">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all text-center">
                  <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <ShieldCheck className="h-8 w-8 text-slate-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Admin Login</h3>
                  <p className="text-slate-500 text-sm">Manage users, view analytics, and oversee the platform.</p>
                </div>
              </Link>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
