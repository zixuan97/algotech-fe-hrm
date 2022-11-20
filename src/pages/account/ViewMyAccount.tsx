import React, { useState } from 'react';
import '../../styles/pages/account.scss';
import { Typography, Card, Divider, Input, Spin } from 'antd';
import authContext from '../../context/auth/authContext';
import themeContext from 'src/context/theme/themeContext';
import { User } from '../../models/types';
import { editUserSvc } from '../../services/accountService';
import asyncFetchCallback from '../../services/util/asyncFetchCallback';
import TimeoutAlert, { AlertType } from '../../components/common/TimeoutAlert';
import ChangePasswordModal from 'src/components/account/ChangePasswordModal';
import AccountMenu from 'src/components/account/AccountMenu';
import EditButtonGroup from 'src/components/account/EditButtonGroup';

const ViewMyAccount = () => {
  const authhenticationContext = React.useContext(authContext);
  const { isDarkMode, updateDarkMode } = React.useContext(themeContext);

  const { user, loadUser } = authhenticationContext;
  const [editUser, setEditUser] = useState<User>();
  const [edit, setEdit] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [alert, setAlert] = useState<AlertType | null>(null);

  React.useEffect(() => {
    if (user) {
      if (!user.isVerified) {
        setOpenModal(true);
      }
      setEditUser(user);
    }
  }, [user]);

  const userFieldOnChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    key: string
  ) => {
    setEditUser((user: User | undefined) => {
      return {
        ...user!,
        [key]: event.target.value
      };
    });
  };

  const handleSaveButtonClick = (e: any) => {
    e.preventDefault();
    if (editUser?.firstName === '') {
      setAlert({
        type: 'warning',
        message: 'First name field cannot be empty!'
      });
      return;
    }

    if (editUser?.lastName === '') {
      setAlert({
        type: 'warning',
        message: 'Last name field cannot be empty!'
      });
      return;
    }

    if (editUser?.email === '') {
      setAlert({
        type: 'warning',
        message: 'Email field cannot be empty!'
      });
      return;
    }

    setLoading(true);
    asyncFetchCallback(
      editUserSvc(editUser!),
      () => {
        setAlert({
          type: 'success',
          message: 'Edits to your account has been saved.'
        });
        loadUser();
        setEdit(false);
        setLoading(false);
      },
      () => {
        setAlert({
          type: 'error',
          message: 'Failed to save changes. Please try again later.'
        });
        setLoading(false);
      }
    );
  };

  return (
    <>
      <div className='account-header'>
        {user && (
          <ChangePasswordModal
            open={openModal}
            handleCancel={() => setOpenModal(false)}
            handleSubmit={() => setOpenModal(false)}
            loadUser={() => loadUser()}
            user={user}
          />
        )}
        <Typography.Title level={1}>My Account</Typography.Title>
        <div className='button-group'>
          {edit && (
            <EditButtonGroup
              setEdit={setEdit}
              edit={edit}
              user={user!}
              setEditUser={setEditUser}
              handleSaveButtonClick={handleSaveButtonClick}
            />
          )}
          {!edit && (
            <AccountMenu
              setEdit={() => setEdit(true)}
              setOpenModal={() => setOpenModal(true)}
            />
          )}
        </div>
      </div>
      {alert && (
        <div className='account-alert'>
          <TimeoutAlert alert={alert} clearAlert={() => setAlert(null)} />
        </div>
      )}
      <Card style={{ paddingBottom: '12px' }}>
        <Spin
          size='large'
          spinning={loading}
          style={{ display: 'flex', justifyContent: 'center' }}
        >
          <Typography.Title
            level={4}
            style={{ color: isDarkMode ? '#f3cc62' : '#96694c' }}
          >
            First Name
          </Typography.Title>
          {edit ? (
            <Input
              value={editUser!.firstName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                userFieldOnChange(e, 'firstName');
              }}
            />
          ) : (
            <Typography>{user?.firstName}</Typography>
          )}
          <Divider type='horizontal' />
          <Typography.Title
            level={4}
            style={{ color: isDarkMode ? '#f3cc62' : '#96694c' }}
          >
            Last Name
          </Typography.Title>
          {edit ? (
            <Input
              value={editUser!.lastName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                userFieldOnChange(e, 'lastName');
              }}
            />
          ) : (
            <Typography>{user?.lastName}</Typography>
          )}
          <Divider type='horizontal' />
          <Typography.Title
            level={4}
            style={{ color: isDarkMode ? '#f3cc62' : '#96694c' }}
          >
            Email
          </Typography.Title>
          {edit ? (
            <Input
              value={editUser!.email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                userFieldOnChange(e, 'email');
              }}
            />
          ) : (
            <Typography>{user?.email}</Typography>
          )}
          <Divider type='horizontal' />
          <Typography.Title
            level={4}
            style={{ color: isDarkMode ? '#f3cc62' : '#96694c' }}
          >
            Role
          </Typography.Title>
          <Typography>{user?.role}</Typography>
          <Divider type='horizontal' />
          {/* <Typography.Title
            level={4}
            style={{ color: isDarkMode ? '#f3cc62' : '#96694c' }}
          >
            Theme
          </Typography.Title>
          <Space>
            <Typography.Text>Dark Mode</Typography.Text>{' '}
            <Switch
              onChange={(checked) => updateDarkMode(checked)}
              checked={isDarkMode}
            />
          </Space> */}
        </Spin>
      </Card>
    </>
  );
};

export default ViewMyAccount;
