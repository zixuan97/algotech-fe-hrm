import { Button, Space } from 'antd';
import { User } from '../../models/types';

interface props {
  setEdit: (boolean: boolean) => void;
  edit: boolean;
  user: User;
  setEditUser: (user: User) => void;
  handleSaveButtonClick: (e: any) => void;
}

const EditButtonGroup = ({
  setEdit,
  edit,
  user,
  setEditUser,
  handleSaveButtonClick
}: props) => {
  return (
    <>
      <Space>
        <Button
          color='primary'
          onClick={() => {
            setEdit(false);
            user && setEditUser(user);
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

export default EditButtonGroup;
