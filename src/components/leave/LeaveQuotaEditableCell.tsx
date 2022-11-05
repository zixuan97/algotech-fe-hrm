import React from 'react';
import { Form, Input, InputNumber } from 'antd';
import { LeaveQuota } from 'src/models/types';

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: 'number' | 'string';
  record: LeaveQuota;
  index: number;
  handleInputChange: (value: string, dataIndex: string) => void;
  children: React.ReactNode;
}

const LeaveQuotaEditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  handleInputChange,
  children,
  ...restProps
}) => {
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`
            }
          ]}
        >
          {inputType === 'number' ? (
            <InputNumber
              onChange={(value) => {
                handleInputChange(value!.toString(), dataIndex);
              }}
            />
          ) : (
            <Input
              onChange={(event) => {
                handleInputChange(event.target.value, dataIndex);
              }}
            />
          )}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

export default LeaveQuotaEditableCell;
