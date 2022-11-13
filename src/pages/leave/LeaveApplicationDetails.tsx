import React, { useState, useEffect, ChangeEvent, useContext } from 'react';
import '../../styles/common/common.scss';
import '../../styles/pages/leaveApplicationDetails.scss';
import { useNavigate, useParams, generatePath } from 'react-router';
import { LeftOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Collapse,
  Input,
  Select,
  Spin,
  Tag,
  Tooltip,
  Typography
} from 'antd';
import { LeaveApplication, LeaveStatus, LeaveType } from 'src/models/types';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import {
  cancelLeaveApplication,
  editLeaveApplication,
  getLeaveApplicationById
} from 'src/services/leaveService';
import { DatePicker } from 'antd';
import moment, { Moment } from 'moment';
import TimeoutAlert, { AlertType } from 'src/components/common/TimeoutAlert';
import ConfirmationModalButton from 'src/components/common/ConfirmationModalButton';
import breadcrumbContext from 'src/context/breadcrumbs/breadcrumbContext';
import {
  LEAVE_APPLICATION_DETAILS_URL,
  MY_LEAVE_APPLICATIONS_URL
} from 'src/components/routes/routes';

const { Panel } = Collapse;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

const leaveOptions = [
  {
    label: 'Annual',
    value: 'ANNUAL'
  },
  { label: 'Childcare', value: 'CHILDCARE' },
  {
    label: 'Compassionate',
    value: 'COMPASSIONATE'
  },
  {
    label: 'Parental',
    value: 'PARENTAL'
  },
  {
    label: 'Sick',
    value: 'SICK'
  },
  {
    label: 'Unpaid',
    value: 'UNPAID'
  }
];

const LeaveApplicationDetails = () => {
  const navigate = useNavigate();
  const { updateBreadcrumbItems } = useContext(breadcrumbContext);

  const { leaveId } = useParams();

  const [originalLeaveApplication, setOriginalLeaveApplication] =
    useState<LeaveApplication>();
  const [updatedLeaveApplication, setUpdatedLeaveApplication] =
    useState<LeaveApplication>();
  const [selectedDate, setSelectedDate] = useState<[Moment, Moment]>();
  const [edit, setEdit] = useState<boolean>(false);
  const [alert, setAlert] = React.useState<AlertType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    updateBreadcrumbItems([
      {
        label: 'My Leave Applications',
        to: MY_LEAVE_APPLICATIONS_URL
      },
      {
        label: 'Leave Application Details',
        to: generatePath(LEAVE_APPLICATION_DETAILS_URL, { leaveId })
      }
    ]);
  }, [updateBreadcrumbItems, leaveId]);

  useEffect(() => {
    if (leaveId) {
      setLoading(true);
      asyncFetchCallback(
        getLeaveApplicationById(leaveId),
        (res) => {
          setOriginalLeaveApplication(res);
          setUpdatedLeaveApplication(res);
          setSelectedDate([moment(res.startDate), moment(res.endDate)]);
        },
        () => void 0,
        { updateLoading: setLoading }
      );
    }
  }, [leaveId]);

  const toLowerCase = (string: string | undefined) => {
    if (string) {
      return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    } else {
      return '';
    }
  };

  const onDateRangeChange = (dates: [Moment, Moment]) => {
    setSelectedDate(dates);
  };

  const onLeaveTypeChange = (value: string) => {
    let typedValue = value as keyof typeof LeaveType;
    setUpdatedLeaveApplication((prev) => {
      if (prev) {
        return { ...prev, leaveType: LeaveType[typedValue] };
      } else {
        return prev;
      }
    });
  };

  const onDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setUpdatedLeaveApplication((prev) => {
      if (prev) {
        return { ...prev, description: e.target.value };
      } else {
        return prev;
      }
    });
  };

  const handleCancelUpdate = async () => {
    setEdit(false);
    setUpdatedLeaveApplication(originalLeaveApplication);
    setSelectedDate([
      moment(originalLeaveApplication!.startDate),
      moment(originalLeaveApplication!.endDate)
    ]);
  };

  const handleLeaveApplicationUpdate = async () => {
    if (selectedDate === null) {
      setAlert({
        type: 'warning',
        message: 'Please input a start and end date!'
      });
      return;
    }

    setLoading(true);

    let reqBody = {
      id: updatedLeaveApplication?.id,
      startDate: selectedDate![0].toISOString(),
      endDate: selectedDate![1].toISOString(),
      leaveType: updatedLeaveApplication?.leaveType,
      description: updatedLeaveApplication?.description,
      employeeId: updatedLeaveApplication?.employeeId
    };

    await asyncFetchCallback(
      editLeaveApplication(reqBody),
      (res) => {
        setOriginalLeaveApplication((originalLeaveApplication) => {
          if (originalLeaveApplication) {
            return {
              ...originalLeaveApplication,
              startDate: selectedDate![0].toDate(),
              endDate: selectedDate![1].toDate(),
              leaveType: updatedLeaveApplication!.leaveType,
              description: updatedLeaveApplication!.description
            };
          } else {
            return originalLeaveApplication;
          }
        });
        setAlert({
          type: 'success',
          message: 'Leave Application updated successfully.'
        });
        setEdit(false);
        setLoading(false);
      },
      (err) => {
        setAlert({
          type: 'error',
          message: 'Leave Application was not updated successfully.'
        });
        setEdit(false);
        setLoading(false);
      }
    );
  };

  const handleLeaveApplicationCancel = async () => {
    setLoading(true);
    await asyncFetchCallback(
      cancelLeaveApplication(originalLeaveApplication!.id),
      (res) => {
        setOriginalLeaveApplication((originalLeaveApplication) => {
          if (originalLeaveApplication) {
            return {
              ...originalLeaveApplication,
              status: LeaveStatus.CANCELLED
            };
          } else {
            return originalLeaveApplication;
          }
        });
        setAlert({
          type: 'success',
          message: 'Leave Application cancelled successfully.'
        });
        setLoading(false);
      },
      (err) => {
        setAlert({
          type: 'error',
          message:
            'Leave Application was not cancelled successfully, please try again later.'
        });
        setLoading(false);
      }
    );
  };

  return (
    <div className='leave-application-details'>
      <div className='leave-application-details-top-section'>
        <div className='leave-application-details-row-display'>
          <Tooltip title='Return to Previous Page'>
            <Button onClick={() => navigate(-1)} icon={<LeftOutlined />} />
          </Tooltip>
          <Typography.Title
            level={2}
            className='leave-application-details-title'
          >
            View Leave Application
          </Typography.Title>
        </div>
        <div className='leave-application-details-button-container'>
          {originalLeaveApplication?.status === 'PENDING' && (
            <Button
              type='primary'
              onClick={() => {
                if (!edit) {
                  setEdit(true);
                } else {
                  handleLeaveApplicationUpdate();
                }
              }}
            >
              {edit ? 'Save Changes' : 'Edit'}
            </Button>
          )}
          {edit && <Button onClick={handleCancelUpdate}>Cancel</Button>}
          {!edit && (
            <ConfirmationModalButton
              modalProps={{
                title: 'Cancel Leave Application',
                body: 'Are you sure you want to cancel this leave application?',
                onConfirm: handleLeaveApplicationCancel
              }}
            >
              Cancel Leave
            </ConfirmationModalButton>
          )}
        </div>
      </div>
      {alert && (
        <div className='alert'>
          <TimeoutAlert alert={alert} clearAlert={() => setAlert(null)} />
        </div>
      )}
      <Card className='leave-application-card'>
        <Spin size='large' spinning={loading} className='spin'>
          <div className='leave-application-displayed-field'>
            <Typography.Title level={4} className='leave-application-title'>
              Leave Duration:
            </Typography.Title>
            {!edit ? (
              <Typography>{`${moment(
                originalLeaveApplication?.startDate
              ).format('DD MMM YYYY hh:mm A')} - ${moment(
                originalLeaveApplication?.endDate
              ).format('DD MMM YYYY hh:mm A')}
            `}</Typography>
            ) : (
              <RangePicker
                showTime
                format='YYYY-MM-DD HH:mm'
                value={selectedDate}
                onChange={(dates: any) => onDateRangeChange(dates)}
              />
            )}
          </div>
          <div className='leave-application-displayed-field'>
            <Typography.Title level={4} className='leave-application-title'>
              Type of Leave:
            </Typography.Title>
            {!edit ? (
              <Typography>
                {`${toLowerCase(originalLeaveApplication?.leaveType)} Leave`}
              </Typography>
            ) : (
              <Select
                className='leave-application-select'
                value={updatedLeaveApplication?.leaveType}
                options={leaveOptions}
                onSelect={onLeaveTypeChange}
              />
            )}
          </div>
          <div className='leave-application-displayed-field'>
            <Typography.Title level={4} className='leave-application-title'>
              Description:
            </Typography.Title>
            {!edit ? (
              <Typography>
                {originalLeaveApplication?.description
                  ? originalLeaveApplication?.description
                  : '-'}
              </Typography>
            ) : (
              <TextArea
                rows={4}
                placeholder='Input updated description'
                onChange={onDescriptionChange}
                value={updatedLeaveApplication?.description}
              />
            )}
          </div>
          <div className='leave-application-details-row-display'>
            <Typography.Title level={4} className='leave-application-title'>
              Status:
            </Typography.Title>
            {(originalLeaveApplication?.status === 'APPROVED' ||
              originalLeaveApplication?.status === 'REJECTED') && (
              <Collapse
                collapsible='header'
                style={{
                  backgroundColor:
                    originalLeaveApplication?.status === 'APPROVED'
                      ? '#6EB978'
                      : '#EA6464'
                }}
              >
                <Panel
                  header={toLowerCase(originalLeaveApplication?.status)}
                  key='1'
                >
                  <div className='leave-application-displayed-field'>
                    <Typography className='leave-application-status-title'>
                      Approved By:
                    </Typography>
                    <Typography>
                      {originalLeaveApplication?.vettedBy?.firstName}
                    </Typography>
                  </div>
                  <div className='leave-application-displayed-field'>
                    <Typography className='leave-application-status-title'>
                      Comments By Vetter:
                    </Typography>
                    <Typography>
                      {originalLeaveApplication?.commentsByVetter
                        ? originalLeaveApplication?.commentsByVetter
                        : '-'}
                    </Typography>
                  </div>
                  <div className='leave-application-displayed-field'>
                    <Typography className='leave-application-status-title'>
                      Last Updated:
                    </Typography>
                    <Typography>
                      {moment(originalLeaveApplication?.lastUpdated).format(
                        'DD MMM YYYY'
                      )}
                    </Typography>
                  </div>
                </Panel>
              </Collapse>
            )}
            {originalLeaveApplication?.status === 'PENDING' && (
              <Tag color='#F6943D' className='leave-application-status-tag'>
                Pending
              </Tag>
            )}
            {originalLeaveApplication?.status === 'CANCELLED' && (
              <Tag color='#D9D9D9' className='leave-application-status-tag'>
                Cancelled
              </Tag>
            )}
          </div>
        </Spin>
      </Card>
    </div>
  );
};

export default LeaveApplicationDetails;
