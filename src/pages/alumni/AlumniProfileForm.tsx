import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import DashboardLayout from '../../components/DashboardLayout';
import { Home, User, Briefcase, Save } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { syncAlumniToSheet } from '../../lib/googleSheets';

export default function AlumniProfileForm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    registerNumber: '',
    department: '',
    batch: '',
    institutionalEmail: user?.email || '',
    personalEmail: '',
    mobileNumber: '',
    currentCity: '',
    currentState: '',
    currentCountry: '',
    degree: '',
    specialization: '',
    graduationYear: '',
    employmentStatus: 'Employed',
    companyName: '',
    jobRole: '',
    workExperience: '',
    skills: '',
    linkedIn: '',
    portfolio: '',
    aboutMe: '',
    mentorAvailability: false,
    internshipSupport: false,
    placementSupport: false,
    guestLectureAvailability: false,
    status: 'Active'
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const docRef = doc(db, 'alumni_profiles', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setFormData({ ...formData, ...docSnap.data() });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setSaving(true);
    try {
      const profileData = {
        ...formData,
        uid: user.uid,
        lastUpdated: new Date().toISOString()
      };

      // 1. Save to Firestore
      await setDoc(doc(db, 'alumni_profiles', user.uid), profileData);

      // 2. Sync to Google Sheets
      await syncAlumniToSheet(profileData);

      alert('Profile updated successfully!');
      navigate('/alumni/dashboard');
    } catch (error) {
      console.error("Error saving profile:", error);
      alert('Failed to save profile.');
    } finally {
      setSaving(false);
    }
  };

  const navItems = [
    { name: 'Dashboard', href: '/alumni/dashboard', icon: Home },
    { name: 'My Profile', href: '/alumni/profile', icon: User },
    { name: 'Job Updates', href: '/alumni/jobs', icon: Briefcase },
  ];

  if (loading) return <div>Loading...</div>;

  return (
    <DashboardLayout navItems={navItems} title="Edit Profile">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8 max-w-4xl mx-auto">
        
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4 border-b pb-2">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Register Number</label>
              <input type="text" name="registerNumber" required value={formData.registerNumber} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Institutional Email</label>
              <input type="email" name="institutionalEmail" disabled value={formData.institutionalEmail} className="w-full px-3 py-2 border border-slate-200 bg-slate-50 rounded-md text-slate-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Personal Email</label>
              <input type="email" name="personalEmail" value={formData.personalEmail} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Mobile Number</label>
              <input type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Current City</label>
              <input type="text" name="currentCity" value={formData.currentCity} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4 border-b pb-2">Academic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
              <input type="text" name="department" required value={formData.department} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Batch (Passed Out Year)</label>
              <input type="text" name="batch" required value={formData.batch} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Degree</label>
              <input type="text" name="degree" value={formData.degree} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4 border-b pb-2">Professional Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Employment Status</label>
              <select name="employmentStatus" value={formData.employmentStatus} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                <option value="Employed">Employed</option>
                <option value="Self-Employed">Self-Employed / Entrepreneur</option>
                <option value="Higher Studies">Higher Studies</option>
                <option value="Seeking Opportunities">Seeking Opportunities</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
              <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Job Role</label>
              <input type="text" name="jobRole" value={formData.jobRole} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Work Experience (Years)</label>
              <input type="number" name="workExperience" value={formData.workExperience} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">LinkedIn Profile URL</label>
              <input type="url" name="linkedIn" value={formData.linkedIn} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">About Me</label>
              <textarea name="aboutMe" rows={4} value={formData.aboutMe} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500"></textarea>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4 border-b pb-2">Contribution & Support</h2>
          <div className="space-y-4">
            <label className="flex items-center gap-3">
              <input type="checkbox" name="mentorAvailability" checked={formData.mentorAvailability} onChange={handleChange} className="h-4 w-4 text-blue-600 rounded border-slate-300" />
              <span className="text-slate-700">Willing to mentor students</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" name="internshipSupport" checked={formData.internshipSupport} onChange={handleChange} className="h-4 w-4 text-blue-600 rounded border-slate-300" />
              <span className="text-slate-700">Can provide internship support</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" name="placementSupport" checked={formData.placementSupport} onChange={handleChange} className="h-4 w-4 text-blue-600 rounded border-slate-300" />
              <span className="text-slate-700">Can provide placement referrals</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" name="guestLectureAvailability" checked={formData.guestLectureAvailability} onChange={handleChange} className="h-4 w-4 text-blue-600 rounded border-slate-300" />
              <span className="text-slate-700">Available for guest lectures</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-200">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <Save className="h-5 w-5" />
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>

      </form>
    </DashboardLayout>
  );
}
