import React, { useState, useEffect, useContext } from 'react';
import '../../styles/pages/leaveQuota.scss';
import { Button, Divider, Form, Popconfirm, Table, Typography } from 'antd';
import {
  CloseOutlined,
  EditOutlined,
  PlusOutlined,
  SaveOutlined
} from '@ant-design/icons';
import { LeaveQuota, User, UserRole, UserStatus } from 'src/models/types';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import TimeoutAlert, { AlertType } from 'src/components/common/TimeoutAlert';
import LeaveQuotaEditableCell from 'src/components/leave/LeaveQuotaEditableCell';
import breadcrumbContext from 'src/context/breadcrumbs/breadcrumbContext';
import { EMPLOYEE_LEAVE_QUOTA_URL } from 'src/components/routes/routes';
import { getUserFullName } from 'src/utils/formatUtils';
import { getAllLeaveQuota } from 'src/services/leaveService';

export interface EmployeeLeaveQuota {
  employee: User;
  annualQuota: number;
  childcareQuota: number;
  compassionateQuota: number;
  parentalQuota: number;
  sickQuota: number;
  unpaidQuota: number;
}

const data = [
  {
    employee: {
      id: 5,
      firstName: 'Zi Kun',
      lastName: 'Teng',
      email: 'meleenoob971+b2b@gmail.com',
      password: '',
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      isVerified: false,
      tier: 'Tier 1',
      managerId: null
    },
    annualQuota: 10,
    childcareQuota: 10,
    compassionateQuota: 15,
    parentalQuota: 10,
    sickQuota: 10,
    unpaidQuota: 10
  }
];

const ManageEmployeeLeaveQuota = () => {
  const [form] = Form.useForm();
  const { updateBreadcrumbItems } = useContext(breadcrumbContext);

  //   const [data, setData] = useState<EmployeeLeaveQuota[]>([]);
  const [currentRow, setCurrentRow] = useState<Partial<EmployeeLeaveQuota>>();
  const [tiers, setTiers] = useState<LeaveQuota[]>([]);
  const [editingKey, setEditingKey] = useState<number | undefined>();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [alert, setAlert] = React.useState<AlertType | null>(null);

  const isEditing = (record: EmployeeLeaveQuota) =>
    record.employee.id === editingKey;

  useEffect(() => {
    updateBreadcrumbItems([
      {
        label: 'Employee Leave Quota',
        to: EMPLOYEE_LEAVE_QUOTA_URL
      }
    ]);
  }, [updateBreadcrumbItems]);

  useEffect(() => {
    setLoading(true);
    asyncFetchCallback(
      getAllLeaveQuota(),
      (res) => {
        setTiers(res);
      },
      () => void 0,
      { updateLoading: setLoading }
    );
  }, []);

  const edit = (record: EmployeeLeaveQuota) => {
    const row = data.find((item) => item.employee.id === record.employee.id);
    setCurrentRow(row);
    form.setFieldsValue({
      ...record
    });
    setEditingKey(record.employee.id);
  };

  const cancel = () => {
    setEditingKey(undefined);
    setCurrentRow({});
  };

  const onInputChange = (value: string, name: string) => {
    console.log(currentRow);
    console.log(value)
    if (name === 'tier') {
      setCurrentRow((old) => ({ ...old, [name]: value }));
    } else {
      setCurrentRow((old) => ({ ...old, [name]: Number(value) }));
    }
  };

  const columns = [
    {
      title: 'Employee Name',
      name: 'employeeName',
      render: (record: EmployeeLeaveQuota) => getUserFullName(record.employee)
    },
    {
      title: 'Tier',
      name: 'tier',
      render: (record: EmployeeLeaveQuota) => record.employee.tier,
      editable: true
    },
    {
      title: 'Annual Leave',
      name: 'annualQuota',
      dataIndex: 'annualQuota',
      editable: true
    },
    {
      title: 'Childcare Leave',
      name: 'childcareQuota',
      dataIndex: 'childcareQuota',
      editable: true
    },
    {
      title: 'Compassionate Leave',
      name: 'compassionateQuota',
      dataIndex: 'compassionateQuota',
      editable: true
    },
    {
      title: 'Parental Leave',
      name: 'parentalQuota',
      dataIndex: 'parentalQuota',
      editable: true
    },
    {
      title: 'Sick Leave',
      name: 'sickQuota',
      dataIndex: 'sickQuota',
      editable: true
    },
    {
      title: 'Unpaid Leave',
      name: 'unpaidQuota',
      dataIndex: 'unpaidQuota',
      editable: true
    },
    {
      title: 'Operation',
      name: 'operation',
      dataIndex: 'operation',
      render: (_: any, record: EmployeeLeaveQuota) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Button type='primary' icon={<SaveOutlined />} onClick={() => {}} />
            <Divider type='vertical' />
            <Popconfirm
              title='Are you sure you want to cancel?'
              cancelText='No'
              okText='Yes'
              onConfirm={cancel}
            >
              <Button icon={<CloseOutlined />} onClick={() => {}} />
            </Popconfirm>
          </span>
        ) : (
          <span>
            <Button
              type='primary'
              icon={<EditOutlined />}
              onClick={() => edit(record)}
            />
          </span>
        );
      }
    }
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: EmployeeLeaveQuota) => ({
        record,
        inputType: col.name === 'tier' ? 'select' : 'number',
        name: col.name,
        title: col.title,
        editing: isEditing(record),
        handleInputChange: onInputChange,
        selectedTier: record.employee.tier,
        tiers: tiers
      })
    };
  });

  return (
    <Form form={form} component={false}>
      <Typography.Title level={2}>
        Manage Individual Employee Leave Quota
      </Typography.Title>
      {alert && (
        <div className='leave-quota-alert'>
          <TimeoutAlert alert={alert} clearAlert={() => setAlert(null)} />
        </div>
      )}
      <Table
        components={{
          body: {
            cell: LeaveQuotaEditableCell
          }
        }}
        bordered
        dataSource={data}
        columns={mergedColumns}
        rowClassName='editable-row'
        pagination={{
          onChange: cancel
        }}
        loading={loading}
      />
    </Form>
  );
};

export default ManageEmployeeLeaveQuota;
