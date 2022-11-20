import React from 'react';
import { Badge, Calendar } from 'antd';
import type { Moment } from 'moment';
import { CalendarObject, CalendarPHObject } from 'src/models/types';
import themeContext from 'src/context/theme/themeContext';
import { StarOutlined } from '@ant-design/icons';

interface LeaveCalendarProps {
  leaveDates: CalendarObject[];
  publicHolidays: CalendarPHObject[];
  handleSelect: (value: Moment) => void;
  onPanelChange: (value: Moment, mode: string) => void;
  colours: Map<number, string>;
  onSelectYear: (onSelectYear: number) => void;
}

const LeaveCalendar = (props: LeaveCalendarProps) => {
  const { isDarkMode } = React.useContext(themeContext);
  const { leaveDates, publicHolidays, handleSelect, onPanelChange, colours } =
    props;

  const onDateChange = (date: Moment) => {
    props.onSelectYear(date.year());
  };

  const dateCellRender = (value: Moment) => {
    const stringValue = value.format('DD/MM/YYYY');
    const listData = leaveDates.filter(
      (leaveDate) => leaveDate.calDate.format('DD/MM/YYYY') === stringValue
    );
    const publicHol = publicHolidays.find(
      (publicHolObject) => publicHolObject.Date === value.format('YYYY-MM-DD')
    );
    let publicHolObserved = publicHolidays.find(
      (publicHolObject) =>
        publicHolObject.Observance === value.format('YYYY-MM-DD')
    );
    if (publicHolObserved?.Date === publicHolObserved?.Observance) {
      publicHolObserved = undefined;
    }

    return (
      <>
        {publicHol && (
          <div className='calendar-public-hol'>
            <StarOutlined style={{ paddingRight: '0.2rem' }} />
            <span>{publicHol.Name}</span>
          </div>
        )}
        {publicHolObserved && (
          <div className='calendar-public-hol'>
            <StarOutlined style={{ paddingRight: '0.2rem' }} />
            <span>{`${publicHolObserved.Name} (observed)`}</span>
          </div>
        )}
        <ul style={{ paddingLeft: '1rem' }}>
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
      onChange={onDateChange}
    />
  );
};

export default LeaveCalendar;
