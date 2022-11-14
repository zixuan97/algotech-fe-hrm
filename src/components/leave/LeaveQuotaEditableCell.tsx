import React, { useState } from 'react';
import { Form, Input, InputNumber, Select } from 'antd';
import { EmployeeLeaveQuota, LeaveQuota } from 'src/models/types';

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  name: string;
  title: any;
  inputType: 'number' | 'string' | 'select';
  handleInputChange: (value: string, name: string) => void;
  selectedTier: string;
  tiers: LeaveQuota[];
  children: React.ReactNode;
}

const LeaveQuotaEditableCell: React.FC<EditableCellProps> = ({
  editing,
  name,
  title,
  inputType,
  handleInputChange,
  selectedTier,
  tiers,
  children,
  ...restProps
}) => {
  let [tier, setTier] = useState<string>(selectedTier);
  let tierNames = tiers?.map((item) => ({
    label: item.tier,
    value: item.tier
  }));
  tierNames = tierNames?.sort((a, b) => a.value.localeCompare(b.value));

  return (
    <td {...restProps}>
      {editing ? (
        <>
          <Form.Item
            name={name}
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
                  handleInputChange(value!.toString(), name);
                }}
                min={0}
              />
            ) : inputType === 'string' ? (
              <Input
                onChange={(event) => {
                  handleInputChange(event.target.value, name);
                }}
              />
            ) : (
              <Select
                defaultValue={selectedTier}
                defaultActiveFirstOption
                options={tierNames}
                value={tier}
                style={{ width: 100 }}
                onChange={(value) => {
                  setTier(value);
                  handleInputChange(value, name);
                }}
              />
            )}
          </Form.Item>
        </>
      ) : (
        children
      )}
    </td>
  );
};

export default LeaveQuotaEditableCell;
