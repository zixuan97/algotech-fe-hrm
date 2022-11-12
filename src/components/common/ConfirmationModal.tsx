import { Modal } from 'antd';

type ConfirmationModalProps = {
  open: boolean;
  title: string;
  body: React.ReactNode;
  onConfirm?: () => void;
  onClose: () => void;
};

const ConfirmationModal = ({
  open,
  title,
  body,
  onConfirm,
  onClose
}: ConfirmationModalProps) => {
  return (
    <>
      <Modal title={title} open={open} onOk={onConfirm} onCancel={onClose}>
        {body}
      </Modal>
    </>
  );
};

export default ConfirmationModal;
