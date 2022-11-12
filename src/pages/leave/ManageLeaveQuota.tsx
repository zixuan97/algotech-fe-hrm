import React, { useState } from 'react';
import '../../styles/pages/leaveQuota.scss';
import { Button, Divider, Form, Popconfirm, Table, Typography } from 'antd';
import {
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SaveOutlined
} from '@ant-design/icons';
import { LeaveQuota } from 'src/models/types';
import {
  createLeaveQuota,
  deleteLeaveQuota,
  editLeaveQuota,
  getAllLeaveQuota,
  getTierSize
} from 'src/services/leaveService';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import TimeoutAlert, { AlertType } from 'src/components/common/TimeoutAlert';
import LeaveQuotaEditableCell from 'src/components/leave/LeaveQuotaEditableCell';
import ConfirmationModal from 'src/components/common/ConfirmationModal';
import ReplaceTierModal from 'src/components/leave/ReplaceTierModal';

const ManageLeaveQuota = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState<LeaveQuota[]>([]);
  const [currentRow, setCurrentRow] = useState<Partial<LeaveQuota>>();
  const [editingKey, setEditingKey] = useState<string>('');
  const [addNewQuota, setAddNewQuota] = useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [alert, setAlert] = React.useState<AlertType | null>(null);
  const [confirmationModalOpen, setConfirmationModalOpen] =
    useState<boolean>(false);
  const [replaceTierModalOpen, setReplaceTierModalOpen] =
    useState<boolean>(false);

  const isEditing = (record: LeaveQuota) => record.tier === editingKey;

  React.useEffect(() => {
    setLoading(true);
    asyncFetchCallback(
      getAllLeaveQuota(),
      (res) => {
        const sortedData = res.sort((a, b) => a.tier.localeCompare(b.tier));
        setData(sortedData);
      },
      () => void 0,
      { updateLoading: setLoading }
    );
  }, []);

  const edit = (record: LeaveQuota) => {
    const row = data.find((item) => item.tier === record.tier);
    setCurrentRow(row);
    form.setFieldsValue({
      ...record
    });
    setEditingKey(record.tier);
  };

  const cancel = () => {
    if (addNewQuota) {
      setAddNewQuota(false);
      data.pop();
      setData([...data]);
    }
    setEditingKey('');
    setCurrentRow({});
  };

  const save = async (tier: string) => {
    try {
      setLoading(true);

      const row = (await form.validateFields()) as LeaveQuota;
      const newData = [...data];
      const index = newData.findIndex((item) => tier === item.tier);
      const item = newData[index];
      newData.splice(index, 1, {
        ...item,
        ...row
      });

      const uniqueValues = new Set(
        newData.map((leaveQuota) => leaveQuota.tier)
      );
      if (uniqueValues.size < newData.length) {
        setAlert({
          type: 'warning',
          message: 'Tier names must be unique!'
        });
        setLoading(false);
        return;
      }

      let reqBody = {
        ...(!addNewQuota && { id: currentRow!.id }),
        tier: currentRow!.tier,
        annual: currentRow!.annual,
        childcare: currentRow!.childcare,
        compassionate: currentRow!.compassionate,
        parental: currentRow!.parental,
        sick: currentRow!.sick,
        unpaid: currentRow!.unpaid
      };

      if (addNewQuota) {
        await asyncFetchCallback(
          createLeaveQuota(reqBody),
          (res) => {
            const sortedData = newData.sort((a, b) =>
              a.tier.localeCompare(b.tier)
            );
            setData(sortedData);
            setEditingKey('');
            setAddNewQuota(false);
            setCurrentRow({});
            setLoading(false);
            setAlert({
              type: 'success',
              message: 'Leave quota created successfully!'
            });
          },
          (err) => {
            setEditingKey('');
            setAddNewQuota(false);
            setCurrentRow({});
            setLoading(false);
            setAlert({
              type: 'error',
              message:
                'Leave quota was not created successfully, please try again!'
            });
          }
        );
      } else {
        await asyncFetchCallback(
          editLeaveQuota(reqBody),
          (res) => {
            const sortedData = newData.sort((a, b) =>
              a.tier.localeCompare(b.tier)
            );
            setData(sortedData);
            setEditingKey('');
            setCurrentRow({});
            setLoading(false);
            setAlert({
              type: 'success',
              message: 'Leave quota updated successfully!'
            });
          },
          (err) => {
            setEditingKey('');
            setCurrentRow({});
            setLoading(false);
            setAlert({
              type: 'error',
              message:
                'Leave quota was not updated successfully, please try again!'
            });
          }
        );
      }
    } catch (errInfo) {
      setLoading(false);
    }
  };

  const handleDelete = async (record: LeaveQuota) => {
    setLoading(true);
    setCurrentRow(record);

    await asyncFetchCallback(getTierSize(record.tier!), (res) => {
      if (res > 0) {
        setReplaceTierModalOpen(true);
      } else {
        setConfirmationModalOpen(true);
      }
      setLoading(false);
    });
  };

  const handleDeleteLeaveQuota = async (id: number) => {
    setConfirmationModalOpen(false);
    await asyncFetchCallback(
      deleteLeaveQuota(id),
      (res) => {
        const newData = data.filter((item) => item.id !== id);
        const sortedData = newData.sort((a, b) => a.tier.localeCompare(b.tier));
        setData(sortedData);
        setData([...newData]);
        setCurrentRow({});
        setLoading(false);
        setAlert({
          type: 'success',
          message: 'Leave quota deleted successfully!'
        });
      },
      (err) => {
        setCurrentRow({});
        setLoading(false);
        setAlert({
          type: 'error',
          message: 'Leave quota was not deleted successfully, please try again!'
        });
      }
    );
  };

  const handleAdd = () => {
    setAddNewQuota(true);
    const newData: LeaveQuota = {
      id: undefined,
      tier: '',
      annual: 0,
      childcare: 0,
      compassionate: 0,
      parental: 0,
      sick: 0,
      unpaid: 0
    };
    setData([...data, newData]);
    setCurrentRow(newData);
    form.setFieldsValue({
      ...newData
    });
    setEditingKey(newData.tier);
  };

  const onInputChange = (value: string, dataIndex: string) => {
    if (dataIndex === 'tier') {
      setCurrentRow((old) => ({ ...old, [dataIndex]: value }));
    } else {
      setCurrentRow((old) => ({ ...old, [dataIndex]: Number(value) }));
    }
  };

  const columns = [
    {
      title: 'Tier',
      dataIndex: 'tier',
      editable: true
    },
    {
      title: 'Annual Leave',
      dataIndex: 'annual',
      editable: true
    },
    {
      title: 'Childcare Leave',
      dataIndex: 'childcare',
      editable: true
    },
    {
      title: 'Compassionate Leave',
      dataIndex: 'compassionate',
      editable: true
    },
    {
      title: 'Parental Leave',
      dataIndex: 'parental',
      editable: true
    },
    {
      title: 'Sick Leave',
      dataIndex: 'sick',
      editable: true
    },
    {
      title: 'Unpaid Leave',
      dataIndex: 'unpaid',
      editable: true
    },
    {
      title: 'Operation',
      dataIndex: 'operation',
      render: (_: any, record: LeaveQuota) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Button
              type='primary'
              icon={<SaveOutlined />}
              onClick={() => save(record.tier)}
            />
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
            <Divider type='vertical' />
            <Button
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record)}
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
      onCell: (record: LeaveQuota) => ({
        record,
        inputType: col.dataIndex === 'tier' ? 'string' : 'number',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
        handleInputChange: onInputChange
      })
    };
  });

  return (
    <Form form={form} component={false}>
      <Typography.Title level={1}>Manage Leave Quota</Typography.Title>
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
        summary={() => (
          <Table.Summary fixed='top'>
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={8}>
                <Button
                  type='primary'
                  icon={<PlusOutlined />}
                  onClick={handleAdd}
                  disabled={addNewQuota ? true : false}
                >
                  Add New Tier
                </Button>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          </Table.Summary>
        )}
      />
      <ConfirmationModal
        open={confirmationModalOpen}
        title='Delete Tier'
        body='Are you sure you want to delete this tier?'
        onConfirm={() => handleDeleteLeaveQuota(currentRow!.id!)}
        onClose={() => setConfirmationModalOpen(false)}
      />
      <ReplaceTierModal
        open={replaceTierModalOpen}
        tierToDelete={currentRow?.tier}
        onConfirm={() => {}}
        onClose={() => setReplaceTierModalOpen(false)}
      />
    </Form>
  );
};

export default ManageLeaveQuota;
