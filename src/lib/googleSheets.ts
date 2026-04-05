// This URL should be the Web App URL generated from Google Apps Script.
// For the demo, we'll use a placeholder or an environment variable.
const GOOGLE_SCRIPT_URL = (import.meta as any).env?.VITE_GOOGLE_SCRIPT_URL || 'https://script.google.com/macros/s/AKfycbz_placeholder/exec';

export const syncAlumniToSheet = async (alumniData: any) => {
  if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL.includes('placeholder')) {
    console.warn('Google Sheets sync skipped: No valid Web App URL configured.');
    return;
  }

  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify({
        action: 'sync_alumni',
        payload: alumniData
      })
    });
    const result = await response.json();
    console.log('Google Sheets Sync Result:', result);
  } catch (error) {
    console.error('Error syncing to Google Sheets:', error);
  }
};

export const logActivityToSheet = async (activityData: any) => {
  if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL.includes('placeholder')) return;

  try {
    await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify({
        action: 'log_activity',
        payload: activityData
      })
    });
  } catch (error) {
    console.error('Error logging activity to Google Sheets:', error);
  }
};

export const syncStudentToSheet = async (studentData: any) => {
  if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL.includes('placeholder')) return;

  try {
    await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify({
        action: 'sync_student',
        payload: studentData
      })
    });
  } catch (error) {
    console.error('Error syncing student to Google Sheets:', error);
  }
};
