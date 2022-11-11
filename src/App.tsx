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
  MY_LEAVE_APPLICATIONS,
  PEOPLE_URL,
  SUBJECTS_URL,
  PROCESSES_URL,
  REPORTS_URL,
  ROOT_URL,
  EDIT_SUBJECT_URL
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
                <Route path={LOGIN_URL} element={<Login />} />
                <Route
                  path={ROOT_URL}
                  element={
                    <AuthRoute redirectTo={LOGIN_URL}>
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
                  <Route path={PEOPLE_URL} element={<></>} />
                  {/* subjects routes */}
                  <Route path={SUBJECTS_URL} element={<AllSubjects />} />
                  <Route path={EDIT_SUBJECT_URL} element={<EditSubject />} />
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
                  {/* leave routes */}
                  <Route
                    path={LEAVE_QUOTA_URL}
                    element={<ManageLeaveQuota />}
                  />
                  <Route
                    path={MY_LEAVE_APPLICATIONS}
                    element={<ViewMyLeaveApplications />}
                  />
                  {/* EDITOR, FOR TESTING; TODO: remove once testing is done */}
                  <Route path={EDIT_TOPIC_URL} element={<EditTopic />} />
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
