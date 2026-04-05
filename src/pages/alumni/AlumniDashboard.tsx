import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import DashboardLayout from '../../components/DashboardLayout';
import { Home, User, Briefcase, Award, Edit, ChevronRight } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export default function AlumniDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      try {
        const docRef = doc(db, 'alumni_profiles', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data());
        } else {
          // If no profile, redirect to profile form
          navigate('/alumni/profile');
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user, navigate]);

  const navItems = [
    { name: 'Dashboard', href: '/alumni/dashboard', icon: Home },
    { name: 'My Profile', href: '/alumni/profile', icon: User },
    { name: 'Job Updates', href: '/alumni/jobs', icon: Briefcase },
  ];

  if (loading) return <div>Loading...</div>;

  return (
    <DashboardLayout navItems={navItems} title="Alumni Dashboard">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Profile Summary Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 lg:col-span-2">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xl">
                {profile?.fullName?.charAt(0) || 'A'}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">{profile?.fullName}</h2>
                <p className="text-slate-500">{profile?.jobRole} at {profile?.companyName}</p>
              </div>
            </div>
            <Link to="/alumni/profile" className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
              <Edit className="h-5 w-5" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-slate-500">Department</p>
              <p className="text-slate-900">{profile?.department}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Batch</p>
              <p className="text-slate-900">{profile?.batch}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Location</p>
              <p className="text-slate-900">{profile?.currentCity}, {profile?.currentCountry}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Experience</p>
              <p className="text-slate-900">{profile?.workExperience} Years</p>
            </div>
          </div>
        </div>

        {/* Quick Stats / Actions */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Mentorship Status</h3>
            <div className="flex items-center gap-3">
              <div className={`h-3 w-3 rounded-full ${profile?.mentorAvailability ? 'bg-green-500' : 'bg-slate-300'}`}></div>
              <span className="text-sm font-medium text-slate-700">
                {profile?.mentorAvailability ? 'Available for Mentoring' : 'Not Available'}
              </span>
            </div>
          </div>

          <div className="bg-blue-600 rounded-xl shadow-sm p-6 text-white">
            <Award className="h-8 w-8 mb-4 text-blue-100" />
            <h3 className="text-lg font-bold mb-2">Share an Opportunity</h3>
            <p className="text-blue-100 text-sm mb-6">Help fellow students by posting job or internship openings from your organization.</p>
            <button 
              onClick={() => navigate('/alumni/jobs')}
              className="flex items-center justify-center gap-2 w-full bg-white text-blue-600 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors group"
            >
              Post a Job
              <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
