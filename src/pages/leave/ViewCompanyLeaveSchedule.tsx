import React, { useEffect, useState, useContext } from 'react';
import '../../styles/pages/companyLeaveSchedule.scss';
import { Spin, Typography } from 'antd';
import { interpolateRdYlBu } from 'd3-scale-chromatic';
import type { Moment } from 'moment';
import moment from 'moment';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import { getAllApprovedLeaveApplications } from 'src/services/leaveService';
import CalendarCellModal from 'src/components/leave/CalendarCellModal';
import { CalendarObject } from 'src/models/types';
import LeaveCalendar from 'src/components/leave/LeaveCalendar';
import interpolateColors from 'src/utils/colourUtils';
import breadcrumbContext from 'src/context/breadcrumbs/breadcrumbContext';
import { COMPANY_LEAVE_SCHEDULE_URL } from 'src/components/routes/routes';

const ViewCompanyLeaveSchedule = () => {
  const { updateBreadcrumbItems } = useContext(breadcrumbContext);

  const [leaveDates, setLeaveDates] = useState<CalendarObject[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Moment>(moment());
  const [selectedMode, setSelectedMode] = useState<string>('month');
  const [openCalendarCellModal, setOpenCalendarCellModal] =
    React.useState<boolean>(false);

  const colours = interpolateColors(leaveDates.length, interpolateRdYlBu, {
    colorStart: 0.2,
    colorEnd: 1,
    useEndAsStart: false
  });

  useEffect(() => {
    updateBreadcrumbItems([
      {
        label: 'Company Leave Schedule',
        to: COMPANY_LEAVE_SCHEDULE_URL
      }
    ]);
  }, [updateBreadcrumbItems]);

  useEffect(() => {
    setLoading(true);
    asyncFetchCallback(
      getAllApprovedLeaveApplications(),
      (res) => {
        const leaveDatesArr = res.flatMap((o) => {
          const startDate = moment(o.startDate);
          const endDate = moment(o.endDate);
          const dateRange = endDate.diff(startDate, 'days');

          let singleLeaveDatesArr: CalendarObject[] = [];
          for (let i = 0; i <= dateRange; i++) {
            singleLeaveDatesArr.push({
              id: o.id,
              calDate: moment(startDate).add(i, 'day'),
              startDate: startDate.format('DD MMM YYYY hh:mm A'),
              endDate: endDate.format('DD MMM YYYY hh:mm A'),
              employeeId: o.employeeId,
              employeeName: o.employee.firstName + ' ' + o.employee.lastName
            } as CalendarObject);
          }
          return singleLeaveDatesArr;
        });
        setLeaveDates(leaveDatesArr);
      },
      () => void 0,
      { updateLoading: setLoading }
    );
  }, []);

  const handleSelect = (value: Moment) => {
    setSelectedDate(value);
    setOpenCalendarCellModal(true);
  };

  const onPanelChange = (value: Moment, mode: string) => {
    setSelectedMode(mode);
  };

  return (
    <>
      <Typography.Title level={2}>Company Leave Schedule</Typography.Title>
      <Spin size='large' spinning={loading} className='calendar-spin'>
        <LeaveCalendar
          leaveDates={leaveDates}
          onPanelChange={onPanelChange}
          handleSelect={handleSelect}
          colours={colours}
        />
        <CalendarCellModal
          open={openCalendarCellModal}
          onClose={() => setOpenCalendarCellModal(false)}
          date={selectedDate}
          data={leaveDates}
          mode={selectedMode}
          colours={colours}
        />
      </Spin>
    </>
  );
};

export default ViewCompanyLeaveSchedule;
