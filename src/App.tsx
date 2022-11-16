import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes
} from 'react-router-dom';
import React from 'react';
import AuthRoute from './components/auth/AuthRoute';
import AuthState from './context/auth/AuthState';
import Login from './pages/Login';
import { setAuthToken } from './utils/authUtils';
import Home from './pages/Home';
import { Layout } from 'antd';
import ThemeState from './context/theme/ThemeState';
import AppHeader from './components/common/AppHeader';
import './styles/common/app.scss';
import {
  ACCOUNT_SETTINGS_URL,
  COMPANY_URL,
  DASHBOARD_URL,
  EDIT_TOPIC_URL,
  LEAVE_QUOTA_URL,
  LOGIN_URL,
  MY_ACCOUNT_URL,
  MY_LEAVE_APPLICATIONS_URL,
  PEOPLE_URL,
  PEOPLE_MANAGE_URL,
  PEOPLE_ROLES_URL,
  SUBJECTS_URL,
  PROCESSES_URL,
  REPORTS_URL,
  ROOT_URL,
  EDIT_SUBJECT_URL,
  COMPANY_LEAVE_SCHEDULE_URL,
  LEAVE_APPLICATION_DETAILS_URL,
  VIEW_SUBJECT_URL,
  VIEW_TOPIC_URL,
  ALL_LEAVE_APPLICATIONS_URL,
  EMPLOYEE_LEAVE_QUOTA_URL,
  PEOPLE_ROLES_ID_URL
} from './components/routes/routes';
import moment from 'moment';
import EditTopic from './pages/subjects/EditTopic';
import NotFound from './pages/NotFound';
import AccountSettings from './pages/AccountSettings';
import AllSubjects from './pages/subjects/AllSubjects';
import ManageLeaveQuota from './pages/leave/ManageLeaveQuota';
import ViewMyLeaveApplications from './pages/leave/ViewMyLeaveApplications';
import EditSubject from './pages/subjects/EditSubject';
import BreadcrumbState from './context/breadcrumbs/BreadcrumbState';
import ViewMyAccount from './pages/account/ViewMyAccount';
import ViewCompanyLeaveSchedule from './pages/leave/ViewCompanyLeaveSchedule';
import LeaveApplicationDetails from './pages/leave/LeaveApplicationDetails';
import ViewSubject from './pages/subjects/ViewSubject';
import ViewTopic from './pages/subjects/ViewTopic';
import AllLeaveApplications from './pages/leave/AllLeaveApplications';
import ManageEmployeeLeaveQuota from './pages/leave/ManageEmployeeLeaveQuota';
import OrganisationChart from './pages/people/OrganisationInfo';
import ManagePeople from './pages/people/ManagePeople';
import ManageRoles from './pages/people/roles/ManageRoles';
import ViewRole from './pages/people/roles/ViewRole';

const { Footer } = Layout;

const App = () => {
  const token = localStorage.token;
  React.useEffect(() => {
    setAuthToken(localStorage.token);
  }, [token]);

  return (
    <AuthState>
      <ThemeState>
        <Router>
          <BreadcrumbState>
            <Layout className='app-layout'>
              <AppHeader />
              <Routes>
                {/* public routes */}
                <Route path={LOGIN_URL} element={<Login />} />
                {/* private routes */}
                <Route
                  path={MY_ACCOUNT_URL}
                  element={
                    <AuthRoute redirectTo={LOGIN_URL}>
                      <Home>
                        <ViewMyAccount />
                      </Home>
                    </AuthRoute>
                  }
                />
                <Route
                  path={ROOT_URL}
                  element={
                    <AuthRoute
                      redirectTo={LOGIN_URL}
                      unverifiedRedirect={MY_ACCOUNT_URL}
                    >
                      <Home />
                    </AuthRoute>
                  }
                >
                  <Route
                    index
                    element={<Navigate replace to={DASHBOARD_URL} />}
                  />
                  {/* dashboard routes */}
                  <Route path={DASHBOARD_URL} element={<></>} />
                  {/* company routes */}
                  <Route path={COMPANY_URL} element={<></>} />
                  {/* people routes */}
                  <Route path={PEOPLE_URL} element={<OrganisationChart />} />
                  <Route path={PEOPLE_MANAGE_URL} element={<ManagePeople />} />
                  <Route path={PEOPLE_ROLES_URL} element={<ManageRoles />} />
                  <Route path={PEOPLE_ROLES_ID_URL} element={<ViewRole/>}/>

                  {/* subjects routes */}
                  <Route path={SUBJECTS_URL} element={<AllSubjects />} />
                  <Route path={VIEW_SUBJECT_URL} element={<ViewSubject />} />
                  <Route path={EDIT_SUBJECT_URL} element={<EditSubject />} />
                  <Route path={VIEW_TOPIC_URL} element={<ViewTopic />} />
                  <Route path={EDIT_TOPIC_URL} element={<EditTopic />} />
                  {/* processes routes */}
                  <Route path={PROCESSES_URL} element={<></>} />
                  {/* report routes */}
                  <Route path={REPORTS_URL} element={<></>} />
                  {/* accounts routes */}
                  <Route
                    path={ACCOUNT_SETTINGS_URL}
                    element={<AccountSettings />}
                  />
                  <Route path={MY_ACCOUNT_URL} element={<ViewMyAccount />} />
                  {/* leave routes */}
                  <Route
                    path={LEAVE_QUOTA_URL}
                    element={<ManageLeaveQuota />}
                  />
                  <Route
                    path={EMPLOYEE_LEAVE_QUOTA_URL}
                    element={<ManageEmployeeLeaveQuota />}
                  />
                  <Route
                    path={COMPANY_LEAVE_SCHEDULE_URL}
                    element={<ViewCompanyLeaveSchedule />}
                  />
                  <Route
                    path={ALL_LEAVE_APPLICATIONS_URL}
                    element={<AllLeaveApplications />}
                  />
                  <Route
                    path={MY_LEAVE_APPLICATIONS_URL}
                    element={<ViewMyLeaveApplications />}
                  />
                  <Route
                    path={LEAVE_APPLICATION_DETAILS_URL}
                    element={<LeaveApplicationDetails />}
                  />
                </Route>
                <Route
                  path='*'
                  element={
                    <Home>
                      <NotFound />
                    </Home>
                  }
                />
              </Routes>
              <Footer style={{ textAlign: 'center' }}>
                The Kettle Gourmet ©{moment().year()} All Rights Reserved
              </Footer>
            </Layout>
          </BreadcrumbState>
        </Router>
      </ThemeState>
    </AuthState>
  );
};

export default App;
