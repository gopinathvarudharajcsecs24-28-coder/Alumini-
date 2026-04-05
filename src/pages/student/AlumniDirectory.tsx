import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { Home, Users, Search, Filter, GraduationCap, MapPin, Briefcase, ChevronRight } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Link } from 'react-router-dom';

export default function AlumniDirectory() {
  const [alumni, setAlumni] = useState<any[]>([]);
  const [filteredAlumni, setFilteredAlumni] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('');

  useEffect(() => {
    const fetchAlumni = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, 'alumni_profiles'));
        const alumniData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setAlumni(alumniData);
        setFilteredAlumni(alumniData);
      } catch (error) {
        console.error("Error fetching alumni:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAlumni();
  }, []);

  useEffect(() => {
    const filtered = alumni.filter(a => {
      const matchesSearch = a.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          a.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          a.jobRole?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDept = selectedDept === '' || a.department === selectedDept;
      return matchesSearch && matchesDept;
    });
    setFilteredAlumni(filtered);
  }, [searchTerm, selectedDept, alumni]);

  const navItems = [
    { name: 'Dashboard', href: '/student/dashboard', icon: Home },
    { name: 'Alumni Directory', href: '/student/directory', icon: Users },
    { name: 'Job Board', href: '/student/jobs', icon: Briefcase },
  ];

  const departments = Array.from(new Set(alumni.map(a => a.department))).filter(Boolean);

  return (
    <DashboardLayout navItems={navItems} title="Alumni Directory">
      <div className="space-y-6">
        
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, company, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Alumni Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-slate-500">Finding alumni...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAlumni.map((person) => (
              <div key={person.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xl flex-shrink-0">
                      {person.fullName?.charAt(0) || 'A'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-slate-900 truncate">{person.fullName}</h3>
                      <p className="text-sm text-blue-600 font-medium">{person.jobRole}</p>
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <Briefcase className="h-4 w-4" />
                          <span className="truncate">{person.companyName}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <MapPin className="h-4 w-4" />
                          <span className="truncate">{person.currentCity}, {person.currentState}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <GraduationCap className="h-4 w-4" />
                          <span>Batch of {person.batch}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-slate-100">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {person.skills?.split(',').slice(0, 3).map((skill: string) => (
                        <span key={skill} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-md">
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                    <Link 
                      to={`/student/profile/${person.id}`}
                      className="flex items-center justify-center gap-2 w-full bg-slate-50 text-slate-700 py-2 rounded-lg font-medium hover:bg-blue-600 hover:text-white transition-all group"
                    >
                      View Profile
                      <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
            {filteredAlumni.length === 0 && (
              <div className="col-span-full text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
                <Users className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900">No alumni found</h3>
                <p className="text-slate-500">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
