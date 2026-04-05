import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { Home, User, Briefcase, Plus, Search, MapPin, DollarSign, Clock, ExternalLink } from 'lucide-react';

export default function JobUpdates() {
  const [searchTerm, setSearchTerm] = useState('');

  const navItems = [
    { name: 'Dashboard', href: '/alumni/dashboard', icon: Home },
    { name: 'My Profile', href: '/alumni/profile', icon: User },
    { name: 'Job Updates', href: '/alumni/jobs', icon: Briefcase },
  ];

  // Mock jobs for now since we don't have a jobs collection yet
  const mockJobs = [
    {
      id: '1',
      title: 'Full Stack Developer',
      company: 'TechCorp Solutions',
      location: 'Remote / Bangalore',
      salary: '₹12L - ₹18L',
      type: 'Full-time',
      postedAt: '2 days ago',
      description: 'Looking for a React and Node.js expert to join our core team.'
    },
    {
      id: '2',
      title: 'Software Engineering Intern',
      company: 'Innovate AI',
      location: 'Hyderabad',
      salary: '₹30k/month',
      type: 'Internship',
      postedAt: '5 hours ago',
      description: 'Great opportunity for final year students to work on cutting edge AI projects.'
    }
  ];

  return (
    <DashboardLayout navItems={navItems} title="Job Updates">
      <div className="space-y-6">
        
        {/* Header Actions */}
        <div className="flex justify-between items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm whitespace-nowrap">
            <Plus className="h-4 w-4" />
            Post a Job
          </button>
        </div>

        {/* Job List */}
        <div className="grid grid-cols-1 gap-4">
          {mockJobs.map((job) => (
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
                      Posted {job.postedAt}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <button className="flex-1 md:flex-none px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                    Apply Now
                    <ExternalLink className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-50">
                <p className="text-slate-600 text-sm line-clamp-2">{job.description}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </DashboardLayout>
  );
}
