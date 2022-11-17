import React from 'react';
import { Input, Modal, Select, SelectProps, Space, Typography } from 'antd';
import { User, JobRole, UserRole } from 'src/models/types';
import TimeoutAlert, {
  AlertType,
  AxiosErrDataBody
} from '../common/TimeoutAlert';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import '../../styles/people/managePeople.scss';
import { editEmployee } from 'src/services/peopleService';

const { Text } = Typography;

type EditPersonModalProps = {
  open: boolean;
  allUsers?: User[];
  allJobRoles?: JobRole[];
  user?: User;
  onConfirm: (userToUpdate: User) => void;
  onClose: () => void;
};

const EditPersonModal = (props: EditPersonModalProps) => {
  const { open, allUsers, allJobRoles, user, onConfirm, onClose } = props;

  const [createLoading, setCreateLoading] = React.useState<boolean>(false);
  const [alert, setAlert] = React.useState<AlertType | null>(null);

  const [jobRoles, setJobRoles] = React.useState<JobRole[] | null>();
  const [managerName, setManagerName] = React.useState<string | null>();

  const [originalEmployee, setOriginalEmployee] = React.useState<User>();
  const [updatedEmployee, setUpdatedEmployee] = React.useState<User>();

  const { Option } = Select;

  const [fullName, setFullName] = React.useState<string>('');
  const [title, setTitle] = React.useState<string>('');

  const managerDataSource = allUsers?.filter(
    (filteredUser) =>
      filteredUser.id !== user?.id && filteredUser.role !== UserRole.INTERN
  );

  const getUserFullName = (user: User) => {
    return user.firstName + ' ' + user.lastName;
  };

  React.useEffect(() => {
    if (user) {
      setJobRoles(user.jobRoles);
      setOriginalEmployee(user);
      setUpdatedEmployee(user);
      if (user.manager) {
        setManagerName(getUserFullName(user.manager));
      }
      setFullName(getUserFullName(user));
      setTitle('Edit ' + getUserFullName(user));
    }
  }, [user]);

  const options: SelectProps['options'] = [];
  for (let i = 10; i < 36; i++) {
    options.push({
      value: i.toString(36) + i,
      label: i.toString(36) + i
    });
  }

  const updateJobRoles = (value: string[]) => {
    setCreateLoading(false);
    if (value) {
      const newJobRoles = value.map((val) => {
        let role = allJobRoles?.find((role) => role.jobRole === val);
        return role!;
      });
      setJobRoles(newJobRoles);
      setUpdatedEmployee({
        ...updatedEmployee,
        jobRoles: newJobRoles!
      } as User);
    } else {
      setJobRoles(null);
      setUpdatedEmployee({
        ...updatedEmployee,
        jobRoles: []
      } as User);
    }
  };

  const updateManager = (value: string) => {
    setCreateLoading(false);
    if (value) {
      let newManager = allUsers?.find((user) => user.id === Number(value));
      setManagerName(getUserFullName(newManager!));
      setUpdatedEmployee({
        ...updatedEmployee,
        managerId: newManager?.id,
        manager: newManager
      } as User);
    } else {
      setManagerName(null);
      setUpdatedEmployee({
        ...updatedEmployee,
        managerId: null,
        manager: undefined
      } as User);
    }
  };

  const onOk = async () => {
    if (updatedEmployee) {
      let requestBody = {
        id: updatedEmployee?.id,
        jobRoles: updatedEmployee?.jobRoles,
        managerId: updatedEmployee?.managerId
      };

      setCreateLoading(true);

      await asyncFetchCallback(
        editEmployee(requestBody),
        () => {
          setCreateLoading(false);
          // Closes modal
          onConfirm(updatedEmployee);
        },
        (err) => {
          const resData = err.response?.data as AxiosErrDataBody;
          setAlert({
            type: 'error',
            message: `An error occured: ${resData.message}`
          });
          setCreateLoading(false);
        }
      );
    }
  };

  const onCancel = () => {
    // Reset fields
    setUpdatedEmployee(originalEmployee);
    setJobRoles(originalEmployee?.jobRoles);
    if (originalEmployee?.manager) {
      setManagerName(getUserFullName(originalEmployee.manager));
    } else {
      setManagerName('');
    }
    // This will close the modal
    onClose();
  };

  return (
    <>
      <Modal
        title={title}
        open={open}
        onOk={onOk}
        onCancel={onCancel}
        okText='Save Changes'
        okButtonProps={{ loading: createLoading }}
      >
        {alert && (
          <div className='alert'>
            <TimeoutAlert alert={alert} clearAlert={() => setAlert(null)} />
          </div>
        )}
        <Space direction='vertical' size='middle' style={{ display: 'flex' }}>
          <Space direction='vertical' style={{ width: '100%' }}>
            <Text>Full Name</Text>
            <Input disabled={true} placeholder={fullName} />
          </Space>
          <div className='people-two-columns-container'>
            <div className='people-email-column'>
              <Space direction='vertical' style={{ width: '100%' }}>
                <Text>Email</Text>
                <Input disabled={true} placeholder={originalEmployee?.email} />
              </Space>
            </div>
            <div className='people-permission-column'>
              <Space direction='vertical' style={{ width: '100%' }}>
                <Text>Permissions</Text>
                <Input disabled={true} placeholder={originalEmployee?.role} />
              </Space>
            </div>
          </div>
          <Space direction='vertical' style={{ width: '100%' }}>
            <Text>Role(s) (Optional)</Text>
            <Select
              mode='multiple'
              allowClear
              showArrow
              placeholder='Select Role(s)'
              style={{ width: '100%' }}
              value={jobRoles?.map((role) => role.jobRole)}
              onChange={updateJobRoles}
            >
              {allJobRoles?.map((option) => (
                <Option key={option.id} value={option.jobRole}>
                  {option.jobRole}
                </Option>
              ))}
            </Select>
          </Space>
          <Space direction='vertical' style={{ width: '100%' }}>
            <Text>Reports to (Optional)</Text>
            <Select
              showSearch
              allowClear
              style={{ width: '100%' }}
              placeholder='Select Manager'
              optionFilterProp='children'
              value={managerName?.toString()}
              onChange={updateManager}
            >
              {managerDataSource?.map((option) => (
                <Option key={option.id} value={option.id}>
                  {getUserFullName(option)}
                </Option>
              ))}
            </Select>
          </Space>
        </Space>
        {/* </div> */}
      </Modal>
    </>
  );
};

export default EditPersonModal;
