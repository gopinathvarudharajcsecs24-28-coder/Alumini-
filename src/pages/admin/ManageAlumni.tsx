import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { Home, Users, GraduationCap, Briefcase, Search, Filter, MoreVertical, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { X, Plus } from 'lucide-react';

export default function ManageAlumni() {
  const [alumni, setAlumni] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAlumni, setNewAlumni] = useState({
    fullName: '',
    registerNumber: '',
    department: '',
    batch: '',
    companyName: '',
    jobRole: '',
    institutionalEmail: '',
    status: 'Active'
  });

  const fetchAlumni = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'alumni_profiles'));
      const alumniData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAlumni(alumniData);
    } catch (error) {
      console.error("Error fetching alumni:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlumni();
  }, []);

  const handleAddAlumni = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'alumni_profiles'), {
        ...newAlumni,
        lastUpdated: new Date().toISOString()
      });
      setShowAddModal(false);
      setNewAlumni({
        fullName: '',
        registerNumber: '',
        department: '',
        batch: '',
        companyName: '',
        jobRole: '',
        institutionalEmail: '',
        status: 'Active'
      });
      fetchAlumni();
    } catch (error) {
      console.error("Error adding alumni:", error);
      alert("Failed to add alumni. Please try again.");
    }
  };

  const handleDeleteAlumni = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this alumni profile?")) {
      try {
        await deleteDoc(doc(db, 'alumni_profiles', id));
        fetchAlumni();
      } catch (error) {
        console.error("Error deleting alumni:", error);
      }
    }
  };

  const navItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: Home },
    { name: 'Manage Alumni', href: '/admin/alumni', icon: GraduationCap },
    { name: 'Manage Students', href: '/admin/students', icon: Users },
    { name: 'Job Portal', href: '/admin/jobs', icon: Briefcase },
  ];

  const departments = Array.from(new Set(alumni.map(a => a.department))).filter(Boolean);

  const filteredAlumni = alumni.filter(a => {
    const matchesSearch = a.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        a.registerNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        a.department?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept === '' || a.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  return (
    <DashboardLayout navItems={navItems} title="Manage Alumni">
      <div className="space-y-6">
        
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, register number, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="flex-1 sm:flex-none px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white text-sm"
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm whitespace-nowrap"
            >
              <Plus className="h-4 w-4" />
              Add Alumni
            </button>
          </div>
        </div>

        {/* Alumni Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Alumni</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Department & Batch</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Employment</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">Loading alumni...</td>
                  </tr>
                ) : filteredAlumni.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">No alumni found</td>
                  </tr>
                ) : (
                  filteredAlumni.map((person) => (
                    <tr key={person.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                            {person.fullName?.charAt(0) || 'A'}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900">{person.fullName}</p>
                            <p className="text-xs text-slate-500">{person.registerNumber}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-900 font-medium">{person.department}</p>
                        <p className="text-xs text-slate-500">Class of {person.batch}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-900 font-medium">{person.jobRole}</p>
                        <p className="text-xs text-slate-500">{person.companyName}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
                          person.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {person.status === 'Active' ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                          {person.status || 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteAlumni(person.id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Alumni Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900">Add New Alumni</h3>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <X className="h-5 w-5 text-slate-500" />
                </button>
              </div>
              <form onSubmit={handleAddAlumni} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-slate-700">Full Name</label>
                    <input
                      type="text"
                      required
                      value={newAlumni.fullName}
                      onChange={(e) => setNewAlumni({...newAlumni, fullName: e.target.value})}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-slate-700">Register Number</label>
                    <input
                      type="text"
                      required
                      value={newAlumni.registerNumber}
                      onChange={(e) => setNewAlumni({...newAlumni, registerNumber: e.target.value})}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="12345678"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-slate-700">Department</label>
                    <input
                      type="text"
                      required
                      value={newAlumni.department}
                      onChange={(e) => setNewAlumni({...newAlumni, department: e.target.value})}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="CSE"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-slate-700">Batch</label>
                    <input
                      type="text"
                      required
                      value={newAlumni.batch}
                      onChange={(e) => setNewAlumni({...newAlumni, batch: e.target.value})}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="2020-2024"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-slate-700">Company Name</label>
                    <input
                      type="text"
                      value={newAlumni.companyName}
                      onChange={(e) => setNewAlumni({...newAlumni, companyName: e.target.value})}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="Google"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-slate-700">Job Role</label>
                    <input
                      type="text"
                      value={newAlumni.jobRole}
                      onChange={(e) => setNewAlumni({...newAlumni, jobRole: e.target.value})}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="Software Engineer"
                    />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-sm font-bold text-slate-700">Institutional Email</label>
                    <input
                      type="email"
                      required
                      value={newAlumni.institutionalEmail}
                      onChange={(e) => setNewAlumni({...newAlumni, institutionalEmail: e.target.value})}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="john@ksrce.ac.in"
                    />
                  </div>
                </div>
                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg font-bold hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    Save Alumni
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
