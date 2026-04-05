import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { Home, Users, GraduationCap, Briefcase, ChevronRight, Search, MapPin } from 'lucide-react';
import { collection, getDocs, query, limit, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Link } from 'react-router-dom';

export default function StudentDashboard() {
  const [recentAlumni, setRecentAlumni] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentAlumni = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, 'alumni_profiles'), orderBy('lastUpdated', 'desc'), limit(3));
        const querySnapshot = await getDocs(q);
        const alumniData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setRecentAlumni(alumniData);
      } catch (error) {
        console.error("Error fetching recent alumni:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecentAlumni();
  }, []);

  const navItems = [
    { name: 'Dashboard', href: '/student/dashboard', icon: Home },
    { name: 'Alumni Directory', href: '/student/directory', icon: Users },
    { name: 'Job Board', href: '/student/jobs', icon: Briefcase },
  ];

  return (
    <DashboardLayout navItems={navItems} title="Student Dashboard">
      <div className="space-y-8">
        
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white shadow-lg">
          <h2 className="text-3xl font-bold mb-2">Welcome to KSRCE Alumni Portal</h2>
          <p className="text-blue-100 max-w-2xl">Connect with our successful alumni network, find mentorship opportunities, and explore the latest job openings shared by our community.</p>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link to="/student/directory" className="group bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-blue-500 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Alumni Directory</h3>
            <p className="text-slate-500 text-sm">Browse and connect with alumni from various departments and batches.</p>
          </Link>

          <Link to="/student/jobs" className="group bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-blue-500 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors">
                <Briefcase className="h-6 w-6 text-purple-600" />
              </div>
              <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-purple-500 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Job Board</h3>
            <p className="text-slate-500 text-sm">Explore job and internship opportunities shared by our alumni network.</p>
          </Link>
        </div>

        {/* Recent Alumni */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-slate-900">Recently Joined Alumni</h3>
            <Link to="/student/directory" className="text-blue-600 hover:text-blue-700 text-sm font-bold flex items-center gap-1 group">
              View All <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white h-48 rounded-xl border border-slate-100 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentAlumni.map((person) => (
                <div key={person.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                      {person.fullName?.charAt(0) || 'A'}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 truncate max-w-[150px]">{person.fullName}</h4>
                      <p className="text-xs text-blue-600 font-medium">{person.jobRole}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-slate-500 mb-4">
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      <span className="truncate">{person.companyName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4" />
                      <span>Batch of {person.batch}</span>
                    </div>
                  </div>
                  <Link to={`/student/profile/${person.id}`} className="flex items-center justify-center gap-2 w-full py-2 bg-slate-50 text-slate-700 rounded-lg text-sm font-bold hover:bg-blue-600 hover:text-white transition-all group">
                    View Profile
                    <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
}
