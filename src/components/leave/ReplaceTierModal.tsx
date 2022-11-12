import { Divider, Modal, Typography } from 'antd';

type ReplaceTierModalProps = {
  open: boolean;
  //   title: string;
  //   body: React.ReactNode;
  tierToDelete: string | undefined;
  onConfirm?: () => void;
  onClose: () => void;
};

const ReplaceTierModal = ({
  open,
  //   title,
  //   body,
  tierToDelete,
  onConfirm,
  onClose
}: ReplaceTierModalProps) => {
  return (
    <>
      <Modal
        title='Delete Tier'
        open={open}
        onOk={onConfirm}
        onCancel={onClose}
      >
        <Typography>
          {tierToDelete} cannot be deleted yet as there are still employees
          assigned to this tier.
        </Typography>
        <Divider />
        <Typography>
          Please select a new tier to assign all employees in {tierToDelete} to.
        </Typography>
      </Modal>
    </>
  );
};

export default ReplaceTierModal;
