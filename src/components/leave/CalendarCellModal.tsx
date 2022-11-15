import React from 'react';
import { Badge, Modal, Divider, Card } from 'antd';
import type { Moment } from 'moment';
import { CalendarObject } from 'src/models/types';

type CalendarCellModalProps = {
  open: boolean;
  onClose: () => void;
  date: Moment | undefined;
  data: CalendarObject[];
  mode: string;
  colours: Map<number, string>;
};

const CalendarCellModal = ({
  open,
  onClose,
  date,
  data,
  mode,
  colours
}: CalendarCellModalProps) => {
  let stringValue: string;
  let listData;
  if (mode === 'month') {
    stringValue = date!.format('DD/MM/YYYY');
    listData = data.filter(
      (leaveDate) => leaveDate.calDate.format('DD/MM/YYYY') === stringValue
    );
  } else {
    stringValue = date!.format('MMM');
    listData = data.filter(
      (leaveDate) => leaveDate.calDate.format('MMM') === stringValue
    );
  }

  const listDataGroups = Object.values(
    listData.reduce<{ [index: number]: CalendarObject[] }>((groups, item) => {
      const group = groups[item.employeeId] || [];
      group.push(item);
      groups[item.employeeId] = group;
      return groups;
    }, {})
  );

  const renderModalMonthView = (listData: CalendarObject[]) => {
    return listData.map((item) => (
      <Badge
        color={colours.get(item.employeeId)}
        text={`${item.employeeName} on leave`}
      />
    ));
  };

  const renderModalYearView = (listDataGroups: CalendarObject[][]) => {
    return listDataGroups.map((item, index) => (
      <>
        <Badge.Ribbon
          text={`${item[0].employeeName}`}
          color={colours.get(item[0].employeeId)}
        >
          <Card title='Leave Duration' size='small'>
            {item.map((o) => (
              <div>
                {o.startDate} - {o.endDate}
              </div>
            ))}
          </Card>
        </Badge.Ribbon>
        {index !== listDataGroups.length - 1 && <Divider />}
      </>
    ));
  };

  return (
    <Modal
      title={`Leave Schedule for ${stringValue}`}
      open={open}
      onCancel={onClose}
      footer={null}
    >
      {mode === 'month'
        ? renderModalMonthView(listData)
        : renderModalYearView(listDataGroups)}
    </Modal>
  );
};

export default CalendarCellModal;
