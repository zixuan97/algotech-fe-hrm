import React from 'react';
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  CopyOutlined,
  DeleteOutlined,
  MoreOutlined
} from '@ant-design/icons';
import { Button, Dropdown, Menu, MenuProps, Modal } from 'antd';
import { omit } from 'lodash';
import { MenuInfo } from 'rc-menu/lib/interface';
import { Step } from 'src/models/types';

type StepsMoreButtonProps = {
  index: number;
  steps: Step[];
  updateSteps: (steps: Step[]) => void;
};

enum StepMoreKeys {
  DUPLICATE = 'DUPLICATE',
  DELETE = 'DELETE',
  MOVE_UP = 'MOVE_UP',
  MOVE_DOWN = 'MOVE_DOWN'
}

const StepsMoreButton = ({
  index,
  steps,
  updateSteps
}: StepsMoreButtonProps) => {
  const [deleteModalOpen, setDeleteModalOpen] = React.useState<boolean>(false);
  const duplicateStep = () => {
    const newSteps = [...steps];
    const duplicatedStep = omit(newSteps[index], 'id');
    newSteps.splice(index + 1, 0, duplicatedStep);
    updateSteps(newSteps);
  };

  const deleteStep = () => {
    const newSteps = [...steps];
    newSteps.splice(index, 1);
    updateSteps(newSteps);
  };

  const moveStepUp = () => {
    if (index === 0) return;
    const newSteps = [...steps];
    const newIndex = index - 1;
    const temp = newSteps[index];
    newSteps[index] = newSteps[newIndex];
    newSteps[newIndex] = temp;
    updateSteps(newSteps);
  };

  const moveStepDown = () => {
    if (index === steps.length - 1) return;
    const newSteps = [...steps];
    const newIndex = index + 1;
    const temp = newSteps[index];
    newSteps[index] = newSteps[newIndex];
    newSteps[newIndex] = temp;
    updateSteps(newSteps);
  };

  const stepsMoreMenuItems: MenuProps['items'] = [
    {
      label: 'Duplicate',
      key: StepMoreKeys.DUPLICATE,
      icon: <CopyOutlined />
    },
    {
      label: 'Delete',
      key: StepMoreKeys.DELETE,
      icon: <DeleteOutlined />
    },
    ...(index !== 0
      ? [
          {
            label: 'Move Up',
            key: StepMoreKeys.MOVE_UP,
            icon: <ArrowUpOutlined />
          }
        ]
      : []),
    ...(index !== steps.length - 1
      ? [
          {
            label: 'Move Down',
            key: StepMoreKeys.MOVE_DOWN,
            icon: <ArrowDownOutlined />
          }
        ]
      : [])
  ];

  const handleMenuClick = ({ key }: MenuInfo) => {
    switch (key) {
      case StepMoreKeys.DUPLICATE:
        duplicateStep();
        break;
      case StepMoreKeys.DELETE:
        setDeleteModalOpen(true);
        break;
      case StepMoreKeys.MOVE_UP:
        moveStepUp();
        break;
      case StepMoreKeys.MOVE_DOWN:
        moveStepDown();
        break;
      default:
        return;
    }
  };

  return (
    <>
      <Modal
        title='Confirm Delete Step'
        open={deleteModalOpen}
        onCancel={() => setDeleteModalOpen(false)}
        onOk={() => {
          setDeleteModalOpen(false);
          deleteStep();
        }}
      >
        Are you sure you want to delete this step?
      </Modal>
      <Dropdown
        overlay={<Menu onClick={handleMenuClick} items={stepsMoreMenuItems} />}
        trigger={['click']}
      >
        <Button icon={<MoreOutlined />} type='text' />
      </Dropdown>
    </>
  );
};

export default StepsMoreButton;
