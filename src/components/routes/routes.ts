export const ROOT_URL = '/';
// app level routes
export const MY_ACCOUNT_URL = ROOT_URL + 'myAccount';
export const LOGIN_URL = ROOT_URL + 'login';
export const DASHBOARD_URL = ROOT_URL + 'dashboard';

// people routes
export const PEOPLE_URL = ROOT_URL + 'people';
export const PEOPLE_MANAGE_URL = PEOPLE_URL + '/manage';
export const PEOPLE_DIRECTORY_URL = PEOPLE_URL + '/directory';
export const PEOPLE_ORGCHART_URL = PEOPLE_URL + '/orgchart';
export const PEOPLE_ROLES_URL = PEOPLE_URL + '/roles';

// subjects routes
export const SUBJECTS_URL = ROOT_URL + 'subjects';
export const MY_SUBJECTS_URL = ROOT_URL + 'mySubjects';
export const SUBJECT_ID_URL = SUBJECTS_URL + '/:subjectId';
export const MY_SUBJECT_ID_URL = MY_SUBJECTS_URL + '/:subjectId';
export const VIEW_SUBJECT_URL = SUBJECT_ID_URL + '/view';
export const EDIT_SUBJECT_URL = SUBJECT_ID_URL + '/edit';
export const ASSIGNED_SUBJECT_URL = MY_SUBJECT_ID_URL + '/assigned';
export const VIEW_TOPIC_URL = SUBJECT_ID_URL + '/topic/:topicId/view';
export const EDIT_TOPIC_URL = SUBJECT_ID_URL + '/topic/:topicId/edit';
export const VIEW_QUIZ_URL = SUBJECT_ID_URL + '/quiz/:quizId/view';
export const EDIT_QUIZ_URL = SUBJECT_ID_URL + '/quiz/:quizId/edit';

// leave routes
export const LEAVE_URL = ROOT_URL + 'leave';
export const LEAVE_QUOTA_URL = LEAVE_URL + '/leaveQuota';
export const EMPLOYEE_LEAVE_QUOTA_URL = LEAVE_URL + '/employeeLeaveQuota';
export const COMPANY_LEAVE_SCHEDULE_URL = LEAVE_URL + '/companyLeaveSchedule';
export const ALL_LEAVE_APPLICATIONS_URL = LEAVE_URL + '/allLeaveApplications';
export const MY_LEAVE_APPLICATIONS_URL = LEAVE_URL + '/myLeaveApplications';
export const LEAVE_APPLICATION_DETAILS_URL =
  LEAVE_URL + '/:leaveId/leaveApplicationDetails';
