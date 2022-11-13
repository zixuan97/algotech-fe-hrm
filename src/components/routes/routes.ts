export const ROOT_URL = '/';
// app level routes
export const ACCOUNT_SETTINGS_URL = ROOT_URL + 'accountSettings';
export const MY_ACCOUNT_URL = ROOT_URL + 'myAccount';
export const LOGIN_URL = ROOT_URL + 'login';
export const DASHBOARD_URL = ROOT_URL + 'dashboard';

// company routtes
export const COMPANY_URL = ROOT_URL + 'company';

// people routes
export const PEOPLE_URL = ROOT_URL + 'people';

// subjects routes
export const SUBJECTS_URL = ROOT_URL + 'subjects';
export const SUBJECT_ID_URL = SUBJECTS_URL + '/:subjectId';
export const EDIT_SUBJECT_URL = SUBJECT_ID_URL + '/edit';
export const EDIT_TOPIC_URL = SUBJECT_ID_URL + '/topic/:topicId/edit';
export const EDIT_QUIZ_URL = SUBJECT_ID_URL + '/quiz/:quizId/edit';

// processes routes
export const PROCESSES_URL = ROOT_URL + 'processes';

// reports routes
export const REPORTS_URL = ROOT_URL + 'reports';

// leave routes
export const LEAVE_URL = ROOT_URL + 'leave';
export const LEAVE_QUOTA_URL = LEAVE_URL + '/leaveQuota';
export const COMPANY_LEAVE_SCHEDULE_URL = LEAVE_URL + '/companyLeaveSchedule';
export const ALL_LEAVE_APPLICATIONS_URL = LEAVE_URL + '/allLeaveApplications';
export const MY_LEAVE_APPLICATIONS_URL = LEAVE_URL + '/myLeaveApplications';
export const LEAVE_APPLICATION_DETAILS_URL =
  LEAVE_URL + '/:leaveId/leaveApplicationDetails';
