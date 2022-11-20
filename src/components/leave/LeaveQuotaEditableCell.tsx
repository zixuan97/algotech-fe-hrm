import React, { useState } from 'react';
import { Form, Input, InputNumber, Select } from 'antd';
import { LeaveQuota } from 'src/models/types';

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  isManageEmployeeLeaveQuota: boolean;
  editing: boolean;
  name: string;
  balance: number;
  title: any;
  inputType: 'number' | 'string' | 'select';
  handleInputChange: (value: string, name: string) => void;
  selectedTier: string;
  tiers: LeaveQuota[];
  children: React.ReactNode;
}

const LeaveQuotaEditableCell: React.FC<EditableCellProps> = ({
  isManageEmployeeLeaveQuota,
  editing,
  name,
  balance,
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
            rules={
              inputType !== 'number'
                ? [
                    {
                      required: true,
                      message: `Please Input ${title}!`
                    }
                  ]
                : [
                    {
                      required: true,
                      message: `Please Input ${title}!`
                    },
                    {
                      type: 'number',
                      min: 0,
                      message: 'Minimum is 0!'
                    },
                    {
                      type: 'number',
                      max: 365,
                      message: 'Maximum is 365!'
                    }
                  ]
            }
          >
            {inputType === 'number' ? (
              <InputNumber
                style={{
                  width: '120px',
                  display: 'flex',
                  justifySelf: 'center',
                  borderRadius: '8px'
                }}
                bordered
                onChange={(value) => {
                  handleInputChange(value!.toString(), name);
                }}
                addonBefore={
                  isManageEmployeeLeaveQuota ? `${balance} /` : undefined
                }
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
