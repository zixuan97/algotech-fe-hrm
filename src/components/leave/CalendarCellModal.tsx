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
  colours: string[];
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
    let filteredData = data.filter(
      (leaveDate) => leaveDate.calDate.format('MMM') === stringValue
    );
    listData = [
      ...new Map(filteredData.map((item) => [item.employeeId, item])).values()
    ];
  }

  return (
    <Modal
      title={`Leave Schedule for ${stringValue}`}
      open={open}
      onCancel={onClose}
      footer={null}
    >
      {listData.map((item) => (
        <>
          {mode === 'month' && (
            <Badge
              color={colours[item.id - 1]}
              text={`${item.employeeName} on leave`}
            />
          )}
          {mode === 'year' && (
            <Badge.Ribbon
              text={`${item.employeeName}`}
              color={colours[item.id - 1]}
            >
              <Card title='Leave Duration' size='small'>
                {item.startDate} - {item.endDate}
              </Card>
            </Badge.Ribbon>
          )}
          <Divider type='horizontal' />
        </>
      ))}
    </Modal>
  );
};

export default CalendarCellModal;
