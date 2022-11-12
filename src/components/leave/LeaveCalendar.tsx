import React from 'react';
import { Badge, Calendar } from 'antd';
import type { Moment } from 'moment';
import { CalendarObject } from 'src/models/types';
import themeContext from 'src/context/theme/themeContext';

interface LeaveCalendarProps {
  leaveDates: CalendarObject[];
  handleSelect: (value: Moment) => void;
  onPanelChange: (value: Moment, mode: string) => void;
  colours: string[];
}

const LeaveCalendar = ({
  leaveDates,
  handleSelect,
  onPanelChange,
  colours
}: LeaveCalendarProps) => {
  const { isDarkMode } = React.useContext(themeContext);

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

  return (
    <Calendar
      dateCellRender={dateCellRender}
      monthCellRender={monthCellRender}
      onSelect={handleSelect}
      onPanelChange={onPanelChange}
    />
  );
};

export default LeaveCalendar;
