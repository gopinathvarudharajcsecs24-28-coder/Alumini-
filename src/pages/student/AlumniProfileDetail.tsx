import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { Home, Users, Briefcase, GraduationCap, MapPin, Mail, Phone, Linkedin, ArrowLeft, Award, Calendar, Globe } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export default function AlumniProfileDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const docRef = doc(db, 'alumni_profiles', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data());
        } else {
          console.error("Profile not found");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  const navItems = [
    { name: 'Dashboard', href: '/student/dashboard', icon: Home },
    { name: 'Alumni Directory', href: '/student/directory', icon: Users },
    { name: 'Job Board', href: '/student/jobs', icon: Briefcase },
  ];

  if (loading) {
    return (
      <DashboardLayout navItems={navItems} title="Alumni Profile">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!profile) {
    return (
      <DashboardLayout navItems={navItems} title="Alumni Profile">
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <Users className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900">Profile not found</h3>
          <button 
            onClick={() => navigate(-1)}
            className="mt-4 text-blue-600 font-bold hover:underline"
          >
            Go Back
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout navItems={navItems} title="Alumni Profile">
      <div className="space-y-6">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Directory
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Profile Header & Contact */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
              <div className="h-32 w-32 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-4xl mx-auto mb-6 border-4 border-white shadow-md">
                {profile.fullName?.charAt(0) || 'A'}
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-1">{profile.fullName}</h2>
              <p className="text-blue-600 font-semibold mb-4">{profile.jobRole}</p>
              <div className="flex items-center justify-center gap-2 text-slate-500 text-sm mb-6">
                <MapPin className="h-4 w-4" />
                {profile.currentCity}, {profile.currentState}
              </div>
              
              <div className="flex justify-center gap-4">
                {profile.linkedinUrl && (
                  <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-50 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all">
                    <Linkedin className="h-5 w-5" />
                  </a>
                )}
                {profile.website && (
                  <a href={profile.website} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-50 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all">
                    <Globe className="h-5 w-5" />
                  </a>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-slate-600">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Mail className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="text-sm truncate">{profile.email}</span>
                </div>
                {profile.phoneNumber && (
                  <div className="flex items-center gap-3 text-slate-600">
                    <div className="p-2 bg-green-50 rounded-lg">
                      <Phone className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-sm">{profile.phoneNumber}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-blue-600 rounded-2xl shadow-sm p-6 text-white">
              <Award className="h-8 w-8 mb-4 text-blue-100" />
              <h3 className="text-lg font-bold mb-2">Mentorship</h3>
              <p className="text-blue-100 text-sm mb-6">
                {profile.mentorAvailability 
                  ? "This alumnus is available for mentoring. Reach out to discuss career guidance and industry insights."
                  : "This alumnus is currently not available for formal mentoring sessions."}
              </p>
              {profile.mentorAvailability && (
                <button className="w-full bg-white text-blue-600 py-2 rounded-lg font-bold hover:bg-blue-50 transition-colors">
                  Request Mentorship
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Experience & Education */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Briefcase className="h-6 w-6 text-blue-600" />
                Professional Background
              </h3>
              <div className="space-y-8">
                <div>
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Current Position</h4>
                  <div className="flex gap-4">
                    <div className="h-12 w-12 rounded-xl bg-slate-50 flex items-center justify-center flex-shrink-0">
                      <Briefcase className="h-6 w-6 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-slate-900">{profile.jobRole}</p>
                      <p className="text-blue-600 font-medium">{profile.companyName}</p>
                      <p className="text-sm text-slate-500 mt-1">{profile.workExperience} years of experience</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Skills & Expertise</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills?.split(',').map((skill: string) => (
                      <span key={skill} className="px-3 py-1.5 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg border border-blue-100">
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <GraduationCap className="h-6 w-6 text-blue-600" />
                Academic History
              </h3>
              <div className="flex gap-4">
                <div className="h-12 w-12 rounded-xl bg-slate-50 flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="h-6 w-6 text-slate-400" />
                </div>
                <div>
                  <p className="text-lg font-bold text-slate-900">K.S.R. College of Engineering</p>
                  <p className="text-slate-600 font-medium">{profile.department}</p>
                  <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                    <Calendar className="h-4 w-4" />
                    Batch of {profile.batch}
                  </div>
                </div>
              </div>
            </div>

            {profile.achievements && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Award className="h-6 w-6 text-blue-600" />
                  Achievements
                </h3>
                <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                  {profile.achievements}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
