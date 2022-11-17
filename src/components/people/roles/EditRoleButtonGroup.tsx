import { Button, Space } from 'antd';
import { JobRole } from '../../../models/types';

interface props {
  setEdit: (boolean: boolean) => void;
  edit: boolean;
  jobRole: JobRole;
  setEditJobRole: (jobRole : JobRole) => void;
  handleSaveButtonClick: (e: any) => void;
}

const EditRoleButtonGroup = ({
  setEdit,
  edit,
  jobRole,
  setEditJobRole,
  handleSaveButtonClick
}: props) => {
  return (
    <>
      <Space>
        <Button
          color='primary'
          onClick={() => {
            setEdit(false);
            jobRole && setEditJobRole(jobRole)
          }}
        >
          Discard
        </Button>
        <Button
          type='primary'
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            if (!edit) {
              setEdit(true);
            } else {
              handleSaveButtonClick(e);
            }
          }}
        >
          Save
        </Button>
      </Space>
    </>
  );
};

export default EditRoleButtonGroup;
