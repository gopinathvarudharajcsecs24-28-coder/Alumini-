import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { Home, Users, GraduationCap, Briefcase, Download, Database, TrendingUp, UserCheck, Clock, ChevronRight } from 'lucide-react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { seedDemoData } from '../../lib/seedData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalAlumni: 0,
    totalStudents: 0,
    activeMentors: 0,
    recentRegistrations: 0
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [exporting, setExporting] = useState(false);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const alumniSnap = await getDocs(collection(db, 'alumni_profiles'));
      const studentSnap = await getDocs(collection(db, 'users'));
      
      const alumni = alumniSnap.docs.map(doc => doc.data());
      const students = studentSnap.docs.map(doc => doc.data()).filter(u => u.role === 'student');
      
      setStats({
        totalAlumni: alumni.length,
        totalStudents: students.length,
        activeMentors: alumni.filter(a => a.mentorAvailability).length,
        recentRegistrations: alumni.length + students.length // Simplified for demo
      });

      // Fetch recent activity
      const activityQuery = query(collection(db, 'alumni_profiles'), orderBy('lastUpdated', 'desc'), limit(5));
      const activitySnap = await getDocs(activityQuery);
      setRecentActivity(activitySnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })));

    } catch (error: any) {
      console.error("Error fetching stats:", error);
      if (error.message?.includes('insufficient permissions')) {
        console.error("Permission error details:", {
          uid: auth.currentUser?.uid,
          email: auth.currentUser?.email,
          role: 'admin' // We know they are in admin dashboard
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleExportData = async () => {
    setExporting(true);
    try {
      const alumniSnap = await getDocs(collection(db, 'alumni_profiles'));
      const studentSnap = await getDocs(collection(db, 'users'));
      
      const alumni = alumniSnap.docs.map(doc => ({ ...doc.data() as any, type: 'Alumni' }));
      const students = studentSnap.docs.map(doc => ({ ...doc.data() as any, type: 'Student' })).filter((u: any) => u.role === 'student');
      
      const allUsers = [...alumni, ...students];
      
      if (allUsers.length === 0) {
        alert('No data to export');
        return;
      }

      // Define CSV headers
      const headers = ['Type', 'Full Name', 'Email', 'Role', 'Department', 'Batch', 'Company', 'Designation', 'Location'];
      
      // Map data to rows
      const rows = allUsers.map((user: any) => [
        user.type || '',
        user.fullName || user.displayName || '',
        user.email || '',
        user.role || '',
        user.department || '',
        user.batch || '',
        user.company || '',
        user.designation || '',
        user.location || ''
      ]);

      // Combine headers and rows
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      ].join('\n');

      // Create download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `ksrce_users_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export data. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const handleSeedData = async () => {
    if (window.confirm('This will add 10 demo alumni profiles. Continue?')) {
      await seedDemoData();
      fetchStats();
    }
  };

  const navItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: Home },
    { name: 'Manage Alumni', href: '/admin/alumni', icon: GraduationCap },
    { name: 'Manage Students', href: '/admin/students', icon: Users },
    { name: 'Job Portal', href: '/admin/jobs', icon: Briefcase },
  ];

  const chartData = [
    { name: '2020', alumni: 400, students: 2400 },
    { name: '2021', alumni: 300, students: 1398 },
    { name: '2022', alumni: 200, students: 9800 },
    { name: '2023', alumni: 278, students: 3908 },
    { name: '2024', alumni: 189, students: 4800 },
  ];

  return (
    <DashboardLayout navItems={navItems} title="Admin Dashboard">
      <div className="space-y-8">
        
        {/* Actions */}
        <div className="flex justify-end gap-4">
          <button 
            onClick={handleSeedData}
            className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors shadow-sm group"
          >
            <Database className="h-4 w-4" />
            Seed Demo Data
            <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
          <button 
            onClick={handleExportData}
            disabled={exporting}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className={`h-4 w-4 ${exporting ? 'animate-bounce' : ''}`} />
            {exporting ? 'Exporting...' : 'Export Data'}
            <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <GraduationCap className="h-6 w-6 text-blue-600" />
              </div>
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">+12%</span>
            </div>
            <p className="text-sm font-medium text-slate-500">Total Alumni</p>
            <h3 className="text-2xl font-bold text-slate-900">{stats.totalAlumni}</h3>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">+5%</span>
            </div>
            <p className="text-sm font-medium text-slate-500">Total Students</p>
            <h3 className="text-2xl font-bold text-slate-900">{stats.totalStudents}</h3>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-orange-50 rounded-lg">
                <UserCheck className="h-6 w-6 text-orange-600" />
              </div>
              <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded-full">Stable</span>
            </div>
            <p className="text-sm font-medium text-slate-500">Active Mentors</p>
            <h3 className="text-2xl font-bold text-slate-900">{stats.activeMentors}</h3>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-50 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">+18%</span>
            </div>
            <p className="text-sm font-medium text-slate-500">Recent Activity</p>
            <h3 className="text-2xl font-bold text-slate-900">{stats.recentRegistrations}</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chart */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Growth Overview</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                    cursor={{fill: '#f8fafc'}}
                  />
                  <Bar dataKey="alumni" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Recent Activity</h3>
            <div className="space-y-6">
              {recentActivity.map((activity, idx) => (
                <div key={activity.id} className="flex gap-4">
                  <div className="relative">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                      {activity.fullName?.charAt(0) || 'A'}
                    </div>
                    {idx !== recentActivity.length - 1 && (
                      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-px h-6 bg-slate-100"></div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{activity.fullName}</p>
                    <p className="text-xs text-slate-500">Updated profile • {new Date(activity.lastUpdated).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
              {recentActivity.length === 0 && (
                <p className="text-sm text-slate-500 text-center py-4">No recent activity</p>
              )}
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
