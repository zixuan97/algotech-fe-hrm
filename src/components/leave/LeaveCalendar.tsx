import React from 'react';
import { Badge, Calendar } from 'antd';
import type { Moment } from 'moment';
import { CalendarObject, CalendarPHObject } from 'src/models/types';
import themeContext from 'src/context/theme/themeContext';
import moment from 'moment';

interface LeaveCalendarProps {
  leaveDates: CalendarObject[];
  publicHolidays: CalendarPHObject[];
  handleSelect: (value: Moment) => void;
  onPanelChange: (value: Moment, mode: string) => void;
  colours: Map<number, string>;
}

const LeaveCalendar = ({
  leaveDates,
  publicHolidays,
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
    const publicHol = publicHolidays.find(
      (publicHolObject) => publicHolObject.Date === value.format('YYYY-MM-DD')
    );
    const publicHolObserved = publicHolidays.find(
      (publicHolObject) =>
        publicHolObject.Observance === value.format('YYYY-MM-DD')
    );

    return (
      <>
        {publicHol && <Badge color='red' text={publicHol.Name} />}
        {publicHolObserved && (
          <Badge color='pink' text={`${publicHolObserved.Name} (observed)`} />
        )}
        <ul>
          {listData.map((item) => (
            <Badge
              color={colours.get(item.employeeId)}
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
