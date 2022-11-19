import { useState } from 'react';
import { Button, Divider, Select, Typography } from 'antd';
import { User } from 'src/models/types';
import { getUserFullName } from 'src/utils/formatUtils';

interface EmployeeSelectorProps {
  handleAssignManagerToEmployee: (body: {
    id: number;
    users: { id: number }[];
  }) => void;
  managerOptions: User[];
  employee: User;
}

interface Option {
  value: number;
  label: string;
}

const EmployeeSelector = ({
  employee,
  managerOptions,
  handleAssignManagerToEmployee
}: EmployeeSelectorProps) => {
  let options: Option[] = managerOptions.map(
    (o) => ({ label: getUserFullName(o), value: o.id } as Option)
  );
  options = options.filter((option) => option.value !== employee.id);

  const [managerId, setManagerId] = useState<number>(0);

  return (
    <>
      <p />
      <Typography
        style={{
          fontWeight: 'bold',
          paddingBottom: '0.5rem',
          textDecoration: 'underline'
        }}
      >
        {getUserFullName(employee)}
      </Typography>
      <Typography style={{ paddingBottom: '0.5rem' }}>Reports to</Typography>
      <Select
        style={{ width: '100%' }}
        onSelect={(value: number) => setManagerId(value)}
        showSearch
        placeholder='Select a Manager'
        options={options}
        filterOption={(input, option) =>
          (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
        }
      />
      <div style={{ paddingTop: '1rem' }}>
        <Button
          type='primary'
          disabled={!managerId}
          style={{ width: 'max-content' }}
          onClick={() => {
            handleAssignManagerToEmployee({
              id: managerId,
              users: [{ id: employee.id }]
            });
          }}
        >
          Save
        </Button>
      </div>
      <Divider />
    </>
  );
};

export default EmployeeSelector;
