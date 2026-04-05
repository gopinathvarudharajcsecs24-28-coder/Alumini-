import { doc, setDoc, writeBatch } from 'firebase/firestore';
import { db, auth } from './firebase';

export const seedDemoData = async () => {
  try {
    const batch = writeBatch(db);

    // 1 Admin
    const adminRef = doc(db, 'users', 'admin_demo_1');
    batch.set(adminRef, {
      uid: 'admin_demo_1',
      name: 'Admin User',
      email: 'admin@ksrce.ac.in',
      role: 'admin',
      createdAt: new Date().toISOString()
    });

    // 3 Students
    for (let i = 1; i <= 3; i++) {
      const studentRef = doc(db, 'users', `student_demo_${i}`);
      batch.set(studentRef, {
        uid: `student_demo_${i}`,
        name: `Student ${i}`,
        email: `student${i}@ksrce.ac.in`,
        role: 'student',
        createdAt: new Date().toISOString()
      });
    }

    // 5 Alumni Profiles
    const alumniData = [
      {
        uid: 'alumni_demo_1',
        fullName: 'John Doe',
        department: 'Computer Science',
        batch: '2020',
        companyName: 'Google',
        jobRole: 'Software Engineer',
        currentCity: 'Bangalore',
        currentCountry: 'India',
        mentorAvailability: true,
        internshipSupport: true,
        placementSupport: true,
        skills: 'React, Node.js, Firebase',
        status: 'Active'
      },
      {
        uid: 'alumni_demo_2',
        fullName: 'Jane Smith',
        department: 'Electronics',
        batch: '2019',
        companyName: 'Intel',
        jobRole: 'Hardware Engineer',
        currentCity: 'Chennai',
        currentCountry: 'India',
        mentorAvailability: true,
        internshipSupport: false,
        placementSupport: true,
        skills: 'Verilog, VHDL, C++',
        status: 'Active'
      },
      {
        uid: 'alumni_demo_3',
        fullName: 'Robert Brown',
        department: 'Mechanical',
        batch: '2018',
        companyName: 'Ford',
        jobRole: 'Design Engineer',
        currentCity: 'Pune',
        currentCountry: 'India',
        mentorAvailability: false,
        internshipSupport: true,
        placementSupport: false,
        skills: 'AutoCAD, SolidWorks',
        status: 'Active'
      },
      {
        uid: 'alumni_demo_4',
        fullName: 'Emily White',
        department: 'Information Technology',
        batch: '2021',
        companyName: 'Amazon',
        jobRole: 'Cloud Architect',
        currentCity: 'Hyderabad',
        currentCountry: 'India',
        mentorAvailability: true,
        internshipSupport: true,
        placementSupport: true,
        skills: 'AWS, Python, Kubernetes',
        status: 'Active'
      },
      {
        uid: 'alumni_demo_5',
        fullName: 'Michael Green',
        department: 'Civil',
        batch: '2017',
        companyName: 'L&T Construction',
        jobRole: 'Project Manager',
        currentCity: 'Mumbai',
        currentCountry: 'India',
        mentorAvailability: true,
        internshipSupport: false,
        placementSupport: false,
        skills: 'Project Management, AutoCAD',
        status: 'Active'
      }
    ];

    for (const alumni of alumniData) {
      const userRef = doc(db, 'users', alumni.uid);
      batch.set(userRef, {
        uid: alumni.uid,
        name: alumni.fullName,
        email: `alumni${alumni.uid.split('_')[2]}@ksrce.ac.in`,
        role: 'alumni',
        createdAt: new Date().toISOString()
      });

      const profileRef = doc(db, 'alumni_profiles', alumni.uid);
      batch.set(profileRef, {
        ...alumni,
        lastUpdated: new Date().toISOString()
      });
    }

    await batch.commit();
    console.log("Demo data seeded successfully!");
    return true;
  } catch (error: any) {
    console.error("Error seeding data:", error);
    if (error.message?.includes('insufficient permissions')) {
      console.error("Permission error details:", {
        uid: auth.currentUser?.uid,
        email: auth.currentUser?.email,
        role: 'admin'
      });
    }
    return false;
  }
};
