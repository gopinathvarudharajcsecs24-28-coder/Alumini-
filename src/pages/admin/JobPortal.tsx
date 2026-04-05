import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { Home, Users, GraduationCap, Briefcase, Search, Plus, Edit, Trash2, MapPin, DollarSign, Clock } from 'lucide-react';

export default function JobPortal() {
  const [searchTerm, setSearchTerm] = useState('');

  const navItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: Home },
    { name: 'Manage Alumni', href: '/admin/alumni', icon: GraduationCap },
    { name: 'Manage Students', href: '/admin/students', icon: Users },
    { name: 'Job Portal', href: '/admin/jobs', icon: Briefcase },
  ];

  // Mock jobs for now
  const mockJobs = [
    {
      id: '1',
      title: 'Full Stack Developer',
      company: 'TechCorp Solutions',
      location: 'Remote / Bangalore',
      salary: '₹12L - ₹18L',
      type: 'Full-time',
      postedBy: 'John Doe (Alumni)',
      status: 'Active'
    },
    {
      id: '2',
      title: 'Software Engineering Intern',
      company: 'Innovate AI',
      location: 'Hyderabad',
      salary: '₹30k/month',
      type: 'Internship',
      postedBy: 'Jane Smith (Alumni)',
      status: 'Active'
    }
  ];

  return (
    <DashboardLayout navItems={navItems} title="Job Portal Management">
      <div className="space-y-6">
        
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search jobs by title or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm whitespace-nowrap">
            <Plus className="h-4 w-4" />
            Add New Job
          </button>
        </div>

        {/* Jobs Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Job Title & Company</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Details</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Posted By</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mockJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-900">{job.title}</p>
                      <p className="text-xs text-blue-600 font-medium">{job.company}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <MapPin className="h-3 w-3" />
                          {job.location}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <DollarSign className="h-3 w-3" />
                          {job.salary}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-600">{job.postedBy}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700">
                        {job.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
