import React, { useEffect, useState } from 'react';
import '../../styles/pages/companyLeaveSchedule.scss';
import { Spin, Typography } from 'antd';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import { getAllApprovedLeaveApplications } from 'src/services/leaveService';
import { Badge, Calendar } from 'antd';
import type { Moment } from 'moment';
import moment from 'moment';
import CalendarCellModal from 'src/components/leave/CalendarCellModal';
import { CalendarObject } from 'src/models/types';
import themeContext from 'src/context/theme/themeContext';

const ViewCompanyLeaveSchedule = () => {
  const { isDarkMode } = React.useContext(themeContext);

  const [leaveDates, setLeaveDates] = useState<CalendarObject[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Moment>(moment());
  const [selectedMode, setSelectedMode] = useState<string>('month');
  const [openCalendarCellModal, setOpenCalendarCellModal] =
    React.useState<boolean>(false);
  const [count, setCount] = useState<number>(0);
  const [colours, setColours] = useState<string[]>([]);

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
        setCount(res.length);
        setLeaveDates(leaveDatesArr);
      },
      () => void 0,
      { updateLoading: setLoading }
    );
  }, []);

  useEffect(() => {
    const colours: string[] = getPredefinedColours(count);
    setColours(colours);
    console.log('colors', colours);
  }, [count]);

  const getRandomColor = () => {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 3; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const getPredefinedColours = (num: number) => {
    let predefinedColours: string[] = [...colours];
    for (let i = count; i <= num; i++) {
      let newColour;
      do {
        newColour = getRandomColor();
      } while (
        predefinedColours.indexOf(newColour) !== -1 ||
        newColour === '#fff'
      );
      predefinedColours.push(newColour);
    }
    return predefinedColours;
  };

  const dateCellRender = (value: Moment) => {
    const stringValue = value.format('DD/MM/YYYY');
    const listData = leaveDates.filter(
      (leaveDate) => leaveDate.calDate.format('DD/MM/YYYY') === stringValue
    );

    return (
      <>
        <ul className='events'>
          {listData.map((item) => (
            <Badge
              color={colours[item.id - 1]}
              text={`${item.employeeName} on leave`}
            />
          ))}
        </ul>
      </>
    );
  };

  const monthCellRender = (value: Moment) => {
    var month = value.format('M');
    const listData = leaveDates.filter(
      (leaveDate) => leaveDate.calDate.format('M') === month
    );
    const leaveCount = [...new Set(listData.map((item) => item.employeeId))]
      .length;

    return (
      <div className={`calendar-month-cell-${isDarkMode ? 'dark' : 'light'}`}>
        <span>{leaveCount} staff on leave</span>
      </div>
    );
  };

  const handleSelect = (value: Moment) => {
    setSelectedDate(value);
    setOpenCalendarCellModal(true);
  };

  const onPanelChange = (value: Moment, mode: string) => {
    setSelectedMode(mode);
  };

  return (
    <>
      <Typography.Title level={1}>Company Leave Schedule</Typography.Title>
      <Spin size='large' spinning={loading} className='calendar-spin'>
        <Calendar
          dateCellRender={dateCellRender}
          monthCellRender={monthCellRender}
          onPanelChange={onPanelChange}
          onSelect={handleSelect}
        />
        <CalendarCellModal
          open={openCalendarCellModal}
          onClose={() => setOpenCalendarCellModal(false)}
          date={selectedDate}
          data={leaveDates}
          mode={selectedMode}
        />
      </Spin>
    </>
  );
};

export default ViewCompanyLeaveSchedule;
