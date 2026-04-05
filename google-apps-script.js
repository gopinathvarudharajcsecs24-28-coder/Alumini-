/**
 * KSR Alumni Management System - Google Apps Script
 * 
 * INSTRUCTIONS:
 * 1. Go to https://script.google.com/ and create a new project.
 * 2. Paste this entire code into Code.gs.
 * 3. Replace the SPREADSHEET_ID below with your actual Google Sheet ID.
 *    (You can find the ID in the URL of your Google Sheet: https://docs.google.com/spreadsheets/d/YOUR_SPREADSHEET_ID/edit)
 * 4. Click "Deploy" > "New deployment".
 * 5. Select type "Web app".
 * 6. Set "Execute as" to "Me".
 * 7. Set "Who has access" to "Anyone".
 * 8. Click "Deploy" and authorize the app.
 * 9. Copy the "Web app URL" and paste it into your React app's environment variables or config.
 */

const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE'; // Replace this!

function setupSheets() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const requiredSheets = [
    'Alumni_Details',
    'Student_Details',
    'Login_Activity',
    'Admin_Logs',
    'Mentor_Requests',
    'Job_Updates',
    'Announcements'
  ];

  requiredSheets.forEach(sheetName => {
    if (!ss.getSheetByName(sheetName)) {
      ss.insertSheet(sheetName);
    }
  });

  // Setup headers for Alumni_Details
  const alumniSheet = ss.getSheetByName('Alumni_Details');
  if (alumniSheet.getLastRow() === 0) {
    alumniSheet.appendRow([
      'UID', 'Full Name', 'Register Number', 'Department', 'Batch', 
      'Institutional Email', 'Personal Email', 'Mobile Number', 
      'Current City', 'Current State', 'Current Country', 
      'Degree', 'Specialization', 'Graduation Year', 
      'Employment Status', 'Company Name', 'Job Role', 'Work Experience', 
      'Skills', 'LinkedIn', 'Portfolio', 'Resume URL', 'Profile Photo URL', 
      'Mentor Availability', 'Internship Support', 'Placement Support', 
      'Guest Lecture Availability', 'About Me', 'Profile Visibility', 
      'Last Updated', 'Status'
    ]);
  }
  
  // Setup headers for Login_Activity
  const loginSheet = ss.getSheetByName('Login_Activity');
  if (loginSheet.getLastRow() === 0) {
    loginSheet.appendRow([
      'UID', 'Name', 'Email', 'Role', 'Login Time', 'Logout Time', 'Browser', 'Device', 'Status'
    ]);
  }
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    const payload = data.payload;
    
    let result = { success: false, message: 'Unknown action' };

    if (action === 'sync_alumni') {
      result = syncAlumni(payload);
    } else if (action === 'log_activity') {
      result = logActivity(payload);
    } else if (action === 'sync_student') {
      result = syncStudent(payload);
    }

    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function syncAlumni(payload) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName('Alumni_Details');
  const data = sheet.getDataRange().getValues();
  
  const uid = payload.uid;
  let rowIndex = -1;
  
  // Find existing row by UID (Column A / index 0)
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === uid) {
      rowIndex = i + 1; // +1 because sheet rows are 1-indexed
      break;
    }
  }
  
  const rowData = [
    payload.uid || '',
    payload.fullName || '',
    payload.registerNumber || '',
    payload.department || '',
    payload.batch || '',
    payload.institutionalEmail || '',
    payload.personalEmail || '',
    payload.mobileNumber || '',
    payload.currentCity || '',
    payload.currentState || '',
    payload.currentCountry || '',
    payload.degree || '',
    payload.specialization || '',
    payload.graduationYear || '',
    payload.employmentStatus || '',
    payload.companyName || '',
    payload.jobRole || '',
    payload.workExperience || '',
    payload.skills || '',
    payload.linkedIn || '',
    payload.portfolio || '',
    payload.resumeUrl || '',
    payload.profilePhotoUrl || '',
    payload.mentorAvailability ? 'Yes' : 'No',
    payload.internshipSupport ? 'Yes' : 'No',
    payload.placementSupport ? 'Yes' : 'No',
    payload.guestLectureAvailability ? 'Yes' : 'No',
    payload.aboutMe || '',
    payload.profileVisibility || 'Public',
    new Date().toISOString(),
    payload.status || 'Active'
  ];
  
  if (rowIndex > -1) {
    // Update existing row
    sheet.getRange(rowIndex, 1, 1, rowData.length).setValues([rowData]);
    return { success: true, message: 'Alumni updated successfully' };
  } else {
    // Append new row
    sheet.appendRow(rowData);
    return { success: true, message: 'Alumni created successfully' };
  }
}

function logActivity(payload) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName('Login_Activity');
  
  sheet.appendRow([
    payload.uid || '',
    payload.name || '',
    payload.email || '',
    payload.role || '',
    payload.loginTime || new Date().toISOString(),
    payload.logoutTime || '',
    payload.browser || '',
    payload.device || '',
    payload.status || 'Success'
  ]);
  
  return { success: true, message: 'Activity logged successfully' };
}

function syncStudent(payload) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName('Student_Details');
  
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['UID', 'Name', 'Email', 'Department', 'Year', 'Login Count', 'Last Login', 'Status']);
  }
  
  const data = sheet.getDataRange().getValues();
  let rowIndex = -1;
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === payload.uid) {
      rowIndex = i + 1;
      break;
    }
  }
  
  if (rowIndex > -1) {
    // Update existing
    const existingCount = data[rowIndex-1][5] || 0;
    sheet.getRange(rowIndex, 6).setValue(existingCount + 1);
    sheet.getRange(rowIndex, 7).setValue(new Date().toISOString());
  } else {
    // Append new
    sheet.appendRow([
      payload.uid || '',
      payload.name || '',
      payload.email || '',
      payload.department || '',
      payload.year || '',
      1,
      new Date().toISOString(),
      'Active'
    ]);
  }
  
  return { success: true, message: 'Student synced successfully' };
}
