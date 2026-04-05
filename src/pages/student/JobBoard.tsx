import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { Home, Users, Briefcase, Search, MapPin, DollarSign, Clock, ExternalLink, ChevronRight } from 'lucide-react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export default function JobBoard() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'jobs'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const jobsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setJobs(jobsData);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const navItems = [
    { name: 'Dashboard', href: '/student/dashboard', icon: Home },
    { name: 'Alumni Directory', href: '/student/directory', icon: Users },
    { name: 'Job Board', href: '/student/jobs', icon: Briefcase },
  ];

  const filteredJobs = jobs.filter(j => 
    j.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout navItems={navItems} title="Job Board">
      <div className="space-y-6">
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search jobs by title, company, or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm"
          />
        </div>

        {/* Job List */}
        <div className="grid grid-cols-1 gap-4">
          {loading ? (
            <div className="text-center py-12 text-slate-500">Loading jobs...</div>
          ) : filteredJobs.length === 0 ? (
            <div className="text-center py-12 text-slate-500">No jobs found matching your search.</div>
          ) : (
            filteredJobs.map((job) => (
              <div key={job.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:border-blue-300 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xl font-bold text-slate-900">{job.title}</h3>
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs font-bold rounded-full uppercase tracking-wider">
                        {job.type}
                      </span>
                    </div>
                    <p className="text-blue-600 font-medium mb-4">{job.company}</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-2 gap-x-6 text-sm text-slate-500">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        {job.salary}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Posted {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'Recently'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => {
                        if (!job.link) return;
                        const url = job.link.startsWith('http') ? job.link : `https://${job.link}`;
                        window.open(url, '_blank');
                      }}
                      className="flex-1 md:flex-none px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
                      disabled={!job.link}
                    >
                      Apply Now
                      <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-50">
                  <p className="text-slate-600 text-sm line-clamp-2">{job.description}</p>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </DashboardLayout>
  );
}
