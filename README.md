# KSRCE Alumni Portal

A comprehensive platform for K.S.R. College of Engineering (KSRCE) to connect students, alumni, and administrators.

## Features

### For Students
- **Alumni Directory**: Browse and search for alumni by department, batch, and company.
- **Job Board**: Access job and internship opportunities shared by the alumni network.
- **Mentorship**: Connect with alumni who are available for mentoring.
- **Profiles**: View detailed professional profiles of alumni.

### For Alumni
- **Profile Management**: Maintain a professional profile with work experience and contact details.
- **Job Posting**: Share career opportunities with the student community.
- **Mentorship Toggle**: Opt-in or out of mentoring students.
- **Dashboard**: Quick overview of profile status and community activity.

### For Administrators
- **User Management**: Manage student and alumni accounts.
- **Job Portal Control**: Moderate and manage all job postings.
- **Analytics**: View growth stats and community activity.
- **Data Management**: Seed demo data and export community information.

## Tech Stack
- **Frontend**: React 19, Vite, Tailwind CSS 4
- **Backend/Database**: Firebase (Firestore, Authentication)
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Charts**: Recharts

## Getting Started

### Prerequisites
- Node.js installed
- Firebase project set up

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env` file in the root and add:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## Deployment

### Netlify
This project is pre-configured for Netlify.
1. Connect your repository to Netlify.
2. Ensure the build command is `npm run build` and the publish directory is `dist`.
3. Add your `GEMINI_API_KEY` in the Netlify Environment Variables settings.
4. The `netlify.toml` and `public/_redirects` files handle the SPA routing automatically.

## License
Apache-2.0
