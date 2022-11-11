export const ROOT_URL = '/';
// app level routes
export const ACCOUNT_SETTINGS_URL = ROOT_URL + 'accountSettings';
export const LOGIN_URL = ROOT_URL + 'login';
export const DASHBOARD_URL = ROOT_URL + 'dashboard';

// company routtes
export const COMPANY_URL = ROOT_URL + 'company';

// people routes
export const PEOPLE_URL = ROOT_URL + 'people';

// subjects routes
export const SUBJECTS_URL = ROOT_URL + 'subjects';
export const EDIT_SUBJECT_URL = SUBJECTS_URL + '/:subjectId/edit';
export const EDIT_TOPIC_URL = SUBJECTS_URL + '/editTopic';

// processes routes
export const PROCESSES_URL = ROOT_URL + 'processes';

// reports routes
export const REPORTS_URL = ROOT_URL + 'reports';

// leave routes
export const LEAVE_QUOTA_URL = ROOT_URL + 'leave/LeaveQuota';
export const MY_LEAVE_APPLICATIONS = ROOT_URL + 'leave/MyLeaveApplications';
