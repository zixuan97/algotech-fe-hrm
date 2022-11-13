import React, { useState, useEffect, useContext } from 'react';
import '../../styles/pages/leaveQuota.scss';
import { Button, Divider, Form, Popconfirm, Table, Typography } from 'antd';
import {
  CloseOutlined,
  EditOutlined,
  PlusOutlined,
  SaveOutlined
} from '@ant-design/icons';
import { User } from 'src/models/types';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import TimeoutAlert, { AlertType } from 'src/components/common/TimeoutAlert';
import LeaveQuotaEditableCell from 'src/components/leave/LeaveQuotaEditableCell';
import breadcrumbContext from 'src/context/breadcrumbs/breadcrumbContext';
import { EMPLOYEE_LEAVE_QUOTA_URL } from 'src/components/routes/routes';
import { getUserFullName } from 'src/utils/formatUtils';

export interface EmployeeLeaveQuota {
  employee: User;
  annualQuota: number;
  childcareQuota: number;
  compassionateQuota: number;
  parentalQuota: number;
  sickQuota: number;
  unpaidQuota: number;
}

const ManageEmployeeLeaveQuota = () => {
  const [form] = Form.useForm();
  const { updateBreadcrumbItems } = useContext(breadcrumbContext);

  const [data, setData] = useState<EmployeeLeaveQuota[]>([]);
  const [currentRow, setCurrentRow] = useState<Partial<EmployeeLeaveQuota>>();
  const [editingKey, setEditingKey] = useState<number>();
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

  const columns = [
    {
      title: 'Employee Name',
      render: (record: EmployeeLeaveQuota) => getUserFullName(record.employee)
    },
    {
      title: 'Tier',
      render: (record: EmployeeLeaveQuota) => record.employee.tier
    },
    {
      title: 'Annual Leave',
      dataIndex: 'annualQuota',
      editable: true
    },
    {
      title: 'Childcare Leave',
      dataIndex: 'childcareQuota',
      editable: true
    },
    {
      title: 'Compassionate Leave',
      dataIndex: 'compassionateQuota',
      editable: true
    },
    {
      title: 'Parental Leave',
      dataIndex: 'parentalQuota',
      editable: true
    },
    {
      title: 'Sick Leave',
      dataIndex: 'sickQuota',
      editable: true
    },
    {
      title: 'Unpaid Leave',
      dataIndex: 'unpaidQuota',
      editable: true
    },
    {
      title: 'Operation',
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
              onConfirm={() => {}}
            >
              <Button icon={<CloseOutlined />} onClick={() => {}} />
            </Popconfirm>
          </span>
        ) : (
          <span>
            <Button type='primary' icon={<EditOutlined />} onClick={() => {}} />
            <Divider type='vertical' />
          </span>
        );
      }
    }
  ];

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
        columns={columns}
        rowClassName='editable-row'
        // pagination={{
        //   onChange: cancel
        // }}
        loading={loading}
      />
    </Form>
  );
};

export default ManageEmployeeLeaveQuota;
